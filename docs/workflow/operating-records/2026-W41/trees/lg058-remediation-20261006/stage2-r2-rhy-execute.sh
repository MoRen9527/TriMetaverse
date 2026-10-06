#!/usr/bin/env bash
# LG-058 二轮 Stage2 R-HY 部署环（TriModel 单包，BOD 更正令 2026-10-06 20:31 ④）
# 硬门①: 环A 备份锚→BACKUP-ANCHOR-r2.ready→本机腿报备 COO+BOD→GO-r2.flag(120s 超时 HOLD exit 42)——未报备不开跑
# 硬门②: 环C 值面探针含验收锚⑤机器预检（未连接冷态静态骨架三断言——CEO 亲测点）
# 硬门③: 环B 失败自动回滚 dist.bak-pre-lg058r2+restart
# 零触碰面: trirmc.service / trirmc-mc.service（纯前端令，TriRMC dist 零变——一轮 §二.7 本体补重启教训引以为戒：本轮无该面变更即零重启）
set -uo pipefail
UP=/srv/fleet/lg058-upgrade
IN=$UP/in
TM_SHA=0359b89a8a87290fecdbb19616e180ccbc3e36af
TM_SHORT=0359b89
TS=$(date -u +%Y%m%dT%H%M%SZ)
CARDS=/srv/fleet/trimodel-data
LOG=$UP/stage2-r2.log

log(){ echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*" >> "$LOG"; }
fail(){ log "FAIL: $*"; echo "$(date -u +%FT%TZ) FAIL: $*" >> "$UP/stage2-r2.FAILED"; exit 1; }

mkdir -p "$UP" "$IN"
if [ -f "$UP/stage2-r2.done" ]; then echo "stage2-r2 done-already skip $(date -u +%FT%TZ)"; exit 0; fi
exec >> "$LOG" 2>&1
log "=== STAGE2-R2 START (pid $$) ==="

# ── 输入包校验 ──
[ -f "$IN/trimodel-dist-$TM_SHORT.tar.gz" ] || fail "in-tm-missing"
ACT_T=$(sha256sum "$IN/trimodel-dist-$TM_SHORT.tar.gz" | awk '{print $1}')
EXP_T=$(grep "trimodel-dist-$TM_SHORT.tar.gz" "$IN/SHA256SUMS-r2" 2>/dev/null | awk '{print $1}')
[ -n "$EXP_T" ] && [ "$ACT_T" = "$EXP_T" ] || fail "tm-dist-hash-mismatch act=$ACT_T exp=$EXP_T"
log "input dist hash verified ($TM_SHORT)"

# ═══ 环A 备份锚（TriModel 单面；HOLD 重入跳过复用）═══
if [ -f "$UP/BACKUP-ANCHOR-r2.ready" ]; then
  log "环A skip: 备份锚已备（HOLD 续跑分支）:"; cat "$UP/BACKUP-ANCHOR-r2.ready"
  BAKTM=$(grep -oP '^dist bak: \K\S+(?= )' "$UP/BACKUP-ANCHOR-r2.ready" | head -1)
else
  BAKTM=/srv/fleet/TriModel/dist.bak-pre-lg058r2-$TS
  cp -a /srv/fleet/TriModel/dist "$BAKTM" || fail "bak-tm-dist"
  mkdir -p "$UP/backup"
  tar -C "$CARDS" -czf "$UP/backup/trimodel-data-cfg-r2-$TS.tar.gz" --exclude='*.log' . 2>/dev/null || fail "bak-cards-tar"
  CFGF="$UP/backup/trimodel-data-cfg-r2-$TS.tar.gz"
  {
    # 一轮观察项①笔误已修：cp -a dist 实际结构={src,test,ui}，server.js 真实路径=$BAKTM/src/server.js
    echo "dist bak: $BAKTM $(sha256sum "$BAKTM/src/server.js" 2>/dev/null | awk '{print $1}') (dir)"
    echo "cfg tar:  $CFGF $(sha256sum "$CFGF" 2>/dev/null | awk '{print $1}')"
    echo "ts: $TS"
  } > "$UP/BACKUP-ANCHOR-r2.ready"
  log "环A 备份锚毕:"; cat "$UP/BACKUP-ANCHOR-r2.ready"
fi

# ── GO-r2.flag 停等（120s 超时 HOLD；硬门① 报备后由 BOD/COO 批 GO）──
GO=0
for i in $(seq 1 24); do [ -f "$UP/GO-r2.flag" ] && { GO=1; break; }; sleep 5; done
if [ "$GO" != "1" ]; then touch "$UP/stage2-r2.HOLD"; log "GO-r2.flag 120s 超时 → HOLD 安全停 (exit 42)"; exit 42; fi
log "GO-r2.flag 在 → 续环"

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
  echo "$(date -u +%FT%TZ) ROLLED-BACK: $*" >> "$UP/stage2-r2.ROLLBACK"
}

# ═══ 环B 部署（只 trimodel.service；trirmc 双 unit 零触碰）═══
rm -rf "$UP/stage-r2"; mkdir -p "$UP/stage-r2/tm"
tar -C "$UP/stage-r2/tm" -xzf "$IN/trimodel-dist-$TM_SHORT.tar.gz" || { rollback "tm-untar"; fail "tm-untar"; }
log "untar ok; stop trimodel"
systemctl stop trimodel.service || { rollback "stop-tm"; fail "stop-tm"; }
rm -rf /srv/fleet/TriModel/dist
cp -a "$UP/stage-r2/tm/dist" /srv/fleet/TriModel/dist || { rollback "mv-dist"; fail "mv-dist"; }
chown -R fleet:fleet /srv/fleet/TriModel/dist
DEP=$(cat /srv/fleet/TriModel/dist/.deploy-sha 2>/dev/null)
[ "$DEP" = "$TM_SHA" ] || { rollback "deploy-sha-got-$DEP"; fail "deploy-sha-mismatch got=$DEP exp=$TM_SHA"; }
log "deploy-sha 断言 ok ($TM_SHORT)"
systemctl start trimodel.service || { rollback "start-tm"; fail "start-tm"; }
sleep 3
systemctl is-active trimodel.service >/dev/null || { rollback "not-active"; fail "tm-not-active"; }
log "环B 部署毕: trimodel active"

# ═══ 环C 值面探针（硬门②）═══
H=$(curl -s -m 6 http://127.0.0.1:3333/health)
echo "$H" | grep -q '"ok" *: *true\|"ok":true' || { log "health 读数: $H"; fail "healthz-not-ok"; }
log "/health ok: $H"
UI=$(curl -s -m 6 http://127.0.0.1:3333/ui)
echo "$UI" | grep -q 'body class="menu-full"' || fail "锚⑤预检失败: 冷态静态骨架缺失"
echo "$UI" | grep -q '无条件常驻' || fail "锚⑤预检失败: 常驻语义注记缺失"
if echo "$UI" | grep -q '自动展开为左侧菜单'; then fail "锚⑤预检失败: 条件展开退役话术残留"; fi
log "环C 探针毕: health ok + 验收锚⑤静态三断言过（冷态 menu-full 骨架/常驻注记/退役话术零残留）"
echo "$UI" | grep -o 'body class="menu-full"' | head -1 >> "$UP/stage2-r2.READOUT.txt"
date -u +%FT%TZ >> "$UP/stage2-r2.READOUT.txt"

touch "$UP/stage2-r2.done"
log "=== STAGE2-R2 DONE ==="
exit 0
