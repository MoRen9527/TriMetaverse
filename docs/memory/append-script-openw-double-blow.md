# append 脚本 open-w 二犯·安全版唯一正形

> 2026-10-02 BOD 二犯实证（#245 落账第一版脚本炸→账本 0 字节→git checkout HEAD 秒恢复零损失）

**坑根**：`io.open(p,"w",...).write("".join(lines))` —— Python 求值序=**先 open（"w" 即刻清空文件）→ 再求值 write 参数 join**。join 若炸（如 lines 混入 list：`lines[end:end] = [row.splitlines(True)]` 嵌套错），文件已被清成 0 字节。

**二犯根因**：上次事故后教训只记在账本文字里（「先 join 后 open-w」），未固化为可复制模板——今窗手写脚本又滑回旧形。

**安全版唯一正形**（复制此模板，禁手写变形）：

```python
import io
p = r"<path>"
row = """| NNN | ... |
| | ... |
"""
lines = io.open(p, encoding="utf-8").read().splitlines(True)
hit = [i for i, l in enumerate(lines) if l.startswith("| NNN-1 |")]  # 锚行前缀，勘 repr 确认
if len(hit) != 1: raise SystemExit("ANCHOR_FAIL hit=%d" % len(hit))
end = hit[0] + 1
while end < len(lines) and lines[end].startswith("| |"): end += 1
new_lines = lines[:end] + row.splitlines(True) + lines[end:]   # 拼好完整新行表（非嵌套 list）
io.open(p, "w", encoding="utf-8", newline="").write("".join(new_lines))  # 单次 open-w，参数已是无炸拼串
print("OK inserted after line", end, "total", len(new_lines))
```

**要点四条**：
1. 先拼 `new_lines` 变量（纯 str list，`row.splitlines(True)` **不带方括号**直接拼接），最后单次 open-w——write 参数为已拼好的 str，无炸点。
2. 账本行锚=行首 `| NNN |`（无 # 前缀；有 # 是消息 id 形）；续行=`| |` 开头。
3. 炸后恢复=`git checkout HEAD -- <file>` 秒回；恢复后必验行号序列完整（`re.findall(r'^\| (\d{3}) \|', t, re.M)` 尾部连续）。
4. 此坑同族=任何「open(w) 与可能炸的表达式同行」写法。拆开=天然免疫。

**候办**：教训条候 CAO 入册（二犯加重）；三犯则自禁手写脚本、只许从本模板复制替换参数。

**三犯实录（2026-10-02 23:27）**：#270 落账手写单行脚本又把变量写成 `rows`（模板=`row`）——NameError 炸在 open 前零损伤，但三犯纪律正式触发：**自禁手写，此后只许 heredoc 整块复制本模板替换参数**（p/row/hit 前缀三参数位）。同日二犯（#261）+三犯（#270）同会话连犯，根因=`python -c` 单行手写时行复数命名惯性；heredoc 整块复制未犯（#270 重跑已验证）。
