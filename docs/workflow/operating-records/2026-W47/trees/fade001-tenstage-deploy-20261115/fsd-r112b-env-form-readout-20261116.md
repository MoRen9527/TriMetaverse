# r112② env 形施工读数卷（BOD 勘正跟催·FD 主刀·免 root）

- 执行: m-duty-fsd；令面=BOD 勘正跟催（现行动面=env 形·非候 root 链）
- 交付面=TriCompany dev 对表 4a05c74（CTO B 案 env 名换笔已 pull 对表）+宿主面两件（非仓件如实注）

## 一、落位读数（三面）

| 面 | 落位 | 凭据 |
| --- | --- | --- |
| 目录面 | `/srv/fleet/.trimc-marker/` 创建（fleet:fleet drwxrwxr-x） | mkdir 实录（卷面路径=唯一凭据） |
| 注入口面 | `/home/fleet/.trimmc/duty-env` 增 `export TRICO_LOOP_MARKER_DIR=/srv/fleet/.trimc-marker/`（duty 席 env 源·免 root） | duty-env 行实录 |
| 消费面 | preflight.py:260 env-first（TRICO_LOOP_MARKER_DIR→兜底 /var/lib/trimc 语义维持）——兜底在 sg=fleet 可写双通路 ✓ | 4a05c74 B 案码面+写测实录 |

## 二、B 案 env 名对表

- TRICO_LOOP_MARKER_DIR（CTO 02:05 确照用；TRIMC_CONFIG_DIR 系 TriRMC daemon 自身消费键同名撞车·unit 注入实测分叉·撤笔 /root/trimc-config-dir.conf.withdrawn-r1122 留档）
- 我席 duty-env 注入初笔曾用旧名——**B 案到达即换名对表**（TRICO_ 前缀分域护栏同族 TRICO_PREFLIGHT_EXPECTED_HOST ✓）

## 三、面域读数（如实）

- sg marker 形=**本已通**（/var/lib/trimc=fleet 可写实测写删过）——env 形落位价值=河源面（/var/lib/trimc root 属）+duty 席 env 正形注入口
- 河源检出同步=值席已办（699a62a→4a05c74 HEAD 推进我席已 pull 对表 ✓）
- 残面=河源 duty-env/unit 面同形落位=河源 face（turnkey 包已呈转 16:4x 卷）·root 形仅 env 受阻时走（r111 governs）

## 四、使用依据

BOD 勘正跟催令（notice-112② 裁定方向 env 形·免 root）；CTO 4a05c74 B 案笔（env 名换 TRICO_LOOP_MARKER_DIR·TriRMC daemon 同名撞车撤笔实录）；duty-env 注入实录（卷面路径+行文本=唯一凭据）
