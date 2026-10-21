#!/usr/bin/env node
// bod-cli v0 — BOD 观察者面聚合 CLI（LG-085 P0·CTO 施工单 2026-10-20）
// 运行位：sg /srv/fleet/bod-cli/bod-cli.mjs（node >= 18，零框架零依赖）。
// 硬约束：零写面——纯 GET healthz + sg 本机观察者 state 文件读；零 POST、零文件写、
//         零 token 经手（四域读出面皆无门；/internal/v1/* 动作端点本 CLI 不触）。
// 数据源形标注（CTO 裁决 B·聚合视图硬约束）：
//   direct        = HTTP healthz 直读（现役通路）
//   observer-file = sg 本机 E1-b2 观察者 state 文件（TriMMC 观察者现役产出）
//   observer-chain= 河源 8710 合账布尔旁证面（8711→8710 现役链·healthz mcLedger）
// 语义（观察窗语义与 E1-4 告警面同款）：观察面无 gap 读数 ≠ daemon 死——宿主睡眠是
//   常态事件；不可达/降级如实呈现带归因，禁四绿假象。
// 用法：node bod-cli.mjs aggregate | json
//   aggregate = 人读一屏；json = 机器读形（hub-watch 快照消费）。

import { readFileSync } from 'node:fs';

const HTTP_TIMEOUT_MS = 8000;
const HEYUAN_8710 = 'http://8.155.54.79:8710/healthz';
const E1B2_STATE_PATH = '/home/fleet/.trilc/e1-b2-heartbeat-watch-state.json';
// dev 8713 心跳 gap 阈值（E1-4 b2 同款 60min 档）：超过此值提示睡眠族归因。
const GAP_WARN_MIN = 60;

async function httpJson(url) {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), HTTP_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ac.signal });
    const body = await res.json();
    return { ok: res.ok, status: res.status, body };
  } catch (err) {
    const reason = err?.name === 'AbortError' ? `timeout>${HTTP_TIMEOUT_MS}ms` : String(err?.message ?? err);
    return { ok: false, unreachable: true, error: reason };
  }
}

// E1-b2 state：v3 形 {alerting, lastAgeMs:int(ms), alertAt, gapAtFire}（b 案换源 2026-10-21）
//             / v2 旧形 {offset, lastActivityEpoch}（变化沿语义·留兼容读）。
// v3 优先：lastAgeMs=「自末次心跳到达」gap 真值（观察者直读 8712 端点 ageMs）。
// v2 退位：lastActivityEpoch 单位自适应（>1e12 视为 ms，否则视为 s）——变化沿面·假超时语义注。
function readE1B2State() {
  try {
    const raw = readFileSync(E1B2_STATE_PATH, 'utf-8');
    const state = JSON.parse(raw);
    if (Number.isFinite(state.lastAgeMs)) {
      const ageMs = Number(state.lastAgeMs);
      const gapMin = Math.round(ageMs / 60000);
      return { ok: true, form: 'observer-v3-agetruth', state, ageMs, gapMin };
    }
    const epoch = Number(state.lastActivityEpoch ?? 0);
    const lastMs = epoch > 1e12 ? epoch : epoch * 1000;
    const gapMin = lastMs > 0 ? Math.round((Date.now() - lastMs) / 60000) : null;
    return { ok: true, form: 'observer-file', state, lastMs, gapMin };
  } catch (err) {
    return { ok: false, form: 'observer-file', error: String(err?.message ?? err) };
  }
}

