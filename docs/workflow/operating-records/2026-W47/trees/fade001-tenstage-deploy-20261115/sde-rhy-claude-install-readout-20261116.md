# SDE 河源 claude 装机毕报（r163 ③款 governs·notice-162 ①款·技术形态域裁）

- sourceOfTruth: 本卷（河源 claude 装机毕报正身）
- syncMode: write-time
- 施工席: SDE 小布；令源=COS 河源装机令（r163 ③款 governs·技术形态本席域裁·毕报附 claude --version 河源实锚）
- 执行窗: 2026-11-16T13:3xZ-13:4xZ+08（date 现查锚）
- 判定: **装机毕·claude --version 河源实锚=2.1.325 (Claude Code)·用户级零系统变更形**

## §一 · 技术形态域裁记录（本席裁定面）

| 候形 | 裁定 |
|---|---|
| npm -g（node22 生态一致·M1 node22 面先例） | **采**——用户级 prefix 形 |
| 原生安装脚本（curl claude.ai/install.sh） | 不采（外网脚本面 vs npm registry 既有生态——npm 面更贴 node22 现役形） |
| 系统级 /usr 形 | 不采（npm prefix=/usr root 域——**用户级零系统变更** M1 纪律先例形遵行） |

## §二 · 装机实录与实锚

- 前置勘：R-HY node v22.23.2+npm 10.9.8 在位 ✓（M1 卷同版对表）·npm prefix=/usr（root 域→用户级形裁定依据）
- 装机：`npm config set prefix ~/.npm-global` + `npm install -g @anthropic-ai/claude-code`（added 2 packages in 23s）
- **claude --version 河源实锚：2.1.325 (Claude Code)**（~/.npm-global/bin/claude·fleet:fleet 用户级）
- PATH 持久化：~/.bashrc 追加 `export PATH=~/.npm-global/bin:$PATH`（毕）
- **版本对照如实注**：sg 面=2.1.227（/bin/claude）vs 河源=2.1.325（npm latest 形）——形态族一致（Claude Code 2.x）版本号差如实录（若需同版 pin=`npm install -g @anthropic-ai/claude-code@2.1.227` 形候值席裁——latest 形零 pin 现势）

## §三 · 候件面（装机令范围毕·如实注）

1. **spawn 会话凭据面**：claude -p headless 会话需 ANTHROPIC_AUTH_TOKEN env（runner spawn env 注入形——值面=BOD/CEO 供·零敏感值出机管道照 r112② 形）——**候值席面供值**（S3 实弹席重试前置件）
2. S3 实弹席重试：装机毕=环境面解——单席试会话（cpo dry-run 席）候凭据面毕即重试
3. 版本 pin 面候裁（2.1.325 latest 形 vs sg 2.1.227 同版形）

## §四 · 护栏遵守

用户级零系统变更（~/.npm-global+~/.bashrc 用户域）✓｜零 root 面（npm prefix 用户级形）✓｜零触在途链 ✓

## 使用依据

r163 ③款 governs（notice-162 ①款）；sg 面 claude --version 对照实测；R-HY node/npm/prefix 前置勘实测；装机输出实录。

—— SDE 小布（毕报=值席 COS 主送→BOD·卷面时戳=commit %cI）
