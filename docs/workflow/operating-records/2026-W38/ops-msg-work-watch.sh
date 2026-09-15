#!/usr/bin/env bash
# ops-msg-work-watch.sh — M-SG「有没有干活」监控（LG-036/M-SG 复工批配套）
# 采样标志：双仓 HEAD / 席位转录最新活动 / m-duty-cos 429 态 / 收口区写入
# 用法：
#   ops-msg-work-watch.sh --once            # 单次采样，输出一行状态（供定时留痕）
#   ops-msg-work-watch.sh --loop [秒]       # 变化时打印事件行（供流式监视）
set -u
HOST="${SG_HOST:-fleet@sg-ecs-server}"

sample() {
  ssh -o ConnectTimeout=10 -o BatchMode=yes "$HOST" '
    echo "TMV=$(git -C /srv/fleet/TriMetaverse rev-parse --short dev 2>/dev/null)"
    echo "TC=$(git -C /srv/fleet/TriCompany rev-parse --short dev 2>/dev/null)"
    newest=$(ls -t /home/fleet/.claude/projects/*/*.jsonl 2>/dev/null | head -1)
    echo "ACT=$(stat -c %Y "$newest" 2>/dev/null)"
    echo "E429=$(tmux capture-pane -t m-duty-cos -p 2>/dev/null | grep -c 429)"
    echo "NOW=$(date +%s)"
  ' 2>/dev/null
}

report() { # $1=sample 输出
  local s="$1" now tmv tc act e age
  now=$(echo "$s" | sed -n 's/^NOW=//p'); tmv=$(echo "$s" | sed -n 's/^TMV=//p')
  tc=$(echo "$s" | sed -n 's/^TC=//p'); act=$(echo "$s" | sed -n 's/^ACT=//p')
  e=$(echo "$s" | sed -n 's/^E429=//p'); now=${now:-$(date +%s)}
  if [ -z "${tmv:-}" ]; then echo "$(date '+%F %T') | ⚠ sg 不可达"; return 1; fi
  age=$(( now - ${act:-0} )); [ "$age" -lt 0 ] && age=0
  if [ "${e:-0}" -gt 0 ]; then v="配额挡(429)→等 20:44 重置"; else v="通道畅通"; fi
  printf '%s | TMV@%s TC@%s | 席位最后活动=%sm前 | %s' "$(date '+%F %T')" "$tmv" "$tc" "$((age/60))" "$v"
}

if [ "${1:---once}" = "--once" ]; then
  report "$(sample)"; echo
else
  INTERVAL="${2:-60}"; prev=""
  while true; do
    s=$(sample); fp=$(echo "$s" | grep -v '^NOW=' | tr '\n' '|')
    if [ "$fp" != "$prev" ] && [ -n "$fp" ]; then
      if [ -n "$prev" ]; then
        # 变化面判定（事件行）
        chg=""
        ptmv=$(echo "$prev" | sed -n 's/.*TMV=\([^|]*\).*/\1/p'); ntmv=$(echo "$s" | sed -n 's/^TMV=//p')
        pe=$(echo "$prev" | sed -n 's/.*E429=\([^|]*\).*/\1/p'); ne=$(echo "$s" | sed -n 's/^E429=//p')
        [ -n "$ntmv" ] && [ "$ptmv" != "$ntmv" ] && chg="仓动作(TMV→$ntmv) "
        [ "${pe:-0}" != "${ne:-0}" ] && chg="${chg}429态变化(${pe:-?}→${ne:-?}) "
        echo "【事件】${chg}$(report "$s")"
      else
        echo "【基线】$(report "$s")"
      fi
      prev="$fp"
    fi
    sleep "$INTERVAL"
  done
fi
