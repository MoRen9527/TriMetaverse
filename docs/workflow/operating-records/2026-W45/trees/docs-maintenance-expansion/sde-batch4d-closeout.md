# docs-maintenance · 批 4d 收口卷（4c SVG 退役+tricompany 指称前缀·SDE）

- sourceOfTruth: 本卷（4d 施工收口正身·两文件 diff 锚+终态全谱复扫读数）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: CTO 三裁齐发（2026-11-04T09:52:46Z·4d 增补令+4c 裁 a 采）+回裁（10:02:01Z·全谱修 5 行 6 处=采·边界面采认）

## 一 · 4d-A：tricompany.md 非链接语法指称前缀（5 行 6 处）

| 行 | 形态 | 修形 |
|---|---|---|
| L11 | prose·sourceOfTruth 行 backtick 指称 | `` `../TriCompany/` ``→`` `../../TriCompany/` `` |
| L32 | prose·冲突条款 backtick 指称 | 同上 |
| L40 | 表 cell·公司维度行 backtick 指称 | 同上 |
| L63 | 序数列表·宿主资产三层 backtick 指称（**增面**·回裁采认） | 同上 |
| L96 | prose·合同两位置（backtick 指称 ×2 处）（**增面**·回裁采认） | 同上（一行两处） |

- 修形=统一规则 backtick 前锚（`` `../TriCompany/ ``→`` `../../TriCompany/ ``）·与 4a 链接面同形同前缀（「同一机械缺陷同一修法」回裁语）。
- 计数差异注记：令文点名 3 处→全谱勘定实测 5 行 6 处（增面 L63+L96 同形态）——回裁采认在卷。
- 边界面（不动·回裁采认）：L9/L25-28/L203/L209 链接文本面（显示文本=渲染语义面·4a「链接文本不动」定谳边界）。

## 二 · 层级勘定注记（令文「三级」表述 vs exists 断言机械裁判）

- 令文原表述「docs/ 深度下单级=指 TMV/TriCompany 不存在·**三级才出仓**」；实勘：源件=docs/ **一层深**——`../../`=D:/Code/ai（**两级**出仓=D:/Code/ai/TriCompany 实存）·三级 `../../../`=D:/ 盘根（不存在）。
- **exists 断言闸拦获防落盘**（4a 同闸同获第二例）：初写三级·dry exists 三 MISS·勘定后改两级·与 4a 同文件链接面修形（`](../../TriCompany/` 两级·已 APPROVE）自洽。机械事实面·毕报显著注记防认知差。

## 三 · 4d-B：tmv-whitepaper.md 8 条 SVG 死引用行退役（8 行纯删）

- 8/8 行号+全文精确双锚断言 OK（L137/199/326/391/510/711/759/822）·fence 邻接断言 8/8 OK（+4 窗内 ```mermaid 实存）。
- **修形=行删除**·图题行/空行/mermaid fence/正文零触碰（git diff=8 deletions 0 insertions 纯删）。
- **头字节三锚**（勘定修正）：域知识「白皮书=BOM 件」表述**与实勘不符**——实测无 BOM（首 8 字节=`2d 20 73 6f 75 72 63 65`='- source'·git HEAD 同形）——防护本质=头字节恒等三锚（修前值锚/修后同值/仅 8 行删）·实跑 2d 20 73 双向恒等。

## 四 · 终态读数（全谱复扫·批 4 全线终态）

| 断言面 | 读数 | 判 |
|---|---|---|
| tricompany backtick 形残 | 0 | ✓ 归零 |
| tricompany 链接旧形残（4a 断言回归） | 0 | ✓ 不变 |
| tricompany 两级 backtick 形 | 6 | ✓ 精确 |
| 白皮书 ](mermaid/ 残 | 0 | ✓ 归零 |
| 白皮书 mermaid fence 数 | 9→9 | ✓ 恒等（修前 HEAD 基线补锚实测） |
| 白皮书行数 | 1493 元素→1485（wc 口径 1492→1484 换行） | ✓ 精确减 8（口径差注记：wc -l=换行数·split=元素数含尾空） |
| 白皮书头 3 字节 | 2d 20 73 双向恒等 | ✓ |
| linkscan 全谱 | **TMV 3·TC 41·TT 0**（修前 TMV 11） | ✓ r3 8 条退役兑现·残 TMV 3=r4 tc001 历史指针候裁面·CTO 令「修后复扫=残面 r4 3 条」精确兑现 |

- **批 4 终态判据兑现**：可修面=0·LIVE 44（TMV 3=r4 候裁面+TC 41=r5 出圈裁定面）=「LIVE 断链归零或=挂起面条数」。

## 五 · 质量门留痕（如实注记）

- prefix 层级初写三级·exists 闸拦获（§二）——闸设计价值再实证。
- Edit old_string 转义字符（\ufeff 字面形）三连匹配 MISS→Write 全量重写绕开——工具面小坑注记（中间层渲染歧义族）。
- dry 脚本内预期值手误两处（fence 预 8 实 9·行数预 824 实 1493）——非状态错误·修前基线以 git show HEAD 补锚实测为准（9/1492 换行）·预期值手误不影响施工正确性（双锚断言层全部实锚）。

## 六 · 使用依据

- CTO 三裁齐发（09:52:46Z）+回裁（10:02:01Z）·4a/4b 收口卷（施工原则先例）
- 施工脚本：sde-batch4d-fix-prefix.py+sde-batch4d-retire-svg.py（Temp·dry/apply 报告在档 sde-batch4d-prefix-report.txt/sde-batch4d-svg-report.txt）
- 复扫：sde-batch4d-rescan.py+全谱 linkscan 三跑序列（69→94→79→52→44）
