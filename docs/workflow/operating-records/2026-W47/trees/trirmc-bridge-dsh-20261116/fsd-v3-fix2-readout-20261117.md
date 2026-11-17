# v3 三修毕报·版本矩阵检查源修正（BOD 裁135 续·SDE 复跑红实锚 c7340cb66·FD 主刀）

- 执行: m-duty-fsd；令面=值席派工三修令（matrix 语义面=贵席定+CTO 复核）
- 交付锚: **TriModel dev b3934e6**（单笔 commit revert 一键形·已 push sg bare 93617e5..b3934e6）
- 现查: 2026-11-17T01:0xZ（写前现查·D-47）·止损线照走：legacy 零漂维持·修面①②在卷实证 ✓

## 一、根因与修形读数

- **根因=检查源面错位**: runner 读安装域 @deepseek-ai/dsh package.json version（河源实锚 **1.0.0**——安装域包版本线）vs matrix=[0.2.0-rc.2/0.2.2-rc.3]（CLI 版本族）——两版本线不同域·fail-visible 防线=设计面正形拒（防线语义正确·错在检查源）
- **修形（令面①·语义裁定随卷呈 CTO）**: 检查源改 **getDshRuntimeVersion 同源读形**——`@deepseek-ai/dsh-app-boot/package.json` version = CLI --version 源码级正源（dsh-app-boot lib/index.js :271 实锚：getDshRuntimeVersion() 即读 app-boot 包 version；沙箱同值实证 0.2.0-rc.2）——**零子进程同源读形**（优于令面①子进程探形：同源保证+零进程开销+零 bin 路径依赖）
- **回落面兼容保留**: 主源缺席/坏→回落 anchor package.json + `versionSourceLabel` 源标记（runtime/anchor-fallback）——fail-visible 消息载源形（`dsh X (source=runtime|anchor-fallback) not in supported matrix`）
- matrix 语义面=CLI 版本族不变（两行=0.2.0-rc.2+0.2.2-rc.3·跨版本触点面 diff=EMPTY 承录）

## 二、门禁读数

- 白盒 **18/18 绿**（+3 件: ①主源优先不误拒——anchor=1.0.0/app-boot=0.2.0-rc.2 错位形放行=河源实弹根因反转验证 ②回落面+fallback 标记 ③拒跑消息载 source=runtime·c7340cb66 fail 形对表）
- TriModel 套件 346/323/6/17（6 fail=预存环境面零因果 Δ+3 全绿）·tsc 绿
- 护栏遵行: 零触现役 loop 链/零 daemon 重启/零河源面/单笔 revert ✓

## 三、复验衔接面（令面③·单席 patch-runner 直跑复验）

- **复验=SDE 面**（河源 pull b3934e6 后）——对照 c7340cb66 七席 fail 形基线：
  ①预期翻转=七席 "dsh 1.0.0 not in supported matrix" 消失（app-boot 源=0.2.0-rc.2 在册）
  ②对表读数=fsd-adopt-runner 状态六键 JSON（outcome=adopted-live/adopted/created 三态·flushed:true）
  ③fail 形若再现=stderr 载 source= 标记（检查源诊断面一步到位）
- 前置核对项: 河源 app-boot 包位=`<anchor>/node_modules/@deepseek-ai/dsh-app-boot/package.json` 在场实勘（主源生效前提）

## 四、使用依据

BOD 裁135 续三修令（值席转达）；SDE 复跑卷 c7340cb66（七席 fail 形基线）；dsh-app-boot lib :271 getDshRuntimeVersion 源码级实锚；沙箱 dsh-app-boot@0.2.0-rc.2 同值实证；TriModel b3934e6 diff
