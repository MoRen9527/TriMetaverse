#!/usr/bin/env bash
# TriModel 批 A 改名 Stage1 sg 构建环（r6；charter v2.1 0ea6b42f 派工）
# 升版对象: TriModel 73ca1cc→<批A commit>（纯 ui/index.html 文案级；布局零改动）
# 产出: /srv/fleet/lg058-upgrade/out/{trimodel-dist-<short>.tar.gz, SHA256SUMS-r6}
# 执行形: 本地管道直灌 b64 → nohup bash stdin（同 r5b 正形）
# 锚面: r5 五件+r4/三轮/二轮回归锚全保持 + 批A 新锚（模型策略/兜底模型 label）+零残留文件式断言+禁改九处正向断言
set -uo pipefail
BASE=/srv/fleet/lg058-upgrade
TM_SHA=72d30995494c0876ce3ab34a9e4445049a0bd435
TM_SHORT=72d3099

case "$TM_SHA" in *FILL*) echo "FATAL: TM_SHA placeholder unfilled"; exit 9;; esac

log(){ echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*"; }

# ── done 门 / 重入锁（陈旧锁 30min 防御）──
if [ -f "$BASE/stage1r6.done" ]; then log "done-already skip"; exit 0; fi
if [ -f "$BASE/stage1r6.running" ]; then
  AGE=$(( $(date +%s) - $(stat -c %Y "$BASE/stage1r6.running" 2>/dev/null || date +%s) ))
  if [ "$AGE" -gt 1800 ]; then log "stale lock ${AGE}s, reclaim"; rm -f "$BASE/stage1r6.running"; else log "running-skip"; exit 0; fi
fi
mkdir -p "$BASE/src" "$BASE/out"
touch "$BASE/stage1r6.running"
trap 'rm -f "$BASE/stage1r6.running"' EXIT
exec >> "$BASE/stage1r6.log" 2>&1
log "=== STAGE1-R6 START (pid $$) sha=$TM_SHA ==="

fail(){ log "FAIL: $*"; echo "$(date -u +%FT%TZ) FAIL: $*" >> "$BASE/stage1r6.FAILED"; exit 1; }

# ═══ 环1a TriModel clone+checkout+断言 ═══
rm -rf "$BASE/src/TriModel"
git clone -q /srv/git/TriModel.git "$BASE/src/TriModel" || fail "tm-clone"
git -C "$BASE/src/TriModel" checkout -q "$TM_SHA" || fail "tm-checkout"
ACT=$(git -C "$BASE/src/TriModel" rev-parse HEAD)
[ "$ACT" = "$TM_SHA" ] || fail "tm-sha-assert got=$ACT"
log "tm checkout ok $TM_SHORT"

# ═══ 环1b 依赖（73ca1cc→批A diff=ui only，package.json/lock 零变→cp 现役 node_modules）═══
[ -d /srv/fleet/TriModel/node_modules ] || fail "tm-nm-src-missing"
rm -rf "$BASE/src/TriModel/node_modules"
cp -a /srv/fleet/TriModel/node_modules "$BASE/src/TriModel/node_modules" || fail "tm-nm-cp"
log "tm node_modules cp ok"

# ═══ 环1c 构建（tsc + copy-ui）═══
cd "$BASE/src/TriModel" || fail "tm-cd"
npm run build > "$BASE/out/tm-r6-build.log" 2>&1 || { tail -5 "$BASE/out/tm-r6-build.log"; fail "tm-build"; }
[ -f dist/src/server.js ] || fail "tm-dist-server-missing"
[ -d dist/ui ] || fail "tm-dist-ui-missing"
echo "$TM_SHA" > dist/.deploy-sha

# ═══ 批A 零残留+禁改九处（文件式，零管道）═══
SC=$(grep -c '策略卡' dist/ui/index.html)
[ "$SC" = "0" ] || fail "batcha: 策略卡 residual=$SC"
LC=$(grep -c '连接配置' dist/ui/index.html)
[ "$LC" = "9" ] || fail "batcha: 连接配置 count=$LC exp=9（须恰为禁改九处报错文案）"
NC=$(grep -c '无法连接配置服务' dist/ui/index.html)
[ "$NC" = "9" ] || fail "batcha: 无法连接配置服务 count=$NC exp=9"
log "批A 零残留断言过: 策略卡=0 连接配置=9(全在报错文案) 无法连接配置服务=9"

# ═══ 批A 新锚 ═══
grep -q "label: '模型策略'" dist/ui/index.html || fail "batcha: nav-label-模型策略-missing"
grep -q "label: '兜底模型'" dist/ui/index.html || fail "batcha: nav-label-兜底模型-missing"
grep -q '模型策略数据未加载' dist/ui/index.html || fail "batcha: L539-new-copy-missing"
grep -q '模型策略暂无规则清单' dist/ui/index.html || fail "batcha: L1067-new-copy-missing"
grep -q '（模型策略已删，本域仍有副本）' dist/ui/index.html || fail "batcha: L1084-new-copy-missing"
grep -q '四域各一份保底直配' dist/ui/index.html || fail "batcha: §4.3-sub-missing"
grep -q '（诚实三态：已存未拉 / 已拉未落 / 已落生效）' dist/ui/index.html || fail "batcha: 三态括注-missing"
log "批A 新锚全过"

# ═══ r5b 守卫值面锚（编译产物层，src 零变全保持）═══
grep -q 'LOCAL_CONFIG_KEYREF_ALLOWED' dist/src/api/trimmc-card.js || fail "r5b-anchor: whitelist-const-missing"
grep -q 'ANTHROPIC_AUTH_TOKEN' dist/src/api/trimmc-card.js || fail "r5b-anchor: auth-token-key-missing"
grep -q 'ANTHROPIC_API_KEY' dist/src/api/trimmc-card.js || fail "r5b-anchor: api-key-key-missing"

# ═══ r5 五件+r4/三轮/二轮回归锚 ═══
grep -q 'API Key' dist/ui/index.html || fail "r5-anchor: apikey-label-missing"
grep -q '认证字段' dist/ui/index.html || fail "r5-anchor: authfield-missing"
grep -q 'API 格式' dist/ui/index.html || fail "r5-anchor: apifmt-missing"
grep -q 'data-cd-keyref' dist/ui/index.html || fail "r5-anchor: keyref-missing"
grep -q 'data-cd-1m' dist/ui/index.html || fail "r5-anchor: 1m-switch-missing"
grep -q 'ANTHROPIC_AUTH_TOKEN' dist/ui/index.html || fail "r5-anchor: auth-token-ui-missing"
grep -q 'ANTHROPIC_API_KEY' dist/ui/index.html || fail "r5-anchor: api-key-ui-missing"
grep -q '请求地址' dist/ui/index.html || fail "r4-regress: form-main-url-missing"
grep -q '配置预览' dist/ui/index.html || fail "r4-regress: preview-missing"
grep -q 'M 面 · 服务域' dist/ui/index.html || fail "r3-regress: fullformat-tab-missing"
grep -q 'R-HY 8712' dist/ui/index.html || fail "r3-regress: rmc-port-parity-missing"
if grep -q '河源' dist/ui/index.html; then fail "r3-regress: heyuan-residual"; fi
grep -q 'body class="menu-full"' dist/ui/index.html || fail "r2-regress: menu-full-missing"
log "tm build ok + 批A锚/零残留/禁改九处 + r5b 守卫锚+r5 五件+r4/三轮/二轮回归锚全过"

# ═══ 环1e 打包+hash ═══
tar -C "$BASE/src/TriModel" -czf "$BASE/out/trimodel-dist-$TM_SHORT.tar.gz" dist || fail "tm-tar"
cd "$BASE/out" || fail "out-cd"
sha256sum "trimodel-dist-$TM_SHORT.tar.gz" > SHA256SUMS-r6
log "--- SHA256SUMS-r6 ---"; cat SHA256SUMS-r6
touch "$BASE/stage1r6.done"
log "=== STAGE1-R6 DONE ==="
exit 0
