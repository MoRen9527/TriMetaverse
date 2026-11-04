# node-fsd-tui-move · TUI 共有化段一（TriRLC→TriCode 平移）节点收口报告

```json
{
  "nodeId": "node-fsd-tui-move",
  "agent": "FSD",
  "startedAt": "2026-11-04T11:52:02+08:00",
  "finishedAt": "2026-11-04T12:12:20+08:00",
  "baselineCommit": "TriRLC@4976dda + TriCode@d181946（两仓 worktree clean·基线回归 TriRLC 758/758 全绿实证 31.8s）",
  "trigger": "COO 派工令 2026-11-04T11:52:02+0800（COS 排工令 11:51:14·CTO 两段技术裁决毕·裁决权收口令后首案）·FSD 接令回执 msg 912c9625",
  "actions": [
    "①前置勘先行（勘定卷 recon-fsd-tui-shared-move.md·TMV d0cb28ff5·施工前落盘）：react 19 peer 两仓对表（TriRLC 19.2.8 在役/TriCode 承接缺口三件）·vendored ink 随迁清单（212f=171js+26ts+12tsx·裸包全集含 js 面重扫修正首轮 ts/tsx-only 盲区）·bun:bundle×12+src/×26 异面定性=import 链不可达残件（dist 编译产物实证零拉入·render 链走 fork.js barrel+theme.js）·消费单点=cli.ts L615 动态 import 唯一消费方·跨仓 git mv 不可行实锚差异=SHA 双锚替代如实注记",
    "②TriCode 承接收编（b0ad344）：src/tui 全树 212f 拷入→src/r-ink-tui/·tsconfig 四键扩（allowJs/checkJs:false/jsx:react-jsx/include+tsx·TriRLC 同形照抄）·pkg peerDependencies react@^19.2.8+react-reconciler@^0.31.0（reconciler peer=react 同源单实例机械延伸候 CTO 确认注记）+deps ink 族 19 包版本机器读 TriRLC 抄录+yoga-layout 保 npm:alias 同形+devDeps @types 两条+exports 加 ./r-ink-tui/* glob 形·check RC=0+build RC=0（dist/r-ink-tui render/fork/app 入口在位·ink 子树 125js 同构·残件面零产出）",
    "③TriRLC 侧切换（9dc5355）：src/tui 212f git rm（源仓终态 SHA 双锚·历史永续可溯）·test/tui 五件+tui-acp.test.ts 随迁（白盒测试随被测物走·域归属一致）·cli.ts L615 单点 import 切 @trimetaverse/tricode/r-ink-tui/render.js（file: symlink 实时链勘实·零刷新需求）·跨域混合件拆分=t9 cli parseArgs 段留本仓新件 tui-acp-cli.test.ts+acp 域八测试随 TriCode",
    "④回归 gate：TriRLC 655/655 零红+TriCode 161/161 全绿（含 tui 六件 103 全绿新家实锚）——758 基线对账线=654 剩余+103 随迁+1 拆件新增·零消失"
  ],
  "artifacts": [
    "TriCode b0ad344: src/r-ink-tui/ 212f+test 六件+tsconfig/pkg/exports 三改+lockfile（新建承载位）",
    "TriRLC 9dc5355: src/tui 212f git rm+test 六件随迁+cli.ts 单点切换+tui-acp-cli.test.ts 新件（220 files ·−34370）",
    "TMV d0cb28ff5: 勘定卷 recon-fsd-tui-shared-move.md（施工前置先行）",
    "reports/node-fsd-tui-move.md（本报告）"
  ],
  "gateResults": [
    {"gate": "施工序①前置勘先行", "result": "PASS", "detail": "勘定卷施工前落盘（d0cb28ff5 12:00:20 先于首笔施工 commit 12:08:40）——react peer 对表+随迁清单+残件定性+消费单点锁定+SHA 双锚差异注记五件齐"},
    {"gate": "施工序②平移施工", "result": "PASS", "detail": "TriCode src/r-ink-tui 212f 在位（拷贝后 find 实锚 212）·包导出 @trimetaverse/tricode/r-ink-tui（exports glob 三形态 import/require/types）·产品名=R 面 Ink TUI（入册事实附毕报·registry owner=CPO 域界不入本席）·TriRLC 依赖切换单点完成"},
    {"gate": "施工序③回归 gate 零红", "result": "PASS", "detail": "TriRLC 655/655 fail=0（40.3s）+TriCode 161/161 fail=0（5.5s·含 tui 103）——758 基线对账=655+103−1 拆件·零消失对账线闭合（tui 六件 tests=103 单独跑实锚非推算）"},
    {"gate": "两仓 build 绿", "result": "PASS", "detail": "TriCode check RC=0+build RC=0；TriRLC build RC=0（切换后）——dist/r-ink-tui 结构对表（render.js/fork.js/app.js+ink 125js·残件面零产出同 TriRLC 旧形）"},
    {"gate": "发现与处置·混合测试件拆分", "result": "PASS", "detail": "tui-acp.test.ts 首迁 TriCode 后 1 红（ERR_MODULE_NOT_FOUND ../src/cli.js）——根因=跨域混合件（8 acp 域测试+1 TriRLC cli parseArgs 域）·处置=拆件（acp 域留 TriCode·t9 cli 段归 TriRLC 新件 tui-acp-cli.test.ts）·复跑双仓全绿"},
    {"gate": "纪律面", "result": "PASS", "detail": "commit 署名 FSD×3（TriRLC 9dc5355/TriCode b0ad344/TMV d0cb28ff5）·D-47 卷面时戳=写前现查粘贴零手打·依赖版本零手抄（机器读 TriRLC pkg 抄录）·版本号/读数全实锚"}
  ]
}
```

