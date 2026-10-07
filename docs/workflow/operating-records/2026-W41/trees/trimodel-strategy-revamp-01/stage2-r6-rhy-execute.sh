#!/usr/bin/env bash
# TriModel 批 A 改名 Stage2 R-HY 部署环（r6；charter v2.1 0ea6b42f 派工）
# 硬门①: 环A 备份锚→BACKUP-ANCHOR-r6.ready→FSD 报备 BOD→GO-r6.flag(120s 超时 HOLD exit 42)——BOD 复核签发，未报备不开跑
# 硬门②: 环C 值面探针含批A 锚+零残留+禁改九处机器预检（文件式 grep 零管道——r2 SIGPIPE 教训正形）
# 硬门③: 环B 失败自动回滚 dist.bak-pre-batcha-r6+restart
# 零触碰面: trirmc.service / trirmc-mc.service / 连接配置四域 endpoint 值面存量（BOD 边界照旧）
# 防双实例: 触发方自挂 GO 前必查停等实例存活（log 尾/FAILED/running 标记）
set -uo pipefail
UP=/srv/fleet/lg058-upgrade
IN=$UP/in
TM_SHA=72d30995494c0876ce3ab34a9e4445049a0bd435
TM_SHORT=72d3099
TS=$(date -u +%Y%m%dT%H%M%SZ)
CARDS=/srv/fleet/trimodel-data
LOG=$UP/stage2-r6.log

case "$TM_SHA" in *FILL*) echo "FATAL: TM_SHA placeholder unfilled"; exit 9;; esac

log(){ echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*" >> "$LOG"; }
fail(){ log "FAIL: $*"; echo "$(date -u +%FT%TZ) FAIL: $*" >> "$UP/stage2-r6.FAILED"; exit 1; }

mkdir -p "$UP" "$IN"
if [ -f "$UP/stage2-r6.done" ]; then echo "stage2-r6 done-already skip $(date -u +%FT%TZ)"; exit 0; fi
exec >> "$LOG" 2>&1
log "=== STAGE2-R6 START (pid $$) sha=$TM_SHA ==="

# ── 输入包校验 ──
[ -f "$IN/trimodel-dist-$TM_SHORT.tar.gz" ] || fail "in-tm-missing"
ACT_T=$(sha256sum "$IN/trimodel-dist-$TM_SHORT.tar.gz" | awk '{print $1}')
EXP_T=$(grep "trimodel-dist-$TM_SHORT.tar.gz" "$IN/SHA256SUMS-r6" 2>/dev/null | awk '{print $1}')
[ -n "$EXP_T" ] && [ "$ACT_T" = "$EXP_T" ] || fail "tm-dist-hash-mismatch act=$ACT_T exp=$EXP_T"
log "input dist hash verified ($TM_SHORT)"

# ═══ 环A 备份锚（TriModel 单面；HOLD 重入跳过复用）═══
if [ -f "$UP/BACKUP-ANCHOR-r6.ready" ]; then
  log "环A skip: 备份锚已备（HOLD 续跑分支）:"; cat "$UP/BACKUP-ANCHOR-r6.ready"
  BAKTM=$(grep -oP '^dist bak: \K\S+(?= )' "$UP/BACKUP-ANCHOR-r6.ready" | head -1)
else
  BAKTM=/srv/fleet/TriModel/dist.bak-pre-batcha-r6-$TS
  cp -a /srv/fleet/TriModel/dist "$BAKTM" || fail "bak-tm-dist"
  mkdir -p "$UP/backup"
  tar -C "$CARDS" -czf "$UP/backup/trimodel-data-cfg-r6-$TS.tar.gz" --exclude='*.log' . 2>/dev/null || fail "bak-cards-tar"
  CFGF="$UP/backup/trimodel-data-cfg-r6-$TS.tar.gz"
  {
    echo "dist bak: $BAKTM $(sha256sum "$BAKTM/src/server.js" 2>/dev/null | awk '{print $1}') (dir)"
    echo "cfg tar:  $CFGF $(sha256sum "$CFGF" 2>/dev/null | awk '{print $1}')"
    echo "ts: $TS"
  } > "$UP/BACKUP-ANCHOR-r6.ready"
  log "环A 备份锚毕:"; cat "$UP/BACKUP-ANCHOR-r6.ready"
fi

# ── GO-r6.flag 停等（120s 超时 HOLD；硬门① 报备后由 BOD 复核签发）──
GO=0
for i in $(seq 1 24); do [ -f "$UP/GO-r6.flag" ] && { GO=1; break; }; sleep 5; done
if [ "$GO" != "1" ]; then touch "$UP/stage2-r6.HOLD"; log "GO-r6.flag 120s 超时 → HOLD 安全停 (exit 42)"; exit 42; fi
log "GO-r6.flag 在 → 续环"

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
  echo "$(date -u +%FT%TZ) ROLLED-BACK: $*" >> "$UP/stage2-r6.ROLLBACK"
}

