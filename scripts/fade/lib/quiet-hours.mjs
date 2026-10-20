// quiet-hours.mjs — 值守候令静默态豁免时段谓词（A 辅·10-14 晨窗施工）
// 依据: BOD 10-14 04:19 带话（值守候令静默=预期态·今夜实锚每 30min 6 通知）
//       + FSD 设计裁量（B 主 A 辅·290a3feb4 续勘节）+ COO 排窗令 04:40-06:10。
// 规则: 本地时 22:00-08:00 内 duty-escalate / idle-escalate 降 log-only。
//       anchor-error 不豁免（结构异常夜间也出声）；reminder 不豁免（灰度观察项·候评估）。
//       豁免不写 state——出豁免窗首轮即正常告警（无冷却残留）。
// B 主（daemon 拍文判据）候下窗：判据源 sg 侧四向勘未定位（.fade/seats/无 daemon 周期拍文/
//       20:37 时锚零命中/「候令」关键词零命中/8710 healthz 空回），候 BOD 澄清拍文所指。

export function isQuietHours(d = new Date()) {
  const h = d.getHours(); // 服务器本地时（两实例宿主 dev 机/sg 机均 +08）
  return h >= 22 || h < 8;
}
