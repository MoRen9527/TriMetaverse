#!/usr/bin/env bash
# LG-058 三轮 Stage2 R-HY 部署环（机器位三段式正名单包，CEO 21:22 令+BOD 端口勘正）
# 硬门①: 环A 备份锚→BACKUP-ANCHOR-r3.ready→本机腿报备 COO+BOD→GO-r3.flag(120s 超时 HOLD exit 42)——未报备不开跑
# 硬门②: 环C 值面探针含正名锚机器预检（文件式 grep——r2 SIGPIPE 假阴性教训落正形）
# 硬门③: 环B 失败自动回滚 dist.bak-pre-lg058r3+restart
# 零触碰面: trirmc.service / trirmc-mc.service / 连接配置四域 endpoint 值面存量（BOD 边界：只动显示名）
set -uo pipefail
UP=/srv/fleet/lg058-upgrade
IN=$UP/in
TM_SHA=0a2ce5b7c79067387705d56c5ff47115fc1dda72
TM_SHORT=0a2ce5b
TS=$(date -u +%Y%m%dT%H%M%SZ)
CARDS=/srv/fleet/trimodel-data
LOG=$UP/stage2-r3.log

log(){ echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*" >> "$LOG"; }
fail(){ log "FAIL: $*"; echo "$(date -u +%FT%TZ) FAIL: $*" >> "$UP/stage2-r3.FAILED"; exit 1; }

mkdir -p "$UP" "$IN"
if [ -f "$UP/stage2-r3.done" ]; then echo "stage2-r3 done-already skip $(date -u +%FT%TZ)"; exit 0; fi
exec >> "$LOG" 2>&1
log "=== STAGE2-R3 START (pid $$) ==="

# ── 输入包校验 ──
[ -f "$IN/trimodel-dist-$TM_SHORT.tar.gz" ] || fail "in-tm-missing"
ACT_T=$(sha256sum "$IN/trimodel-dist-$TM_SHORT.tar.gz" | awk '{print $1}')
EXP_T=$(grep "trimodel-dist-$TM_SHORT.tar.gz" "$IN/SHA256SUMS-r3" 2>/dev/null | awk '{print $1}')
[ -n "$EXP_T" ] && [ "$ACT_T" = "$EXP_T" ] || fail "tm-dist-hash-mismatch act=$ACT_T exp=$EXP_T"
log "input dist hash verified ($TM_SHORT)"

# ═══ 环A 备份锚（TriModel 单面；HOLD 重入跳过复用）═══
if [ -f "$UP/BACKUP-ANCHOR-r3.ready" ]; then
  log "环A skip: 备份锚已备（HOLD 续跑分支）:"; cat "$UP/BACKUP-ANCHOR-r3.ready"
  BAKTM=$(grep -oP '^dist bak: \K\S+(?= )' "$UP/BACKUP-ANCHOR-r3.ready" | head -1)
else
  BAKTM=/srv/fleet/TriModel/dist.bak-pre-lg058r3-$TS
  cp -a /srv/fleet/TriModel/dist "$BAKTM" || fail "bak-tm-dist"
  mkdir -p "$UP/backup"
  tar -C "$CARDS" -czf "$UP/backup/trimodel-data-cfg-r3-$TS.tar.gz" --exclude='*.log' . 2>/dev/null || fail "bak-cards-tar"
  CFGF="$UP/backup/trimodel-data-cfg-r3-$TS.tar.gz"
  {
    # r2 勘正形：cp -a dist 结构={src,test,ui}，server.js 真实路径=$BAKTM/src/server.js
    echo "dist bak: $BAKTM $(sha256sum "$BAKTM/src/server.js" 2>/dev/null | awk '{print $1}') (dir)"
    echo "cfg tar:  $CFGF $(sha256sum "$CFGF" 2>/dev/null | awk '{print $1}')"
    echo "ts: $TS"
  } > "$UP/BACKUP-ANCHOR-r3.ready"
  log "环A 备份锚毕:"; cat "$UP/BACKUP-ANCHOR-r3.ready"
fi

# ── GO-r3.flag 停等（120s 超时 HOLD；硬门① 报备后由 BOD/COO 批 GO）──
GO=0
for i in $(seq 1 24); do [ -f "$UP/GO-r3.flag" ] && { GO=1; break; }; sleep 5; done
if [ "$GO" != "1" ]; then touch "$UP/stage2-r3.HOLD"; log "GO-r3.flag 120s 超时 → HOLD 安全停 (exit 42)"; exit 42; fi
log "GO-r3.flag 在 → 续环"

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
  echo "$(date -u +%FT%TZ) ROLLED-BACK: $*" >> "$UP/stage2-r3.ROLLBACK"
}

# ═══ 环B 部署（只 trimodel.service；trirmc 双 unit 零触碰）═══
rm -rf "$UP/stage-r3"; mkdir -p "$UP/stage-r3/tm"
tar -C "$UP/stage-r3/tm" -xzf "$IN/trimodel-dist-$TM_SHORT.tar.gz" || { rollback "tm-untar"; fail "tm-untar"; }
log "untar ok; stop trimodel"
systemctl stop trimodel.service || { rollback "stop-tm"; fail "stop-tm"; }
rm -rf /srv/fleet/TriModel/dist
cp -a "$UP/stage-r3/tm/dist" /srv/fleet/TriModel/dist || { rollback "mv-dist"; fail "mv-dist"; }
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
curl -s -m 6 http://127.0.0.1:3333/ui -o "$UP/ui-probe-r3.html" || fail "ui-fetch"
UIF="$UP/ui-probe-r3.html"
grep -q 'body class="menu-full"' "$UIF" || fail "锚⑤回退: 二轮冷态静态骨架缺失"
grep -q 'M 面 · 服务域' "$UIF" || fail "三轮锚: 三段式全格式签缺失"
grep -q 'M-SG' "$UIF" || fail "三轮锚: M-SG 正名缺失"
grep -q 'R-HY' "$UIF" || fail "三轮锚: R-HY 正名缺失"
if grep -q '河源' "$UIF"; then fail "三轮锚: 机器位旧名「河源」渲染面残留"; fi
for CMP in 'M 服务域' 'M 本地域' 'R 服务域' 'R 本地域'; do
  if grep -q "$CMP" "$UIF"; then fail "三轮锚: 压缩形「$CMP」渲染面残留"; fi
done
log "环C 探针毕: health ok + 二轮锚⑤保持 + 三轮正名锚全绿（全格式签/M-SG/R-HY 在场+河源/压缩形渲染面零残留；文件式零管道）"
{
  echo 'menu-full body = PASS (二轮锚保持)'
  echo 'full-format tabs = PASS (M 面 · 服务域 等)'
  echo 'M-SG / R-HY = PASS'
  echo 'heyuan residual = ZERO / compact tabs = ZERO (PASS)'
  echo 'probe mode = file-grep (r2 SIGPIPE lesson applied)'
  date -u +%FT%TZ
} > "$UP/stage2-r3.READOUT.txt"

touch "$UP/stage2-r3.done"
log "=== STAGE2-R3 DONE ==="
exit 0
