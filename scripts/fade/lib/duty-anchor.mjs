// duty-anchor.mjs — duty second-hop 自消复核锚判（b 项落形·BOD 闭窗宣告 ㊿+287=4ced0ae9c·双批齐）
//
// 锚面=bod 信箱档（TriMLC letter-store 落盘面·target=bod 的信持久于 notify-mailbox.json
// 至消费）。判据：duty 源信（source_seat 含 duty/cos）received_at 晚于 transcript 静默
// 起点=拾取实证→self-clear 不报。信箱档不可读/无锚/锚旧=fail-open 照报（保守不漏报·
// 三钉③同守——读炸不崩 job 由调用方兜）。
//
// 锚面物理勘定如实注（2026-11-06 施工前实勘）：
//   · 通报方向（BOD→duty SendMessage 直发）零文件锚（uds 管道+receiver inbox 内存面）
//     ——PENDING_MIN 通报在途判物理不可达·候锚面提案批后落（毕报呈 BOD/COS）。
//   · bod 信箱档消费后清空（今 10:2x 勘 count=0）→锚瞬态·在读拍有锚才降级——
//     今晨首告（09:16:43 拍·回执 09:46:28 才投）救不了=通报在途窗物理天花板·如实注。

import fs from "node:fs";

/** 读 bod 信箱档（零副作用·读炸/形破返 null=fail-open 由调用方照报）。 */
export function readMailboxDoc(path) {
  try {
    const doc = JSON.parse(fs.readFileSync(path, "utf-8"));
    return doc && Array.isArray(doc.letters) ? doc : null;
  } catch {
    return null;
  }
}

/**
 * duty 源信拾取锚判（纯函数·四态可测）。
 * @param mailboxDoc 信箱档（{letters:[…]}|null）
 * @param dutyMs     duty transcript mtime（静默起点·null=无读数）
 * @returns {anchored:boolean, reason:string, newestMs?:number, count?:number}
 *   anchored=true  → 拾取实证（duty 源信 received_at > dutyMs）→调用方 self-clear
 *   anchored=false → 照报（no-doc/no-duty-letter/bad-ts/anchor-older-than-silence/no-duty-ms）
 */
export function dutyPickupAnchor(mailboxDoc, dutyMs) {
  if (dutyMs === null || !Number.isFinite(dutyMs)) return { anchored: false, reason: "no-duty-ms" };
  if (!mailboxDoc || !Array.isArray(mailboxDoc.letters)) return { anchored: false, reason: "no-doc" };
  const hits = mailboxDoc.letters.filter(
    (l) => l && typeof l.received_at === "string" && /duty|cos/i.test(String(l.source_seat || "")),
  );
  if (hits.length === 0) return { anchored: false, reason: "no-duty-letter" };
  const newest = hits
    .map((l) => Date.parse(l.received_at))
    .filter((t) => Number.isFinite(t))
    .sort((a, b) => b - a)[0];
  if (newest === undefined) return { anchored: false, reason: "bad-ts" };
  if (newest > dutyMs) return { anchored: true, reason: "pickup-verified", newestMs: newest, count: hits.length };
  return { anchored: false, reason: "anchor-older-than-silence", newestMs: newest, count: hits.length };
}

// ── 通报锚判（BOD ㊿+288 批准·2026-11-06）─────────────────────────────────
// 锚文件=docs/workflow/hub-state/duty-notice-anchor.log（非周平面固定位·git 追踪
// 留痕）·BOD 侧每轮 duty 通报后落一行：`notice @<ISO 时戳> 第<N>轮 <通道注记>`。
// 判据（PENDING_MIN=15min·BOD 批令主判据正形落位）：最新通报时戳晚于 transcript
// 静默起点（通报是对本次静默的响应）且距检出拍 <15min（响应窗内·duty 可能还没回）
// →通报在途→调用方 self-clear。通报晚于起点但已超 15min=响应窗已过照报（真死防
// 漏报闭合·BOD 漏报边例条件）；通报早于起点=旧通报与本窗无关照报。零行/文件不存在
// =fail-open 照报（保守不漏报）。

export const NOTICE_PENDING_MIN = 15;

/**
 * 通报在途判（纯函数·六态可测）。
 * @param anchorLogText 锚文件全文（string|null）
 * @param dutyMs        duty transcript mtime（静默起点·null=无读数）
 * @param nowMs         检出拍时刻
 * @param pendingMin    响应窗（缺省 15）
 * @returns {inFlight:boolean, reason:string, newestNoticeMs?:number}
 */
export function dutyNoticeInFlight(anchorLogText, dutyMs, nowMs, pendingMin = NOTICE_PENDING_MIN) {
  if (dutyMs === null || !Number.isFinite(dutyMs)) return { inFlight: false, reason: "no-duty-ms" };
  if (!anchorLogText || !anchorLogText.trim()) return { inFlight: false, reason: "no-anchor-log" };
  const stamps = [...anchorLogText.matchAll(/notice @(\S+)/g)]
    .map((m) => Date.parse(m[1]))
    .filter((t) => Number.isFinite(t))
    .sort((a, b) => b - a);
  if (stamps.length === 0) return { inFlight: false, reason: "no-valid-notice" };
  const newest = stamps[0];
  if (newest > dutyMs && nowMs - newest < pendingMin * 60000) {
    return { inFlight: true, reason: "notice-in-flight", newestNoticeMs: newest };
  }
  return {
    inFlight: false,
    reason: newest > dutyMs ? "notice-expired" : "notice-older-than-silence",
    newestNoticeMs: newest,
  };
}

/** 读通报锚文件全文（零副作用·读炸/不存在返 null=fail-open 照报）。 */
export function readNoticeAnchor(path) {
  try {
    return fs.readFileSync(path, "utf-8");
  } catch {
    return null;
  }
}
