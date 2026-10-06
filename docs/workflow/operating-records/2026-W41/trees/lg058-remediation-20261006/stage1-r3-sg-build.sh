#!/usr/bin/env bash
# LG-058 三轮 Stage1 sg 构建环（机器位三段式正名，CEO 21:22 令+BOD 21:3x 端口勘正）
# 三轮升版对象: TriModel 0359b89→0a2ce5b（显示层正名单包）；TriRMC 不在三轮面（零触碰）
# 产出: /srv/fleet/lg058-upgrade/out/{trimodel-dist-0a2ce5b.tar.gz, SHA256SUMS-r3}
# 执行形: B64 内联 nohup（aegis 间歇锁对症）；脚本落盘件=素材+审计锚
set -uo pipefail
BASE=/srv/fleet/lg058-upgrade
TM_SHA=ce153a9bc4f678eef592f24fd531dbf4f2f891ba
TM_SHORT=ce153a9

log(){ echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*"; }

# ── done 门 / 重入锁（陈旧锁 30min 防御）──
if [ -f "$BASE/stage1r3.done" ]; then log "done-already skip"; exit 0; fi
if [ -f "$BASE/stage1r3.running" ]; then
  AGE=$(( $(date +%s) - $(stat -c %Y "$BASE/stage1r3.running" 2>/dev/null || date +%s) ))
  if [ "$AGE" -gt 1800 ]; then log "stale lock ${AGE}s, reclaim"; rm -f "$BASE/stage1r3.running"; else log "running-skip"; exit 0; fi
fi
mkdir -p "$BASE/src" "$BASE/out"
touch "$BASE/stage1r3.running"
trap 'rm -f "$BASE/stage1r3.running"' EXIT
exec >> "$BASE/stage1r3.log" 2>&1
log "=== STAGE1-R3 START (pid $$) ==="

fail(){ log "FAIL: $*"; echo "$(date -u +%FT%TZ) FAIL: $*" >> "$BASE/stage1r3.FAILED"; exit 1; }

# ═══ 环1a TriModel clone+checkout+断言 ═══
rm -rf "$BASE/src/TriModel"
git clone -q /srv/git/TriModel.git "$BASE/src/TriModel" || fail "tm-clone"
git -C "$BASE/src/TriModel" checkout -q "$TM_SHA" || fail "tm-checkout"
ACT=$(git -C "$BASE/src/TriModel" rev-parse HEAD)
[ "$ACT" = "$TM_SHA" ] || fail "tm-sha-assert got=$ACT"
log "tm checkout ok $TM_SHORT"

# ═══ 环1b 依赖（0359b89→0a2ce5b diff=ui+test 三文件，package.json/lock 零变→cp 现役 node_modules）═══
[ -d /srv/fleet/TriModel/node_modules ] || fail "tm-nm-src-missing"
rm -rf "$BASE/src/TriModel/node_modules"
cp -a /srv/fleet/TriModel/node_modules "$BASE/src/TriModel/node_modules" || fail "tm-nm-cp"
log "tm node_modules cp ok"

# ═══ 环1c 构建（tsc + copy-ui）═══
cd "$BASE/src/TriModel" || fail "tm-cd"
npm run build > "$BASE/out/tm-r3-build.log" 2>&1 || { tail -5 "$BASE/out/tm-r3-build.log"; fail "tm-build"; }
[ -f dist/src/server.js ] || fail "tm-dist-server-missing"
[ -d dist/ui ] || fail "tm-dist-ui-missing"
echo "$TM_SHA" > dist/.deploy-sha
# 三轮值面锚（D-44 spirit：构建产物内断言三轮新码特征——正名显示层必须在产物）
grep -q 'M 面 · 服务域' dist/ui/index.html || fail "fullformat-domain-tab-missing (三段式全格式签未进产物)"
grep -q 'M-SG' dist/ui/index.html || fail "m-sg-name-missing"
grep -q 'R-HY' dist/ui/index.html || fail "r-hy-name-missing"
# 四签端口对等（BOD 复验 21:44 打回钉）：四卡头实例行各含自己端口值
grep -q 'M-SG 8712' dist/ui/index.html || fail "port-parity: mmc M-SG 8712 missing"
grep -q '本机 8713' dist/ui/index.html || fail "port-parity: mlc 本机 8713 missing"
grep -q 'R-HY 8712' dist/ui/index.html || fail "port-parity: rmc R-HY 8712 missing"
grep -q '本机 8711' dist/ui/index.html || fail "port-parity: rlc 本机 8711 missing"
if grep -q '河源' dist/ui/index.html; then fail "heyuan-residual (机器位旧名残留)"; fi
for CMP in 'M 服务域' 'M 本地域' 'R 服务域' 'R 本地域'; do
  if grep -q "$CMP" dist/ui/index.html; then fail "compact-tab-residual ($CMP)"; fi
done
log "tm build ok + 三轮值面锚过 (全格式签/M-SG/R-HY 在场+河源/压缩形零残留)"

# ═══ 环1e 打包+hash ═══
tar -C "$BASE/src/TriModel" -czf "$BASE/out/trimodel-dist-$TM_SHORT.tar.gz" dist || fail "tm-tar"
cd "$BASE/out" || fail "out-cd"
sha256sum "trimodel-dist-$TM_SHORT.tar.gz" > SHA256SUMS-r3
log "--- SHA256SUMS-r3 ---"; cat SHA256SUMS-r3
touch "$BASE/stage1r3.done"
log "=== STAGE1-R3 DONE ==="
exit 0
