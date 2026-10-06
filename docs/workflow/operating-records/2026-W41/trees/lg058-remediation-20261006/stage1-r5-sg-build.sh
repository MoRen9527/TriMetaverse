#!/usr/bin/env bash
# LG-058 r5 Stage1 sg 构建环（连接配置表单增补·cc-switch 对齐，CEO 23:41 批·裁 A）
# 升版对象: TriModel 75986ad→5188e7f（表单增补单包）；TriRMC 不在 r5 面（零触碰）
# 产出: /srv/fleet/lg058-upgrade/out/{trimodel-dist-5188e7f.tar.gz, SHA256SUMS-r5}
# 执行形: 本地管道直灌 b64（heredoc 经 ssh 变形教训）→ nohup bash stdin
# 锚语义变更（r4→r5）: 密钥禁入锚反转为密钥行在位锚（r5 任务书：密钥明文落投影对齐 cc-switch）；
# 裁 A「格式不落盘」系运行时行为=jsdom ②i 断言承担，产物层锚四选项文案+警示文案在位。
set -uo pipefail
BASE=/srv/fleet/lg058-upgrade
TM_SHA=5188e7f8d18dc02f2c5325ece0b23503db259235
TM_SHORT=5188e7f

log(){ echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*"; }

# ── done 门 / 重入锁（陈旧锁 30min 防御）──
if [ -f "$BASE/stage1r5.done" ]; then log "done-already skip"; exit 0; fi
if [ -f "$BASE/stage1r5.running" ]; then
  AGE=$(( $(date +%s) - $(stat -c %Y "$BASE/stage1r5.running" 2>/dev/null || date +%s) ))
  if [ "$AGE" -gt 1800 ]; then log "stale lock ${AGE}s, reclaim"; rm -f "$BASE/stage1r5.running"; else log "running-skip"; exit 0; fi
fi
mkdir -p "$BASE/src" "$BASE/out"
touch "$BASE/stage1r5.running"
trap 'rm -f "$BASE/stage1r5.running"' EXIT
exec >> "$BASE/stage1r5.log" 2>&1
log "=== STAGE1-R5 START (pid $$) ==="

fail(){ log "FAIL: $*"; echo "$(date -u +%FT%TZ) FAIL: $*" >> "$BASE/stage1r5.FAILED"; exit 1; }

# ═══ 环1a TriModel clone+checkout+断言 ═══
rm -rf "$BASE/src/TriModel"
git clone -q /srv/git/TriModel.git "$BASE/src/TriModel" || fail "tm-clone"
git -C "$BASE/src/TriModel" checkout -q "$TM_SHA" || fail "tm-checkout"
ACT=$(git -C "$BASE/src/TriModel" rev-parse HEAD)
[ "$ACT" = "$TM_SHA" ] || fail "tm-sha-assert got=$ACT"
log "tm checkout ok $TM_SHORT"

# ═══ 环1b 依赖（75986ad→5188e7f diff=ui+test 两文件，package.json/lock 零变→cp 现役 node_modules）═══
[ -d /srv/fleet/TriModel/node_modules ] || fail "tm-nm-src-missing"
rm -rf "$BASE/src/TriModel/node_modules"
cp -a /srv/fleet/TriModel/node_modules "$BASE/src/TriModel/node_modules" || fail "tm-nm-cp"
log "tm node_modules cp ok"

# ═══ 环1c 构建（tsc + copy-ui）═══
cd "$BASE/src/TriModel" || fail "tm-cd"
npm run build > "$BASE/out/tm-r5-build.log" 2>&1 || { tail -5 "$BASE/out/tm-r5-build.log"; fail "tm-build"; }
[ -f dist/src/server.js ] || fail "tm-dist-server-missing"
[ -d dist/ui ] || fail "tm-dist-ui-missing"
echo "$TM_SHA" > dist/.deploy-sha
# r5 值面锚（D-44 spirit）：五件特征必须在产物
grep -q 'API Key' dist/ui/index.html || fail "r5-anchor: apikey-label-missing"
grep -q '认证字段' dist/ui/index.html || fail "r5-anchor: authfield-missing"
grep -q 'API 格式' dist/ui/index.html || fail "r5-anchor: apifmt-missing"
grep -q '选择接入密钥的环境变量名' dist/ui/index.html || fail "r5-anchor: authfield-subtitle-missing"
grep -q 'ANTHROPIC_AUTH_TOKEN' dist/ui/index.html || fail "r5-anchor: auth-token-key-missing"
grep -q 'ANTHROPIC_API_KEY' dist/ui/index.html || fail "r5-anchor: api-key-key-missing"
grep -q 'data-cd-keyref' dist/ui/index.html || fail "r5-anchor: keyref-missing"
grep -q 'data-cd-eye' dist/ui/index.html || fail "r5-anchor: eye-missing"
grep -q 'data-cd-1m' dist/ui/index.html || fail "r5-anchor: 1m-switch-missing"
grep -q '需本地路由，TriModel 现役仅支持 Anthropic Messages 直连' dist/ui/index.html || fail "r5-anchor: apifmt-warn-missing"
grep -q 'OpenAI Chat Completions（需开启路由）' dist/ui/index.html || fail "r5-anchor: fmt-opt-openai-chat-missing"
grep -q 'Gemini Native generateContent（需开启路由）' dist/ui/index.html || fail "r5-anchor: fmt-opt-gemini-missing"
# r4 回归锚（r5 不回退 r4 成果）
grep -q '请求地址' dist/ui/index.html || fail "r4-regress: form-main-url-missing"
grep -q '主模型' dist/ui/index.html || fail "r4-regress: form-main-model-missing"
grep -q '高级选项' dist/ui/index.html || fail "r4-regress: advanced-missing"
grep -q '模型映射表' dist/ui/index.html || fail "r4-regress: map-missing"
grep -q '行为开关' dist/ui/index.html || fail "r4-regress: switches-missing"
grep -q '配置预览' dist/ui/index.html || fail "r4-regress: preview-missing"
grep -q 'ANTHROPIC_BASE_URL' dist/ui/index.html || fail "r4-regress: baseurl-missing"
grep -q 'crossSessionInbound' dist/ui/index.html || fail "r4-regress: crosssession-missing"
# 三轮/二轮正名回归锚
grep -q 'M 面 · 服务域' dist/ui/index.html || fail "r3-regress: fullformat-tab-missing"
grep -q 'R-HY 8712' dist/ui/index.html || fail "r3-regress: rmc-port-parity-missing"
if grep -q '河源' dist/ui/index.html; then fail "r3-regress: heyuan-residual"; fi
grep -q 'body class="menu-full"' dist/ui/index.html || fail "r2-regress: menu-full-missing"
log "tm build ok + r5 值面锚过 (五件特征+r4/三轮/二轮回归)"

# ═══ 环1e 打包+hash ═══
tar -C "$BASE/src/TriModel" -czf "$BASE/out/trimodel-dist-$TM_SHORT.tar.gz" dist || fail "tm-tar"
cd "$BASE/out" || fail "out-cd"
sha256sum "trimodel-dist-$TM_SHORT.tar.gz" > SHA256SUMS-r5
log "--- SHA256SUMS-r5 ---"; cat SHA256SUMS-r5
touch "$BASE/stage1r5.done"
log "=== STAGE1-R5 DONE ==="
exit 0
