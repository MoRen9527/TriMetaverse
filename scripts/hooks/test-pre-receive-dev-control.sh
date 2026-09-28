#!/usr/bin/env bash
# test-pre-receive-dev-control.sh — LG-017/v2.1 hook 正身 fixture 自测（部署前置，V21-2 §四.6）
# 用法：bash scripts/hooks/test-pre-receive-dev-control.sh （依赖：git + bash，零其他依赖）
# 用例集：V21-2 §四.6 六类（全零创建/全零删除/merge/R 面邮箱/未知邮箱/非 ff）
#         + 补充（staging 从宽/边界 refs 不设防/扫描上限/tripwire 窗内外）
set -u

HERE="$(cd "$(dirname "$0")" && pwd)"
PRE="$HERE/pre-receive-dev-control"
POST="$HERE/post-receive-rface-tripwire"
TRI_EMAIL="trirmc@tri.company"
RFA_EMAIL="rface-agent@tri.company"
UNK_EMAIL="intruder@example.com"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

PASS_N=0; FAIL_N=0
pass() { PASS_N=$((PASS_N+1)); printf 'PASS  %s\n' "$1"; }
fail() { FAIL_N=$((FAIL_N+1)); printf 'FAIL  %s\n' "$1"; }

setup_bare() {
  rm -rf "$TMP/bare.git" "$TMP/work"
  git init -q --bare "$TMP/bare.git"
  cp "$PRE" "$TMP/bare.git/hooks/pre-receive"
  cp "$POST" "$TMP/bare.git/hooks/post-receive-rface-tripwire"
  git init -q "$TMP/work"
  git -C "$TMP/work" config user.name tester
  git -C "$TMP/work" config user.email tester@test.local
  git -C "$TMP/work" remote add origin "$TMP/bare.git"
  git -C "$TMP/work" checkout -q -b dev
}

