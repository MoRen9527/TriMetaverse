#!/usr/bin/env bash
# LG-058 r4 Stage2 R-HY 部署环（连接配置表单化单包，CEO 22:41 批·BOD 裁 b 今夜续走）
# 硬门①: 环A 备份锚→BACKUP-ANCHOR-r4.ready→本机腿报备 COO+BOD→GO-r4.flag(120s 超时 HOLD exit 42)——未报备不开跑
# 硬门②: 环C 值面探针含 r4 表单锚机器预检（文件式 grep——r2 SIGPIPE 假阴性教训落正形）
# 硬门③: 环B 失败自动回滚 dist.bak-pre-lg058r4+restart
# 零触碰面: trirmc.service / trirmc-mc.service / 连接配置四域 endpoint 值面存量（BOD 边界照旧）
# BOD 裁 b 三护栏: ①硬门①全程不省 ②毕报候 BOD 即时复验 ③复验异常即时回滚不过夜
set -uo pipefail
UP=/srv/fleet/lg058-upgrade
IN=$UP/in
TM_SHA=75986ade701c6eb1fe24a443909e386ecd4f9751
TM_SHORT=75986ad
TS=$(date -u +%Y%m%dT%H%M%SZ)
CARDS=/srv/fleet/trimodel-data
LOG=$UP/stage2-r4.log

log(){ echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*" >> "$LOG"; }
fail(){ log "FAIL: $*"; echo "$(date -u +%FT%TZ) FAIL: $*" >> "$UP/stage2-r4.FAILED"; exit 1; }

mkdir -p "$UP" "$IN"
if [ -f "$UP/stage2-r4.done" ]; then echo "stage2-r4 done-already skip $(date -u +%FT%TZ)"; exit 0; fi
exec >> "$LOG" 2>&1
log "=== STAGE2-R4 START (pid $$) ==="

# ── 输入包校验 ──
[ -f "$IN/trimodel-dist-$TM_SHORT.tar.gz" ] || fail "in-tm-missing"
ACT_T=$(sha256sum "$IN/trimodel-dist-$TM_SHORT.tar.gz" | awk '{print $1}')
EXP_T=$(grep "trimodel-dist-$TM_SHORT.tar.gz" "$IN/SHA256SUMS-r4" 2>/dev/null | awk '{print $1}')
[ -n "$EXP_T" ] && [ "$ACT_T" = "$EXP_T" ] || fail "tm-dist-hash-mismatch act=$ACT_T exp=$EXP_T"
log "input dist hash verified ($TM_SHORT)"

# ═══ 环A 备份锚（TriModel 单面；HOLD 重入跳过复用）═══
if [ -f "$UP/BACKUP-ANCHOR-r4.ready" ]; then
  log "环A skip: 备份锚已备（HOLD 续跑分支）:"; cat "$UP/BACKUP-ANCHOR-r4.ready"
  BAKTM=$(grep -oP '^dist bak: \K\S+(?= )' "$UP/BACKUP-ANCHOR-r4.ready" | head -1)
else
  BAKTM=/srv/fleet/TriModel/dist.bak-pre-lg058r4-$TS
  cp -a /srv/fleet/TriModel/dist "$BAKTM" || fail "bak-tm-dist"
  mkdir -p "$UP/backup"
  tar -C "$CARDS" -czf "$UP/backup/trimodel-data-cfg-r4-$TS.tar.gz" --exclude='*.log' . 2>/dev/null || fail "bak-cards-tar"
  CFGF="$UP/backup/trimodel-data-cfg-r4-$TS.tar.gz"
  {
    echo "dist bak: $BAKTM $(sha256sum "$BAKTM/src/server.js" 2>/dev/null | awk '{print $1}') (dir)"
    echo "cfg tar:  $CFGF $(sha256sum "$CFGF" 2>/dev/null | awk '{print $1}')"
    echo "ts: $TS"
  } > "$UP/BACKUP-ANCHOR-r4.ready"
  log "环A 备份锚毕:"; cat "$UP/BACKUP-ANCHOR-r4.ready"
fi

# ── GO-r4.flag 停等（120s 超时 HOLD；硬门① 报备后由 BOD/COO 批 GO）──
GO=0
for i in $(seq 1 24); do [ -f "$UP/GO-r4.flag" ] && { GO=1; break; }; sleep 5; done
if [ "$GO" != "1" ]; then touch "$UP/stage2-r4.HOLD"; log "GO-r4.flag 120s 超时 → HOLD 安全停 (exit 42)"; exit 42; fi
log "GO-r4.flag 在 → 续环"

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
  echo "$(date -u +%FT%TZ) ROLLED-BACK: $*" >> "$UP/stage2-r4.ROLLBACK"
}

