// duty-tick-signal.mjs — 值守候令拍文判据（B 主·10-14 晨窗施工·件①正身）
// 判据源=BOD 答询 10-14 04:33: bod-tick 拍文真身=
//   docs/workflow/operating-records/<当 ISO 周目录>/trees/bod-tick/tick-latest.md
//   （TriMLC 8713 daemon 产出·:07/:37 双点·⓪段含全席现态）
// 读法两机一致：新鲜度用**内容节拍时戳**（首行「节拍（daemon 版）YYYY-MM-DD HH:MM:SS」·+08）
//   而非文件 mtime——sg 侧文件经 git checkout 不保源 mtime，mtime 断言两机行为分叉。
// 语义：
//   allIdle   = ⓪段「全席空闲」——全席候令态（idle-escalate 豁免判据：无人施工·静默预期）
//   dutyIdle  = m-duty-cos=候令 OR 全席空闲——值守候令（duty-escalate 豁免判据，
//               覆盖 sg 值席 m-duty-cos 与本机值守 m-cos（全空闲时 m-cos 必空闲）两形态）
// fail-open：拍文缺失/解析失败/时戳 >35min（拍节 30min+5min 缓冲）→ fresh=false 不豁免照发
//   （保守向：拍文断供时值守真失联不漏报；代价=断供窗噪声回归·灰度观察项）。

import fs from "node:fs";
import path from "node:path";

/** 当 ISO 周目录名（周一为首·ISO 8601 week）——拍文落 <year>-W<ww>/ 树目录。 */
export function isoWeekDir(d = new Date()) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7; // 周日=0 → 7
  t.setUTCDate(t.getUTCDate() + 4 - day); // 移到本 ISO 周的周四
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((t - yearStart) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

/** 读 bod-tick 拍文值守候令信号。永不 throw（三钉③ degrade——读失败=fresh=false）。 */
export function readDutyTickSignal(repoRoot, now = Date.now()) {
  try {
    const p = path.join(
      repoRoot, "docs", "workflow", "operating-records",
      isoWeekDir(new Date(now)), "trees", "bod-tick", "tick-latest.md",
    );
    const raw = fs.readFileSync(p, "utf-8");
    const m = raw.match(/节拍（daemon 版）(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/);
    if (!m) return { fresh: false, reason: "no-timestamp" };
    const ts = Date.parse(`${m[1].replace(" ", "T")}+08:00`);
    if (!Number.isFinite(ts)) return { fresh: false, reason: "bad-timestamp" };
    if (now - ts > 35 * 60000) return { fresh: false, reason: "stale" };
    const allIdle = raw.includes("全席空闲");
    return {
      fresh: true,
      ts,
      allIdle,
      dutyIdle: raw.includes("m-duty-cos=候令") || allIdle,
    };
  } catch {
    return { fresh: false, reason: "read-failed" }; // 文件缺失/IO 错——degrade 不豁免
  }
}
