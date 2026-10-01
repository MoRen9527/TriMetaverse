# LG-056 A1 前置断言脚本·预置卷（batch-07 件4）

- 脚本位: /home/fleet/bin/lg056_a1_assert.py（sha256 前 16= 前 16 位）
- **落位偏差如实注**: charter 令落 /srv/fleet/bin 系——实勘 root:root 755 fleet 不可写，改落 /home/fleet/bin/（值席脚本族既有先例位），候 BOD root 迁位或授权
- 判据面: weekly-plane-shift-local-align-sop.md（LG-056）＋charter 四判据（fetch 不推/冲突即停/README 指针核/周 index 现役指针核）
- 只读断言面: 仅 git fetch（ref 级）+文件读；零 merge 零 push 零仓库写

## 干跑读数（1001 06:5x+08，--expect-week 2026-W40 基线态）

- 第一轮 3/5——暴露脚本两缺陷（未尾化名/周名格式不配对）自纠；第二轮 **5/5 PASS exit=0**：
  1. PASS ①对齐态 behind=0 ahead=0
  2. PASS ②新周平面三件齐
  3. PASS ③shift 审计 from=W39 to=W40 status=pass（周名对表）
  4. PASS ④index latestActiveWeek=true
  5. PASS ⑤README 无陈旧字面指针
- 退出码语义: 0=全 PASS／1=有 FAIL（含冲突即停态断言，只报不修）／2=参数错

## 周日（10-04）触发方式

- 候 BOD 令后值席执行: `python3 /home/fleet/bin/lg056_a1_assert.py --expect-week 2026-W41`
- 判定语义: 迁移本体（R-HY 23:00）+对齐 job（TriMLC 23:10）自然完成后，W41 面五断言全 PASS=自然终验达标；任一 FAIL=只报不修（冲突即停纪律），候人工
- 边界遵守: 不挂自动 job（charter 边界）；只读断言面

## 脚本全文（防丢嵌入，）

```python
```