# 以指定身份造 empty commit（第三参=GIT_COMMITTER_DATE）
c() {
  if [ $# -ge 3 ]; then
    GIT_COMMITTER_DATE="$3" git -C "$TMP/work" -c user.email="$1" -c user.name="${1%%@*}" commit -q --allow-empty -m "$2"
  else
    git -C "$TMP/work" -c user.email="$1" -c user.name="${1%%@*}" commit -q --allow-empty -m "$2"
  fi
}

expect_reject() { # <label> <pattern> <push-args...>
  local label="$1" pattern="$2"; shift 2
  local out rc
  out="$(git -C "$TMP/work" push "$@" 2>&1)"; rc=$?
  if [ $rc -ne 0 ] && printf '%s' "$out" | grep -q "$pattern"; then
    pass "$label"
  else
    fail "$label (rc=$rc) :: $(printf '%s' "$out" | tail -2 | tr '\n' ' ')"
  fi
}

expect_accept() { # <label> <push-args...>
  local label="$1"; shift
  local out rc
  out="$(git -C "$TMP/work" push "$@" 2>&1)"; rc=$?
  if [ $rc -eq 0 ]; then
    pass "$label"
  else
    fail "$label (rc=$rc) :: $(printf '%s' "$out" | tail -2 | tr '\n' ' ')"
  fi
}

echo "== 组 1：dev 写控基本闸 =="
setup_bare
c "$TRI_EMAIL" "seed"
expect_accept "T1 允许单内首推放行（ref 创建走 --not --all）" origin dev
c "$RFA_EMAIL" "rface commit"
expect_reject "T2 R 面身份拒（文案 R-face）" "R-face" origin dev
git -C "$TMP/work" reset -q --hard HEAD~1
c "$UNK_EMAIL" "unknown commit"
expect_reject "T3 未知身份拒（deny-by-default 文案）" "not on dev allowlist" origin dev
git -C "$TMP/work" reset -q --hard HEAD~1

echo "== 组 2：anti-non-ff/禁删/merge 走私面 =="
c "$TRI_EMAIL" "legit2"
expect_accept "T4a 合法 ff 推放行（anti-non-ff 对照）" origin dev
git -C "$TMP/work" reset -q --hard HEAD~1
c "$TRI_EMAIL" "divergent"
expect_reject "T4 非 ff（force-push）拒" "non-fast-forward" --force origin dev
expect_reject "T5 删除 dev 拒" "deletion" origin :dev
git -C "$TMP/work" reset -q --hard origin/dev  # 回 legit2（bare 现势）
git -C "$TMP/work" checkout -q -b side
c "$RFA_EMAIL" "smuggled" "2026-09-27T10:00:00+0800"
git -C "$TMP/work" checkout -q dev
GIT_COMMITTER_DATE="2026-09-27T10:01:00+0800" GIT_AUTHOR_DATE="2026-09-27T10:01:00+0800" \
  git -C "$TMP/work" -c user.email="$TRI_EMAIL" -c user.name=trirmc merge -q --no-ff --no-edit side
expect_reject "T6 merge 第二亲线带入 R 面 commit 被扫（走私面覆盖）" "R-face" origin dev
git -C "$TMP/work" reset -q --hard origin/dev
git -C "$TMP/work" branch -qD side

echo "== 组 3：staging 从宽/边界 refs =="
git -C "$TMP/work" checkout -q -b staging
c "$RFA_EMAIL" "rface-on-staging"
expect_accept "T7 staging 无邮箱策略从宽（rface 放行）" origin staging
c "$RFA_EMAIL" "staging-2"
expect_accept "T7b staging ff 推放行" origin staging
git -C "$TMP/work" checkout -q --detach HEAD~1
c "$RFA_EMAIL" "staging-divergent"
git -C "$TMP/work" checkout -q -B staging
expect_reject "T9 staging 非 ff 拒" "non-fast-forward" --force origin staging
git -C "$TMP/work" checkout -q dev
git -C "$TMP/work" checkout -q -b feature-x
c "$RFA_EMAIL" "rface-on-feature"
expect_accept "T8 其他 refs 不设防（边界声明用例：feature 分支开放）" origin feature-x
git -C "$TMP/work" checkout -q dev

echo "== 组 4：扫描上限（501 commit，约 10-30s）=="
setup_bare
c "$TRI_EMAIL" "seed"
expect_accept "T10 重置后基线推放行" origin dev
for i in $(seq 1 501); do c "$TRI_EMAIL" "bulk$i"; done
expect_reject "T11 >500 commit 超限拒（fail-closed）" "scan limit" origin dev

echo "== 组 5：tripwire（只观测不拦截）=="
setup_bare
c "$TRI_EMAIL" "tw-base"
expect_accept "T12 tripwire 基线推放行" origin dev
base_sha="$(git -C "$TMP/work" rev-parse HEAD)"
c "$TRI_EMAIL" "tw-out-of-window" "2026-09-30T10:00:00+0800" # 周三窗外
out_sha="$(git -C "$TMP/work" rev-parse HEAD)"
expect_accept "T13a tripwire 不拦截（窗外 commit push 仍放行）" origin dev
# 手动喂 stdin 须 cd bare 仓（真实部署时 git 调用环境 cwd=bare 仓根；本地直跑 rev-list 落仓依赖 cwd）
( cd "$TMP/bare.git" && printf '%s %s %s\n' "$base_sha" "$out_sha" "refs/heads/dev" | hooks/post-receive-rface-tripwire )
if grep -q "suspicious-rface-commit-on-dev" "$TMP/bare.git/hooks/tripwire.log" 2>/dev/null; then
  pass "T13 tripwire 窗外旗标留痕"
else
  fail "T13 tripwire 窗外旗标留痕"
fi
: > "$TMP/bare.git/hooks/tripwire.log"
c "$TRI_EMAIL" "tw-in-window" "2026-09-27T23:30:00+0800" # 周日 23:30 窗内
in_sha="$(git -C "$TMP/work" rev-parse HEAD)"
( cd "$TMP/bare.git" && printf '%s %s %s\n' "$out_sha" "$in_sha" "refs/heads/dev" | hooks/post-receive-rface-tripwire )
if [ ! -s "$TMP/bare.git/hooks/tripwire.log" ]; then
  pass "T14 tripwire 周日窗内零误报"
else
  fail "T14 tripwire 周日窗内零误报（意外旗标：$(cat "$TMP/bare.git/hooks/tripwire.log"))"
fi

echo "== 汇总 =="
printf 'PASS=%d FAIL=%d\n' "$PASS_N" "$FAIL_N"
[ "$FAIL_N" -eq 0 ] || exit 1
exit 0
