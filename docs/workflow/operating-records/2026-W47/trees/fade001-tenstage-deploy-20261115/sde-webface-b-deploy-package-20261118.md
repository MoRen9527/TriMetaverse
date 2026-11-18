# SDE wrapper B 形升级＋单实例部署包备制卷（七席全景节 2 前置·notice-191②/COO 形裁 384926ac2 承）

- sourceOfTruth: 本卷（节 2 直办链开工件·BOD 直办执行用·先例 146 形）
- syncMode: write-time
- 执行席: SDE 小布；令源=m-duty-cos 派令（wrapper B 形升级＋单实例部署包备制）
- 施工窗: 2026-11-18T13:00Z 起笔（date 现查原值·D-47 全程）
- 判定: **B 形正身落位（三参 argparse·py_compile+--help 双检 PASS）＋face 部署包备制毕＋现役 8791 零扰 diff 同断言——8792 零启动（直办链执行面留白·零越位）**

## §一 · B 形正身（一份多实例复用·零拷贝轮换）

- **权威正身位**：`/home/fleet/.web-faces/run-web-masked.py`（0600·3547 bytes·py_compile PASS）
- 三参形：`--port`（缺省 8791=旧形兼容）/`--cwd`（缺省 TriMetaverse=旧形兼容·非目录 fail-fast exit 2）/`--base`（缺省=脚本同目录=旧形兼容·web.log+new-token 产物落位）
- **token 截获逻辑逐字原样**：`[?&]token=([A-Za-z0-9._~-]+)` regex→0600 new-token+stdout `MASKED`+`[wrapper] launch token captured len=N`（D-46 原生·零语义改）
- 零参调用=旧形行为全同（现役 systemd unit 自有拷贝零改零扰——B 形正身仅供新 face）
- 回滚锚：现役 wrapper bak=`/home/fleet/.dsh-workspaces/r-duty-cos/.rot/run-web-masked.py.bak-webface-b-20261118T130152Z`（现役正身与 bak diff 逐字同=零扰断言 ✓）

## §二 · 单实例部署包（face=ns1-w46）

| 项 | 值 |
|---|---|
| face 名 | ns1-w46（ns1 run 承） |
| 端口 | **8792** |
| CWD | `/var/lib/trirmc/cron/runs/shift-W46-20261118T055326Z`（run 目录根·ns1 拍 13 件族在位断言 ✓） |
| BASE | `/home/fleet/.web-faces/ns1-w46/.rot/`（已预建·三件同目录：wrapper 产物 web.log+new-token 自产） |

## §三 · 部署命令面（BOD 直办执行用·节 2 直办链开工件）

```bash
# 节 2 直办链·face=ns1-w46 单实例启动（河源机·fleet 身份）
python3 /home/fleet/.web-faces/run-web-masked.py \
  --port 8792 \
  --cwd /var/lib/trirmc/cron/runs/shift-W46-20261118T055326Z \
  --base /home/fleet/.web-faces/ns1-w46/.rot
```

- 后台形（直办链按需选）：`nohup <上行> >/dev/null 2>&1 &`（wrapper 自写 .rot/web.log——外壳日志冗余可免）
- 启动后面读数三件（直办链自检用）：`ls -la BASE/`（web.log+new-token 0600 在）·`grep -c MASKED web.log`（stdout 零明文 token 断言）·`ss -tlnp | grep 8792`（监听在·127.0.0.1 形承现役）

## §四 · 护栏对表

- 现役 8791 零扰：进程 uptime 14 天在·正身 diff 逐字同·systemd unit 零触 ✓
- r1/ns1 存档零触：CWD=run 目录根只读面（dsh web 读卷面）·scores-r1/scores-ns1 域零触 ✓
- D-24 断言（河源机 iZf8ziw57ydktu77fsld9yZ 施工）·D-46 承（token 值零出现·路径形 only）✓
- 8792 零启动断言：`ss` 只见 8791——**部署=备制毕，启动=直办链执行面（零越位）** ✓
- 单笔 revert 一键族：B 形正身单文件+bak 锚一枚 ✓

## 使用依据

notice-191②；COO 形裁 384926ac2；CTO 荐 B 形（三参 argparse）；现役 wrapper 正身 66 行逐字承（token 截获面零语义改）；D-24/D-46/D-47。

—— SDE 小布（毕报=落卷+SendMessage 直达值席·卷面时戳=commit %cI）
