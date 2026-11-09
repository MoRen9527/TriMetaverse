#!/usr/bin/env node
// test-duty-anchor.mjs — duty-anchor 判据自测门（b 项落形·node 直跑断言式·exit code 门）
// 用法: node scripts/fade/test-duty-anchor.mjs
// 如实注: hub-silent-detect.mjs 真跑不执行——keeper 段现役连败在案（真跑触发基建
// 告警扰面）；本件只测纯函数判据层+信箱档读面，零 notify 面。
// 判据四态谱: 锚新(self-clear)/锚旧(照报)/无锚(照报)/读炸(照报 fail-open)。

import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { readMailboxDoc, dutyPickupAnchor, readNoticeAnchor, dutyNoticeInFlight, NOTICE_PENDING_MIN } from "./lib/duty-anchor.mjs";

let passed = 0;
function ok(name, fn) {
  fn();
  passed += 1;
  console.log(`ok ${passed} - ${name}`);
}

const DUTY_MS = Date.parse("2026-11-06T01:00:00.000Z"); // 假想静默起点（transcript mtime）

ok("案1 锚新: duty 源信 received_at 晚于静默起点 → pickup-verified（self-clear 面）", () => {
  const r = dutyPickupAnchor(
    { letters: [{ source_seat: "duty-cos", received_at: "2026-11-06T01:05:00.000Z" }] },
    DUTY_MS,
  );
  assert.equal(r.anchored, true);
  assert.equal(r.reason, "pickup-verified");
  assert.equal(r.count, 1);
  assert.equal(r.newestMs, Date.parse("2026-11-06T01:05:00.000Z"));
});

ok("案2 锚旧: received_at 早于静默起点 → anchor-older-than-silence 照报", () => {
  const r = dutyPickupAnchor(
    { letters: [{ source_seat: "duty-cos", received_at: "2026-11-06T00:30:00.000Z" }] },
    DUTY_MS,
  );
  assert.equal(r.anchored, false);
  assert.equal(r.reason, "anchor-older-than-silence");
});

ok("案3 混合谱取最新: 旧信+新信并存 → anchored=true（最新值面）", () => {
  const r = dutyPickupAnchor(
    { letters: [
      { source_seat: "duty-cos", received_at: "2026-11-06T00:30:00.000Z" },
      { source_seat: "m-cos", received_at: "2026-11-06T01:07:00.000Z" },
    ] },
    DUTY_MS,
  );
  assert.equal(r.anchored, true);
  assert.equal(r.count, 2);
  assert.equal(r.newestMs, Date.parse("2026-11-06T01:07:00.000Z"));
});

ok("案4 非 duty 源信不命中: 无 duty/cos 源 → no-duty-letter 照报", () => {
  const r = dutyPickupAnchor(
    { letters: [{ source_seat: "m-fsd", received_at: "2026-11-06T01:05:00.000Z" }] },
    DUTY_MS,
  );
  assert.equal(r.anchored, false);
  assert.equal(r.reason, "no-duty-letter");
});

ok("案5 doc 形破族: null/letters 缺失/非数组 → no-doc 照报", () => {
  assert.equal(dutyPickupAnchor(null, DUTY_MS).reason, "no-doc");
  assert.equal(dutyPickupAnchor({}, DUTY_MS).reason, "no-doc");
  assert.equal(dutyPickupAnchor({ letters: "x" }, DUTY_MS).reason, "no-doc");
});

ok("案6 dutyMs 缺席: null/NaN → no-duty-ms 照报（fail-open 面）", () => {
  assert.equal(dutyPickupAnchor({ letters: [] }, null).reason, "no-duty-ms");
  assert.equal(dutyPickupAnchor({ letters: [] }, NaN).reason, "no-duty-ms");
});

ok("案7 时戳坏值: received_at 非 ISO → bad-ts 照报", () => {
  const r = dutyPickupAnchor(
    { letters: [{ source_seat: "duty-cos", received_at: "not-a-date" }] },
    DUTY_MS,
  );
  assert.equal(r.anchored, false);
  assert.equal(r.reason, "bad-ts");
});

ok("案8 readMailboxDoc 真 IO 链: 临时档构造→读回+活体信箱档附验（只断结构不触值面）", () => {
  const tmp = path.join(os.tmpdir(), `duty-anchor-test-${process.pid}-${Date.now()}.json`);
  fs.writeFileSync(
    tmp,
    JSON.stringify({ letters: [{ source_seat: "duty-cos", received_at: "2026-11-06T01:05:00.000Z" }] }),
  );
  const doc = readMailboxDoc(tmp);
  assert.ok(doc !== null, "临时档应可读");
  assert.ok(Array.isArray(doc.letters) && doc.letters.length === 1, "读回结构面");
  fs.rmSync(tmp, { force: true });
  // 活体信箱档附验（dev 机部署事实·不在则注记跳过非 fail——daemon 未起时缺档合法）
  const live = readMailboxDoc("D:/Code/ai/TriMLC/notify-mailbox.json");
  if (live === null) console.log("  # 活体信箱档不可读（注记级跳过·非本件判据面）");
  else assert.ok(Array.isArray(live.letters), "活体档 letters 为数组");
});

