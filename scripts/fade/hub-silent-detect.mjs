#!/usr/bin/env node
// hub-silent-detect.mjs — 900s silent-detection job (TriMLC 8713 cron spawn face)
// Batch: 09-30 evening silent-detection enablement (CTO 02:36 dispatch; FSD construction)
// Verdict basis: cto-bod-three-items-rm-verdict-20260929.md §三 (architecture) §八 (ledger schema)
//
// Consumption: docs/workflow/hub-state/in-progress.json (non-closed entries)
// Tiers:
//   all-silent ≤ 15min                     → healthy, clear state
//   all-silent > 15min                     → reminder-level nudge to the owner seat
//   all-silent > 30min AND no waiting reason → idle-escalate to COS (mailbox dual-hop)
//   duty seat (m-cos) transcript silent > 30min → duty-escalate direct to BOD (second hop)
//     [v2 候改 2026-10-21 BOD 判据反馈·LG-069 灰度首报案]：transcript 单源不能分
//     「空闲无活」（零来件正常态）与「失联」——二级确认=箱水位不动+注册面在册→定性
//     空闲非静默（BOD 建议①）。箱位=8713 daemon 数据面（考古候窗）——现役先注记级：
//     duty-escalate 文体带误报可能注·升级通道处置照 COO 附报形（勿凭单源直升级）。
// waiting reason = entry.status === 'waiting-window' (structured; note-text heuristics avoided)
//
// 三钉 contract (hard):
//   ① anchor-check failure speaks  — ledger missing / git plumbing failure → error notify, never silent skip
//   ② send-failure not marked notified — cooldown state written ONLY after sendNotify resolves
//   ③ parse-failure never crashes job — per-entry try/catch, process exits 0 always
//
// Grayscale week 1: 900s cadence, FSD reads execution_log daily first-round readings.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { sendNotify } from "./lib/notify-sender.mjs";
import { collectNodeSignals } from "./lib/tree-signals.mjs";
import { isQuietHours } from "./lib/quiet-hours.mjs";
import { readDutyTickSignal } from "./lib/duty-tick-signal.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const LOG_DIR = path.join(REPO_ROOT, ".fade", "probe-logs");
const LOG_FILE = path.join(LOG_DIR, "hub-silent-detect.log");
const STATE_FILE = path.join(REPO_ROOT, ".fade", "tmp", "hub-silent-detect-state.json");
const LEDGER_FILE = path.join(REPO_ROOT, "docs", "workflow", "hub-state", "in-progress.json");

// thresholds (minutes) — verdict §三 tiers
const REMIND_MIN = 15;
const ESCALATE_MIN = 30;
const COOLDOWN_MIN = 30;

const DUTY_SEAT = "COS"; // 中枢值守 — duty second-hop target maps to m-cos transcript

