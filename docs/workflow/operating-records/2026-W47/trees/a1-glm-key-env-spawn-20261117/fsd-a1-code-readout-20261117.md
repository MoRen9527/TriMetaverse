# a1 施工毕报·TriModel 进程内解卡→spawn 3334 带 GLM env（BOD 裁124 续·FD 主刀）

- 执行: m-duty-fsd；正身=a1 施工派工令（值席径裁·BOD 裁124 续）+CTO 六判据门禁一审绿 PASS
- 交付锚: TriModel dev **3efc4df**（3efc4df6105156dd4015d712b50723db2ce54109·单笔 commit revert 一键形·已 push sg bare c1381bc..3efc4df）
- 回滚锚: pre-a1 态=sg bare c1381bc（revert 一键形前置声明 ✓）；河源部署面候窗（③判据窗序·本卷零触河源）
- 状态: **READY_FOR_REVIEW**（候 CTO 完工门禁二审）

## 一、实现读数（三件面）

| 面 | 落位 | 读数 |
| --- | --- | --- |
| ①解卡面 | src/proxy-spawn.ts decryptGlmEntry | card provider_entries 双 GLM 条目（e-glm-anthropic/e-glm-flash-anthropic）→key-encryptor decrypt（key-source.ts:53 同形）——**源面勘正**：活源=trimmc-card.json 非 keys.enc（keys.enc 已退役改名 .migrated·readSecureKeys 恒 null，方案卷 §2.1 设计期近似表述随卷勘正）；缺席/坏卡/解密败=undefined 零 throw |
| ②组装面 | buildGlmChildEnv（纯函数） | 主缺席→null（不 spawn）；档缺席→单键形降级（keyCount=1）；base env 保全+双 GLM 键补丁——读数面计数形（keyCount）零值面 |
| ③spawn 面 | spawnProxyWithKeys | 3333 listen 后挂钩（server.ts 仅 import+调用·机制正身独立模块）；spawn 3334 子进程 env 链（stdio inherit·detached false·exit 读数）；启动形双态解析（dist .js 直启主形/src .ts+--import tsx 备形/俱缺 fail-safe 不 spawn） |

## 二、判据对表（六判据·完工门禁二审对表面）

| 判据 | 实装面 |
| --- | --- |
| ①解卡最小化 | decryptEntry 只被调双 GLM 条目 id（白盒实证调用域）·e-deepseek 等其余条目零触 |
| ②明文生命周期 | 解密→父进程内存→子 env 链·零落盘零日志零读数卷（console 面仅 keyCount 计数形·D-46 全程） |
| ③3334 spawn 窗序 | 代码面就绪；**窗序动作=R-HY 部署窗**（stop 旧 3334→重启 3333 spawn 子进程→healthz+路由探针·照 SDE 勘定谳窗序·本卷零触河源） |
| ④零新增明文面 | post-a1 扫三面：src 零明文字面量（sk-/gsk_ 长串 grep 零命中）+console 面零值插值+白盒 at-rest 断言（卡原文零明文） |
| ⑤回滚锚 | sg bare pre-hash c1381bc+单笔 commit revert 一键形；R-HY 回滚=检出 c1381bc+旧 3334 独立启动形还原（一步） |
| ⑥隔离纪律 | TriModel 仓 dev 单笔·零触主链 daemon/现役 loop 链/河源面（部署窗动作候令） |

## 三、白盒族与门禁读数

- **白盒 11/11 绿**（test/proxy-spawn.test.ts）：双条目 mock 形×2（双键全形+未知条目零触调用域）/零明文×3（patch 面最小性·at-rest 无明文真链 roundtrip·读数面结构=childEnv+keyCount 两键）/fail-safe×5（缺主 null·缺档单键·空串视同缺席·坏卡 undefined·无卡零回落）/启动形解析×1
- **tsc --noEmit 绿**（npm run check）
- **套件 328/305/6/17**：6 fail=stash 双跑实证**预存 sg 环境面**（build:verify 链+ui-boot/ui-boot-connection/ui-e11/ui-fourplane/ui.e2e.gate 五 UI E2E playwright 面·无改动基线同款复现）——本改动零新增失败（Δ=+11 全绿）
- **push 面**: sg bare dev c1381bc..3efc4df ✓

## 四、残面与候窗面

1. **R-HY 部署窗**（③窗序·候令）：河源 pull 对齐→旧 3334 独立进程 stop→3333 重启（spawn 子进程自启）→3334 healthz+glm-anthropic 路由活体探针——照 SDE 勘定谳窗序·值席/BOD SSH R 面通道
2. **env 键名面定谳**：GLM_API_KEY（主·anthropic-proxy apiKeyEnv 现役消费 ✓）；GLM_FLASH_API_KEY（档）=实装单键降级形——R-HY card 双条目实读=部署窗核对项（方案 §五.2 候定面保持）
3. sg 面零 spawn 实弹（解卡/spawn 动作面=R-HY 生产窗·本卷=代码面+白盒面毕）

## 五、使用依据

a1 施工派工令（值席径裁·BOD 裁124 续）；CTO 六判据门禁一审绿 PASS；fsd-a1-design-20261117.md（§八 编码期勘正随卷）；TriModel 3efc4df diff/c1381bc 基线；key-source.ts 活源裁定；D-46/D-24
