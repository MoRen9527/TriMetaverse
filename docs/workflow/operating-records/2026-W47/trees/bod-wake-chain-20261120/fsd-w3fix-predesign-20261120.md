# FSD W3-WAKE 修复窗预勘卷（waitReply 永挂 bug·零施工候裁面·三件草案）

- sourceOfTruth: 本卷（trees/bod-wake-chain-20261120/·W3-WAKE 修复预勘正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 席位: FSD 小全（m-fsd·bug 本席自产——首暴实锚采认：settled 共享闭包标志系 W3-b 本席手笔）
- 落款: date 现查见卷尾（D-47 写前跑）
- 法源链: COS 预勘令（台账 736·零施工候裁面·并行不空等）+sde 卷 sde-w3d2-deploy-probe-20261120.md §三 码面实锚
- 定性自领: 本 bug=本席 W3-b 施工缺陷（非 sde 非探针面）——sde 实锚与码面逐字吻合采认

## §〇 · bug 机理自领确认（码面复勘）

`defaultConnectSocket`（seat-wake-wiring.ts）单一 `settled` 闭包标志被两语义复用：
1. **connect settle 面**（意图：resolve/reject 竞争 guard）——`settle()` 置 `settled=true`；
2. **waitReply guard 面**（意图：防重复 resolve）——`replyResolve = (v) => { if (!settled) {...res(v)} }`。

时序：connect 先 settle→settled=true→waitReply 随后设置 replyResolve→四路触发（data/close/error/timeout）经 `!settled` guard 恒 false→**res 永不调**→`await conn.waitReply(2000)` 永挂→wakeAction 永挂→HTTP res 永不写→客户端 120s exit 143。timeout 定时器也走同一 replyResolve 槽——同闸死。

**白盒不可见机理**：33/33 全走 `deps.connectSocket` mock 注入（W3-a §四.4「真管道写案不入白盒」边界遵行面）——`defaultConnectSocket` 真值连接器**零测试覆盖**。教训自领=mock 掩盖家族新变体：mock 注入边界正确 isolates 了 IO，但也把「真值连接器内部状态机」整体排除在门禁外——**真值组件自身需独立内存对拍覆盖**（见 §二）。

## §一 · 修复设计草案①——settled 标志拆分

两 guard 分立+waitReply 零共享标志：

```typescript
export const defaultConnectSocket: SocketConnector = (socketPath: string) =>
  new Promise<SocketConn>((resolve, reject) => {
    const sock = net.connect(socketPath);
    const pending: Buffer[] = [];
    let connected = false;            // guard ①：connect settle 竞争（resolve vs reject）·唯一职责
    let replyResolve: ((v: string | null) => void) | null = null;

    sock.on('connect', () => {
      if (connected) return;
      connected = true;
      resolve({
        write: (data: string) => sock.write(data),
        waitReply: (ms: number) =>
          new Promise<string | null>((res) => {
            // guard ②：waitReply 局部 done——零共享 settled（修的是本 bug）
            let done = false;
            const finish = (v: string | null) => {
              if (done) return;
              done = true;
              clearTimeout(timer);
              res(v);
            };
            const timer = setTimeout(() => finish(pendingText()), ms);
            timer.unref?.();
            replyResolve = finish;
          }),
        destroy: () => sock.destroy(),
      });
    });
    sock.on('data', (chunk: Buffer) => {
      pending.push(chunk);
      replyResolve?.(pendingText());            // 无 settled 闸（本 bug 位）
    });
    sock.on('close', () => replyResolve?.(pendingText() || null));  // 无 settled 闸
    sock.on('error', (err: Error) => {
      replyResolve?.(null);
      if (!connected) { connected = true; reject(err); }             // guard ① 独占
    });

    function pendingText() { return Buffer.concat(pending).toString('utf8'); }
  });
```

