# B 件·R-HY 测试环境施工·SDE 执行读数卷

- 执行: m-sde（SDE 小布）；方案真源=CTO `cto-rhy-test-env-isolation-plan-20261003.md`（3532a1c5+3d351bc2 勘正版）；验卷=STE `ste-b-plan-verification-readout-20261003.md`（41d42fe1）
- 时点: 读数现采 2026-10-03 15:00-15:42+08（07:0x-07:42Z，date 现查锚）
- 六步全毕 ✅

## 一、六步执行读数

| 步 | 内容 | 读数 | 判定 |
| --- | --- | --- | --- |
| 0 | 预检（上窗毕） | npmjs 通/磁盘/内存/服务基线锚 | ✅ |
| 1 | 本地 clone（CTO 裁② 8de8fe7 基） | clone 顶=8de8fe7ef211ab7adb1e5b6ed3e78f34124ddcf0 断言过；dubious ownership 三层逐一 fleet safe.directory 修复（先例同形） | ✅ |
| 2 | npm install（fleet 身份） | 收尾正常（audit 提示级）；node_modules 建立；**`@trimetaverse/tricode -> ../../../TriCode` symlink 在位+resolve=`/srv/fleet/TriCode/dist/index.js`**（file: 依赖复用既有 clone 零重装，CTO 风险表候补条款零触发） | ✅ |
| 3 | 类型门 | `npm run check`（tsc -p tsconfig.json --noEmit）**EXIT=0 零错误**（timeout 420s 保护未触发） | ✅ |
| 4 | 样本冒烟（验收主锚） | 三文件串行（--test-concurrency=1）：card-path/apply-strategy/anthropic-proxy → **tests 31 / pass 31 / fail 0 / EXIT=0 / 4.5s** | ✅ |
| 5 | 清场 | 测试进程 4.5s 自然退出零残留（ps 断言空）；目录保留（默认候 COO 裁）；tmux 零会话产生（全程 SSH 直跑） | ✅ |

## 二、硬边界五条逐条自查（步 5 只读断言）

1. **目录界**：/srv/fleet/trimodel-test 在位，全部操作限该目录 ✅
2. **服务零自启**：systemd 零 trimodel-test 单元 ✅
3. **端口 3433 系**：ss 零监听（测试纯逻辑零端口面）✅
4. **生产面零触**：trimodel MainPID=1669514+ActiveEnterTimestamp=2026-09-29 02:59:13 CST（**连续基线锚零重启**）；生产 clone porcelain 唯一 untracked=`?? dist.bak-pre-rmc-20260928T185606Z/`（**09-28 遗留备份目录，非本轮产生非本轮触碰**）✅
5. **GLM 稳态零真 key**：测试目录零 .env；三样本均纯逻辑/mock 形态（anthropic-proxy=14 mock）；零真网外呼设计 ✅

## 三、验收锚对照（方案卷 §三）

- 主锚（步 4 exit 0+读数入卷）：✅ 31/31 EXIT 0（本卷 §一）
- 辅锚（类型门过+install 完整+tricode resolve 在位）：✅ 三件全过
- 隔离断言（硬边界五条+生产服务连续）：✅ §二；STE 独立复验候派（四环照旧）

## 四、施工插曲（如实录）

- 依赖面 grep 零命中假阴性一例：初查 node_modules 用 `@tricompany` scope 名→零命中；实锚依赖名=`@trimetaverse/tricode`（scope 名记错非链接缺失）——resolve 探针纠正，教训=依赖断言以 package.json 实锚为准不凭记忆 scope 名。
- import 探针打 dist/src/index.js 不可行（dist gitignored 未构建，预期内）；改用 STE 验卷观察 3 正形=resolve 依赖面探针（require.resolve 一行，RESOLVE-OK 实锚）。

## 五、候办与移交

- STE 独立复验候派（毕报四环）
- 目录 /srv/fleet/trimodel-test 保留（方案卷默认=今后日常测试位雏形；清理/保留候 COO 裁）
- 日常测试 SOP（触发/读数归档/清场节奏）候 COO 组单另定（方案卷 §五，本卷不越界）

## 六、使用依据

- CTO 方案卷 3532a1c5（+3d351bc2 步 1 基线勘正=8de8fe7 本地 clone）+STE 验卷 41d42fe1
- 纪律：D-04 时刻现查/硬边界五条/测试命令显式 cd 前缀/fleet 身份施工/零生产触碰
- 活体探针：R-HY ssh 只读+fleet 身份施工（npm/tsc/node test）；生产面只读 systemctl/git status
