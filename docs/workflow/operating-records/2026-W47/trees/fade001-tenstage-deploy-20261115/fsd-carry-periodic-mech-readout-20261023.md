# 线 3 施工读数卷·carry_periodic 入迁移器机制（CEO 19:47:33 r75·首拍提前事件驱动）

- 执行: m-duty-fsd；交付锚=TriCompany dev **22dff7c**（机制模块+清单骨架+wrapper 接线三件）
- 时序: 施工闸关键路径——机制面即开毕（23:00 前毕线内）；清单面=候线 1 卷（r72/r73 并卷 COS 清单定谳在途），卷达即填 entries（扩窗=JSON 面零代码）

## 一、机制面读数（两件）

1. **搬运机制主步**（carry_periodic.py）：白名单装载形+逐条目搬运（源寻址三路=from_dir 正形 year-W 剥周段/裸 from_week 兼容/根 glob 兜底→目的=year-W 正形 to_dir 机械复制；源缺失=合法跳过读数面不造替身）
2. **白名单扩窗框架**（carry_periodic_whitelist.json）：entries 骨架空数组+schema 注（条目形 {path_pattern 支持 {from_week}/{to_week}/{year} 令牌, mode}）——扩窗=改 JSON 面零代码；**清单内容=线 1 卷定谳填入（本批不填=禁臆测纪律）**

## 二、接线读数

- weekly_plane_shift_fade 增 `--carry-periodic-whitelist` 旗：缺省=仓内清单文件；显式 'none'=跳步；异常=stderr 记录 skip 不阻断迁移主链
- AST 过+端到端自测过（中性实例：from 树源件→白名单条目→to 正形目录搬运 1 件+空清单骨架形态双态）

## 三、护栏遵守（照令三条）

- cron 本体零改动（schedule 零触）✓；零 payload 人工触 ✓；23:50 cron 原排=第 2 拍不动（机制=事件驱动首拍可调面，非 cron 改动）✓

## 四、候件与链位

- 清单面：线 1 卷（r72/r73 并卷 COS 清单定谳）达即填 entries→机制即生效（首拍事件驱动触发面候线 3 事件令）
- 链位: 施工毕（本卷）→STE 复验绿→CTO 门禁=三闸闭环第三闸→首拍（预计 21:00-21:30）→23:50 cron 原排第 2 拍不动
- 使用依据: r75 令（线 3 施工两段面）；carry_periodic 端到端自测实录；77f03965/plan_scope carry 域对表（carry_periodic→migrate 投影一致性）
