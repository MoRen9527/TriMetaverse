# 经验库（dev-ops）

## 经验总结：binding 收尾线三课（单侧复验漏洞/漏 add 家族二现/幂等比较归一）

# 经验：binding 收尾线三课（FSD 主执行席复盘）

## 单侧复验漏洞
退役类操作后只复验本仓、忘姊妹仓同步面——双仓必须双侧 tsc+全量复验。

## 漏 add 家族二现
完工 commit 前不核对应入库件清单——git status 逐件对账列为 commit 前硬动作。

## 幂等比较归一
同步工具幂等比较须归一 BOM/CRLF——PS5.1 四坑（BOM/CRLF/数组切片/null）叠加实证后改 python 实现。

（来源：knowledge/org/inbox/org-experience-fsd-20260921-binding-closeout.md）
