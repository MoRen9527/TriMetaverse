#!/usr/bin/env bash
# LG-058 r4 Stage1 sg 构建环（连接配置表单化，CEO 22:41 批·BOD 22:41/22:43 派工+裁 b）
# 升版对象: TriModel ce153a9→75986ad（连接配置表单化单包）；TriRMC 不在 r4 面（零触碰）
# 产出: /srv/fleet/lg058-upgrade/out/{trimodel-dist-75986ad.tar.gz, SHA256SUMS-r4}
# 执行形: B64 内联 nohup（aegis 间歇锁对症）；脚本落盘件=素材+审计锚
set -uo pipefail
BASE=/srv/fleet/lg058-upgrade
TM_SHA=75986ade701c6eb1fe24a443909e386ecd4f9751
TM_SHORT=75986ad

log(){ echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*"; }

# ── done 门 / 重入锁（陈旧锁 30min 防御）──
if [ -f "$BASE/stage1r4.done" ]; then log "done-already skip"; exit 0; fi
if [ -f "$BASE/stage1r4.running" ]; then
  AGE=$(( $(date +%s) - $(stat -c %Y "$BASE/stage1r4.running" 2>/dev/null || date +%s) ))
  if [ "$AGE" -gt 1800 ]; then log "stale lock ${AGE}s, reclaim"; rm -f "$BASE/stage1r4.running"; else log "running-skip"; exit 0; fi
fi
mkdir -p "$BASE/src" "$BASE/out"
touch "$BASE/stage1r4.running"
trap 'rm -f "$BASE/stage1r4.running"' EXIT
exec >> "$BASE/stage1r4.log" 2>&1
log "=== STAGE1-R4 START (pid $$) ==="

fail(){ log "FAIL: $*"; echo "$(date -u +%FT%TZ) FAIL: $*" >> "$BASE/stage1r4.FAILED"; exit 1; }

# ═══ 环1a TriModel clone+checkout+断言 ═══
rm -rf "$BASE/src/TriModel"
git clone -q /srv/git/TriModel.git "$BASE/src/TriModel" || fail "tm-clone"
git -C "$BASE/src/TriModel" checkout -q "$TM_SHA" || fail "tm-checkout"
ACT=$(git -C "$BASE/src/TriModel" rev-parse HEAD)
[ "$ACT" = "$TM_SHA" ] || fail "tm-sha-assert got=$ACT"
log "tm checkout ok $TM_SHORT"

# ═══ 环1b 依赖（ce153a9→75986ad diff=ui+test 两文件，package.json/lock 零变→cp 现役 node_modules）═══
[ -d /srv/fleet/TriModel/node_modules ] || fail "tm-nm-src-missing"
rm -rf "$BASE/src/TriModel/node_modules"
cp -a /srv/fleet/TriModel/node_modules "$BASE/src/TriModel/node_modules" || fail "tm-nm-cp"
log "tm node_modules cp ok"

# ═══ 环1c 构建（tsc + copy-ui）═══
cd "$BASE/src/TriModel" || fail "tm-cd"
npm run build > "$BASE/out/tm-r4-build.log" 2>&1 || { tail -5 "$BASE/out/tm-r4-build.log"; fail "tm-build"; }
[ -f dist/src/server.js ] || fail "tm-dist-server-missing"
[ -d dist/ui ] || fail "tm-dist-ui-missing"
echo "$TM_SHA" > dist/.deploy-sha
# r4 值面锚（D-44 spirit：构建产物内断言 r4 新码特征——表单化必须在产物）
grep -q '请求地址' dist/ui/index.html || fail "form-main-url-missing (主平铺请求地址未进产物)"
grep -q '主模型' dist/ui/index.html || fail "form-main-model-missing"
grep -q '高级选项' dist/ui/index.html || fail "form-advanced-missing"
grep -q '模型映射表' dist/ui/index.html || fail "form-map-missing"
grep -q '行为开关' dist/ui/index.html || fail "form-switches-missing"
grep -q '配置预览' dist/ui/index.html || fail "form-preview-missing"
grep -q 'ANTHROPIC_BASE_URL' dist/ui/index.html || fail "form-key-baseurl-missing"
grep -q 'crossSessionInbound' dist/ui/index.html || fail "form-key-crosssession-missing"
grep -q 'CLAUDE_CODE_EFFORT_LEVEL' dist/ui/index.html || fail "form-key-effort-missing"
# 密钥禁入（域卡自管边界）：两键名全产物零出现
if grep -q 'ANTHROPIC_AUTH_TOKEN' dist/ui/index.html; then fail "forbidden-key-authtoken-present"; fi
if grep -q 'ANTHROPIC_API_KEY' dist/ui/index.html; then fail "forbidden-key-apikey-present"; fi
# 三轮正名回归锚（r4 不回退三轮成果）
grep -q 'M 面 · 服务域' dist/ui/index.html || fail "r3-regress: fullformat-tab-missing"
grep -q 'R-HY 8712' dist/ui/index.html || fail "r3-regress: rmc-port-parity-missing"
if grep -q '河源' dist/ui/index.html; then fail "r3-regress: heyuan-residual"; fi
log "tm build ok + r4 值面锚过 (表单化特征+密钥禁入+三轮回归)"

# ═══ 环1e 打包+hash ═══
tar -C "$BASE/src/TriModel" -czf "$BASE/out/trimodel-dist-$TM_SHORT.tar.gz" dist || fail "tm-tar"
cd "$BASE/out" || fail "out-cd"
sha256sum "trimodel-dist-$TM_SHORT.tar.gz" > SHA256SUMS-r4
log "--- SHA256SUMS-r4 ---"; cat SHA256SUMS-r4
touch "$BASE/stage1r4.done"
log "=== STAGE1-R4 DONE ==="
exit 0
