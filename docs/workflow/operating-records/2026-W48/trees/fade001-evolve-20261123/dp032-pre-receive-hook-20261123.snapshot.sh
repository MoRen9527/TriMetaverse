#!/usr/bin/env bash
# DP-20261123-032 · D-91 链跑期禁推硬闸（pre-receive·TriCompany bare·服务端位=sg /srv/git/TriCompany.git）
# 判据（D-91 技术形四件·CTO 2026-11-23 22:03:25 全文见 b31dbf6 纪律册 §D-91）：
#   拒 = 目标 refs/heads/dev + 变更触碰业务码（^runtime/·D-91 口径）+ 链跑态 marker 非 stale 存在
#   例外 = refs/heads/hotfix/* 不受限（合入 dev 仍受闸）；非业务面（docs/ 等）放行
#   stale 保护 = marker mtime 超 2h 自动失效 → 放行 + stderr 告警（防残留锁死推送）
# marker 探测面（双源·跨机）：
#   A. FSD chain-running.marker（{pid,runId,start_at}·ignite 写/退删·DP-032 d129061）——本机 sg 缺省位 + R-HY 三候选位
#   B. D-91 .running 件（<runs_root>/<runId>/.running）——R-HY /var/lib/trirmc/cron/runs 与 /srv/fleet/TriRMC/fade001-runs
# 探测不可达 = 放行 + 告警（fail-open·与 stale 同形；DP032_PROBE_FAIL_CLOSED=1 可改 fail-closed）
set -uo pipefail
unset GIT_DIR GIT_WORK_TREE GIT_INDEX_FILE GIT_OBJECT_DIRECTORY GIT_ALTERNATE_OBJECT_DIRECTORIES 2>/dev/null || true
STALE_SEC=7200
BUSINESS_RE='^runtime/'
PROBE_FAIL_CLOSED="${DP032_PROBE_FAIL_CLOSED:-0}"
ZERO='0000000000000000000000000000000000000000'
local_marker="/srv/git/TriCompany.git/chain-running.marker"
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
# 本机侧 marker（sg 若跑链）
probe=""
if [ -f "$local_marker" ]; then
  age=$(( $(date +%s) - $(stat -c %Y "$local_marker" 2>/dev/null || echo 0) ))
  if [ "$age" -le "$STALE_SEC" ]; then probe="${probe}FRESH(local) ${local_marker}
"; else probe="${probe}STALE(local) ${local_marker}
"; fi
fi
# R-HY 侧探测（链机）
remote=$(timeout 8 ssh -n -o BatchMode=yes -o ConnectTimeout=3 -o StrictHostKeyChecking=accept-new R-HY '
M1="/srv/git/TriCompany.git/chain-running.marker"; M2="/srv/fleet/TriRMC/chain-running.marker"; M3="/srv/fleet/chain-running.marker"
for f in "$M1" "$M2" "$M3" $(find /var/lib/trirmc/cron/runs /srv/fleet/TriRMC/fade001-runs -maxdepth 2 -name .running -type f 2>/dev/null); do
  [ -f "$f" ] || continue
  age=$(( $(date +%s) - $(stat -c %Y "$f" 2>/dev/null || echo 0) ))
  if [ "$age" -le 7200 ]; then echo "FRESH $f"; else echo "STALE $f"; fi
done' 2>/dev/null)
prc=$?
if [ $prc -ne 0 ]; then
  if [ "$PROBE_FAIL_CLOSED" = "1" ]; then
    echo "[pre-receive·D-91] 拒绝：链跑态 marker 探测不可达（R-HY ssh 失败·fail-closed 配置）" >&2
    exit 1
  fi
  echo "[pre-receive·D-91] 告警：链跑态 marker 探测不可达（R-HY ssh 失败）——按 fail-open 放行；如为异常请核查。" >&2
  exit 0
fi
probe="${probe}${remote}
"
fresh=$(printf '%s' "$probe" | grep -E '^FRESH' | head -n 3 || true)
stale=$(printf '%s' "$probe" | grep -E '^STALE' | head -n 3 || true)
if [ -n "$fresh" ]; then
  echo "[pre-receive·D-91] 拒绝：链跑期间禁止向 dev 推送业务码（活跃 marker 在案）" >&2
  echo "  活跃 marker：$(printf '%s' "$fresh" | tr '\n' ' ')" >&2
  echo "  触碰业务码（前 5）：$(printf '%s' "$biz_list" | tr '\n' ' ')" >&2
  echo "  依据：D-91 跑中更新纪律（链跑期间禁推 TriCompany 主分支业务码；例外=hotfix/* 分支）。" >&2
  echo "  处置：候链收口后再推，或走 hotfix/* 分支。" >&2
  exit 1
fi
if [ -n "$stale" ]; then
  echo "[pre-receive·D-91] 告警：发现 stale marker（>2h·已按放行处理）：$(printf '%s' "$stale" | tr '\n' ' ')" >&2
