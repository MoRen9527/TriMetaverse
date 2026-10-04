# STE 上午窗令两件读数卷（08:0x 令·10-04）

- sourceOfTruth: 本件（STE 两件读数正身；承接 BOD 上午窗令 08:0x）
- syncMode: final
- lastSyncedAt: 2026-10-04T00:1xZ（date 现查=2026-10-04 08:1x+08）
- 执行席: STE 小柯（m-duty-ste）

## 件① 白名单反例 403 覆盖核对即闭 ✓（CTO 勘正③核实）

- 核对对象：TriRLC `test/server/cron-mcp-entry-guard.test.ts`（HEAD=2afffe1）
- **g1/g2/g3 三例在库实锚**（逐字对表）：
  - g1（:230）POST 创建×白名单外 command→**403 全形状钉死**（拦在 addJob 前，引擎零触达）
  - g2（:240）PATCH×白名单外 command×不存在 id→**403**（≠not_found=拦截位在 updateJob 前死证）
  - g3（:252）PATCH 对照组×不携带 command×同 id→**404**（证明 403 来自 command 门而非 PATCH 整体封禁）
- 签名跑：套件 **18/18 EXIT=0**（g1/g2/g3 ok 实锚）——**CTO 勘正③核实成立，403 覆盖在库，零排测即闭** ✓

## 件② LG-034/035 波⑤清尾·策略删除复活回头测段 ✓

- 对象：TriModel HEAD=161d0ca（零新笔，修测面跨仓独立）
- 硬核定向（E12 十案+E10 W3，带 env+chromium 沙箱）：**11/11 EXIT=0**（C1 硬核删除→保存→真 reload→不复活+边界案 C8/C9/C10a/b 全含）
- 全量门四项：**313/296/0/17 EXIT=0**——与 batch-13 件①确证基线逐位零漂移
- 判：波⑤线批B 修测面车道并行下维持全绿，清尾段闭 ✓

## 边界遵守

零改码零排测 ✓；零敏感值 ✓；沙箱卡+随机端口、生产零触碰 ✓。

## 使用依据

BOD 上午窗令 08:0x 两件；CTO 勘正③；batch-13 件①确证卷（基线）；TriRLC 2afffe1/TriModel 161d0ca 现势。实测留痕 /tmp/amf{1,2}-*.log。