形定要点：
- `connected`=connect settle 竞争唯一职责（error 晚到时防 reject-after-resolve——reject-after-resolve 本无害但守干净）；
- waitReply `done`=局部闭包标志·零共享（Promise res 天然幂等，done 纯为 clearTimeout 收口）；
- timeout 返回 `pendingText()`（部分回执信息面保全·空则 `|| null` 在 close 路径）；
- replyResolve 单槽语义保持（现役调用形一次 waitReply·多调用后覆盖前者注释载明）。

## §二 · 修复设计草案②——真值 waitReply 单测（真 socket 内存对拍·防复发钉）

新案组（seat-wake-wiring.test.ts 增·或独立 seat-wake-socket.test.ts·候裁）——**Node net 临时 server（named pipe 形·协议面同构）**：

| 案 | server 行为编程 | 断言 | 回归钉语义 |
|---|---|---|---|
| s1 data 路径 | 收帧后立即 `sock.write('ACK')` 保持连接 | waitReply 返回含 'ACK'·限时 2000ms 内 | **修复前此案永挂超时红=回归钉**（直接钉住本 bug） |
| s2 fire-and-forget 路径 | 收帧后零回执·连接保持 300ms 后 server 端 destroy | waitReply 在限时内返回（timeout→pendingText 空 null/close→null）·**非永挂** | 真发语义（harness 无 ack 帧面）投递成判据不阻塞 |
| s3 立即断连路径 | 收帧后立即 destroy | waitReply 返回 null（close 路径） | EPIPE/对端断形 |
| s4 connect 拒 | 无 server（管道不存在） | connector promise reject（ENOENT/ECONNREFUSED 族 code 面） | error 路径+掩形联动 |

实现形：`net.createServer()`→`server.listen('\\\\.\\pipe\\trilc-test-<rand>')`（Windows named pipe 真值）→defaultConnectSocket 连接→对拍→`server.close()` 收口；案级 `{timeout: 3000}` 防永挂回归（永挂=超时红即钉）。server 端收帧录制（帧形断言联动 u10 协议形锚·可选联动案）。

**防复发机理自评**：s1 案修复前必红（永挂→3s 超时）——mock connector 掩盖面被真值对拍钉补；后续任何连接器状态机改动过此案组。

## §三 · 修复设计草案③——泄漏面收口形

现役恒泄面（sde 卷 §三 实锚）：waitReply 永挂→`conn.destroy()` 永不达→单 socket 泄+handler promise 泄（HTTP res 永不写）。修复①后主泄面自然收口（waitReply 必返回→destroy 达→res 写出）。**加固形=destroy 入 finally**：

```typescript
const conn = await connect(target.socketPath);
try {
  conn.write(envelope);
  const reply = await conn.waitReply(2000);
  return { ...成功面... };
} finally {
  conn.destroy();          // 任何路径（含未来 waitReply 改抛错形）socket 必收口
}
```

技术债注记：`replyResolve` 单槽+waitReply 单次消费形=调用契约注（wakeAction 现役一次调用形合规）——多播面候远期（零需求不预造）。

## §四 · 候裁面（零施工遵行）

- 改动面清单候 CTO 裁（§一 修复形+§二 案组归属件名+§三 finally 形）——裁后施工触发令到即行（TriMLC 修件+白盒 s1-s4+全量+build+毕报卷）。
- sde 三次重启窗依赖本修件 dist——快毕节律（deadline 09:00 在轨）。

## 使用依据

- sde 卷 sde-w3d2-deploy-probe-20261120.md §三（码面实锚 settled 互斥重用+泄漏面载录·本席码面复勘逐字吻合自领）
- COS 预勘令（台账 736·三件草案面）
- W3-d 校形卷（fire-and-forget 概率形=s2 案语义源·W3-c 门禁卷 §四.4 replied 预判承）

—— FSD 小全（m-fsd）·2026-11-19T19:15:26Z（+8=2026-11-20 03:15:26·date 现查原值·D-47 正形）
