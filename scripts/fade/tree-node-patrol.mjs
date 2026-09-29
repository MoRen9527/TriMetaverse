// tree-node-patrol.mjs — LG-057 树节点收口巡检催办执行体（第二段正式体，非过渡态）
// 任务书: TASK-TREE-NODE-CLOSURE-01（正身 8c242679）；CTO 联合技术门 APPROVE（16327ad7）
// 判定口径（CTO 批 §四）: 5 分钟自前节点完成证据起算，不含承接席作业时长——
//   流转型节点卡「收口件 done」；执行型节点（execution-report）卡「认领 ack」（done 亦可）。
// 在途树枚举来源（CTO 留痕要求）: operating-records/2026-W*/trees/*/node-status.jsonl
//   文件存在性枚举（非台账查询）——无收口账的树不在巡检视野（铸单前自举盲区，如实留痕）。
// 催办去重: 同节点超时催办一次落 missing 记录（recorded_by=patrol）；解除前不重复催。
import fs from 'node:fs';
import path from 'node:path';

const REPO = 'D:/Code/ai/TriMetaverse';
const OP_ROOT = path.join(REPO, 'docs/workflow/operating-records');
const TIMEOUT_MS = 5 * 60 * 1000;
const CHAIN = ['cast', 'flow', 'dispatch', 'execution-report', 'aggregation', 'acceptance'];
const CHAIN_ZH = { cast: '铸单', flow: '流转', dispatch: '拆派', 'execution-report': '执行·回报', aggregation: '汇录', acceptance: '验收销账' };
const EXEC_TYPE = new Set(['execution-report']);
const SEAT = { cast: 'BOD', flow: 'COS', dispatch: 'COO', 'execution-report': '承接席', aggregation: 'COS', acceptance: 'BOD' };

function appendRecord(jsonlPath, rec) {
  fs.appendFileSync(jsonlPath, JSON.stringify(rec) + '\n');
}

function listTreeJsonls() {
  const out = [];
  let weeks = [];
  try { weeks = fs.readdirSync(OP_ROOT).filter((d) => /^2026-W\d+$/.test(d)); } catch { return out; }
  for (const w of weeks) {
    const treesDir = path.join(OP_ROOT, w, 'trees');
    let trees = [];
    try { trees = fs.readdirSync(treesDir); } catch { continue; }
    for (const t of trees) {
      const p = path.join(treesDir, t, 'node-status.jsonl');
      try { if (fs.statSync(p).isFile()) out.push({ treeId: t, week: w, path: p }); } catch { /* no ledger */ }
    }
  }
  return out;
}

function parseLedger(p) {
  const recs = [];
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try {
      const r = JSON.parse(line);
      if (r && r.node && r.state && r.ts) recs.push(r);
    } catch { /* skip malformed line */ }
  }
  recs.sort((a, b) => new Date(a.ts) - new Date(b.ts));
  return recs;
}

// 催办投递对象=节点责任席（seats.json 名册正名）+ COS（追补三条：COS=状态账记账人+催办协调人）；
// 承接席未认领时无定席 → 仅投 COS。urgent=normal（信箱落箱即送达；账本 missing 记录=持久痕迹，patrol 去重防扰）。
const SEAT_TARGET = {
  cast: 'board', flow: 'ceo-chief-of-staff', dispatch: 'chief-operating-officer',
  'execution-report': '', aggregation: 'ceo-chief-of-staff', acceptance: 'board',
};
const COS_SEAT = 'ceo-chief-of-staff';

async function notify(title, body, targets) {
  const url = process.env.TRIMC_NOTIFY_SG_URL;
  const token = process.env.TRIMC_NOTIFY_SG_TOKEN;
  if (!url || !token) return `notify skip: env missing`;
  try {
    const res = await fetch(`${url}/internal/v1/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Internal-Token': token },
      // TriMMC /internal/v1/notify 契约（routes.ts）: 广播面 source_seat/target_daemon/urgent/title/body+targets 代 target_seat
      body: JSON.stringify({ source_seat: 'm-cos', target_daemon: 'trimmc', targets, urgent: 'normal', title, body }),
    });
    return `notify http=${res.status}`;
  } catch (e) { return `notify fail: ${e.message}`; }
}

let scanned = 0, urged = 0;
for (const tree of listTreeJsonls()) {
  scanned++;
  const recs = parseLedger(tree.path);
  if (recs.length === 0) continue;
  const doneTs = {};   // node -> latest done ts (ms)
  const ackTs = {};    // node -> latest ack ts (ms)
  for (const r of recs) {
    const t = new Date(r.ts).getTime();
    if (Number.isNaN(t)) continue;
    if (r.state === 'done') doneTs[r.node] = Math.max(doneTs[r.node] ?? 0, t);
    if (r.state === 'ack') ackTs[r.node] = Math.max(ackTs[r.node] ?? 0, t);
  }
  // 找链上第一个未 done 节点 = pending 节点
  let pendingIdx = CHAIN.findIndex((n) => !doneTs[n]);
  if (pendingIdx === -1) continue; // 全链收口毕
  if (pendingIdx === 0) continue;  // 铸单未毕=无前节点可计时（自举盲区）
  const pending = CHAIN[pendingIdx];
  const prev = CHAIN[pendingIdx - 1];
  const T = doneTs[prev];
  const now = Date.now();
  if (now - T <= TIMEOUT_MS) continue; // 未超时
  // 接管证据：执行型=ack 或 done；流转型=done
  const evidence = EXEC_TYPE.has(pending) ? Math.max(ackTs[pending] ?? 0, doneTs[pending] ?? 0) : (doneTs[pending] ?? 0);
  if (evidence > T) continue; // 已接管（作业时长不计）
  // 催办去重：T 之后已有 patrol missing 且其后无新证据 → 已催过
  const lastMissing = [...recs].reverse().find((r) => r.node === pending && r.state === 'missing' && r.recorded_by === 'patrol');
  if (lastMissing && new Date(lastMissing.ts).getTime() > T && new Date(lastMissing.ts).getTime() > evidence) continue;
  appendRecord(tree.path, {
    ts: new Date().toISOString(), tree_id: tree.treeId, node: pending,
    actor: SEAT[pending], state: 'missing', receipt_id: '',
    content_ref: '', recorded_by: 'patrol',
    note: `timeout ${Math.round((now - T) / 60000)}min after ${prev} done; takeover evidence absent`,
  });
  urged++;
  const owner = SEAT_TARGET[pending] || '';
  const targets = [...new Set([owner, COS_SEAT].filter(Boolean))];
  const msg = await notify(
    `树节点催办：${tree.treeId} / ${CHAIN_ZH[pending]}`,
    `节点「${pending}（${CHAIN_ZH[pending]}，责任=${SEAT[pending]}）」自前节点「${prev}」完成已超 5 分钟无接管证据（执行型卡认领、流转型卡收口件）。请接管或向 COS 交回执 id。树目录=operating-records/${tree.week}/trees/${tree.treeId}/。本催办已落 missing 记录（patrol），接管后自动解除。`,
  );
  console.log(`urged: ${tree.treeId}/${pending} ${msg}`);
}
console.log(`patrol done: trees=${scanned} urged=${urged}`);