// ── keeper probe (keeper-probe-20261015 · CTO dispatch 4e0becc27 · BOD 令文基准) ──
// 半死窗教训（2026-10-15 09:04-09:34 无人察觉 30min）：端口在+进程在≠服务活——
// 双探针合取（禁只探 TCP）：
//   A=GET {KEEPER_URL} → HTTP 200 且 body.ok!==false（隧道全链活体真值；实测健康端点
//     =/healthz 200 {"ok":true,"service":"trimc",...}——勘验钉定 2026-10-15）
//   B=keeper 进程在位：ssh.exe cmdline 含 '18710:127.0.0.1:8712'（保活进程本体指纹，
//     实勘 pid 33780 cmdline 钉定——勘验禁猜）
// 任一败=failN+1；连续 KEEPER_PROBE_N=2 拍才直报（防单拍网络抖动误报）；恢复清零。
// 直报复用 duty-escalate 形（targets=[bod]·urgent）零新级别；不走 quiet-hours 豁免
// （基建故障全时段报警——夜间正是 sg 通知链依赖时段，裁量理由入毕报）；冷却 30min
// 照 duty-escalate 形重报节奏。
// 测试钩子（FAIL 态模拟构造·禁真停 keeper）：KEEPER_PROBE_URL 覆盖探针地址（坏口
// =FAIL 态证据）；KEEPER_PROBE_DRYRUN=1 时告警只落日志不真发（零扰频测试面）。
const KEEPER_URL = process.env.KEEPER_PROBE_URL?.trim() || "http://127.0.0.1:18710/healthz";
const KEEPER_FINGERPRINT =
  (process.env.KEEPER_PROBE_FINGERPRINT?.trim() || "18710:127.0.0.1:8712").replace(/'/g, "");
const KEEPER_DRYRUN = process.env.KEEPER_PROBE_DRYRUN === "1";
const KEEPER_PROBE_N = 2;
const KEEPER_KEY_FAIL = "keeper-tunnel|fail";
const KEEPER_KEY_ALARM = "keeper-tunnel|alarm";

async function probeKeeper() {
  // A: HTTP liveness — tunnel full-chain truth (never TCP-only)
  let httpOk = false;
  let httpDetail = "";
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 5000);
    try {
      const res = await fetch(KEEPER_URL, { signal: ctl.signal });
      httpOk = res.status === 200;
      if (!httpOk) {
        httpDetail = `http-${res.status}`;
      } else {
        try {
          const j = await res.json();
          if (j && j.ok === false) { httpOk = false; httpDetail = "ok-false"; }
        } catch { httpOk = false; httpDetail = "bad-body"; }
      }
    } finally {
      clearTimeout(t);
    }
  } catch (e) {
    httpDetail = e.name === "AbortError" ? "timeout(5s)" : String(e.message || e).slice(0, 60);
  }
  // B: keeper process presence — ssh forward cmdline fingerprint (勘验钉定识别串)
  // 2026-10-17 加固（瞬态族实锚：10-17 20:1x 繁忙窗 spawnSync powershell ETIMEDOUT×2 拍
  // →假告警直报 BOD，实探隧道活·COS 20:16 处置回执）：
  //   ①一次重试——execFileSync 败后隔 2s 重试一发，仍败才落结论（防 spawn 瞬态）；
  //   ②探针自身故障与探明缺失分判——probeBroken=true（探针炸）≠ keeper-process-missing
  //     （探针成功·count=0）：前者在 A 活拍不计 failStreak（主判据 HTTP 真值在·B 缺位
  //     降级留痕），后者照合取死判——保住「禁只探 TCP」防假活教训原形。
  const PS_ARGS = ["-NoProfile", "-Command",
    `(Get-CimInstance Win32_Process -Filter "Name='ssh.exe'" | Where-Object { $_.CommandLine -like '*${KEEPER_FINGERPRINT}*' } | Measure-Object).Count`];
  let procOk = false;
  let procDetail = "";
  let probeBroken = false;
  let lastErr = "";
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const out = execFileSync("powershell", PS_ARGS, { encoding: "utf8", timeout: 15000 });
      const n = parseInt(String(out).trim(), 10);
      if (Number.isFinite(n)) {
        procOk = n > 0;
        if (!procOk) procDetail = "keeper-process-missing";
        probeBroken = false;
        lastErr = "";
        break;
      }
      lastErr = `unparseable output: ${String(out).trim().slice(0, 40)}`; // 异常输出形态=探针故障
    } catch (e) {
      lastErr = String(e.message || e).slice(0, 60);
    }
    if (attempt < 2) {
      await new Promise((r) => setTimeout(r, 2000)); // 繁忙窗瞬态避让：隔 2s 一发重试
    }
  }
  if (lastErr) {
    procDetail = `proc-probe-fail: ${lastErr}`;
    probeBroken = true;
  }
  return { httpOk, procOk, httpDetail, procDetail, probeBroken };
}

