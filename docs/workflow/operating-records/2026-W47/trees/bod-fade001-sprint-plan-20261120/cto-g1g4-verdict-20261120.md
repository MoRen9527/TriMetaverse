# G1-G4 判据卷复验落判卷（CTO·engines 债根治链收口判定·S7/C-2 读数卷对表+G3 六探本席自跑）

- date 现查: 2026-11-20 22:1x CST（D-47）
- 落判人: CTO 小狄（G1-G4 判据复验位·G3 六探=本席自跑非转述采信）

## 落判：**G1-G4 全 PASS——engines 债根治链收口（sg TriMMC=node 18.20.8 原生运行+better-sqlite3 真持久化+零 shim 依赖）**

| 门 | 判据 | 读数（值席+本席独立复测） | 判 |
|---|---|---|---|
| G1 pull/build 链 | chown 后 pull 通+①案 build 双锚 | root 窗全谱毕（C-1 核心落定）+TriOrchKit 切 dev 2bb4d65（master 零合并零越权）→install rc0→build rc0→**md5=C3 锚 f6c77aa1 机械全等**（同基线同值·支位差零）+IMPORT_OK exports=20 | ✓ |
| G2 install/polyfill | better-sqlite3 真装+活体零触 | install 11.10.0+store.js better-sqlite3 形+**node:sqlite=0 断言双绿**+pid 1816473 零触全序不变 | ✓ |
| **G3 store 功能值面六探** | 六探值面（本席自跑） | **6/6 PASS**：P1 create-run ✓／P2 idempotency-unique-deny ✓／P3 transitions=2（FK 链+actor NOT NULL+actor CHECK 白名单**三约束沿途实证**）✓／P4 state-check-deny（BOGUS 拒）✓／P5 gate+watch baseline ✓／P6 close→reopen durable 全行读回 ✓——**约束族全 enforced=真 sqlite 引擎实证**（探针行清场退出） | ✓ |
| G4 restart/service 面 | C-2 A 形 discipline | restart rc0→pid 2196585 active→三验（healthz 200/fail-closed 401/**store 活体零崩零 sqlite 错**=better-sqlite3 载入实证） | ✓ |

## 收口判定

**engines 债根治链（② polyfill→C-1 store swap→①案 build→C-2 重启）=G1-G4 全过收口**——sg TriMMC 现势=node v18.20.8 原生+better-sqlite3 真持久化（约束族全 enforced·durability 复验）+**零 shim 依赖**（node:sqlite 时代 sg 面终结）。G3 中段两探针迭代（actor NOT NULL/CHECK 白名单双拒）=**约束族活体自证面**（试错即实证——denial 行为=引擎真义）。

## 残面如实注

①node_sqlite_shim 包=已被 S7 install 清场（零引用面终结——前记「残 node_modules 候清理」自然消解）②fade.db 旧件读写面=**G3 六探定谳闭合**（真读真写真清场全过——Nov 6 旧件=活体在用面非遗存）③jobCount=0 再录/token 轮换/mc_link 值匹配=前报开放项原样（本链外）。

## 使用依据

S7 毕报（C-1 核心面+node:sqlite=0 断言）+C-2 读数卷 c1119595b；G3 六探本席自跑（P1-P6 全过+双探针迭代约束实证）；C3 锚 md5 全等（①案 §一）；A 形 restart discipline（2196585 三验）；store.js dist 源读（import better-sqlite3 直连形·shim 依赖解除实锚）；D-46/D-47。
