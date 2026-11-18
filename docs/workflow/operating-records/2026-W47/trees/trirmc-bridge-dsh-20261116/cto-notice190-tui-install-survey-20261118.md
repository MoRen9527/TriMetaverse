# notice-190 tui 插件装补勘定卷（CTO·三面+装补前提事实裁定）

- date 现查: 2026-11-18 20:5x CST（D-47）
- 勘定人: CTO 小狄（notice-190 承令·与 notice-189 web 勘形并行不互阻）
- 勘定形: heyuan 侧只读 SSH 实勘（R-HY 通道·D-24 机位断言先行：sg=iZt4n2…/heyuan=iZf8ziw…双端断言）+ 双端 npm 官源源读（0.2.0-rc.2 现役装 + 0.2.2-rc.2/rc.4 tarball）
- ns2 链零触 ✓；现役运行面（web face 8791/8710 daemon/会话族）零触 ✓

## 裁定总览：**装补前提被事实推翻（FREEZE）——`dsh tui --resume` tmux 看窗路线缺件=TUI chat app 包在官方生态全线不存在，非可装补缺件**

## 面 a·插件包名与安装源勘定

1. **TUI chat app 包=不存在**（三重实锚）：
   - heyuan 现役装全量包清单实勘（`/srv/fleet/dsh/node_modules/@deepseek-ai/` 0.2.0-rc.2 全家）：app 面=**acp-app / web-app / headless / sdk-app / sdk-minimal 五面零 TUI**（client-ui-* 全族=web 前端件；api-terminal-controller=agent 终端 API 面；terminal/-bash=agent 持久终端服务——均非人类 chat TUI）；
   - npm 官源 0.2.2-rc.2/rc.4 `PROFILE_TEMPLATES` 源码钉死：五名模板零 tui（notice-189 卷面 b① 承录）；
   - heyuan CLI 0.2.0-rc.2 help 原文自证：「`dsh tui --patch ./extra.yml` boot a **custom profile** with one extra overlay」——**help 自身把 tui 定性为 custom profile 示例名**，非出厂 profile。
2. **装补机制门=pnpm 缺**：heyuan fleet 环境 node v22.23.2 ✓ / npm 10.9.8 ✓ / **pnpm 无**——`dsh plugin` 即 pnpm 包装器，无 pnpm 不可执行（实锚：本勘探针触发原文报错「pnpm was not found; install pnpm and make it available on PATH」）。
3. **npm 源可达性 ✓**：heyuan → registry.npmjs.org HTTP/2 200（20:46 CST 实测）——安装源面基础在（与 sg 面新实锚互证）。
4. **结论**：`dsh plugin --profile tui add <package>` 的 `<package>` 槽位**无可满足对象**——即便补装 pnpm，也无一包可加出 chat TUI。

## 面 b·profile 清单验证

- `dsh plugin list`（pnpm 面）=不可执行（pnpm 缺·见面 a②）；
- profiles 目录实锚（de-facto 清单）：`/home/fleet/.dsh/profiles/` = **acp / headless / sdk / tui / web 五目录**——其中 **tui=本勘探针副作用产物**（见下「副作用如实注」），骨架=dsh-base 单层空 patch **空壳无 app**，`--resume` 无载体；
- 四现役（acp/headless/sdk/web）原样未动 ✓。

### 副作用如实注（探针 write 侧效·透明申报）

`dsh plugin --profile tui --help` 探针触发 profile tui **骨架自动初始化**（/home/fleet/.dsh/profiles/tui：package.json[dsh-base]+空 cordis.patch.yml+pnpm-workspace.yaml 三件）——惰性骨架零服务影响零会话影响；留置（若裁弃=回滚一行 `rm -rf /home/fleet/.dsh/profiles/tui`）。此系 dsh plugin 命令先 init 后解析参数的设计行为，非数据损面。

## 面 c·冒烟验活

**不可达（阻于面 a）**：tui profile 空壳无 UI app——`dsh tui --resume <uuid>` 即便执行也无渲染面（dsh-base 裸树无 app 层）；且冒烟须起进程，R 面零杂进程纪律下**拒绝起无意义进程**。冒烟候路线定谳后补。

## 路线替代案（CTO 技术裁·候 CEO 定谳执行面）

| 路线 | 形 | 勘定 | 判 |
|---|---|---|---|
| **B·零装只读查看器**（荐） | tmux 窗=zstd/jq 只读渲染会话 transcript（`zstd -dc session.v4.jsonl.zstd \| jq …` 或 projcache JSON） | 存储形实勘 ✓：会话体=`~/.dsh/sessions/<cwd-slug>/session-<uuid>/session.v4.jsonl.zstd`（+projcache `~/.dsh/storages/session_projcache/sessions/session-<uuid>.json`）；heyuan zstd/jq/python3 三工具全在 ✓；ns1 目标会话实锚（COS=bd42c2bb… 在 `--var-lib-trirmc-cron-runs-shift-W46-…--/` 槽·活跃态 mtime 11-18 14:00） | **零新依赖零写入零供应链面**，直击 CEO 看窗真实需求；FSD 小活（只读渲染脚本+uuid→tmux 窗 map） |
| A·ACP+第三方 TUI client | `dsh acp`（session/list+session/resume 0.2.2 README 锚）+第三方终端 ACP client | 0.2.0 acp resume 语义未勘+第三方依赖=R 面供应链新增面+跨 profile 会话根域存疑 | 候深勘，非速赢 |
| C·web 每席端口 | 每 seat workspace 一 web face（notice-189 a⑥/c④ 已呈） | 现役 18791→heyuan 8791 隧道先例在 | 浏览器线主路线维持 |
| D·升级线 | 后续 dsh 版本若出厂 TUI | rc.4 仍零 tui（源码钉死） | 版本锁政策面候 BOD，远期 |

**CTO 裁定建议**：装补令 FREEZE（前提事实不成立）；看窗需求以 **Route B** 承接（候令后 FSD 施工·只读门禁=零写会话零触 lock·单测白盒+实弹冒烟后补面 c）；C 线并行不阻。

## 使用依据

heyuan R-HY SSH 只读实勘（包清单/profiles 目录/会话存储形/工具链/npm 可达性）；npm 官源 dsh@0.2.2-rc.2+dsh-official-bundles@0.2.2-rc.2/rc.4 tarball 源读；heyuan 0.2.0-rc.2 CLI help 原文；notice-189 勘定卷（1a1da033d）；notice-190 派工令；D-24/D-46/D-47 纪律。
