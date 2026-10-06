#!/usr/bin/env bash
# LG-058 r5b Stage1 sg 构建环（密钥行白名单豁免·BOD 裁 a 小轮）
# 升版对象: TriModel 5188e7f→73ca1cc（守卫修复单包：src/api/trimmc-card.ts+真链测试卷）
# 产出: /srv/fleet/lg058-upgrade/out/{trimodel-dist-73ca1cc.tar.gz, SHA256SUMS-r5b}
# 执行形: 本地管道直灌 b64 → nohup bash stdin
# 锚面: r5 五件特征锚+回归锚全保持（ui/index.html 零变）+r5b 守卫值面锚（编译产物）
set -uo pipefail
BASE=/srv/fleet/lg058-upgrade
TM_SHA=73ca1ccfd1f5df3cf34419cb947ef972180c29da
TM_SHORT=73ca1cc

log(){ echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*"; }

# ── done 门 / 重入锁（陈旧锁 30min 防御）──
if [ -f "$BASE/stage1r5b.done" ]; then log "done-already skip"; exit 0; fi
if [ -f "$BASE/stage1r5b.running" ]; then
  AGE=$(( $(date +%s) - $(stat -c %Y "$BASE/stage1r5b.running" 2>/dev/null || date +%s) ))
  if [ "$AGE" -gt 1800 ]; then log "stale lock ${AGE}s, reclaim"; rm -f "$BASE/stage1r5b.running"; else log "running-skip"; exit 0; fi
fi
mkdir -p "$BASE/src" "$BASE/out"
touch "$BASE/stage1r5b.running"
trap 'rm -f "$BASE/stage1r5b.running"' EXIT
exec >> "$BASE/stage1r5b.log" 2>&1
log "=== STAGE1-R5B START (pid $$) ==="

fail(){ log "FAIL: $*"; echo "$(date -u +%FT%TZ) FAIL: $*" >> "$BASE/stage1r5b.FAILED"; exit 1; }

# ═══ 环1a TriModel clone+checkout+断言 ═══
rm -rf "$BASE/src/TriModel"
git clone -q /srv/git/TriModel.git "$BASE/src/TriModel" || fail "tm-clone"
git -C "$BASE/src/TriModel" checkout -q "$TM_SHA" || fail "tm-checkout"
ACT=$(git -C "$BASE/src/TriModel" rev-parse HEAD)
[ "$ACT" = "$TM_SHA" ] || fail "tm-sha-assert got=$ACT"
log "tm checkout ok $TM_SHORT"

# ═══ 环1b 依赖（5188e7f→73ca1cc diff=src/api+test，package.json/lock 零变→cp 现役 node_modules）═══
[ -d /srv/fleet/TriModel/node_modules ] || fail "tm-nm-src-missing"
rm -rf "$BASE/src/TriModel/node_modules"
cp -a /srv/fleet/TriModel/node_modules "$BASE/src/TriModel/node_modules" || fail "tm-nm-cp"
log "tm node_modules cp ok"

# ═══ 环1c 构建（tsc + copy-ui）═══
cd "$BASE/src/TriModel" || fail "tm-cd"
npm run build > "$BASE/out/tm-r5b-build.log" 2>&1 || { tail -5 "$BASE/out/tm-r5b-build.log"; fail "tm-build"; }
[ -f dist/src/server.js ] || fail "tm-dist-server-missing"
[ -d dist/ui ] || fail "tm-dist-ui-missing"
echo "$TM_SHA" > dist/.deploy-sha

# r5b 守卫值面锚（编译产物层——白名单常量+两精确名键必须在 trimmc-card.js）
grep -q 'LOCAL_CONFIG_KEYREF_ALLOWED' dist/src/api/trimmc-card.js || fail "r5b-anchor: whitelist-const-missing"
grep -q 'ANTHROPIC_AUTH_TOKEN' dist/src/api/trimmc-card.js || fail "r5b-anchor: auth-token-key-missing"
grep -q 'ANTHROPIC_API_KEY' dist/src/api/trimmc-card.js || fail "r5b-anchor: api-key-key-missing"
log "r5b 守卫值面锚过"

# r5 值面锚（ui 零变→全保持）
grep -q 'API Key' dist/ui/index.html || fail "r5-anchor: apikey-label-missing"
grep -q '认证字段' dist/ui/index.html || fail "r5-anchor: authfield-missing"
grep -q 'API 格式' dist/ui/index.html || fail "r5-anchor: apifmt-missing"
grep -q 'data-cd-keyref' dist/ui/index.html || fail "r5-anchor: keyref-missing"
grep -q 'data-cd-1m' dist/ui/index.html || fail "r5-anchor: 1m-switch-missing"
grep -q 'ANTHROPIC_AUTH_TOKEN' dist/ui/index.html || fail "r5-anchor: auth-token-ui-missing"
grep -q 'ANTHROPIC_API_KEY' dist/ui/index.html || fail "r5-anchor: api-key-ui-missing"
# r4 回归锚
grep -q '请求地址' dist/ui/index.html || fail "r4-regress: form-main-url-missing"
grep -q '配置预览' dist/ui/index.html || fail "r4-regress: preview-missing"
# 三轮/二轮正名回归锚
grep -q 'M 面 · 服务域' dist/ui/index.html || fail "r3-regress: fullformat-tab-missing"
grep -q 'R-HY 8712' dist/ui/index.html || fail "r3-regress: rmc-port-parity-missing"
if grep -q '河源' dist/ui/index.html; then fail "r3-regress: heyuan-residual"; fi
grep -q 'body class="menu-full"' dist/ui/index.html || fail "r2-regress: menu-full-missing"
log "tm build ok + r5b 守卫锚+r5 五件+r4/三轮/二轮回归锚全过"

# ═══ 环1e 打包+hash ═══
tar -C "$BASE/src/TriModel" -czf "$BASE/out/trimodel-dist-$TM_SHORT.tar.gz" dist || fail "tm-tar"
cd "$BASE/out" || fail "out-cd"
sha256sum "trimodel-dist-$TM_SHORT.tar.gz" > SHA256SUMS-r5b
log "--- SHA256SUMS-r5b ---"; cat SHA256SUMS-r5b
touch "$BASE/stage1r5b.done"
log "=== STAGE1-R5B DONE ==="
exit 0
