# SDE 收口卷 · P2 store 形迁移落位（C 形一次·条件四照裁）· 2026-10-17

- sourceOfTruth: docs/workflow/operating-records/2026-W42/trees/lg087-dsh-sega-20261016/reports/sde-p2-store-migration-closeout-20261017.md
- syncMode: static（施工收口卷·store 落位毕）
- lastSyncedAt: 2026-10-17 13:34:51+08:00（date 现查原值·D-47 正形）
- 执行席: SDE 小布（m-sde）·charter-2026-W42-006 P2（CTO 66ab801bd 裁 store 形 C 形迁移）
- 施工位: 河源 R-HY ~/.dsh/.credentials.yaml（13 席生产 store·单文件统一载入位）

## 迁移实录（D-46 值面族全程仪式）

| 步 | 动作 | 读数 | 判 |
| --- | --- | --- | --- |
| 1 | 在案记录查（读含密文件第一动作） | ~/.dsh/.credentials.yaml 161B=段A 探针 boot 自动建空骨架（version:1+refs:{}·非手工施工件）·~/.dsh/.env 不存在（洁净无遮蔽） | ✓ |
| 2 | key 流灌（本机文件流直灌远端 /dev/shm 中转·600） | 35B 双端对表·key 零进命令行零进 transcript | ✓ |
| 3 | 直编 store（yaml load→改 refs→dump 600 保持·os.replace 原子） | STORE_WRITE_OK：refs=[DEEPSEEK_API_KEY]·值长 35·权限 600·属主 fleet·223B | ✓ |
| 4 | 中转件处置 | /dev/shm/key-segb.stdin shred -u | ✓ |
| 5 | 值面核验形 | 只报键名+长度·值全程零回显（结构面脱敏探） | ✓ |

## 条件四状态对表（CTO 裁示逐条）

1. **迁移时点=13 席 web 形运行前·600 fleet 单文件**——✓ 本窗内落位（B 系未开跑）
2. **env 清除是迁移本体**——store 已接管；13 席 web 形 boot 形**不带 env 注入**（B1 接位施工时落地·boot 命令设计注记入 B1 卷）·探针床 deepseek.env（观测载体探针级承载）**退役时点并 B16 入账**（挂账候 B 系到序）
3. **D-46 含密值面族纪律**——✓ 本迁移全程照守（在案查询+零回显+变量读入+脱敏前置取段层）
4. **强隔离不可达如实接受**——✓ 已裁接受（13 席同 key 账户级共享）

## 机制面注记（勘验沉淀）

- 四级 lookup：launch env → stored file → project .env → harness-home .env——**launch env 最优先**：13 席 boot 只要 env 干净 store 即接管（现 ~/.dsh 无 .env·boot 形不注入=双净）
- 轮换语义：rotated stored key 下请求即生效零重启（轮换三折族成本归零实锚）
- 空骨架文件定性：base composition 默认载入 dsh-credentials-local·boot 即 auto-create——非段A 手工件

## 使用依据

- CTO 裁示卷 66ab801bd（P2 store 形条件四）
- SDE P2 勘验卷 sde-p2-credentials-survey-20261017.md（9883450b5·机制面）
- dsh-credentials-local README（直编正形+lookup 序）

落款=SDE 小布 2026-10-17 13:34:51 +0800（date 现查原值·发毕对表）