/** keeper 判定体（双探针合取·防抖·冷却·直报）——probeBroken 降级分判已在调用侧。 */
async function keeperProbeJudge(kp, state, healthy, now) {
  const alive = kp.httpOk && kp.procOk;
  if (alive) {
    const hadFail =
      state[KEEPER_KEY_FAIL] !== undefined || state[KEEPER_KEY_ALARM] !== undefined;
    delete state[KEEPER_KEY_FAIL];
    delete state[KEEPER_KEY_ALARM];
    if (hadFail) appendLog("keeper recovered (fail state cleared)");
    healthy.push("keeper-tunnel ok (http+proc both up)");
  } else {
    const n =
      (typeof state[KEEPER_KEY_FAIL] === "number" ? state[KEEPER_KEY_FAIL] : 0) + 1;
    state[KEEPER_KEY_FAIL] = n;
    const failDetail = kp.httpOk ? `proc=${kp.procDetail}` : `http=${kp.httpDetail}`;
    if (n < KEEPER_PROBE_N) {
      appendLog(
        `keeper probe fail x${n}/${KEEPER_PROBE_N} (${failDetail}) — below debounce threshold`,
      );
    } else {
      const lastAlarm = state[KEEPER_KEY_ALARM];
      if (typeof lastAlarm === "number" && now - lastAlarm < COOLDOWN_MIN * 60000) {
        appendLog(
          `keeper probe fail x${n} (${failDetail}) — in cooldown (last alarm ${new Date(lastAlarm).toISOString()})`,
        );
      } else {
        const title = `[silent-detect] keeper 隧道探活异常：18710 隧道连败 ${n} 拍（${failDetail}）`;
        const body =
          `失败探针=${kp.httpOk ? "B(keeper 进程)" : "A(HTTP 活体)"} 详情=${failDetail}\n` +
          `双探针判据: A=GET ${KEEPER_URL} HTTP200+ok · B=ssh keeper 进程识别串(18710:127.0.0.1:8712)在位\n` +
          `连续 ${KEEPER_PROBE_N} 拍防抖已达·冷却 ${COOLDOWN_MIN}min·来源=hub-silent-detect keeper 段（CTO dispatch 4e0becc27）`;
        try {
          if (KEEPER_DRYRUN) {
            appendLog(`DRYRUN keeper-escalate (not sent, alarm state not written): ${title}`);
          } else {
            await notifyOrThrow({ targets: ["bod"], title, body, urgent: "urgent" });
            state[KEEPER_KEY_ALARM] = now;
            appendLog(`NOTIFIED keeper-escalate keeper-tunnel -> [bod] (${failDetail})`);
          }
        } catch (err) {
          appendLog(
            `ERROR keeper notify failed: ${err.message} — alarm state NOT written (三钉②·下拍重试)`,
          );
        }
      }
    }
  }
}

function nowIso() {
  return new Date().toISOString();
}

function appendLog(line) {
  try {
    fs.mkdirSync(LOG_DIR, { recursive: true });
    fs.appendFileSync(LOG_FILE, `${nowIso()} ${line}\n`, "utf-8");
  } catch { /* 三钉③: logging must never crash the job */ }
}

