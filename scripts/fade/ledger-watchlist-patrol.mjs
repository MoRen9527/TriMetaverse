// ledger-watchlist-patrol.mjs — 判据型「候裁读数落树触发」daemon 级执行体（形态 B，CTO 裁卷 34aef5c2）
// 提案卷: docs/workflow/operating-records/2026-W40/ledger-watchlist-daemon-upgrade-proposal-20260929.md (9dd0ef49)
// 裁卷: cto-watchlist-daemon-upgrade-verdict-20260929.md (34aef5c2)——形态 B 准/300s/契约三钉/两道网并存
// 判据: 台账 watchlist.json 中 status=waiting 项,其 treeAnchor 进入 dev 树(is-ancestor)即发 BOD 到件通知。
// 契约三钉(裁卷 §裁点3):
//   ①锚核查失败须出声——rev-parse 验证+malformed error,禁静默 skip(防 is-ancestor 恒 false 盲区无声回归)
//   ②发信失败不置 notified——保 waiting 重试+失败计数(防假通知)
//   ③解析失败不崩 job——error 出声后正常退出
// 上线: allowlist 追加+job INSERT 与 F-2 修复窗并批(候 COO 下午方案卷定窗);本文件=备料,非上线态。
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const REPO = 'D:/Code/ai/TriMetaverse';
// 真源=树内固定跨周路径（CTO 守望锚① 2026-09-29 CEO 终批：勿放周目录防翻周迁移复杂度）；
// .fade/hub-snapshots/watchlist.json 已迁入树内并撤销（2026-09-29 真源迁移笔）。
const WATCHLIST = path.join(REPO, 'docs/workflow/hub-state/watchlist.json');
const SEAT_TARGET = 'bod'; // BOD 信箱面(TriMMC 名册目标=bod,勘正 2026-09-29:初版误写 board 三轮 400 unknown_target_seat;toast/信箱=兜底网;pipe 主道=COS 半自动,两道网并存)

function err(msg) { console.error(`[watchlist-patrol][ERROR] ${new Date().toISOString()} ${msg}`); }

// ── 读清单(三钉③:解析失败不崩 job) ──
let items;
try {
  items = JSON.parse(fs.readFileSync(WATCHLIST, 'utf8'));
  if (!Array.isArray(items)) throw new Error('watchlist.json top-level is not an array');
} catch (e) {
  err(`watchlist parse fail: ${e.message} (job exits clean, no write-back)`);
  console.log('watchlist done: parse-fail, skipped');
  process.exit(0);
}

function gitOk(args) {
  try { execFileSync('git', args, { cwd: REPO, stdio: 'pipe' }); return true; } catch { return false; }
}

async function notify(title, body) {
  const url = process.env.TRIMC_NOTIFY_SG_URL;
  const token = process.env.TRIMC_NOTIFY_SG_TOKEN;
  if (!url || !token) return { ok: false, detail: 'notify skip: env missing' };
  try {
    const res = await fetch(`${url}/internal/v1/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Internal-Token': token },
      // TriMMC /internal/v1/notify 契约(notify/outbox.ts TARGET_SEAT_ROSTER): bod→daemon='trimlc'
      // (勘正 2026-09-29: 初版 'trimmc' 系 sg 值席专用, bod 目标必 400 daemon_seat_mismatch)
      body: JSON.stringify({ source_seat: 'm-cos', target_daemon: 'trimlc', targets: [SEAT_TARGET], urgent: 'normal', title, body }),
    });
    return { ok: res.status >= 200 && res.status < 300, detail: `http=${res.status}` };
  } catch (e) { return { ok: false, detail: `notify fail: ${e.message}` }; }
}

let hit = 0, skipBad = 0;
const changed = [];
for (const it of items) {
  if (!it || it.status !== 'waiting') continue;
  // 三钉①:锚先验存在(malformed/悬空=出声,禁静默 skip)
  const anchor = String(it.treeAnchor ?? '');
  if (!/^[0-9a-f]{7,40}$/i.test(anchor)) {
    err(`item ${it.id}: malformed treeAnchor "${anchor}" — NOT skipped silently, needs COS fix`);
    skipBad++;
    continue;
  }
  if (!gitOk(['rev-parse', '--verify', `${anchor}^{commit}`])) {
    err(`item ${it.id}: treeAnchor ${anchor} not resolvable in repo — NOT skipped silently, needs COS fix`);
    skipBad++;
    continue;
  }
  // 树锚核查:锚进 dev=完工读数落树
  let reached = false, probe = '';
  try {
    execFileSync('git', ['merge-base', '--is-ancestor', anchor, 'dev'], { cwd: REPO, stdio: 'pipe' });
    reached = true;
  } catch (e) {
    probe = `is-ancestor false (${e.status ?? 'ERR'})`;
  }
  if (!reached) { console.log(`watchlist: ${it.id} anchor not in dev yet (${probe})`); continue; }
  // 命中→到件通知(三钉②:失败不置 notified,保 waiting 重试+计数)
  const kindZh = { accept: '验收', writeoff: '销账', verdict: '判读' }[it.kind] ?? it.kind;
  const r = await notify(
    `【到件通知】${it.id} 完工读数已落树`,
    `${it.id} 之完工读数 commit 已进 dev 树:锚 ${anchor}${it.treePath ? `,树指针 ${it.treePath}` : ''}。候 BOD ${kindZh}。(watchlist-patrol 自动到件,300s 节奏)`,
  );
  if (r.ok) {
    it.status = 'notified';
    it.notifiedAt = new Date().toISOString();
    changed.push(it.id);
    hit++;
    console.log(`watchlist: ${it.id} notified (${r.detail})`);
  } else {
    it.failCount = (it.failCount ?? 0) + 1;
    err(`item ${it.id}: notify FAILED (${r.detail}) — kept waiting, failCount=${it.failCount}, will retry`);
  }
}

// ── 原子写回(tmp+rename) ──
if (changed.length > 0 || items.some((x) => x && x.failCount)) {
  const tmp = WATCHLIST + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(items, null, 1) + '\n');
  fs.renameSync(tmp, WATCHLIST);
}
console.log(`watchlist done: waiting-scan=${items.filter((x) => x && x.status === 'waiting').length} notified=${hit} bad-anchor=${skipBad}`);
