#!/usr/bin/env python3
"""_fadehash.py — FADE 工具族共享双 hash（单一 canonical 实现，LG-008 联审 CTO 案）

seal-materials.py（卷封）与 run-root.py（run 根）共享本模块的 dual_sha256——
防"两套 hash 实现各自漂移"。调和记录（LG-008 2026-08-28 双席意见合成）：
CPO 产品侧坚持单一 hash 纪律 × CTO 结构裁定封卷与 root 语义相反须分文件——
独立脚本 + 共享 canonical 模块，两席关切各得其所。

双 hash 口径：raw=文件字节原样 sha256；lf=行尾归一化(\\r\\n→\\n)后 sha256——
SOFT-DRIFT 判据（联审 CTO-F6）：跨 Win/Unix 流转的行尾漂移不按材料污染处理，仅警告留痕。
"""
from __future__ import annotations

import hashlib
from pathlib import Path


def dual_sha256(p: Path) -> tuple[str, int, str]:
    """返回 (raw_sha256, bytes, lf_sha256)。"""
    data = p.read_bytes()
    raw = hashlib.sha256(data).hexdigest()
    lf = hashlib.sha256(data.replace(b"\r\n", b"\n")).hexdigest()
    return raw, len(data), lf


# 兼容别名：seal-materials 原内部函数名（既有调用方/冒烟脚本不断链）
_sha256 = dual_sha256
