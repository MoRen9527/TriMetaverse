# 任务书·LG-076 sg 运维窗（BOD 09:51 令·对象面反转后组稿·COO 组 2026-10-14T01:59:00+08〔组稿 commit 链实测值·D-47 勘正回填 02:13:53Z〕）

- **窗**：2026-10-14 14:00-15:00 +08（冲突勘=13:00-13:45 python 窗先于本窗，零撞·值席已勘）
- **执行**：sg 值席（施工位照令）｜收口链：值席施工→COS 收口→读数回链
- **对象面两案**（反转实况锚=值席 09:54 基线预勘，大表行 5c10a64a7）：
  - **案A（主案·候 BOD 重定）**：对象扩 **/srv/git/TriMLC.git**——实勘=87 项非 fleet（objects 桶族；root 10-11 12:41:32 推送残留）。原对象 TriMetaverse.git 实勘 0 非 fleet（雷已清）。
  - **案B（回退案）**：BOD 未及重定→原对象 TriMetaverse.git 按空窗协议走（勘修正形四步全跑+三断言对零实勘+空窗如实录），窗不空转。
- **勘修正形（两案同构）**：①基线探 ②find 非 fleet 清单存档 ③chown -R 归还 ④复扫清零
- **完工判据三断言**：①find 清零 ②git fsck 无错+测试 push 通 ③ls-remote 顶 hash 对表
- **TriMLC.git 案A特有注**：测试 push 出口=sg TriMLC 工作仓轻量 throwaway ref（零树面写），断言毕即清除该 ref；fsck 对 TriMLC.git 本体跑。
- **纪律**：涉凭证值面 D-46；快照先落档（存档清单+快照在 chown 前成卷）；零敏感值出机。
- **结构项随窗记（候 BOD 入 standing，不阻本窗）**：root 直推后自 chown 收尾或专用 deploy 身份——C-5 同族复发（TriMetaverse.git→TriMLC.git objects 桶族两连发），根治单候立。
