#!/usr/bin/env bash
# LG-058 r5 Stage2 R-HY 部署环（连接配置表单增补单包，CEO 23:41 批·裁 A）
# 硬门①: 环A 备份锚→BACKUP-ANCHOR-r5.ready→本机腿报备 COO+BOD→GO-r5.flag(120s 超时 HOLD exit 42)——未报备不开跑
# 硬门②: 环C 值面探针含 r5 五件特征锚机器预检（文件式 grep——r2 SIGPIPE 假阴性教训落正形）
# 硬门③: 环B 失败自动回滚 dist.bak-pre-lg058r5+restart
# 零触碰面: trirmc.service / trirmc-mc.service / 连接配置四域 endpoint 值面存量（BOD 边界照旧）
# 锚语义变更（r4→r5）: 密钥禁入锚反转为密钥行在位锚；裁 A 运行时断言由 ②i 承担
set -uo pipefail
UP=/srv/fleet/lg058-upgrade
IN=$UP/in
TM_SHA=5188e7f8d18dc02f2c5325ece0b23503db259235
TM_SHORT=5188e7f
TS=$(date -u +%Y%m%dT%H%M%SZ)
CARDS=/srv/fleet/trimodel-data
LOG=$UP/stage2-r5.log

log(){ echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*" >> "$LOG"; }
fail(){ log "FAIL: $*"; echo "$(date -u +%FT%TZ) FAIL: $*" >> "$UP/stage2-r5.FAILED"; exit 1; }

mkdir -p "$UP" "$IN"
if [ -f "$UP/stage2-r5.done" ]; then echo "stage2-r5 done-already skip $(date -u +%FT%TZ)"; exit 0; fi
exec >> "$LOG" 2>&1
log "=== STAGE2-R5 START (pid $$) ==="

# ── 输入包校验 ──
[ -f "$IN/trimodel-dist-$TM_SHORT.tar.gz" ] || fail "in-tm-missing"
ACT_T=$(sha256sum "$IN/trimodel-dist-$TM_SHORT.tar.gz" | awk '{print $1}')
EXP_T=$(grep "trimodel-dist-$TM_SHORT.tar.gz" "$IN/SHA256SUMS-r5" 2>/dev/null | awk '{print $1}')
[ -n "$EXP_T" ] && [ "$ACT_T" = "$EXP_T" ] || fail "tm-dist-hash-mismatch act=$ACT_T exp=$EXP_T"
log "input dist hash verified ($TM_SHORT)"

# ═══ 环A 备份锚（TriModel 单面；HOLD 重入跳过复用）═══
if [ -f "$UP/BACKUP-ANCHOR-r5.ready" ]; then
  log "环A skip: 备份锚已备（HOLD 续跑分支）:"; cat "$UP/BACKUP-ANCHOR-r5.ready"
  BAKTM=$(grep -oP '^dist bak: \K\S+(?= )' "$UP/BACKUP-ANCHOR-r5.ready" | head -1)
else
  BAKTM=/srv/fleet/TriModel/dist.bak-pre-lg058r5-$TS
  cp -a /srv/fleet/TriModel/dist "$BAKTM" || fail "bak-tm-dist"
  mkdir -p "$UP/backup"
  tar -C "$CARDS" -czf "$UP/backup/trimodel-data-cfg-r5-$TS.tar.gz" --exclude='*.log' . 2>/dev/null || fail "bak-cards-tar"
  CFGF="$UP/backup/trimodel-data-cfg-r5-$TS.tar.gz"
  {
    echo "dist bak: $BAKTM $(sha256sum "$BAKTM/src/server.js" 2>/dev/null | awk '{print $1}') (dir)"
    echo "cfg tar:  $CFGF $(sha256sum "$CFGF" 2>/dev/null | awk '{print $1}')"
    echo "ts: $TS"
  } > "$UP/BACKUP-ANCHOR-r5.ready"
  log "环A 备份锚毕:"; cat "$UP/BACKUP-ANCHOR-r5.ready"
fi

# ── GO-r5.flag 停等（120s 超时 HOLD；硬门① 报备后由 BOD/COO 批 GO）──
GO=0
for i in $(seq 1 24); do [ -f "$UP/GO-r5.flag" ] && { GO=1; break; }; sleep 5; done
if [ "$GO" != "1" ]; then touch "$UP/stage2-r5.HOLD"; log "GO-r5.flag 120s 超时 → HOLD 安全停 (exit 42)"; exit 42; fi
log "GO-r5.flag 在 → 续环"

# ── 回滚函数（硬门③，TriModel 单面）──
rollback(){
  log "!!! ROLLBACK 触发: $* !!!"
  systemctl stop trimodel.service 2>/dev/null
  rm -rf /srv/fleet/TriModel/dist
  cp -a "$BAKTM" /srv/fleet/TriModel/dist
  chown -R fleet:fleet /srv/fleet/TriModel/dist
  systemctl start trimodel.service
  sleep 2
  log "ROLLBACK 完: trimodel=$(systemctl is-active trimodel.service)"
  echo "$(date -u +%FT%TZ) ROLLED-BACK: $*" >> "$UP/stage2-r5.ROLLBACK"
}

# ═══ 环B 部署（只 trimodel.service；trirmc 双 unit 零触碰）═══
rm -rf "$UP/stage-r5"; mkdir -p "$UP/stage-r5/tm"
tar -C "$UP/stage-r5/tm" -xzf "$IN/trimodel-dist-$TM_SHORT.tar.gz" || { rollback "tm-untar"; fail "tm-untar"; }
log "untar ok; stop trimodel"
systemctl stop trimodel.service || { rollback "stop-tm"; fail "stop-tm"; }
rm -rf /srv/fleet/TriModel/dist
cp -a "$UP/stage-r5/tm/dist" /srv/fleet/TriModel/dist || { rollback "mv-dist"; fail "mv-dist"; }
chown -R fleet:fleet /srv/fleet/TriModel/dist
DEP=$(cat /srv/fleet/TriModel/dist/.deploy-sha 2>/dev/null)
[ "$DEP" = "$TM_SHA" ] || { rollback "deploy-sha-got-$DEP"; fail "deploy-sha-mismatch got=$DEP exp=$TM_SHA"; }
log "deploy-sha 断言 ok ($TM_SHORT)"
systemctl start trimodel.service || { rollback "start-tm"; fail "start-tm"; }
sleep 3
systemctl is-active trimodel.service >/dev/null || { rollback "not-active"; fail "tm-not-active"; }
log "环B 部署毕: trimodel active"

# ═══ 环C 值面探针（硬门②；文件式 grep——r2 pipefail+SIGPIPE 假阴性教训落正形）═══
H=$(curl -s -m 6 http://127.0.0.1:3333/health)
echo "$H" | grep -q '"ok" *: *true\|"ok":true' || { log "health 读数: $H"; fail "healthz-not-ok"; }
log "/health ok: $H"
curl -s -m 6 http://127.0.0.1:3333/ui -o "$UP/ui-probe-r5.html" || fail "ui-fetch"
UIF="$UP/ui-probe-r5.html"
grep -q 'body class="menu-full"' "$UIF" || fail "回归: 二轮冷态静态骨架缺失"
grep -q 'M 面 · 服务域' "$UIF" || fail "回归: 三轮全格式签缺失"
grep -q 'R-HY 8712' "$UIF" || fail "回归: 三轮 rmc 端口对等缺失"
grep -q 'API Key' "$UIF" || fail "r5 锚: 密钥行标签缺失"
grep -q '认证字段' "$UIF" || fail "r5 锚: 认证字段下拉缺失"
grep -q 'API 格式' "$UIF" || fail "r5 锚: API 格式下拉缺失"
grep -q 'ANTHROPIC_AUTH_TOKEN' "$UIF" || fail "r5 锚: AUTH_TOKEN 键缺失"
grep -q 'ANTHROPIC_API_KEY' "$UIF" || fail "r5 锚: API_KEY 键缺失"
grep -q 'data-cd-keyref' "$UIF" || fail "r5 锚: 密钥行 keyref 缺失"
grep -q 'data-cd-eye' "$UIF" || fail "r5 锚: 显隐眼睛缺失"
grep -q 'data-cd-1m' "$UIF" || fail "r5 锚: 1M 开关缺失"
grep -q '需本地路由，TriModel 现役仅支持 Anthropic Messages 直连' "$UIF" || fail "r5 锚: 警示文案缺失"
grep -q 'Gemini Native generateContent（需开启路由）' "$UIF" || fail "r5 锚: 四选项文案缺失"
grep -q '请求地址' "$UIF" || fail "回归: r4 主平铺请求地址缺失"
grep -q '配置预览' "$UIF" || fail "回归: r4 配置预览缺失"
if grep -q '河源' "$UIF"; then fail "回归: 三轮河源残留"; fi
log "环C 探针毕: health ok + 二轮/三轮/r4 回归锚保持 + r5 五件特征锚全绿（文件式零管道）"
{
  echo 'menu-full body = PASS (二轮锚保持)'
  echo 'r3 fullformat/port-parity = PASS (三轮锚保持)'
  echo 'r4 form blocks = PASS (请求地址/配置预览保持)'
  echo 'r5 five-piece = PASS (密钥行/认证字段/API 格式/1M 开关/眼睛)'
  echo 'r5 keys = PASS (AUTH_TOKEN/API_KEY 认证字段双选项)'
  echo 'r5 warn = PASS (非原生警示文案在位)'
  echo 'probe mode = file-grep (r2 SIGPIPE lesson applied)'
  date -u +%FT%TZ
} > "$UP/stage2-r5.READOUT.txt"

touch "$UP/stage2-r5.done"
log "=== STAGE2-R5 DONE ==="
exit 0
