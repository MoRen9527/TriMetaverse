# batch 偏移错位家族（修改运行中 .cmd/.bat 启动器）

> 2026-11-17 LG-099 子项A 部署段首案实锚（cos-lg099-deploy-readout-20261117.md §五·台账 713·D 系窗正形化候选）

**根因机理**：cmd.exe batch 逐行按**字节偏移**读文件，不重扫。修改一个正在被 wrapper cmd 挂在 node 行（阻塞等待 daemon）的启动器后，daemon 死→wrapper 从**旧偏移**续读新文件=读到错位字节——跳过中间所有 set 行（env 不更新）直接撞上 node 行→拉起「env 旧值」daemon。

**本案时序**（三重实证锚）：channel.cmd 22:04:26 Edit（+1048B）→22:04:5x shutdown 旧 daemon 29540→老 wrapper 28588（CREATED=11-12·挂 L46 偏移五天）错位续读→22:05:07 起 node 24516（env=11-12 版旧 ALLOWLIST）→我 22:05:0x schtasks /run 的新 node EADDRINUSE 崩退（channel.log L56636 实锚）→8713 被旧 env 体占着→job 铸 403。

**识别信号**：①改完配置重启后新配置不生效（403/旧值面）②daemon CREATED 时点与 schtasks /run 时点不符或父进程是「老 wrapper」③channel.log 出现两次 ready/EADDRINUSE④PATCH 旧条目 200 而新条目 403=env 半旧实锚。

**正形**：启动器修改必须**三清后进行**——①POST /shutdown 优雅停 daemon（禁裸杀）②**杀干净所有挂在该 batch 上的 wrapper cmd**（查法=CIM Win32_Process 按 CommandLine/ParentProcessId 追 daemon 父链·wrapper CREATED 与 daemon 起点不符=错位体）③port FREE 验+TriMLC node 残留清点——然后才 Edit/追加配置→schtasks /run 冷启→**值面探针验证**（完工判据=新值面生效实证·如 job 铸 201/新条目过门——healthz 绿≠env 生效）。

**对照实验法**（勘因利器）：用 node 同链读 env（`node -e "console.log(process.env.KEY.length)"` 挂同 set 行测试 cmd）——cmd 解析完好+node 读到新值+daemon 实际旧值三者矛盾=错位体实锤。

**关联**：trimlc-daemon-restart-discipline（重启正形链）为父条目——本条=其「修改配置面」前置补充：先例链（Disable watchdog→shutdown→port FREE→schtasks 冷启）未覆盖 wrapper cmd 层·本条补第三清。
