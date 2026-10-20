#!/usr/bin/env bash
# retire-claude-seat.sh · v1 — 段B claude 席退役三步幂等脚本（charter-2026-W42-006 B 系备料）
# 用法: ./retire-claude-seat.sh <seat>                # dry-run（只采集读数打印动作·零变更）
#       ./retire-claude-seat.sh <seat> --execute --confirm-seat <seat>   # 真执行（双键确认）
# 三步: ①在途清零断言读数采集（WAIT 人工确认位·值席面核对后才 --execute）
#       ②tmux 优雅停（SIGTERM 主进程→宽限→残留精杀兜底→kill-session→pane 清点=0 断言）
#       ③迁移标注留痕输出（树卷用）+compass 文件零触碰断言（sha256 前后一致·dsh tricompass 活读零扰动证）
# 纪律: 逐 pid 记录禁裸杀（只杀确认过的该席 claude 进程树）·断言失败即停·幂等（已退役席=ALREADY_RETIRED 退出 0）
# 席位进程操作逐席串行·禁并发 2（外层编排保证·本脚本单席单跑）
set -euo pipefail

SEAT="${1:-}"
MODE="dry"
CONFIRM=""
[[ "${2:-}" == "--execute" ]] && MODE="exec"
[[ "${3:-}" == "--confirm-seat" ]] && CONFIRM="${4:-}"

# 席名白名单（13 席枚举·防拼错动错会话）
VALID="cos coo cto cao cpo cfo cmo cho cso fsd rdt ste sde"
if [[ ! " $VALID " =~ " $SEAT " ]]; then
  echo "FATAL: seat='$SEAT' 不在 13 席白名单 [$VALID]"; exit 2
fi
if [[ "$MODE" == "exec" && "$CONFIRM" != "$SEAT" ]]; then
  echo "FATAL: --execute 需 --confirm-seat $SEAT 双键确认（防误触发）"; exit 2
fi

SESS="r-duty-$SEAT"
TS=$(date "+%Y-%m-%d %H:%M:%S %z")
echo "=== retire-claude-seat: $SESS · mode=$MODE · $TS"

# 幂等门：会话已不存在=已退役
if ! tmux has-session -t "$SESS" 2>/dev/null; then
  echo "ALREADY_RETIRED: 会话 $SESS 不存在·零动作"; exit 0
fi

# ---- Step1 在途清零断言读数采集 ----
PANE_PID=$(tmux list-panes -t "$SESS" -F "#{pane_pid}")
PANE_CMD=$(tmux list-panes -t "$SESS" -F "#{pane_current_command}")
# claude pid 三级探测: ①pane_pid 本身即 claude（pane 直跑形） ②直接子进程 comm=claude ③直接子 cmdline 含 claude
CLAUDE_PID=""
if [[ "$(cat /proc/$PANE_PID/comm 2>/dev/null)" == "claude" ]]; then
  CLAUDE_PID="$PANE_PID"
else
  for c in $(pgrep -P "$PANE_PID" 2>/dev/null || true); do
    if [[ "$(cat /proc/$c/comm 2>/dev/null)" == "claude" ]] || grep -q claude "/proc/$c/cmdline" 2>/dev/null; then
      CLAUDE_PID="$c"; break
    fi
  done
fi
echo "[S1] pane_pid=$PANE_PID pane_cmd=$PANE_CMD claude_pid=${CLAUDE_PID:-UNKNOWN}"
if [[ -n "$CLAUDE_PID" ]]; then
  echo "[S1] claude 进程树（主+子）:"
  ps -o pid,ppid,etime,cmd --ppid "$CLAUDE_PID" 2>/dev/null | head -10 || true
  # transcript 最新增量时点（该席 projects 目录最近 mtime·泛化探测）
  TDIR=$(ls -dt /home/*/.claude/projects/*/ 2>/dev/null | head -1 || true)
  [[ -n "$TDIR" ]] && echo "[S1] transcript 最新目录: $TDIR ($(ls -t "$TDIR" 2>/dev/null | head -2 | tr '\n' ' '))"
fi
echo "[S1] WAIT-CONFIRM: 在途任务清零须值席面人工核对确认后 --execute（脚本不代判）"
if [[ "$MODE" != "exec" ]]; then
  echo "=== DRY-RUN 毕·零变更（真执行: ./retire-claude-seat.sh $SEAT --execute --confirm-seat $SEAT）"
  exit 0
