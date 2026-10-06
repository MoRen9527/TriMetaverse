---
name: key-presence-vs-value-validation
description: 抽验配置「键存在/结构模式」≠值面验证——值正确性须第二方法（值解析+契约镜像对表），否则内部自洽假绿
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 142b839b-781d-4c51-98ce-ccc8d36b8ff2
  modified: 2026-09-03T12:37:14.491Z
---

核验他人数据面交付时，键存在性/结构模式抽验（键齐不齐、值有无重复模式）**不等于值面验证**（值形态契约对表、所指文件存在性、与权威源投影一致性）。2026-09-03 M0d 实证：FD 回填 sourceFiles 六键，我抽验「13/13 六键齐+dup-values 模式在」即判核过；COS 代跑第二方法（值解析+contract.paths 镜像对表）抓出三实缺陷——值缺仓库前缀（78/78）/CSO-DE 指向不存在分立件（违合并式唯一合法态投影）/frontmatter 错映射——且 dry-run rc=0 假绿并存（解析基座内部自洽）。

**Why**：生成器可「自洽地错」——键结构对而值面系统性偏离契约（解析基座偏移使自身校验全绿）；只验结构=替生成器复读了一遍它的假设。

**How to apply**：①数据面核验必含值面三查：值形态契约对表（抽 N 条逐字符）/所指文件 resolve 实测/与权威源（contract.paths 类）投影逐键对表；②接受协作者的第二方法复核且欢迎矛盾证据（COS 代跑抓错=分权红利，勿防御）；③「内部自洽+门全绿」并存矛盾时优先怀疑解析基座，不是巧合。关联 [[manifest-identity-verification]] [[verification-style-confirmed]] [[key-presence-vs-value-validation]]。
