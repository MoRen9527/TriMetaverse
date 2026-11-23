#!/usr/bin/env bash
# DP-20261123-032（v4·R 形）· D-91 链跑期禁推硬闸（pre-receive·TriCompany bare·sg 服务端）
# 判据：拒 = 目标 refs/heads/dev + 变更触碰业务码（^runtime/·D-91 口径）+ 链跑态 marker 非 stale
#   marker 主判（R 形·跨机正形·CTO 裁 2026-11-23）：ref `refs/runtime/chain-running`（链机 push·链毕删）
#     git log -1 --format=%ct refs/runtime/chain-running → age≤2h=reject / >2h=warn 放行 / ref 无=放行
#   备查（本地文件·sg 若跑链）：/srv/git/TriCompany.git/chain-running.marker + /srv/fleet/TriRMC/chain-running.marker
#   （R-HY 侧文件/`.running` 件不再探——R 形为跨机唯一通道；ssh 探针已去·push 零网络等待）
# 例外：refs/heads/hotfix/* 不受限（合入 dev 仍受闸）；非业务面（docs/ 等）放行
# 注：marker ref 的 commit 必须是链启动时**新建 commit**（committer date=启动时点），否则 stale 判定失真
set -uo pipefail
unset GIT_DIR GIT_WORK_TREE GIT_INDEX_FILE GIT_OBJECT_DIRECTORY GIT_ALTERNATE_OBJECT_DIRECTORIES 2>/dev/null || true
STALE_SEC=7200
BUSINESS_RE='^runtime/'
MARKER_REF='refs/runtime/chain-running'
ZERO='0000000000000000000000000000000000000000'
local_markers="/srv/git/TriCompany.git/chain-running.marker /srv/fleet/TriRMC/chain-running.marker"
dev_hit=0
biz_list=""
while read -r old new ref; do
  [ -z "${ref:-}" ] && continue
  case "$ref" in refs/heads/hotfix/*) continue ;; esac
  [ "$ref" = "refs/heads/dev" ] || continue
  if [ "$old" = "$ZERO" ]; then
    files=$(git ls-tree -r --name-only "$new" 2>/dev/null || true)
  else
    files=$(git diff --name-only "$old" "$new" 2>/dev/null || true)
  fi
  b=$(printf '%s\n' "$files" | grep -E "$BUSINESS_RE" | head -n 5 || true)
  if [ -n "$b" ]; then dev_hit=1; biz_list="${biz_list}${b}
"; fi
done
[ "$dev_hit" -eq 0 ] && exit 0
# ── 主判：R 形 marker ref ──
fresh=""; stale=""
if git for-each-ref --format='%(refname)' "$MARKER_REF" 2>/dev/null | grep -qx "$MARKER_REF"; then
  cts=$(git log -1 --format=%ct "$MARKER_REF" 2>/dev/null || echo 0)
  age=$(( $(date +%s) - ${cts:-0} ))
  if [ "$age" -le "$STALE_SEC" ]; then fresh="ref ${MARKER_REF} (age=${age}s)"; else stale="ref ${MARKER_REF} (age=${age}s)"; fi
fi
# ── 备查：本地文件（sg 若跑链） ──
for m in $local_markers; do
  [ -f "$m" ] || continue
  age=$(( $(date +%s) - $(stat -c %Y "$m" 2>/dev/null || echo 0) ))
  if [ "$age" -le "$STALE_SEC" ]; then fresh="${fresh} local ${m} (age=${age}s)"; else stale="${stale} local ${m} (age=${age}s)"; fi
done
if [ -n "$fresh" ]; then
  echo "[pre-receive·D-91] 拒绝：链跑期间禁止向 dev 推送业务码（活跃 marker 在案）" >&2
  echo "  活跃 marker：${fresh}" >&2
  echo "  触碰业务码（前 5）：$(printf '%s' "$biz_list" | tr '\n' ' ')" >&2
  echo "  依据：D-91 跑中更新纪律（链跑期间禁推 TriCompany 主分支业务码；例外=hotfix/* 分支）。" >&2
  echo "  处置：候链收口后再推，或走 hotfix/* 分支。" >&2
  exit 1
fi
if [ -n "$stale" ]; then
  echo "[pre-receive·D-91] 告警：发现 stale marker（>2h·已按放行处理）：${stale}" >&2
  echo "  建议清理残留（链异常毕的遗留 ref/文件）。" >&2
fi
exit 0
