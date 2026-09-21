# T3·sg 名册联动核验收口报告（核显=已办；零差口=候二次对表）

- BOD 直改实勘（seats-sg.json 真源）：{"name":"m-duty-sde","agent":"SeniorDeploymentEngineer","manual":"deployment-engineer"} + compass 手册已改名 senior-deployment-engineer.session.md
- 悬空雷已排：compass/deployment-engineer.session.md 不存在（已改名）而名册 manual 字段仍指旧名——本席补全同步 manual→senior-deployment-engineer（BOD 直改补全，非改裁）
- 对表矩阵（差口如实列）：
  1. seats-sg.json sg 真源：m-duty-sde/SeniorDeploymentEngineer ✓（manual 已同步）
  2. tmux live：会话名仍 m-duty-de（旧名旧手册在跑）——改名须重启，候 BOD 窗（照 09-16 重启轮先例 BOD 侧执行）
  3. 本机面 .claude/seats.json：deployment-engineer/DeploymentEngineer/sessionPrompt 指已改名旧路径（悬空）——候 local 线（T5-T8 侧）
  4. D-13 名册+TriCompany source-agents：SeniorDeploymentEngineer 零命中（未入册）——候 CAO/CTO 入册窗；入册前不代传播（防 C-2/62d9c01 名址分裂族复发）
  5. .claude/agents/deployment-engineer.md：旧名在位——候发布链（CTO 窗）
- 验收锚结论：sg 真源面已核显+自洽；全名址零差口候上述四项 owner 通道收敛后二次对表达成（候办已列，不越域代 propagation）
