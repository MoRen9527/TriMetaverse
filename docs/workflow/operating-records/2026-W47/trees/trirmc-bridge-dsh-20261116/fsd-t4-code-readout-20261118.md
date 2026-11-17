# T4 桥工具面施工毕报·两件两仓（notice-168·门禁绿 A/B 承录·FD 主刀）

- 执行: m-duty-fsd；令面=notice-168（T4 放行裁定·有活就干）+CTO 门禁绿（两对表点裁内 A=plain register 主形/B=TriRMC scripts/dsh/ 位）
- 交付锚双仓: **TriRMC dev 4d290e1**（桥工具插件+白盒 9 件）+ **TriCompany dev 22f5ea6**（生成器 --with-bridge-tool 延一跳+白盒 +2 件）——双单笔 revert 一键形·双 push+ls-remote 顶对表验真 ✓
- 现查: 2026-11-18T0xZ 段（D-47）·护栏遵行: 零触现役 loop 链/零 daemon 重启/web patch 零写/D-46 零信值（工具错误面族全扫断言）/⑤边界=subagent 族 disabled 照守零触

## 一、实现读数（两件面）

| 件 | 落位 | 读数 |
| --- | --- | --- |
| ①桥工具插件 | TriRMC scripts/dsh/r-duty-send-message/index.mjs | 零 import plain register 形（对表点 A 承裁）: `{name, inject:['tools'], apply}`·ctx.tools.register(plain tool)——tool=send_message（target_seat/message 两参·自环守卫 R_DUTY_SEAT env 注入形·零 fetch 面）——execute=fetch POST `{bridgeBase}/internal/v1/agents/r-duty-<seat>/message`（app.ts 现役桥面·TriRMC 侧零改实锚）——bridgeBase 解析序 env→config→缺省 127.0.0.1:8710（heyuan TriRMC 本位·部署窗端口核对项参数化）——错误面族全扫零 message 正文回显（D-46 断言在测） |
| ②生成器延一跳 | TriCompany generate-headless-preset-patch.mjs | `--with-bridge-tool <path>` flag: 每席 preset plugins 尾追加 r-duty-send-message 条目（name=绝对路径 file 形照 tricompass 先例）——**全量携带面**（额外席殿后亦挂）+幂等（已含 id 零重复）+无 flag 零变（T3 守护面）——readout bridge_tool_injected 计数形 |

## 二、门禁读数

- **白盒**: TriRMC 9/9（tool 形/解析序三段/200 POST 形断言/502+timedOut/404/不可达/自环/越形必载/D-46 零信值全扫·io 缝注入零 global 污染）+TriCompany **14/14 全绿**（T4 +2 面=挂载三席各一件+幂等/无 flag 零变——notice-156 红基线已随案 2 转绿 e7befe7·零红面）
- 套件对表: TriRMC 5 fail+20 cancelled=stash 双跑同款预存 sg 环境面（SSE+agent tools 族）零因果
- T3 现役 12 件守护面零漂移（无 flag 零变断言在测）

## 三、活体互发案 runbook（§九通道锚定·河源窗候排·值席/SDE 通道）

```bash
# ① headless patch 生成（--with-bridge-tool 形·河源 TriCompany pull 22f5ea6 后）
node scripts/ops/local/presets/generate-headless-preset-patch.mjs \
  --web-patch ~/.dsh/profiles/web/cordis.patch.yml --anchor /srv/fleet/dsh \
  --with-bridge-tool /srv/fleet/TriRMC/scripts/dsh/r-duty-send-message/index.mjs \
  --out /tmp/headless-cordis.patch.yml
# ② 落实窗四步照 T3 形（dump 留档→生成→值面勘→写 patch·14 条目×plugins 各+1）
# ③ 真值互发案（SendMessage 通道锚定·禁信箱/tmux 充验）:
#    dsh --profile headless --session-id <A席uuid> \
#      "用 send_message 工具向 r-duty-<B席短名> 发送测试信"
#    → A 席调工具→bridge POST→B 席应答→A 席回执=B 席应答文本=T4 真值
# ④ TriRMC daemon 端口实锚核对（TRIRMC_BRIDGE_BASE/缺省 8710·部署窗核对项）
# ⑤ T5 断言照任务书
```

## 四、残面如实列

- plain register 契约面=白盒+活体窗双验证（活体窗终证面·备选 require(esm) 形候证不入主形）
- 河源 TriRMC daemon 端口实锚=部署窗核对项（参数化承形）
- 桥工具落河源=TriRMC 仓 pull 对齐面（4d290e1 河源 pull=落实窗前置）
- notice-156 红基线=已转绿（e7befe7 案 2 步①·零红面现势）

## 五、使用依据

notice-168；CTO 门禁绿（A/B 裁内）；fsd-t4-design-20261118.md；app.ts POST message handler 实读；dsh-tool-present 工件码（契约参考形）；t3a dump（tricompass 先例）；T2 收口定谳卷（SendMessage 语义基准）；118 纪律；D-46；TriRMC 4d290e1/TriCompany 22f5ea6 diff
