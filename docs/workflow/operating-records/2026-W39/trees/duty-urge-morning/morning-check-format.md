# 报备二：晨检发布格式（BOD 批令件一③）

- 载体: 每日 08:05+08 notify→bod（标题「〔晨检 YYYY-MM-DD〕值席四点读数」）+必要时入 daily-progress 当日节
- 格式四点:
  1. ① 8710 healthz（ok/cron jobs/degraded）
  2. ② bare 同步近况（最近一轮 FETCH/PUSH + FAIL 累计）
  3. ③ TMV 树顶 commit
  4. ④ 催办面指针（2h 巡检状态/未 resolve 候项）
- 周一加项（LG-016 件5 断言）: heyuan TriRMC weekly-plane-shift job lastRunStatus=ok 且 lastError=null（值席会话面执行，GET /internal/v1/cron/jobs）
- 异常路径: 任一点异常→同信标注+值席会话接手升级（三类口径）
- 样例: 〔晨检 2026-09-23〕① ok=true jobs=6 degraded=false ② 21:22 FETCH-OK/PUSH-OK FAIL=0 ③ 树顶 919012fe ④ 催办 4 条已触发
