# 共享 JSON 账本对表扫模板（JSON.parse 兜底判据·件2 残尾清尾件）· 2026-10-17

- sourceOfTruth: docs/workflow/operating-records/2026-W42/trees/coo-ledger-scan-template-20261017/coo-ledger-scan-template-20261017.md
- syncMode: static（模板判据件·一次出卷）
- lastSyncedAt: 2026-10-17T10:0x:xx+08:00（写前跑见落款·D-47 正形 A）
- 令源: COS 序列 E 件毕报件2（ledger-concurrent-write-p2 残尾·commit 1a15ad56a·「对表扫 JSON.parse 兜底判据候 COO 设扫模板」）
- 承接位: COO 排工面出件（本件）·采用面=COS 对表扫+各席共享账本读数面
- 关联纪律: 共享 JSON 账本写法纪律（load→改→dump 全程解析）/键存在性抽验≠值面验证/D-46 值面禁进打印路径

## 一、判据五条（对表扫读共享 JSON 账本一律照此）

1. **第一动作=全程解析**：读共享 JSON 账本（in-progress.json/daemon 大表/周索引等）第一动作 `json.load` 全程解析——禁正则行扫直读值面、禁字符串切片取值。
2. **parse 失败=坏笔信号即报**：`JSONDecodeError` → 输出 `[SCAN-ABORT] <path> pos=<e.pos> <e.msg>` 并**中止本轮扫描**（exit 2）——禁静默跳过、禁兜底猜读、禁「跳过坏行继续扫」（跳过=把坏笔藏进绿色读数）。
3. **解析成功≠值面正确**：值面三查照旧（键存在/值非空/值语义对表）——解析绿只是入场券。
4. **只读面纪律**：对表扫=只读操作，禁顺手写回；发现坏笔→报 COO/COS 收口，不自行修账（修账走 load→改→dump 正形+锁笔 commit）。
5. **输出投影白名单**：扫描输出只投影账本业务字段（id/status/note 时戳）——含密值面（token/凭据）禁进打印路径（D-46 正形）。

## 二、模板骨架（Python·供各席对表扫脚本嵌入）

```python
import json, sys

def scan_ledger(path: str, required_keys: tuple) -> dict:
    """共享 JSON 账本对表扫正形入口。parse 失败即中止（坏笔信号），禁静默。"""
    try:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)          # 判据1：全程解析
    except json.JSONDecodeError as e:
        print(f"[SCAN-ABORT] {path} pos={e.pos} {e.msg}")   # 判据2：即报中止
        sys.exit(2)
    missing = [k for k in required_keys if k not in data]   # 判据3：键面入场券
    if missing:
        print(f"[SCAN-ABORT] {path} 缺键 {missing}")
        sys.exit(2)
    return data        # 值面三查由调用方续做；本函数只读不写（判据4）
```

## 三、采用与清尾

- 采用面：COS 对表扫（daemon 版大表/in-progress.json 对表）自此件起照判据五条执行；各席自写扫描脚本同嵌。
- 清尾：ledger-concurrent-write-p2 件2 残尾「扫模板候 COO」**随本件出卷清尾**；残尾余 sg 面 gate 同步候 sg 值席窗带（COS 面·不在本件域）。
- 本件随 COO 下批链推平；COS 采用确认回执后件2 本机面全清。

## 四、落款

- COO 小营 2026-10-17（date 现查见 lastSyncedAt 写前跑原值）
