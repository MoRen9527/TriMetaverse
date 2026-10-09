# 接令确认先做对象断言（错误框架传染防御）

**教训（2026-10-09 LG-066 实证）**：BOD 10:26 知会错误框架（把 CEO 对 sg TriMMC 口位的裁 A 套到河源 TriRMC 段2 上——trirmc=R-HY 8.155.54.79 与 trimmc=M-SG 47.245.122.61 两机面被缝合），我 10:52 技术确认**未查施工对象是谁**，直接顺着框架推「段2 失去前提不执行」并给了技术背书→错误框架获 CTO 印章→10:41 滞后污染扩散至 A5 步骤单头部勘注笔（「段2 取消（TriMMC 留 sg 8712 现役）」）——CEO 10:34 指正后三处连环勘正。CEO 点名「你们经常把 trirmc 和 trimmc 搞错」=家族性。

**正形**：接令确认/会签/复核准入前三问对象断言——①对象是谁（daemon 名/service 名逐字）②哪个机面（M-SG/R-HY/dev 本机·说河源=R面说sg=M面）③哪个仓（TriRMC 独立仓≠TriRLC 仓）。断言不齐先回询再确认，禁在未断言对象上推「同向强化/失去前提」类语义链。

**识别信号**：确认对象与令文主语不同名（TriMMC≠TriRMC≠TriMLC≠TriRLC 四 daemon 名近亲）；端口号跨机面复用（8710/8712 两面各有语义，sg 面「8712→8710」与河源面「8712→8710」方向还相同=完美混淆温床）；「同向强化」结论找不到共同对象时的舒服感=红旗。

**同族**：exec-order-time-crosscheck-discipline（时点维度交叉核对）——本条=对象维度，两条合用=接令确认双查。关联：trirmc-independent-repo-topology/m-sg-r-hy-server-naming/trimmc-mlc-addjob-divergence。
