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
