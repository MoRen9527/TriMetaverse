# T3 施工毕报·runner 一行修+T3-b/T3-c 生成器双件（BOD 144②·CTO 门禁绿四项·FD 主刀）

- 执行: m-duty-fsd；令面=BOD 144②（T3 先行）+CTO 门禁绿四项+runner 一行修准（转达令面）
- 交付锚双仓: **TriModel dev 9d9dfde**（runner loader await 一行修）+ **TriCompany dev da59e59**（T3-b/T3-c 生成器+白盒）——双单笔 revert 一键形·双 push sg bare ✓
- 状态: **READY_FOR_REVIEW**（候 CTO 完工门禁二审→落实窗候排·值席/R-HY 通道）

## 一、实现读数

| 件 | 落位 | 读数 |
| --- | --- | --- |
| runner 一行修 | TriModel src/dsh-adopt/runner.ts | apply 首行 `loader await`（headless run() 首行 rc.2 工件码同款·required-services 三 profile 全缺根因码级钉死·SDE 挂账卷 §三.1 定谳输入落地）——v3 复验线重跑前置件+T4 线共用输入；白盒 +2 件（await 恰一次且先于服务触面时序断言/缺席容错零阻主序）20/20 绿 |
| T3-b patch 生成器 | TriCompany scripts/ops/local/presets/generate-headless-preset-patch.mjs | web patch preset 段（READ-ONLY 直读·web patch 零写照承）→preset-r-duty-* 条目原样搬运→headless cordis.patch.yml；四护栏自带=零注释形/降权自检（danger-full-access 零容忍）/13 席齐断言（缺席逐名列 fail-visible·额外席 warn）/零写面（--out 显式才落盘）；js-yaml 经 --anchor dsh 安装锚解析（install-anchored 先例·零新增依赖） |
| T3-c 注册表生成器 | 同目录 generate-session-registry.mjs | sessions r-duty-* 族扫描（listAgents 现役读形同源）→三键映射 registry JSON（seat/session_id/employee_id/workspace·T4 桥消费形）；缺席席 fail-visible/坏件跳过 warn 如实/非 uuid 形保留原值（T0 ④ 形面勘定项）/--manifest 精化形（TriCompany 正名承接位） |

## 二、门禁读数

- 白盒: TriModel runner 20/20+TriCompany 生成器 8/8（preset 过滤原样/13 席齐缺席列/降权拒产/零注释首行/三键映射+id 读形/缺席+坏件/manifest 精化/smoke）
- cognition 全量 10 errors=预存环境面（四笔同款在档）零因果
- 护栏: web patch 零触（生成器 input read-only）/dsh 侧零写面（sessions 只读+patch 落盘显式）/单笔 revert/零触现役 loop 链 ✓

## 三、部署窗运行形（落实窗四步照卷·值席/R-HY 通道候排）

```bash
# 河源面（node 与 dsh 同域·js-yaml 走安装锚）
# ① dump 留档（headless patch 现役 4 行+web patch 4681 行卷面留档）
# ② 生成（read-only input）
node scripts/ops/local/presets/generate-headless-preset-patch.mjs \
  --web-patch ~/.dsh/profiles/web/cordis.patch.yml \
  --anchor /srv/fleet/dsh --out /tmp/headless-cordis.patch.yml
# ③ 值面勘（readout stderr 读数+headless patch 回读 13 席点验）
# ④ 写 patch（~/.dsh/profiles/headless/cordis.patch.yml 落位）+ dsh --dump-config --profile headless 值面勘（charter 验收门 4 全项）
# 注册表生成（T4 桥消费形）
node scripts/ops/local/presets/generate-session-registry.mjs \
  --sessions-root ~/.dsh/sessions --out <registry.json>
```

## 四、残面如实列

- transpiler 本体深勘=候项（BOD SSH root 链或 dev 机面·①④读数未定位如实注——不阻本线）
- acp patch 并勘=留窗随查（缺省 headless 先行·CTO 准面）
- 落实窗+验收勘（13 席齐/UUID 面在/降权链生效）=河源部署窗候排
- notice-115 解锁读数=落实窗毕随督办线回 COS 转 notice-115 面（charter 关联注记）
- sg 白盒运行形: `~/node22/bin/node --test scripts/ops/local/presets/presets-whitebox.test.mjs`（js-yaml 走沙箱锚·零仓内依赖）

## 五、使用依据

BOD 144②；CTO 门禁绿四项+runner 一行修准令面；cos-t3a-survey-readout-20261117.md（勘形窗四读数·preset 条目形样例）；fsd-t3-design-20261117.md（§二/§三/§四）；W45 三键正形谱系；SDE 挂账卷+headless run() 工件码实锚；charter §四护栏
