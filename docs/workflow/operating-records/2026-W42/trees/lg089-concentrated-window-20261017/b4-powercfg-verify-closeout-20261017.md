# B 件毕报卷：powercfg /requests 补验闭环（LG-088 a 件验证链补锚）

- sourceOfTruth: 本卷（a 件旁证读数记录·验证链主卷=LG-088 勘验卷）
- syncMode: manual
- lastSyncedAt: 2026-10-17 10:22 +0800
- 执行: CEO 亲测（管理员 PS·CEO 选①通道 10:17:44 贴回读数）·BOD 判读落卷

## 读数（CEO 管理员 PS 原样）

```
SYSTEM:
[PROCESS] \Device\HarddiskVolume3\Users\jedih\AppData\Local\nvm\v22.21.1\node.exe
（DISPLAY/AWAYMODE/PERFBOOST/ACTIVELOCKSCREEN 均无）
执行:
[PROCESS] MoUsoCoreWorker.exe (USO Worker)——系统自身更新服务·非我司
```

## 判读

- **a 件生效旁证实锚**：SYSTEM 电源请求面有 node.exe（nvm v22.21.1 部署路径=我司 daemon 运行时）持有请求——即 a 件挂线的 `SetThreadExecutionState(ES_SYSTEM_REQUIRED|ES_CONTINUOUS)` 注册生效，daemon 在向电源管理器声明「系统需保持唤醒」。
- 与凌晨探针 FAIL 对表：04:0x 探针 FAIL=非 admin 权限面（powercfg /requests 需管理员）设计行为——非 a 件未生效。双读数并读=a 件全程生效。
- 与今晨断窗旁证互证：08:1x-09:18 出网断窗期间宿主未睡眠（8713 uptime 连续）——a 件 SYSTEM 请求压制深睡的实战面一致。
- DISPLAY/AWAYMODE 面无请求=a 件范围正确（只保系统不锁屏灭屏·设计如斯）。

## 结论

B 件闭环——LG-088 缓解 a 件验证链补齐第三锚（①engage OS 返回值级断言 04:06 ②uptime 实战连续 ③powercfg SYSTEM 请求面旁证）。挂账销。

## 落款

- 拍发: 2026-10-17 10:22 +0800（D-47：CEO 贴回时戳 10:17:44·落卷 date 现查对表）
