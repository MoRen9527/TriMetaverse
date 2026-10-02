# item1 改指值面规格卷·dev 侧（本机 COS 消费；回执门双环制）

- 制备: m-duty-sde（sg 值席）2026-10-02 18:1x+08；令源=COO 窗令车道 B 主链+COO 分工标注（值面写面执行席=本机 COS 确认）
- 性质: 值面规格+验证锚供给；本席零 dev 写面，全卷零敏感值（pem=自签公钥证书公料，读数只引指纹）

## 一、值面两键（channel.cmd set 区新增，现 L3-17 无 URL 键）

```
set TRILC_TRIMODEL_API_URL=https://8.155.54.79
set NODE_EXTRA_CA_CERTS=<leaf pem 本机绝对路径>
```

- 键名实锚：`TRILC_TRIMODEL_API_URL`（TriMLC src/config/env.ts:170；dev-side 卷 §三.1 同锚）
- 目标值：`https://8.155.54.79`（443 Caddy 反代正门；TRIMODEL_API_TOKEN 已在启动器 L11=鉴权头候用面，不动）
- 与 token 轮换工序 1' **同文件并批**：channel.cmd 一次编辑会话内同批落 token 三落点+本两行（禁分次编辑留中间态；具体编辑序本机 COS 定，规格锁「冷起前全落位」）

## 二、leaf pem 取料法（本机机内自取，零跨机零出机）

```
openssl s_client -connect 8.155.54.79:443 -showcerts </dev/null
```
取首个 BEGIN/END CERT 段存本机 fleet 可控配置位（路径本机 COS 定，如 `%USERPROFILE%\.config\trimodel\rhy-leaf.pem`），NODE_EXTRA_CA_CERTS 值=该绝对路径。

**正料指纹对表**（sg 侧 18:1x 同法自取验证过）：subject=issuer=`CN=trimodel-r-hy`（自签）｜SAN 必含 `IP Address:8.155.54.79`｜有效期 2026-09-26→2028-12-29。取料后 `openssl x509 -noout -subject -ext subjectAltName` 对表即验。

## 三、三处验证锚（回执门复核料——COO 双环制：COS 落位信号+本席核对，缺一门不开）

1. channel.cmd 含 `TRILC_TRIMODEL_API_URL` 行且值=`https://8.155.54.79`（findstr 计数断言，不回显整段）
2. 含 `NODE_EXTRA_CA_CERTS` 行且值指向的 pem 文件存在（Test-Path 断言）
3. pem 指纹对表：subject=`CN=trimodel-r-hy`+SAN 含 8.155.54.79

## 四、回执门时序

本机 COS 落位毕→四环回执（经 BOD 通道达本席）→本席按 §三 三锚核对→向 FSD 确认「回执门开」→FSD 工序 5' 一次冷起（承载 F-3 dist+Part B+新 token+本改指值+信任面，禁二次重启）。

## 使用依据

COO 窗令 10-02 18:0x+分工标注 SendMessage；fsd-chain-precheck-readout-20261002.md（§五 执行案 1'/5'+§三 消费方勘验）；window-readout-02-dev-side.md（§三 落点重勘+信任面关键前提）；本席 sg 侧 pem 自取实锚（18:1x，指纹对表一致）。