async function probeDomains() {
  const [trimc, trirmc] = await Promise.all([
    httpJson('http://127.0.0.1:8712/healthz'),
    httpJson(HEYUAN_8710),
  ]);
  const e1b2 = readE1B2State();
  // 8711 观察者链面：复用 8710 直读的合账布尔（mcLedger=ok 为 8711→8710 心跳到达旁证）。
  const chainOk = trirmc.ok && trirmc.body?.mcLedger === 'ok';
  return {
    fetchedAt: new Date().toISOString(),
    domains: {
      'trimc-sg8712': {
        label: 'sg 8712 TriMMC（M 面中枢）',
        form: 'direct',
        ok: trimc.ok && trimc.body?.ok === true,
        unreachable: trimc.unreachable === true,
        error: trimc.error ?? null,
        healthz: trimc.body ?? null,
      },
      'trirmc-heyuan8710': {
        label: '河源 8710 TriRMC（R 面服务域）',
        form: 'direct',
        ok: trirmc.ok && trirmc.body?.ok === true,
        unreachable: trirmc.unreachable === true,
        error: trirmc.error ?? null,
        healthz: trirmc.body ?? null,
      },
      'trmlc-dev8713': {
        label: 'dev 8713 TriMLC（R 面本地·观察者面）',
        form: 'observer-file',
        ok: e1b2.ok,
        unreachable: !e1b2.ok,
        error: e1b2.error ?? null,
        alerting: e1b2.state?.alerting ?? null,
        lastActivityMs: e1b2.lastMs ?? null,
        ageMs: e1b2.ageMs ?? null,
        gapMin: e1b2.gapMin ?? null,
        alertAt: e1b2.state?.alertAt ?? null,
        gapAtFire: e1b2.state?.gapAtFire ?? null,
        note: !e1b2.ok
          ? `观察者 state 不可读（${E1B2_STATE_PATH}）——非 daemon 死判据，归因候查`
          : e1b2.form === 'observer-v3-agetruth'
            ? e1b2.gapMin != null && e1b2.gapMin > GAP_WARN_MIN
              ? `gap=${e1b2.gapMin}min（ageMs 真值形·v3 b 案端点读数）——心跳疑断`
              : `gap=${e1b2.gapMin}min（ageMs 真值形·v3 b 案端点读数）`
            : // v2 变化沿语义注（观察者已升 v3 后此形=历史 state 残留读）
              // 对平勘验 2026-10-20 实锚：变化沿流静默时长非心跳间隙——假超时形态。
              e1b2.gapMin != null && e1b2.gapMin > GAP_WARN_MIN
              ? `gap=${e1b2.gapMin}min——⚠v2 变化沿面（历史形·观察者应已升 v3），daemon 真值判据=活体面勿凭此重启`
              : `gap=${e1b2.gapMin}min（v2 变化沿面·历史形）`,
      },
      'trirlc-dev8711': {
        label: 'dev 8711 TriRLC（R 面本地·观察者链面）',
        form: 'observer-chain',
        // 布尔=合账面健康（8711 心跳到达 8710 的旁证），非 8711 daemon 直证——观察窗语义如实。
        ok: chainOk,
        unreachable: trirmc.unreachable === true,
        error: trirmc.unreachable ? `上游 8710 不可达：${trirmc.error}` : null,
        mcLedger: trirmc.body?.mcLedger ?? null,
        note: trirmc.unreachable
          ? '8710 上游不可达→8711 链面无读数（级联，非 8711 本域故障判据）'
          : chainOk
            ? null
            : `mcLedger=${JSON.stringify(trirmc.body?.mcLedger)}——合账面异常，8711 心跳到达性候查`,
      },
    },
  };
}

function fmtCron(hz) {
  if (!hz?.cron) return '—';
  const c = hz.cron;
  const bits = [`jobs=${c.jobCount ?? '?'}`];
  if (c.enabled != null) bits.push(`enabled=${c.enabled}`);
  if (c.degraded != null) bits.push(`degraded=${c.degraded}`);
  if (c.consecutiveFailures != null) bits.push(`fails=${c.consecutiveFailures}`);
  return bits.join(' ');
}

function renderAggregate(r) {
  const lines = [];
  lines.push(`=== bod-cli v0 四域聚合 @ ${r.fetchedAt}（+0800 ${new Date(Date.now() + 8 * 3600e3).toISOString().slice(11, 19)}）===`);
  for (const [key, d] of Object.entries(r.domains)) {
    const mark = d.ok ? '[OK]' : '[!!]';
    const form = `源形=${d.form}`;
    let detail = '';
    if (d.form === 'direct') {
      detail = d.ok ? `service=${d.healthz?.service ?? '?'} ${fmtCron(d.healthz)}` : `unreachable ${d.error ?? ''}`;
    } else if (d.form === 'observer-file') {
      detail = d.ok
        ? `alerting=${d.alerting} gap=${d.gapMin}min（变化沿面）lastActivity=${d.lastActivityMs ? new Date(d.lastActivityMs).toISOString() : '?'}`
        : `state 不可读 ${d.error ?? ''}`;
    } else {
      detail = d.ok ? `mcLedger=${d.mcLedger}（8711→8710 链旁证）` : `无读数 ${d.error ?? ''}`;
    }
    lines.push(`${mark} ${key} ${d.label}`);
    lines.push(`     ${form} ${detail}`);
    if (d.note) lines.push(`     注：${d.note}`);
  }
  lines.push('（零写面：纯 GET healthz+state 文件读；观察面无读数≠daemon 死·宿主睡眠常态事件）');
  return lines.join('\n');
}

async function main() {
  const cmd = process.argv[2] ?? 'aggregate';
  const r = await probeDomains();
  if (cmd === 'json') {
    console.log(JSON.stringify(r, null, 2));
  } else if (cmd === 'aggregate') {
    console.log(renderAggregate(r));
  } else {
    console.error('用法: node bod-cli.mjs aggregate|json');
    process.exit(2);
  }
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error('bod-cli failed:', String(err?.message ?? err));
    process.exit(1);
  },
);