## 实现方案

平移形=SHA 双锚替代跨仓 git mv（技术不可行如实注记）：TriRLC 侧 git rm 终态（历史在其 git log 永续可溯）+TriCode 侧首笔 commit 注记源 SHA——保历史可溯意图达成。编译面=TriRLC 同形四键平移（allowJs 拉入 js·jsx react-jsx·include 扩 tsx）——残件面（bun:bundle/src 引用·import 不可达）随树平移保 vendored 完整性但不进 dist（编译产物实证同构）。依赖面=react+reconciler 入 peer（宿主 TriRLC 供给）+ink 族 19 包入 dependencies（vendored 运行必需）。

## 异常与处置

1. **裸包扫描盲区（self-caught）**：首轮 import 扫描只盖 ts/tsx 漏 171 js 面——react-reconciler 由 vendored ink js 内 import 实证漏网。全树含 js 重扫得完整 21 包清单——依赖声明据第二轮实锚（若按首轮清单漏 react-reconciler peer 会运行崩）。
2. **tui-acp 混合件 1 红（迁移后测试抓获）**：跨域混合件（acp 域+TriRLC cli 域）——拆件处置·复跑双仓全绿。
3. **file: 依赖形态勘实**：npm file: 依赖=symlink 实时链（readlink -f→TriCode 实目录实证）——非快照拷贝·零刷新需求（先验假设「npm file:=快照」被勘正）。

## 断点交接

- 段一毕（三锚：TriRLC 9dc5355+TriCode b0ad344+TMV d0cb28ff5·双门见本报告）·段二（河源装机 SDE）候本毕报触发。
- **产品名入册事实**（供 CPO registry 收口窗）：产品名=R 面 Ink TUI·承载位=TriCode src/r-ink-tui/·包导出=@trimetaverse/tricode/r-ink-tui（glob 子路径）·peer={react ^19.2.8, react-reconciler ^0.31.0}·消费方=TriRLC cli.ts（file: symlink）。
- dist 卫生候窗：TriRLC dist/tui stale 残留（tsc 不清 dist·运行链零触达·rm 类命令权限未批不强删）+dist/vendor 旧布局残留（勘定卷已注记）——清理候 CTO/SDE 窗。
- TriRLC deps ink 族冗余候 CTO 裁（react+reconciler 必须留=peer 供给义务；其余 17 包零非 tui 引用属冗余无害）。

## 自测结果

- TriRLC 基线 758/758（平移前实锚）→迁后 655/655 零红；TriCode 161/161（含 tui 103 新家全绿）。
- TriCode check RC=0+build RC=0；TriRLC build RC=0。
- 对账线零消失（758=654+103+1 全实锚）。

## 技术债务标记

1. reconciler 入 peer 系机械延伸裁量候 CTO 确认（勘定卷注记在案）。
2. TriRLC deps ink 族冗余+tsconfig jsx/allowJs 死配置+dist stale 三件候清理窗（超本单最小化·如实留档）。
3. 残件面（bun:bundle×12+src/×26）随树平移保留——上游 claude-code 完整组件树残留·运行零触达·候上游对齐窗清理裁决。

## 使用依据

COO 派工令 2026-11-04T11:52:02+0800·COS 排工令 11:51:14·CTO 两段技术裁决·勘定卷 recon-fsd-tui-shared-move.md（TMV d0cb28ff5）·TriRLC package.json/tsconfig@4976dda·TriCode@b0ad344·TriRLC@9dc5355·两仓测试读数实锚
