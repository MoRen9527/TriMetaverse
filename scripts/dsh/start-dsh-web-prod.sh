#!/usr/bin/env bash
# start-dsh-web-prod.sh — dsh 生产 web 实例 ensure（B 系接退线 tools·单实例共用形）
# 裁据: CTO 五裁 2026-10-17（①单实例共用 ~/.dsh 主 HOME ②端口 8791 默认 loopback ③独立 tmux dsh-web-prod
#       ④三验③挂窗2 ⑤本脚本入 tools 位）·幂等可重跑·只 ensure 不破坏
# 版本: 0.2.0-rc.2 exact pin（/srv/fleet/dsh/ npm 形装设位）
set -uo pipefail
PORT=8791
SESS=dsh-web-prod
DSH_BIN=/srv/fleet/dsh/node_modules/.bin/dsh
export DSH_HOME=/home/fleet/.dsh

code() { curl -s -m 3 -o /dev/null -w '%{http_code}' "http://127.0.0.1:${PORT}/" 2>/dev/null; }

# ---- 段1: 实例 ensure（幂等） ----
cur=$(code)
if [ "$cur" != "000" ]; then
  echo "[ensure] 8791 已有实例应答 (http_code=${cur}) — 幂等跳过起"
else
  echo "[ensure] 8791 无应答 (code=000) — 勘 tmux ${SESS} 残迹"
  if tmux -u has-session -t "${SESS}" 2>/dev/null; then
    echo "FATAL: tmux ${SESS} 在但 8791 不通 — 残迹态禁盲清，先人工勘（tmux -u capture-pane -t ${SESS} -p | tail -20）"; exit 1
  fi
  echo "[ensure] 起 tmux ${SESS}（DSH_HOME=/home/fleet/.dsh · ${DSH_BIN} web --port ${PORT} --no-open）"
  tmux -u new-session -d -s "${SESS}" -c /srv/fleet/TriMetaverse "${DSH_BIN} web --port ${PORT} --no-open" \
    || { echo "FATAL: tmux new-session 失败"; exit 1; }
  echo "[ensure] tmux ${SESS} 已起 — 等 boot"
fi

# ---- 段2: 健康断言（等最多 30s） ----
code_v=000
for i in $(seq 1 30); do
  code_v=$(code)
  [ "$code_v" != "000" ] && break
  sleep 1
done
echo "[health] http_code=${code_v} (200/303/401=壳活——401=认证门应答·000=超时 FAIL)"
echo "[health] 绑定断言:"
ss -tln 2>/dev/null | grep ":${PORT} " || echo "  FAIL: ${PORT} 未 LISTEN"
ver=$("$DSH_BIN" --version 2>/dev/null | head -1)
echo "[health] 版本: ${ver} (基准 0.2.0-rc.2)"
[ "$ver" = "0.2.0-rc.2" ] || echo "  WARN: 版本偏离 exact pin"

# ---- 段3: 席会话创建指针（GUI 手工正形·窗2 #7 脚本形候） ----
# [D-46 NOTE] dsh 启动行原语打明文 token URL（boot banner）——凡 capture-pane/读 log 通路都是泄漏面，
#   前置掩罩后再看: tmux -u capture-pane -t dsh-web-prod -p | sed -E 's/token=[^&" ]+/token=<MASKED>/g'
#   事故先例 2026-10-17 CTO 席: 未滤 capture 致 token 进 transcript（fleet 级同域·零扩散·B14 实例处置窗顺手轮换护栏在案）
cat <<'PTR'
[seat-session] 席会话创建段=GUI 人机正形（P0 层2 实锚: Gateway Remote 非 REST·零 curl 通路）:
  1) 本机: ssh -L 8791:127.0.0.1:8791 <河源机>    # 隧道
  2) 浏览器: http://127.0.0.1:8791                 # token 自读: tmux -u capture-pane -t dsh-web-prod -p | grep -i token（零转报）
  3) GUI 选 preset r-duty-<seat> 建会话 → 发首句（persona 自检+compass 引用 = 毕锚①②·接位判定门）
PTR
echo "[done] start-dsh-web-prod.sh 毕"