ok("案9 readMailboxDoc 错路径/坏 JSON → null fail-open", () => {
  assert.equal(readMailboxDoc("D:/no/such/file.json"), null);
});

// ── 通报锚判六态（BOD ㊿+288 批准·v4.3 增量锚笔消费面）──
const NOW_MS = Date.parse("2026-11-06T03:00:00.000Z");

ok("案10 通报在途成立: 通报晚于静默起点且 15min 窗内 → notice-in-flight", () => {
  const r = dutyNoticeInFlight(
    "notice @2026-11-06T02:50:00Z 第1轮 tmux直发\n",
    Date.parse("2026-11-06T01:00:00.000Z"),
    NOW_MS,
  );
  assert.equal(r.inFlight, true);
  assert.equal(r.reason, "notice-in-flight");
  assert.equal(r.newestNoticeMs, Date.parse("2026-11-06T02:50:00Z"));
});

ok("案11 响应窗过期照报: 通报晚于起点但超 15min → notice-expired（真死防漏报闭合）", () => {
  const r = dutyNoticeInFlight(
    "notice @2026-11-06T01:10:00Z 第1轮\n",
    Date.parse("2026-11-06T01:00:00.000Z"),
    NOW_MS,
  );
  assert.equal(r.inFlight, false);
  assert.equal(r.reason, "notice-expired");
});

ok("案12 通报旧于静默起点照报: → notice-older-than-silence（旧通报与本窗无关）", () => {
  const r = dutyNoticeInFlight(
    "notice @2026-11-06T00:30:00Z 第0轮\n",
    Date.parse("2026-11-06T01:00:00.000Z"),
    NOW_MS,
  );
  assert.equal(r.inFlight, false);
  assert.equal(r.reason, "notice-older-than-silence");
});

ok("案13 空/缺行族: null/空白 → no-anchor-log；无合法时戳 → no-valid-notice", () => {
  assert.equal(dutyNoticeInFlight(null, 1, NOW_MS).reason, "no-anchor-log");
  assert.equal(dutyNoticeInFlight("  \n", 1, NOW_MS).reason, "no-anchor-log");
  assert.equal(dutyNoticeInFlight("notice @bogus 第1轮\n", 1, NOW_MS).reason, "no-valid-notice");
  assert.equal(dutyNoticeInFlight("无关行\n", 1, NOW_MS).reason, "no-valid-notice");
});

ok("案14 dutyMs 缺席 → no-duty-ms fail-open", () => {
  assert.equal(dutyNoticeInFlight("notice @2026-11-06T02:50:00Z\n", null, NOW_MS).reason, "no-duty-ms");
});

ok("案15 多行取最新+pendingMin 可注入+常量值面", () => {
  const r = dutyNoticeInFlight(
    "notice @2026-11-06T01:10:00Z 第1轮\nnotice @2026-11-06T02:50:00Z 第2轮 tmux直发\nnotice @2026-11-06T01:30:00Z 第1.5轮\n",
    Date.parse("2026-11-06T01:00:00.000Z"),
    NOW_MS,
  );
  assert.equal(r.inFlight, true, "最新行（第2轮 02:50）在窗");
  assert.equal(r.newestNoticeMs, Date.parse("2026-11-06T02:50:00Z"));
  assert.equal(NOTICE_PENDING_MIN, 15, "PENDING_MIN=15（BOD 批令值）");
  const r2 = dutyNoticeInFlight(
    "notice @2026-11-06T02:50:00Z\n",
    Date.parse("2026-11-06T01:00:00.000Z"),
    NOW_MS,
    1,
  );
  assert.equal(r2.inFlight, false, "pendingMin=1 注入→窗过照报（可注入面）");
});

ok("案16 readNoticeAnchor 真 IO 链: 临时档读回+错路径 null（fail-open 面）", () => {
  const tmp = path.join(os.tmpdir(), `notice-anchor-test-${process.pid}-${Date.now()}.log`);
  fs.writeFileSync(tmp, "notice @2026-11-06T02:50:00Z 第1轮 tmux直发\n");
  assert.match(readNoticeAnchor(tmp), /notice @2026-11-06T02:50:00Z/);
  fs.rmSync(tmp, { force: true });
  assert.equal(readNoticeAnchor("D:/no/such/anchor.log"), null);
});

console.log(`\n# duty-anchor 自测门 ${passed}/16 绿`);
