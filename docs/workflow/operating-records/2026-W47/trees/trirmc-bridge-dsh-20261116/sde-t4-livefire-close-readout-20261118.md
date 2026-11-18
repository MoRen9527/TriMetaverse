# SDE T4 活体互发窗闭环毕报·T5 断言五项全绿（notice-169 restart 放行执行毕·真值回执实锚·四残面如实旗标）

- sourceOfTruth: 本卷（T4 活体互发窗闭环毕报正形·任务书 T5 验收门复勘毕）
- syncMode: write-time
- 执行席: SDE 小布；令源=**notice-168**（本席前卷令源行「BOD 148」系笔误随线勘正·notice-169 值席转达承录）+BOD notice-169 daemon restart 放行令
- 执行窗: 2026-11-17T23:31:34Z→23:5xZ（date 现查原值·全 D-47 现采·D-24 断言先行）
- 判定: **restart 放行执行毕+③真值互发全链闭环（A→桥 API→B 真实 resume turn→回执原文→A 收执）+T5 断言五项全绿——任务书闭环毕报·notice-115 解锁读数回转照走 COS 呈批链**

## §一 · restart 放行执行毕（notice-169·正形链+四附加护栏全录）

| 步 | 读数 |
|---|---|
| 旧 dist 留档（护栏②回滚姿态） | dist.bak-pre-t4-restart-20261117T233209Z（592K 全拷贝·回装一键形） |
| tsc rebuild（in place） | exit=0·dist session-bridge dsh 28/claude 3（注释形零调用点） |
| restart 正形 | User=fleet（进程属主）+Restart=always/5s——kill 主 pid（属主权限）→systemd 自动拉起=unit 正形生命周期（零 root 需求·MainPID 刷新） |
| **完工三断言（护栏①）** | healthz 复绿 ok=true ✓·pid 对表 2319222→**2518936** ✓·cron/watchdog 零变化（enabled=true/jobCount=6/degraded=false/consecutiveFailures=0 前后全等=触发面熄火维持）✓ |
| token 门保持 | 无凭 401 ✓（护栏④面继续有效） |

## §二 · ③真值互发全链闭环（断言 3·通道锚定语义保持）

- **链路实锚**：A=r-duty-cos（headless boot·bash 工具形）→curl POST 桥 API（token=$(cat /tmp/.trirmc-internal-token) 0600 文件形·命令替换形零回显）→daemon registry 命中 r-duty-sde→sendMessage→**B 真实 resume turn**（--session-id session-b731dbc3-…前缀形·exit=0）→**B 回执原文**：「探针内容确认收到，链路双向正常；本席在值守态，无异常读数·回执时点：2026-11-18T07:48:27+0800（date 现查原值）」→200→A 收执转述 ✓
- **发送→桥 API→对席收到→回执态闭环=全真**（非信箱/tmux 充验形·B 应答=真席 turn 产出带 date 现查形）
- D-46 全程：token 零回显（curl @file+A $(cat) 形+A 明示零回显遵行）·**token 文件用毕 shred -u 销毁 ✓**

## §三 · T5 验收门五断言复勘（任务书闭环面）

| 断言 | 判 | 实锚 |
|---|---|---|
| 1 claude 清零 | ✓ | which claude 零命中（复跑）+源面零调用点+**运行 dist 新形零 claude 调用点**（grep 0）+spawn dsh 实证（spawn ok agentId 返回） |
| 2 三 API smoke | ✓ | spawn=daemon API spawn r-duty-sde ok（agentId 返回）·list=token 面 200+registry 对表·send=resume ACK（「ACK — r-duty-sde（小布）收到，链路正常」）+桥面 message 全链 |
| 3 SendMessage 回执链 | ✓ | §二全链闭环 |
| 4 14 席 preset 值面勘 | ✓ | 本窗②四门（exit=0/preset 14/桥面 28/降权基座齐平）+剥桥 deep-equal 14/14+UUID 面（session 记录形） |
| 5 零回归 | ✓ | cron 零变化（§一）·sg 面零触·零会话损失（registry 0→0→1 前后对表·护栏③） |

## §四 · 残面如实旗标（四项·候 FSD/CTO 面核）

1. **headless lite=固定工具集**：preset pending（agentPresets 服务缺=T3 reload 如实注正形）+插件栈不实例化（overlay insert 形 config 入树实证但工具面零现=rc.2 lite 限制）——「A 席调工具」形=dsh 域结构面；本窗真值形=A bash→桥 API 直调（通道锚定语义保持·零充验）——候 FSD/CTO 裁：dsh 插件面支持 or R 席运行面切换
2. **T2 send 面 id 形**：spawnSession 抽裸 uuid vs resume 需 `session-` 前缀（app help 例形·本席独立复现钉死）——registry 胶合绕行·session-bridge.ts 码面候修
3. **listAgents 扫描形 vs dsh 实盘形**：.json 记录文件扫描（maxdepth2）vs dsh 实盘 session-<uuid> 目录+zstd 转录=结构性失配（registry 永零根因）——胶合补（r-duty-sde.json 记录文件）·码面候正形化
4. **胶合件正形化**：r-duty-sde.json（前缀 sessionId 形）+overlay 文件（/tmp 留档审计）=部署面手工形·候 FSD/CTO 正形化（registry 自动铸造面）

## §五 · 毕报回转

- 任务书 T5 验收门闭环毕报→notice-115 解锁读数链（S3 实弹+旧形三跑接力）随线回转照走 COS 呈批链
- 修笔三单笔 revert 一键形：TriCompany 4065c32（append 补挂·白盒 15/15）+TriRMC d5f2196（token 面·11/11）+TriRMC 7126ddd（更名 bridge_send_message 遮蔽冲突消解·11/11）
- next_agent 判断：COS（呈批链+notice-115 解锁面）→FSD/CTO（四残面面核·session-bridge 码面修）

## 使用依据

notice-168（令源勘正承录）+notice-169（restart 放行·四附加护栏）；coo-task-charter §五五断言；fsd-t4-code-readout runbook §九；app.ts/session-bridge.ts 实读；本卷读数=现采实锚（md5/pid/exit/registry/回执原文全 machine-read 或原文转录）。

—— SDE 小布（毕报=落卷+SendMessage 直达值席→m-cos→BOD→CEO·任务书闭环·卷面时戳=commit %cI）
