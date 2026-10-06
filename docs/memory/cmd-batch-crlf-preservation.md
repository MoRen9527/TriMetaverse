# cmd 批文件程序化写入必保 CRLF+实跑探针

- 事实（2026-10-02 00:2x M2 落位件）：channel.cmd 程序化写入（`[IO.File]::WriteAllText`+`-join "`n"`）行尾形态漂移，冷起时 cmd 解析 LF-only set 区**静默失效**→TRILC_PORT 未生效→daemon 绑默认 8711→EADDRINUSE 崩；COS 还原 CRLF 处置毕，内容零损。静默失效=最毒形态：set 行不报错、不崩溃，只在下次冷起爆。
- **我的三重盲区（自勘）**：①快照实测 crlf_present=False 后，未对「cmd 批文件 LF-only」这一反常形态追源——Windows batch 惯例 CRLF，且若真 LF-only 则 24h 前那次冷起怎么活的？矛盾信号被我放过；②验证只断言「写入前后一致」（内容行/token sha8/行数/非 ASCII 数），**行尾维度缺席**+未实跑；③回执「LF-only 保真」把「与快照一致」当「原生态保真」——一致性≠正确性。
- **归因留痕（不翻案不硬收）**：我写前快照（00:11，在 COS 00:02 token 落位写入之后）实测文件已无 CRLF——漂移引入时点存在先于我写入的可能性（COS 00:02 写入环节或更早）；BOD 转知归因「你原子写后漂为 LF」与我写前实测有张力。漂移时点候勘；但**教训不依赖归因**：形态守卫在我侧永远该做。
- 正形（后续程序化改 cmd/bat 铁律）：
  1. 写前探测行尾形态（CRLF 出现次数），写入保持原形态（CRLF 文件插入行用 `` `r`n ``），写后断言 CR 字节数==写前 CR 数+新增行数×1；
  2. 反常形态必追源：与平台惯例/活体行为（uptime 证明旧冷起成功）矛盾即停，不带着矛盾落笔；
  3. 验证须含「cmd 实跑 set 生效」值面探针——**安全形态=临时探针 cmd（拷 set 区剥启动行）`call` 后 `echo %KEY%` 断言；禁直接 call 生产启动器（会真启 daemon）**；端口生效终验=冷起后 healthz 断言 8713 在听。
- BOD 已入册教训条（BOD 侧）：cmd 批文件程序化写入必保 CRLF+验证须含 cmd 实跑 set 生效值面探针（2026-10-02 00:5x 转知）。
- 关联候办：R-HY 401 pull_denied 件（冷起后 daemon 拉取已到达 HTTP 层=NODE_EXTRA_CA_CERTS 信任面 TLS 链路已通，但 R-HY token 门未放行）候明晚窗排程，SDE 候令（BOD 00:5x）。
