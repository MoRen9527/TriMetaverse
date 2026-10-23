# CTO 段1 毕报 · AGENDA-001 供应链卫生基线（1-1+1-2 实测全绿·段2 启动门达）

- sourceOfTruth: 本卷（cto-seg1-closeout-20261023.md）
- syncMode: static（段1 勘验段毕报·COS 19:35 派工触发·窗内毕·零现役工程文件变更）
- lastSyncedAt: 卷面时点锚=git commit 时戳（shell 生成·零手打·D-47 卷面正形）
- 施工席: CTO 小狄（段1 主责）·令源=任务书正身（CEO 02:47:43 确认令）+排工单（COO·CEO 19:33 问询触发开窗）

## §一 1-1 读数（npm12×nvm4w 兼容+allowlist 语法实测）

| 项 | 读数 |
| --- | --- |
| 基线锚 | node v22.21.1 / npm 10.9.4 / nvm4w 1.2.2（root=%LOCALAPPDATA%\nvm·槽：22.21.1/20.18.1+本次新增 24.22.1/26.12.1） |
| npm 12 engines | `^22.22.2 \|\| ^24.15.0 \|\| >=26.0.0`（registry 实查·latest=12.2.1）——**现役 22.21.1 不满足**（差 patch 位：22.22.2 起） |
| 槽自带 npm | 24.22.1→11.19.1 / 26.12.1→11.20.0——**npm 12 不随任何现役 node 槽自带·升级载体=npm 层 `npm install -g npm@12`**（node 槽满足 engines 即可） |
| npm 12 实装 | 24.22.1 槽+临时 prefix 实装 **12.2.1 RC=0** ✓（真实跑通） |
| allowlist 语法正形 | **package.json `allowScripts` 字段**（`{"esbuild@0.28.2": true}`·默认版本 pin 形）+命令面 `npm approve-scripts / deny-scripts / install-scripts ls\|approve\|deny\|prune` + `--allow-scripts-pending` 检查闸 |
| 默认态定性 | **npm 12 install 脚本 default-deny**（零配置即拦·形态=warn 不 fail RC=0）——CI 严格化须加 pending 空判闸（段2 输入） |

## §二 1-2 读数（白名单包清单实测）

- **esbuild 必测全链绿**：默认装→`install scripts blocked`（warn 实锚 esbuild@0.28.2 postinstall: node install.js）→`approve-scripts esbuild`→package.json 落 `allowScripts`→重装零 warn→`--allow-scripts-pending` 清零→构建 smoke ✓（bundle 413b·输出正确）。注：esbuild 平台二进制走 optionalDependencies（@esbuild/win32-x64 等直接装）·postinstall 被 block 亦可用——approve 后校验链归位，白名单语义=补全校验链而非解锁可用性。
- **依赖树备查（@swc/core/electron/node-gyp 系）**：TriRLC/TriPilot/TriCode 三 node 工程 lockfile 全谱 grep **零存在**；TriMetaverse 根非 node 工程（无 package.json）——**白名单清单无需收三包**；段3 各模块生效时以 `npm install-scripts ls` 就地勘全清单（方法锚）。
- esbuild 平台包存在性：TriRLC（win32-x64+linux-x64）/TriPilot+TriCode（全平台族 optionalDeps）——esbuild 白名单条目三工程通用。

## §三 坑案三条（nvm4w 兼容性勘验实锚产出·段3 全局切换注意项）

1. **nvm use UAC 无头静默失败**：报 "Now using" 但 symlink 未建（elevate UAC 无值守确认·两跑复现）——C:\nvm4w\nodejs 现缺位，node 解析兜底 `C:\Program Files\nodejs`（22.21.0·活·patch 位漂移）。**恢复项=有人值守窗跑 `nvm use 22.21.1` 一次（UAC 确认）**——候窗挂账。daemon 双 healthz 绿零影响（进程内已加载·19:47 收口复探）。
2. **claude shim 残留占位坑**：C:\nvm4w\nodejs 曾被全局 claude 安装写成物理目录（残留 4 件）致 use 全拒（`NVM_SYMLINK is set to a physical file` 硬错）——已清残留（断言 claude 本体=AppData/Roaming/npm 独立 exe 位零依赖零损后删）。
3. **MSYS2/Git Bash 读数缓存伪影**：nvm use 后裸 `node -v`/`npm -v` 读旧值（hash -r 不解·显式路径即真值）——长会话 shell 切版本后必显式路径验证；CI 干净环境不受影响。

## §四 段2 启动门判定

**段1 全绿过门 ✓**（1-1+1-2 实测全过·判据对任务书 §二段1 表全达）——段2（10-24 18-24 窗 SDE CI 施工）**启动门达**。

段2 关键输入（SDE 面）：
- CI 切 npm12 形态=runner 内 `npm install -g npm@12`（自升·非随槽自带）·node 槽 engines 断言 24.15+/26+。
- allowlist 落点=各工程 package.json `allowScripts` 字段（版本 pin 形）。
- CI 严格闸=`npm install-scripts ls` 输出空 + `approve-scripts --allow-scripts-pending` 空判（default-deny 是 warn 形态·不闸会假绿）。
- 回滚预案（排工单）：任一模块构建异常→`.npmrc` 临时 `ignore-scripts=false`+回滚依赖升级——随段2 SDE 卷。

## §五 施工边界如实

- 零现役工程文件变更（实测全在 %TEMP% 临时工程+真槽显式路径·勘验段性质保持）。
- 环境面变更=新增两 node 槽（24.22.1/26.12.1）+npm12 临时 prefix（%TEMP%）+nvm4w symlink 位缺（坑案 1·恢复项候窗）——daemon 现役零触碰（healthz 双绿全程）。
- 测试残留：`%TEMP%\npm12-agi001\`（毕报引用后候窗清·零毒）。
- STE 协同位（1-2）：备查项本席已闭（lockfile 全谱零存在·硬读数）；STE 段4 4-1 验收时按 §二方法锚复核即可。

## §六 三送

BOD（销账锚）·COS（台账对表+段2 门达知会）。

—— CTO 小狄（卷面时点锚=git commit 时戳·零手打·D-47 卷面正形）
