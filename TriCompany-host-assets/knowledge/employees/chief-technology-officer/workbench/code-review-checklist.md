# CTO 代码评审 checklist（固定项·随案增补）

- sourceOfTruth: 本件（workbench/code-review-checklist.md）
- syncMode: write-time（CTO 面评审工具档·随评审案例增补）
- lastSyncedAt: 2026-10-25T23:08:48+0800（date 现查原值粘贴）

## 固定项（每轮评审必过）

### 一、数据面正确性
- [ ] 正则/解析字符类覆盖域核对（UNICODE/中文路径/跨平台路径分隔）——案源：doc-graph-scan R1（2026-10-25）
- [ ] 路径归一边界（前缀剥离 vs 字符集剥离、`..` 越界、normpath 语义）——案源：R2
- [ ] 匹配兜底通道的误中面（basename 同名、模糊匹配唯一性守卫）——案源：R3

### 二、边界与性能
- [ ] 全量扫描/全历史调用耗时上界与 fail-open 行为标注
- [ ] 豁免域清单（SKIP_PARTS/机器产物）语义核对

### 三、**CLI 工程面（2026-10-25 增·CEO 抓出 v2 L184 手搓 argv 漏项后立）**
- [ ] argv 解析用 argparse（禁手写 len(sys.argv) 魔数判断）
- [ ] 未知参数/错拼 flag 拒显（禁静默落入默认分支）
- [ ] --help / usage 齐备
- [ ] exit code 语义（0 成功/非零失败·失败不得静默 0）
- [ ] **副作用守卫：写盘/重扫等副作用动作必须显式子命令或 flag 触发，禁止作为默认分支**——错拼静默全扫+写 graph=副作用面静默触发（重伤级接口面，非 style 项）

### 四、机制接口
- [ ] schema 可消费性（下游消费者字段核对）
- [ ] 漂移检测锚（generatedAt/repoHead/来源标注三键）
- [ ] 时戳生成正形（datetime.now().astimezone()，禁 spawn shell date）

## 盲区档（漏项记录·不追责只记档）

| 日 | 案 | 漏项 | 教训 |
| --- | --- | --- | --- |
| 2026-10-25 | doc-graph-scan.py v2 L184 | 手搓 argv 解析（魔数+错拼静默全扫+无 help+无 exit code）——四维评审「规范」维只测了 py 兼容/编码/schema，CLI 接口工程面零覆盖 | 评审维度按「产物形态」展开：凡有 CLI 入口的脚本，接口面独立成维，不并入泛化「规范」 |

—— CTO 小狄