fi
if [[ "${SEGB_S1_CONFIRMED:-}" != "yes" ]]; then
  echo "FATAL: Step1 值席面确认未落（SEGB_S1_CONFIRMED=yes 环境变量为人工确认键）"; exit 3
fi

# ---- Step2 tmux 优雅停 ----
if [[ -z "$CLAUDE_PID" ]]; then
  echo "FATAL: claude_pid 未知·禁盲停（异常即停）"; exit 4
fi
# compass 文件零触碰断言·前置 sha256（映射表形 .claude/compass/<seat-dir>.session.md）
COMPASS_FILE=$(ls /srv/fleet/TriMetaverse/.claude/compass/ 2>/dev/null | grep -i "$SEAT" | head -1 || true)
C_SHA_BEFORE=""
if [[ -n "$COMPASS_FILE" ]]; then
  C_SHA_BEFORE=$(sha256sum "/srv/fleet/TriMetaverse/.claude/compass/$COMPASS_FILE" | cut -d' ' -f1)
  echo "[S2] compass 零触碰锚 before: ${C_SHA_BEFORE:0:16} ($COMPASS_FILE)"
fi
# 优雅停: 先采集子 pid 列表（杀后子进程变孤儿 PPID=1·届时 pgrep -P 失效）→SIGTERM 主进程→宽限 8s→残留精杀
CHILD_PIDS=$(pgrep -P "$CLAUDE_PID" 2>/dev/null || true)
echo "[S2] 子进程采集: $(echo $CHILD_PIDS | tr '\n' ' ')"
echo "[S2] SIGTERM -> $CLAUDE_PID"
kill -TERM "$CLAUDE_PID" 2>/dev/null || true
for i in $(seq 1 8); do
  kill -0 "$CLAUDE_PID" 2>/dev/null || break
  sleep 1
done
if kill -0 "$CLAUDE_PID" 2>/dev/null; then
  echo "[S2] 宽限 8s 仍存活-> SIGKILL 精杀 $CLAUDE_PID"
  kill -KILL "$CLAUDE_PID" 2>/dev/null || true
  sleep 1
fi
kill -0 "$CLAUDE_PID" 2>/dev/null && { echo "FATAL: 进程 $CLAUDE_PID 未退（异常即停）"; exit 5; }
echo "[S2] claude 进程已退 ✓"
# 子进程残留精杀（杀前采集列表逐个验·孤儿态 PPID=1 不影响本列表）
LEFT=0
for c in $CHILD_PIDS; do
  if kill -0 "$c" 2>/dev/null; then
    echo "[S2] 子进程残留精杀 $c ($(cat /proc/$c/comm 2>/dev/null))"
    kill -KILL "$c" 2>/dev/null || true
    LEFT=$((LEFT+1))
  fi
done
sleep 1
[[ "$LEFT" == "0" ]] && echo "[S2] 子进程零残留（主进程退出已收敛）✓" || echo "[S2] 残留 $LEFT 个已精杀·复核:"
tmux kill-session -t "$SESS" 2>/dev/null || true
tmux has-session -t "$SESS" 2>/dev/null && { echo "FATAL: 会话 $SESS 未清（异常即停）"; exit 6; }
echo "[S2] tmux 会话已清·pane 清点=0 ✓"
# 复活名址注销提示（会话层 ListAgents 面人工/编排层执行·脚本只提示）
echo "[S2] NOTE: 复活名址注销=会话层（ListAgents 面该席常驻进程名址）·编排层执行"

# ---- Step3 迁移标注留痕+compass 零触碰后验 ----
if [[ -n "$COMPASS_FILE" && -n "$C_SHA_BEFORE" ]]; then
  C_SHA_AFTER=$(sha256sum "/srv/fleet/TriMetaverse/.claude/compass/$COMPASS_FILE" | cut -d' ' -f1)
  [[ "$C_SHA_BEFORE" == "$C_SHA_AFTER" ]] && echo "[S3] compass 零触碰后验 ✓ (${C_SHA_AFTER:0:16})" \
    || { echo "FATAL: compass 文件在退役窗内被改（异常即停报 CTO）"; exit 7; }
fi
echo ""
echo "=== 迁移标注块（树卷用） ==="
cat <<BLOCK
| $SESS | claude 形退役 | $TS | 退役三步毕（在途清零值席确认+tmux 优雅停 pane 清零+名址注销提示）·compass 零触碰 ✓ ·回滚锚=claude 模板 57cf86b64 幂等重开 |
BLOCK
echo "=== RETIRED_OK: $SESS ==="