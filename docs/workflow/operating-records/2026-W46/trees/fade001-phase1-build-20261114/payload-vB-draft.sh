#!/usr/bin/env bash
# FADE-001 payload vB 形文稿（阶段 2·qualify 并入·vA1 骨架全保留）
# 基座=vA1 现役（payload-vA1-current.txt·CMD_LEN=1539·CMD_MD5=8b84bff8b98a·2026-11-13 活体投影）
# 变更=单插一行 qualify 序（{fromWeek} 等=daemon 模板变量替换位·照抄 vA1 原样）
# 部署=PATCH API 内存态改形（deploy 教训①正形）·重启后 md5+值面终态复验
# 插序语义：manifest 主行之后（qualify 拦截轮 manifest 含主行+qualify_exit 行·审计面完整）
set -eo pipefail
export GIT_SSH_COMMAND="ssh -i /home/fleet/.ssh/id_ed25519 -o StrictHostKeyChecking=no"
trap 'E=$?; if [ "$E" -ne 0 ]; then cd /srv/fleet/TriCompany 2>/dev/null || true; python3 -m runtime.cognition.shift_notify_fail --chain-exit "$E" || true; fi' EXIT
RUN_ID="shift-W{fromWeek}-$(date -u +%Y%m%dT%H%M%SZ)" && RUN_DIR=/var/lib/trirmc/cron/runs/$RUN_ID && mkdir -p "$RUN_DIR"
cd /srv/fleet/TriCompany
RC=0
python3 -m runtime.cognition.preflight --from {fromWeek} --to {toWeek} --start-date {startDate} >"$RUN_DIR/preflight.json" 2>&1 || RC=$?
if [ "$RC" -ne 0 ]; then
  printf '{"run_id":"%s","preflight_exit":%d}\n' "$RUN_ID" "$RC" >>"$RUN_DIR/manifest.json"
  exit $RC
fi
printf '{"run_id":"%s","from_week":"{fromWeek}","to_week":"{toWeek}","start_date":"{startDate}"}\n' "$RUN_ID" >"$RUN_DIR/manifest.json"
python3 -m runtime.cognition.qualify --run-dir "$RUN_DIR" >"$RUN_DIR/qualify.json" 2>&1 || { RC=$?; printf '{"run_id":"%s","qualify_exit":%d}\n' "$RUN_ID" "$RC" >>"$RUN_DIR/manifest.json"; exit $RC; }
git pull --ff-only origin dev || true
cd /srv/fleet/TriMetaverse && git pull --ff-only sg-bare dev || true
cd /srv/fleet/TriCompany
python3 -m runtime.cognition.weekly_plane_shift --from {fromWeek} --to {toWeek} --start-date {startDate} --operating-root /srv/fleet/TriMetaverse/docs/workflow/operating-records --sync 2>&1 | tee "$RUN_DIR/shift.log"
cd /srv/fleet/TriMetaverse && git add docs/workflow/operating-records && (git diff --cached --quiet || git -c user.name="TriRMC-Scheduler" -c user.email="trirmc@tri.company" commit -m "ops: weekly plane shift {fromWeek}->{toWeek} run=$RUN_ID") && (git push sg-bare HEAD:dev || (git fetch sg-bare dev && git merge --no-edit FETCH_HEAD && git push sg-bare HEAD:dev))
