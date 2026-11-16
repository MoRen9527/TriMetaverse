# SDE 河源 claude 卸载毕报（CEO 20:39 直令 governs·notice-167 ①款）

- sourceOfTruth: 本卷（河源 claude 卸载毕报正身·承装机毕报 sde-rhy-claude-install-readout-20261116.md）
- syncMode: write-time
- 施工席: SDE 小布；令源=COS 卸载令分诊（CEO 20:39 直令「TriRMC 上有 dsh，装 claude 装机干嘛……卸载下」）
- 执行窗: 2026-11-16T12:42:19Z（date 现查锚）
- 判定: **卸载毕·三步全清·零命中探针全绿（照装机前勘形）·bashrc 回撤断言零残留**

## §一 · 卸载三步实录

| 步 | 操作 | 读数 |
|---|---|---|
| ① npm uninstall -g @anthropic-ai/claude-code | removed 2 packages in 980ms | ✓ |
| ② 残留清 | bin/claude 清 ✓+@anthropic-ai 空父目录 rmdir 补清毕（uninstall 空目录残留微勘补清） | ✓ |
| ③ bashrc PATH 行回撤 | sed 删装机追加行·npm-global 计数=0 | ✓ |

## §二 · 零命中探针（照装机前勘形·全绿）

- `which claude`（bash -lc 形）=零命中 ✓
- 常见位（~/.local/bin/claude+~/.npm-global/bin/claude+/usr/local/bin/claude）=零命中 ✓
- `find /home/fleet -maxdepth 4 -name claude -type f`=零输出 ✓
- **装机前勘形逐字对表**（装机令前置勘同法同空）——回撤至装前态断言成立

## §三 · 装卸对称面注记

- 装机面（2.1.325）→卸载毕=河源面 claude CLI 回到装前态（零命中）——**S3 实弹席环境面前提回归缺位态**（§五 降级面三形候裁维持——spawn 形裁面候 CTO/BOD 重勘）
- npm prefix 配置面（~/.npm-global set 形）维持零动（prefix 配置=装机前置设置非 claude 本体·回撤面=零 claude 残留判据下 prefix 配置无害留置·如实注）
- dsh 面零触（CEO 令 dsh 语境知悉——本席零触 dsh 面）

## 使用依据

CEO 20:39 直令（notice-167 ①款）；装机毕报（对称面基线）；卸载三步输出实录=12:42:19Z 现采实锚。

—— SDE 小布（毕报=值席 COS 主送→BOD 呈 CEO·卷面时戳=commit %cI）