# ═══ 环B 部署（只 trimodel.service；trirmc 双 unit 零触碰）═══
rm -rf "$UP/stage-r4"; mkdir -p "$UP/stage-r4/tm"
tar -C "$UP/stage-r4/tm" -xzf "$IN/trimodel-dist-$TM_SHORT.tar.gz" || { rollback "tm-untar"; fail "tm-untar"; }
log "untar ok; stop trimodel"
systemctl stop trimodel.service || { rollback "stop-tm"; fail "stop-tm"; }
rm -rf /srv/fleet/TriModel/dist
cp -a "$UP/stage-r4/tm/dist" /srv/fleet/TriModel/dist || { rollback "mv-dist"; fail "mv-dist"; }
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
curl -s -m 6 http://127.0.0.1:3333/ui -o "$UP/ui-probe-r4.html" || fail "ui-fetch"
UIF="$UP/ui-probe-r4.html"
grep -q 'body class="menu-full"' "$UIF" || fail "回归: 二轮冷态静态骨架缺失"
grep -q 'M 面 · 服务域' "$UIF" || fail "回归: 三轮全格式签缺失"
grep -q 'R-HY 8712' "$UIF" || fail "回归: 三轮 rmc 端口对等缺失"
grep -q '请求地址' "$UIF" || fail "r4 锚: 主平铺请求地址缺失"
grep -q '主模型' "$UIF" || fail "r4 锚: 主平铺主模型缺失"
grep -q '高级选项' "$UIF" || fail "r4 锚: 高级选项折叠缺失"
grep -q '模型映射表' "$UIF" || fail "r4 锚: 模型映射表缺失"
grep -q '行为开关' "$UIF" || fail "r4 锚: 行为开关组缺失"
grep -q '配置预览' "$UIF" || fail "r4 锚: 配置预览缺失"
grep -q 'ANTHROPIC_BASE_URL' "$UIF" || fail "r4 锚: BASE_URL 键缺失"
grep -q 'crossSessionInbound' "$UIF" || fail "r4 锚: crossSessionInbound 键缺失"
if grep -q 'ANTHROPIC_AUTH_TOKEN' "$UIF"; then fail "r4 边界: AUTH_TOKEN 禁入违例"; fi
if grep -q 'ANTHROPIC_API_KEY' "$UIF"; then fail "r4 边界: API_KEY 禁入违例"; fi
if grep -q '河源' "$UIF"; then fail "回归: 三轮河源残留"; fi
log "环C 探针毕: health ok + 二轮/三轮回归锚保持 + r4 表单锚全绿（密钥禁入两键零出现；文件式零管道）"
{
  echo 'menu-full body = PASS (二轮锚保持)'
  echo 'r3 fullformat/port-parity = PASS (三轮锚保持)'
  echo 'r4 form blocks = PASS (请求地址/主模型/高级选项/映射表/行为开关/预览)'
  echo 'r4 keys sample = PASS (BASE_URL/crossSessionInbound)'
  echo 'secret keys = ZERO (AUTH_TOKEN/API_KEY 禁入边界)'
  echo 'probe mode = file-grep (r2 SIGPIPE lesson applied)'
  date -u +%FT%TZ
} > "$UP/stage2-r4.READOUT.txt"

touch "$UP/stage2-r4.done"
log "=== STAGE2-R4 DONE ==="
exit 0
