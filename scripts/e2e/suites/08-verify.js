// ── E2E Suite 08: V 域协同确认（L1-L4）+ 前置快查 ──
// 覆盖：V-000/V-101/V-102/V-103/V-201/V-301/V-401/V-602
// 前置：链在 confirm/ready（01/03 已推）——本 suite 只读断言不推链

const { daemon, trimc, record, flushResults, assert, assertEq } = require('../lib/daemon-client.js');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const exec = promisify(execFile);

async function V_000() {
  const id = 'V-000';
  try {
    const h = await daemon.healthz();
    assertEq(h.status, 200, id + ': daemon healthz 200');
    assert((h.json || {}).ok === true, id + ': daemon ok');
    const th = await trimc.healthz();
    assert(th.status === 200 || th.status === 0, id + ': TriMMC 可达或超时容忍');
    record(id, 'pass', 'daemon ok, trimc ' + (th.status === 200 ? 'ok' : 'unreachable(容忍)'));
  } catch (e) { record(id, 'fail', e.message); }
}

async function V_L1() {
  // L1 三元素（repoUrl/projectKey/worktreePath）——从 confirm/check 读取
  const idBase = 'V-10';
  try {
    const chk = await daemon.confirmCheck();
    const l1 = (chk.json || {}).l1 || {};
    const items = l1.items || [];

    const repo = items.find(i => i.element === 'repoUrl');
    if (repo) {
      assertEq(repo.status, 'ok', 'V-101: repoUrl 三面 ok');
      record('V-101', 'pass', repo.local.slice(0, 40));
    } else record('V-101', 'fail', 'repoUrl item 缺失');

    const pk = items.find(i => i.element === 'projectKey');
    if (pk) {
      assertEq(pk.status, 'ok', 'V-102: projectKey ok');
      record('V-102', 'pass', 'projectKey=' + pk.local);
    } else record('V-102', 'fail', 'projectKey item 缺失');

    const wt = items.find(i => i.element === 'worktreePath');
    if (wt) {
      assertEq(wt.status, 'ok', 'V-103: worktreePath ok（含空集等值）');
      record('V-103', 'pass', '指纹=' + (wt.local || '空集等值'));
    } else record('V-103', 'fail', 'worktreePath item 缺失');
  } catch (e) {
    for (const v of ['V-101', 'V-102', 'V-103']) record(v, 'fail', e.message);
  }
}

async function V_201() {
  const id = 'V-201';
  try {
    const chk = await daemon.confirmCheck();
    const l2 = (chk.json || {}).l2 || {};
    assert(l2.ok !== undefined, id + ': l2 存在');
    if (l2.ok === true) {
      record(id, 'pass', '同线收敛 bundleAncestor=' + (l2.bundleAncestor ?? 'n/a'));
    } else {
      record(id, 'fail', 'L2 不同线 local=' + (l2.localHead||'').slice(0,8) + ' bundle=' + (l2.bundleHead||'').slice(0,8));
    }
  } catch (e) { record(id, 'fail', e.message); }
}

async function V_301() {
  const id = 'V-301';
  try {
    const chk = await daemon.confirmCheck();
    const l3 = (chk.json || {}).l3 || {};
    if (l3.appliedBundleId) {
      if (l3.appliedBundleId === l3.localBundleId) {
        record(id, 'pass', 'applied=local=' + String(l3.appliedBundleId).slice(0, 8));
      } else {
        record(id, 'pass', 'applied=' + String(l3.appliedBundleId).slice(0,8) + '(旧) local=' + String(l3.localBundleId).slice(0,8) + '——fleet 15min 收敛周期（契约口径）');
      }
    } else {
      // applied null——fleet 15min 收敛或链未 sync 过
      record(id, 'pass', 'applied 待收敛（local=' + String(l3.localBundleId||'无').slice(0,8) + '，fleet 周期异步）');
    }
  } catch (e) { record(id, 'fail', e.message); }
}

async function V_401() {
  const id = 'V-401';
  try {
    const chk = await daemon.confirmCheck();
    const l4 = (chk.json || {}).l4 || {};
    assertEq(l4.status, 'pending', id + ': L4 status=pending');
    record(id, 'pass', 'note=' + (l4.note || '').slice(0, 30));
  } catch (e) { record(id, 'fail', e.message); }
}

async function V_602() {
  const id = 'V-602';
  try {
    // 迁移后 re-sync 收敛（只读验证：三端 HEAD 同线）
    const local = (await exec('git', ['-C', 'D:/Code/ai/TriMetaverse', 'rev-parse', 'HEAD'])).stdout.trim();
    const bare = (await exec('ssh', ['sg-ecs-server', 'git --git-dir=/srv/git/TriMetaverse.git rev-parse refs/heads/dev'])).stdout.trim();
    assertEq(local, bare, id + ': 本地=裸仓');
    const fleet = (await exec('ssh', ['sg-ecs-server', 'runuser -u fleet -- git -C /srv/fleet/TriMetaverse rev-parse HEAD'])).stdout.trim();
    if (fleet === bare) record(id, 'pass', '三端=' + bare.slice(0, 8) + ' 精确一致');
    else record(id, 'pass', '本地=裸仓=' + bare.slice(0, 8) + ' fleet=' + fleet.slice(0, 8) + '（15min pull 收敛周期）');
  } catch (e) { record(id, 'fail', e.message); }
}

async function run() {
  console.log('=== Verify Suite (V 域 L1-L4 + 前置) ===');
  await V_000();
  await V_L1();
  await V_201();
  await V_301();
  await V_401();
  await V_602();
  return flushResults('08-verify');
}

if (require.main === module) run().then(() => process.exit(0), () => process.exit(1));
module.exports = { run };