function readState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function writeState(state) {
  try {
    fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
    const tmp = `${STATE_FILE}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(state, null, 2), "utf-8");
    fs.renameSync(tmp, STATE_FILE); // atomic tmp+rename (precedent: watchlist-patrol)
  } catch (err) {
    appendLog(`ERROR writeState failed: ${err.message} (cooldown may repeat — acceptable)`);
  }
}

function readLedger() {
  // 锚①: ledger missing/unreadable = structural anchor failure → throw to main handler
  const raw = fs.readFileSync(LEDGER_FILE, "utf-8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error("in-progress.json is not an array");
  return parsed;
}

async function notifyOrThrow({ targets, title, body, urgent }) {
  // 三钉②: this either resolves (state may be written) or throws (state untouched)
  // source_seat=m-duty-cos (duty system channel; CTO-ratified A-case) — the lib
  // guardrail enforces real-name attribution for mechanism-seat sends (fail-closed).
  return sendNotify({
    targets,
    title,
    body,
    urgent,
    attribution: "hub-silent-detect 900s job by FSD (m-fsd)",
    sourceSeat: "m-duty-cos",
    targetDaemon: "trimlc",
  });
}

async function main() {
  appendLog(`--- round start (pid ${process.pid}) ---`);
  const state = readState();
  const now = Date.now();
  const alerts = [];
  const healthy = [];
  const skipped = [];

  let entries;
  try {
    entries = readLedger();
  } catch (err) {
    // 锚①: speaks — but 三钉②: notification failure itself must not crash either
    appendLog(`ERROR ledger anchor failure: ${err.message}`);
    try {
      await notifyOrThrow({
        targets: ["m-cos"],
        title: "[silent-detect] 锚核查失败：in-progress.json 不可读",
        body: `hub-silent-detect 无法读取在办账（${err.message}）。本轮探测未执行，请核查 hub-state 文件状态。三钉①锚失败出声通知。`,
        urgent: "urgent",
      });
      appendLog("anchor-failure notify sent");
    } catch (e2) {
      appendLog(`ERROR anchor notify also failed: ${e2.message}`);
    }
    return; // exit 0 — 三钉③
  }

  const open = entries.filter((e) => e && e.status !== "closed");
  if (open.length === 0) {
    appendLog("ledger empty (all closed) — safe degrade, zero alerts"); // 空账=安全降级
    return;
  }

  for (const entry of open) {
    try {
      const id = String(entry.id || "(no-id)");
      const signals = collectNodeSignals({
        repoRoot: REPO_ROOT,
        treePath: entry.treePath,
        owner: entry.owner,
      });

      if (signals.seats.length === 0) {
        // owner 解析不出席位 → conservative skip (data-shape issue, log-only, no false alarm)
        skipped.push(`${id}: owner unresolvable ("${String(entry.owner).slice(0, 60)}")`);
        continue;
      }

      const silentMin =
        signals.newestMs === null ? Infinity : Math.floor((now - signals.newestMs) / 60000);

      if (silentMin <= REMIND_MIN) {
        healthy.push(`${id}: ${signals.seats.join("/")} silent ${silentMin}m (≤${REMIND_MIN})`);
        // clear prior alert state for this node — it recovered
        for (const k of Object.keys(state)) {
          if (k === id || k.startsWith(`${id}|`)) delete state[k];
        }
        continue;
      }

      const waitingReason = entry.status === "waiting-window";
      const level =
        silentMin > ESCALATE_MIN && !waitingReason ? "idle-escalate" : "reminder";

      const stateKey = `${id}|${level}`;
      const last = state[stateKey];
      if (last && now - last < COOLDOWN_MIN * 60000) {
        skipped.push(`${id}: ${level} in cooldown (last ${new Date(last).toISOString()})`);
        continue;
      }

      alerts.push({
        id,
        level,
        silentMin,
        seats: signals.seats,
        status: entry.status,
        perSource: signals.perSource,
        stateKey,
      });
    } catch (err) {
      // 锚①: per-entry anchor failure (e.g. git plumbing) speaks — as an alert row
      alerts.push({
        id: String(entry?.id || "(no-id)"),
        level: "anchor-error",
        error: err.message,
        stateKey: `${String(entry?.id || "no-id")}|anchor-error`,
      });
    }
  }

  // duty-seat second hop: duty seat transcript silent > ESCALATE_MIN → direct BOD
  try {
    const dutyMs = collectNodeSignals({
      repoRoot: REPO_ROOT,
      treePath: "",
      owner: DUTY_SEAT,
    }).perSource.transcript;
    const dutySilentMin = dutyMs === null ? Infinity : Math.floor((now - dutyMs) / 60000);
    const dutyKey = "duty-cos-silent";
    if (dutySilentMin > ESCALATE_MIN) {
      const last = state[dutyKey];
      if (!(last && now - last < COOLDOWN_MIN * 60000)) {
        alerts.push({
          id: dutyKey,
          level: "duty-escalate",
          silentMin: dutySilentMin,
          seats: ["m-cos"],
          perSource: { transcript: dutyMs },
          stateKey: dutyKey,
          // BOD 10-21 判据反馈：transcript 单源=可能空闲误报非失联——接收侧先验
          // 箱水位/注册面再定性，处置照 COO 附报形勿直升级（v2 二级确认候窗）。
          note: "transcript 单源读数——可能=空闲态误报（零来件≠失联），先验箱水位+注册面再定性",
        });
      } else {
        skipped.push("duty-cos: escalate in cooldown");
      }
    } else {
      delete state[dutyKey];
      healthy.push(`duty-cos silent ${dutySilentMin}m (ok)`);
    }
  } catch (err) {
    appendLog(`ERROR duty-hop check failed: ${err.message}`); // 三钉③ degrade
  }

  // ── keeper probe (keeper-probe-20261015 · CTO dispatch 4e0becc27 · BOD 令文基准) ──
  // 双探针合取：A=http 活体真值（禁只探 TCP）/ B=keeper 进程在位——任一败=连败+1，
  // 连续 KEEPER_PROBE_N 拍才直报（防单拍网络抖动误报）；恢复清零。
  // 直报=duty-escalate 形（targets [bod]·urgent）零新级别；不走 quiet-hours/tick 豁免
  // （基建故障全时段报警——夜间正是 sg 通知链依赖时段；裁量理由入毕报）；冷却 30min
  // 照 duty-escalate 形重报节奏。三钉同守：段内异常只落日志不崩 job（③）；
  // notify 失败不写 alarm state 下拍重试（②）。
  try {
    const kp = await probeKeeper();
    // 2026-10-17 加固：探针自身故障降级拍——B 炸（probeBroken）且 A 活（HTTP 真值）→
    // 本拍不计 failStreak 不告警（防探针瞬态故障放大为基建告警·COS 处置建议采）；
    // 已有 fail 态不清（前拍若真败仍保留防抖连续性），log 留痕降级。
    if (kp.probeBroken && kp.httpOk) {
      appendLog(
        `keeper probe B degraded (${kp.procDetail}) but A truth alive — probe-self-fail not counted (2026-10-17 加固)`,
      );
      healthy.push("keeper-tunnel ok (A truth alive; B probe-self-fail degraded)");
    } else {
      await keeperProbeJudge(kp, state, healthy, now);
    }
  } catch (err) {
    appendLog(`ERROR keeper probe segment failed: ${err.message}`); // 三钉③ degrade
  }

  // dispatch alerts
  const failCount = { n: 0 };
  // 件①(10-14 晨窗·B 主拍文判据): bod-tick 拍文值守候令豁免——判据源=BOD 答询 04:33
  // (tick-latest.md ⓪段·8713 :07/:37 双点·内容节拍时戳判新鲜两机一致)。fail-open:
  // 拍文缺失/不新鲜→不豁免照发(保守:失联不漏报)。A 辅时段豁免保留为 B 主缺位期兜底层。
  const tick = readDutyTickSignal(REPO_ROOT, Date.now());
  if (!tick.fresh) appendLog(`duty-tick signal not fresh (${tick.reason}) — tick-exempt inactive`);
  for (const a of alerts) {
    // 值守候令静默态豁免(A 辅+B 主): quiet-hours 22:00-08:00 OR 拍文值守候令。
    // 豁免不写 state——出豁免态首轮即正常告警(无冷却残留); anchor-error/reminder 不豁免。
    const quiet = isQuietHours();
    const tickExempt =
      tick.fresh &&
      (a.level === "duty-escalate" ? tick.dutyIdle : a.level === "idle-escalate" ? tick.allIdle : false);
    if ((quiet || tickExempt) && (a.level === "duty-escalate" || a.level === "idle-escalate")) {
      skipped.push(
        `${a.id}: ${a.level} suppressed (${quiet ? "quiet-hours 22:00-08:00" : "bod-tick 值守候令拍文"}豁免)`,
      );
      continue;
    }
    let targets;
    let title;
    let urgent = "normal";
    if (a.level === "duty-escalate") {
      targets = ["bod"];
      // 件③(10-12夜调参): 插条目 id 真名 — 原硬编码「中枢 m-cos」对任何 duty-escalate
      // 节点都错（变体⑤实锚: 条目=duty-cos 时标题张冠李戴）。信号源如实在 body。
      title = `[silent-detect] 值席静默直报：${a.id} 已静默 ${a.silentMin}min`;
      urgent = "urgent";
    } else if (a.level === "idle-escalate") {
      targets = ["m-cos"];
      title = `[silent-detect] idle 升级：${a.id}（${a.seats.join("/")}）静默 ${a.silentMin}min 无候办理由`;
    } else if (a.level === "anchor-error") {
      targets = ["m-cos"];
      title = `[silent-detect] 锚核查失败：${a.id}`;
      urgent = "urgent";
    } else {
      // reminder → owner seat itself (nudge)
      const aliasToOps = { FSD: "m-fsd", COS: "m-cos", CAO: "m-cao", CFO: "m-cfo", CHO: "m-cho", CMO: "m-cmo", COO: "m-coo", CPO: "m-cpo", CSO: "m-cso", CTO: "m-cto", RDT: "m-rdt", STE: "m-ste", SDE: "m-sde" };
      targets = a.seats.map((k) => aliasToOps[k] || k);
      title = `[silent-detect] 提醒：${a.id} 已静默 ${a.silentMin}min（阈值 ${REMIND_MIN}min）`;
    }

    const src = a.perSource
      ? Object.entries(a.perSource)
          .map(([k, v]) => `${k}=${v ? new Date(v).toISOString() : "n/a"}`)
          .join(" ")
      : a.error || "";
    // 件②(10-12夜调参): silentMin 用 round start 基点——贴线跑时滞后发送最长一轮(900s+)，
    // 报文静默值系统性低估（模板值⑤犯实锚: 报 40min 实距 53min）。发送时按信号源重算实距。
    const sendMs = Date.now();
    const srcVals = a.perSource
      ? Object.values(a.perSource).filter((v) => typeof v === "number")
      : [];
    const realMin = srcVals.length
      ? Math.floor((sendMs - Math.max(...srcVals)) / 60000)
      : a.silentMin;
    const body =
      `条目=${a.id} 状态=${a.status || "-"} 级别=${a.level} 静默=${realMin === Infinity ? "∞(无信号)" : realMin + "min"}` +
      (realMin !== a.silentMin ? `（round 基点读数 ${a.silentMin}min）\n` : "\n") +
      `信号源: ${src}\n` +
      `来源=hub-silent-detect 900s job（灰度第 1 周；三源 OR 豁免；冷却 ${COOLDOWN_MIN}min/节点/级）`;
    // title 同步用实距
    title = title.replace(`${a.silentMin}min`, `${realMin === Infinity ? "∞" : realMin + "min"}`);

    try {
      await notifyOrThrow({ targets, title, body, urgent });
      state[a.stateKey] = now; // 三钉②: only on success
      appendLog(`NOTIFIED ${a.level} ${a.id} -> [${targets.join(",")}]`);
    } catch (err) {
      failCount.n += 1;
      appendLog(`ERROR notify failed (${a.level} ${a.id}): ${err.message} — state NOT written (三钉②)`);
    }
  }

  writeState(state);
  appendLog(
    `round summary: open=${open.length} healthy=${healthy.length} alerts=${alerts.length} ` +
      `sendFails=${failCount.n} skipped=${skipped.length}` +
      (skipped.length ? ` | ${skipped.join(" ; ")}` : ""),
  );
  for (const h of healthy) appendLog(`  ok: ${h}`);
  // always exit 0 — 三钉③ (cron spawn face must not flag errors / trigger retry storms)
}

main().catch((err) => {
  appendLog(`FATAL-CAUGHT ${err.message} (exit 0 per 三钉③)`);
}).finally(() => {
  process.exit(0);
});
