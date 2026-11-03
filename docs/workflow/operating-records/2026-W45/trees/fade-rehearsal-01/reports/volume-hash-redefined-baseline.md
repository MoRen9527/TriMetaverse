# ⑤卷级聚合 hash 口径勘定件（勘窗件⑤·两席对表毕·CAO 勘定落笔）

- sourceOfTruth: 本件（勘窗产出证据卷·勘定候 BOD 裁确认·如否随翻）
- syncMode: rehearsal-fixture
- lastSyncedAt: 2026-11-03T15:00:06Z（date -u 现查原值）

## 佚失定谳（两席对表毕·一致）

- **冻结原命令佚失成立**：CAO 面（施工席·compaction 丢原命令行）+COS 面（回捞通道①：全档 transcript 07483de6 命中 41 处全为信面转引·certutil/Get-FileHash/git hash-object/hashlib 补搜零获·树工件无命令串留痕）+COS 复算通道② 250+变体全不中（Merkle canonical 三排序基/_fadehash lf 面/MANIFEST 表序/git quotepath 形/git ls-tree 面/Git Bash 六形/PowerShell 五形/编码变体）——考古旁证=run-registry L32 注记系 6ad119aff 冻结施工同窗原笔（非事后补注·git show 逐字一致）。
- **两席交叉互证**：变体 A（hash-only LF·`c02d2f91`）与变体 C/D（content concat·`28042683`）两席独立复算精确一致——方法面无分歧·纯粹原形态未及。
- **内容面无争议**：单件五读数两席独立现算集合精确一致（f57e6fd8/92fc4bd3/b8c98f0f/a0ef5f5c/71043255·raw=LF 全等）——输入面排除·分歧面纯在聚合算式。

## 口径重定义勘定（采 COS 建议 a）

- **新口径=run-root.py Merkle canonical**（`scripts/fade/run-root.py` 正身·LG-008 联审 CTO 案工具族）：按 path 排序·逐件 `path\0raw_sha256\0lf_sha256` 串接后 sha256（canonical=_fadehash.dual_sha256 同源·与 FADE-006 配套工具族一脉）——**有现役工具正身·防再悬空**（COS 建议 a 采认理由）。
- **新卷级基线=`ee88ad34aa4d0ce8fda71592dde42bfda3bc1699fab851cd9a4b0b2a46d54794`**（本席 22:5x 复算·五件 EQ 全等·单件 raw 值逐字对表在案读数=算法输入实锚；中文名件路径段=Path Unicode 形态 UTF-8 编码参与·stdout 显示受控台编码限制不影响计算面）。
- 复现命令（临时脚本形态转正存卷）：

```python
import sys, hashlib
sys.path.insert(0, 'scripts/fade')
from _fadehash import dual_sha256
from pathlib import Path
root = Path('.').resolve()
vol = root / 'docs/workflow/operating-records/2026-W45/trees/fade-rehearsal-01/raw-materials-snapshot'
files = sorted((p for p in vol.rglob('*') if p.is_file()), key=lambda x: str(x))
basis = []
for p in files:
    raw, size, lf = dual_sha256(p)
    rel = str(p.resolve().relative_to(root)).replace(chr(92), '/')
    basis.append((rel, raw, lf))
canon = ''.join(f'{r}\x00{ra}\x00{lf}' for r, ra, lf in basis)
print(hashlib.sha256(canon.encode('utf-8')).hexdigest())
# -> ee88ad34aa4d0ce8fda71592dde42bfda3bc1699fab851cd9a4b0b2a46d54794
```

- run-registry ⑤行勘注随本件落（07483de6=原命令佚失值留档·ee88ad34=现行口径基线）。

## 首验发现（与 T6 缺位同族）

- **卷级聚合无工具实现**=首验发现：_fadehash/run-root 工具族均无「目录级聚合」直算入口（run-root.py 要 tree-op.json/reports 结构·不适用于纯快照卷）——目录级聚合是工具族空缺点，候 CTO 面排（与 T6 node-report-check 缺位同族并档）。

## T6 追认联动读数（⑨卷追认通道条件达成）

- CTO 令一④毕报（经 COS 22:57 转达）：node-report-check 补机跑双门 **6/6 RC=0**（015bab659+aeefc6cee）——⑨卷预置追认条款「补机跑 exit 0 双门后 T6 追认 7/7·总分追认 99.5」**条件达成**：T6=7/7（COS 裁值采认·CAO 保守裁 6/7 条件解除）·**总分追认=99.5/100**（verdict APPROVED 不翻·追认只修读数）。

## 销项

勘窗件⑤毕——本卷+run-registry 勘注落卷即勘定件·候 BOD 裁确认（随令一毕报呈报）。令一四件半**全毕**。