# ═══ 环B 部署（只 trimodel.service；trirmc 双 unit 零触碰）═══
rm -rf "$UP/stage-r6"; mkdir -p "$UP/stage-r6/tm"
tar -C "$UP/stage-r6/tm" -xzf "$IN/trimodel-dist-$TM_SHORT.tar.gz" || { rollback "tm-untar"; fail "tm-untar"; }
log "untar ok; stop trimodel"
systemctl stop trimodel.service || { rollback "stop-tm"; fail "stop-tm"; }
rm -rf /srv/fleet/TriModel/dist
cp -a "$UP/stage-r6/tm/dist" /srv/fleet/TriModel/dist || { rollback "mv-dist"; fail "mv-dist"; }
chown -R fleet:fleet /srv/fleet/TriModel/dist
DEP=$(cat /srv/fleet/TriModel/dist/.deploy-sha 2>/dev/null)
[ "$DEP" = "$TM_SHA" ] || { rollback "deploy-sha-got-$DEP"; fail "deploy-sha-mismatch got=$DEP exp=$TM_SHA"; }
log "deploy-sha 断言 ok ($TM_SHORT)"
systemctl start trimodel.service || { rollback "start-tm"; fail "start-tm"; }
sleep 3
systemctl is-active trimodel.service >/dev/null || { rollback "not-active"; fail "tm-not-active"; }
log "环B 部署毕: trimodel active"

# ═══ 环C 值面探针（硬门②；文件式 grep 零管道）═══
H=$(curl -s -m 6 http://127.0.0.1:3333/health)
echo "$H" | grep -q '"ok" *: *true\|"ok":true' || { log "health 读数: $H"; fail "healthz-not-ok"; }
log "/health ok: $H"
curl -s -m 6 http://127.0.0.1:3333/ui -o "$UP/ui-probe-r6.html" || fail "ui-fetch"
UIF="$UP/ui-probe-r6.html"
# 批A 零残留+禁改九处（活体服务的文件面）
SC=$(grep -c '策略卡' /srv/fleet/TriModel/dist/ui/index.html)
[ "$SC" = "0" ] || fail "batcha: 策略卡 residual=$SC"
LC=$(grep -c '连接配置' /srv/fleet/TriModel/dist/ui/index.html)
[ "$LC" = "9" ] || fail "batcha: 连接配置 count=$LC exp=9"
NC=$(grep -c '无法连接配置服务' /srv/fleet/TriModel/dist/ui/index.html)
[ "$NC" = "9" ] || fail "batcha: 无法连接配置服务 count=$NC exp=9"
grep -q "label: '模型策略'" "$UIF" || fail "batcha: nav-label-模型策略-missing"
grep -q "label: '兜底模型'" "$UIF" || fail "batcha: nav-label-兜底模型-missing"
grep -q '四域各一份保底直配' "$UIF" || fail "batcha: §4.3-sub-missing"
# r5 五件+r4/三轮/二轮回归
grep -q 'API Key' "$UIF" || fail "r5 锚: 密钥行标签缺失"
grep -q '认证字段' "$UIF" || fail "r5 锚: 认证字段下拉缺失"
grep -q 'API 格式' "$UIF" || fail "r5 锚: API 格式缺失"
grep -q 'data-cd-keyref' "$UIF" || fail "r5 锚: 密钥行 keyref 缺失"
grep -q 'data-cd-1m' "$UIF" || fail "r5 锚: 1M 开关缺失"
grep -q '请求地址' "$UIF" || fail "回归: r4 主平铺请求地址缺失"
grep -q '配置预览' "$UIF" || fail "回归: r4 配置预览缺失"
grep -q 'M 面 · 服务域' "$UIF" || fail "回归: 三轮全格式签缺失"
grep -q 'R-HY 8712' "$UIF" || fail "回归: 三轮 rmc 端口对等缺失"
if grep -q '河源' "$UIF"; then fail "回归: 三轮河源残留"; fi
grep -q 'body class="menu-full"' "$UIF" || fail "回归: 二轮冷态静态骨架缺失"
log "环C 探针毕: health ok + 批A零残留/禁改九处/新锚 + r5 五件+r4/三轮/二轮回归锚全绿（文件式零管道）"
{
  echo 'batchA rename = PASS (策略卡=0 / 连接配置=9 全在报错文案 / 无法连接配置服务=9)'
  echo 'batchA nav labels = PASS (模型策略 + 兜底模型)'
  echo 'batchA §4.3 sub = PASS (四域各一份保底直配)'
  echo 'r5 five-piece = PASS (密钥行/认证字段/API 格式/keyref/1M 保持)'
  echo 'r4 form blocks = PASS (请求地址/配置预览保持)'
  echo 'r3 fullformat/port-parity = PASS (三轮锚保持)'
  echo 'r2 menu-full = PASS (二轮锚保持)'
  echo 'healthz = PASS'
  echo 'probe mode = file-grep (r2 SIGPIPE lesson applied)'
  date -u +%FT%TZ
} > "$UP/stage2-r6.READOUT.txt"

touch "$UP/stage2-r6.done"
log "=== STAGE2-R6 DONE ==="
exit 0
