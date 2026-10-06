#!/usr/bin/env bash
# LG-058 二轮 Stage1 sg 构建环（TriModel 单包，BOD 更正令 2026-10-06 20:31 ④）
# 二轮升版对象: TriModel 0359b89（45757bd→0359b89 左菜单常驻骨架）；TriRMC 不在二轮面（纯前端令，dist 零变零触碰）
# 产出: /srv/fleet/lg058-upgrade/out/{trimodel-dist-0359b89.tar.gz, SHA256SUMS-r2}
# 执行形: B64 内联 nohup（aegis 间歇锁对症，一轮轮1-4 教训）；脚本落盘件=素材+审计锚
set -uo pipefail
BASE=/srv/fleet/lg058-upgrade
TM_SHA=0359b89a8a87290fecdbb19616e180ccbc3e36af
TM_SHORT=0359b89

log(){ echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*"; }

# ── done 门 / 重入锁（陈旧锁 30min 防御，照一轮形）──
if [ -f "$BASE/stage1r2.done" ]; then log "done-already skip"; exit 0; fi
if [ -f "$BASE/stage1r2.running" ]; then
  AGE=$(( $(date +%s) - $(stat -c %Y "$BASE/stage1r2.running" 2>/dev/null || date +%s) ))
  if [ "$AGE" -gt 1800 ]; then log "stale lock ${AGE}s, reclaim"; rm -f "$BASE/stage1r2.running"; else log "running-skip"; exit 0; fi
fi
mkdir -p "$BASE/src" "$BASE/out"
touch "$BASE/stage1r2.running"
trap 'rm -f "$BASE/stage1r2.running"' EXIT
exec >> "$BASE/stage1r2.log" 2>&1
log "=== STAGE1-R2 START (pid $$) ==="

fail(){ log "FAIL: $*"; echo "$(date -u +%FT%TZ) FAIL: $*" >> "$BASE/stage1r2.FAILED"; exit 1; }

# ═══ 环1a TriModel clone+checkout+断言 ═══
rm -rf "$BASE/src/TriModel"
git clone -q /srv/git/TriModel.git "$BASE/src/TriModel" || fail "tm-clone"
git -C "$BASE/src/TriModel" checkout -q "$TM_SHA" || fail "tm-checkout"
ACT=$(git -C "$BASE/src/TriModel" rev-parse HEAD)
[ "$ACT" = "$TM_SHA" ] || fail "tm-sha-assert got=$ACT"
log "tm checkout ok $TM_SHORT"

# ═══ 环1b 依赖（45757bd→0359b89 diff=ui+test 三文件，package.json/lock 零变→cp 现役 node_modules）═══
[ -d /srv/fleet/TriModel/node_modules ] || fail "tm-nm-src-missing"
rm -rf "$BASE/src/TriModel/node_modules"
cp -a /srv/fleet/TriModel/node_modules "$BASE/src/TriModel/node_modules" || fail "tm-nm-cp"
log "tm node_modules cp ok"

# ═══ 环1c 构建（tsc + copy-ui）═══
cd "$BASE/src/TriModel" || fail "tm-cd"
npm run build > "$BASE/out/tm-r2-build.log" 2>&1 || { tail -5 "$BASE/out/tm-r2-build.log"; fail "tm-build"; }
[ -f dist/src/server.js ] || fail "tm-dist-server-missing"
[ -d dist/ui ] || fail "tm-dist-ui-missing"
echo "$TM_SHA" > dist/.deploy-sha
# 二轮值面锚（D-44 spirit：构建产物内断言新码特征——冷态静态骨架必须已在产物）
grep -q 'body class="menu-full"' dist/ui/index.html || fail "menu-full-static-anchor-missing (二轮新码特征未进产物)"
grep -q '无条件常驻' dist/ui/index.html || fail "resident-skeleton-comment-missing"
if grep -q '自动展开为左侧菜单' dist/ui/index.html; then fail "retired-copy-residual (条件展开话术残留)"; fi
log "tm build ok + 二轮值面三断言过 (menu-full 静态骨架/常驻注记/退役话术零残留)"

# ═══ 环1e 打包+hash ═══
tar -C "$BASE/src/TriModel" -czf "$BASE/out/trimodel-dist-$TM_SHORT.tar.gz" dist || fail "tm-tar"
cd "$BASE/out" || fail "out-cd"
sha256sum "trimodel-dist-$TM_SHORT.tar.gz" > SHA256SUMS-r2
log "--- SHA256SUMS-r2 ---"; cat SHA256SUMS-r2
touch "$BASE/stage1r2.done"
log "=== STAGE1-R2 DONE ==="
exit 0
