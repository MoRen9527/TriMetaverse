# 候办② · sg 面仓 pre-commit gate 同步执行读数卷

- sourceOfTruth: 本件（SDE 面执行读数正身；上游=BOD 2026-10-06 裁一账本 JSON gate + COS 2026-10-07 13:16 窗口解锁知会候办②）
- syncMode: static
- lastSyncedAt: 2026-10-07T06:02:44Z（date 现查；+8 = 14:02:44 +0800）
- 执行席: SDE 小布（m-sde）；触发=D-23 例外窗（CEO 13:14 亲令 14:00-18:00）14:01 cron 自提醒
- 状态: **执行毕全绿，候 COS 刷账销候办**

## 一、落点语义辨析（执行前定案）

- sg **bare** 仓无 pre-commit 触发面（bare 无工作区 commit；服务端对应物=pre-receive，非本候办 scope）
- 合理落点=sg **工作树** `/srv/fleet/TriMetaverse/.git/hooks/`——sg 侧 commit 面在工作树
- 本机源=`D:\Code\ai\TriMetaverse\.git\hooks\pre-commit`（账本 staged JSON gate，BOD 2026-10-06 裁一产物，609B）

## 二、执行读数（四步）

| 步 | 动作 | 读数 | 判 |
| --- | --- | --- | --- |
| ① 机位断言+现态勘 | ssh fleet@47.245.122.61 勘 hooks/ | `.git`=目录（工作树形态）；hooks/ 仅 14 个 `.sample` 模板，**无 pre-commit**；python+python3 双在位（/usr/bin）；属主 fleet:fleet | ✓ 分支③写入路径确认 |
| ② 对表 | — | sg 侧无既有 pre-commit，无勘差需求 | ✓（步骤空转合规） |
| ③ 传输+安装 | scp→/tmp→cp+chmod +x | md5 三点一致：本机=`e37dee39…`=传输=落位；`-rwxr-xr-x fleet fleet 609B`；LF 纯净（本机 CRLF 计数=0，scp 字节流保真） | ✓ |
| ④ 验证 | sh -n+正反探针+空载直通 | `sh -n` PASS；python3 正探针（合法 JSON）exit 0；负探针（坏 JSON）**exit=1 拦截面真拦**；repo cwd 空载直通 exit 0 零 stderr | ✓ |

## 三、勘差注记（探针形态，不影响生产语义）

空载探针首跑从 fleet 家目录直接执行 hook：`git diff --cached` 无仓库上下文时 git 退化 `--no-index` 模式报 `unknown option 'cached'`（stderr dump），guard 链 grep 空输入不命中→hook 仍 exit 0（fail-open 空载语义成立）。git 真实触发场景 cwd 必在仓库根（git 设置 GIT_DIR），不受影响——正形探针（`cd /srv/fleet/TriMetaverse && sh .git/hooks/pre-commit`）exit 0 零 stderr 实证。候办注记：hook 语义依赖仓库 cwd 上下文，直接从任意目录执行 hook 文件非生产等价探针。

## 四、红线遵守与边界

- 零碰 sg 工作树文件/index（hook 文件外无任何工作区写入；探针纯只读+脚本执行）
- sg 在役进程（3333/3334/8712）零触碰（全程 ssh 只做 hooks 目录文件面操作）
- 传输走 /tmp 中转即清（tmp cleaned 实锚）；未触 bare 仓、未触 pre-receive 面
- PS→ssh CRLF 坑前置拦截：本机源先勘 LF 纯净（CRLF=0）再 scp 字节流传输

## 五、销账申报

候办②「sg 面仓 pre-commit gate 同步」**执行毕**——同物同形（md5 三点一致）落位 sg 工作树 hooks/，验证链全绿（语法/正反探针/空载直通四道）。候 COS 刷账销项；树指针=本卷。

## 六、使用依据

- BOD 2026-10-06 裁一（账本断链 3h 教训→pre-commit JSON gate）；本机 hook 全文（609B python guard fail-open 形）
- COS 2026-10-07 13:16 窗口解锁知会（候办②认排）+13:19 收讫回执（方案无异议）
- D-23 排程：CEO 13:14 亲令例外窗 14:00-18:00；D-24 机位断言；跨管道行尾族纪律（PS→跨机三坑并档）
- 实勘读数：本卷 §二 原样（2026-10-07 14:00-14:03 +0800 窗内）
