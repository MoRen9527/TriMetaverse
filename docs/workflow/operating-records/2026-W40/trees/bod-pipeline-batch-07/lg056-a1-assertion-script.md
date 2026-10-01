# LG-056 A1 前置断言脚本·预置卷（batch-07 件4）

- 脚本位: /home/fleet/bin/lg056_a1_assert.py（sha256 前 16= 前 16 位）
- **落位偏差如实注**: charter 令落 /srv/fleet/bin 系——实勘 root:root 755 fleet 不可写，改落 /home/fleet/bin/（值席脚本族既有先例位），候 BOD root 迁位或授权
- 判据面: weekly-plane-shift-local-align-sop.md（LG-056）＋charter 四判据（fetch 不推/冲突即停/README 指针核/周 index 现役指针核）
- 只读断言面: 仅 git fetch（ref 级）+文件读；零 merge 零 push 零仓库写

## 干跑读数（1001 06:5x+08，--expect-week 2026-W40 基线态）

- 第一轮 3/5——暴露脚本两缺陷（未尾化名/周名格式不配对）自纠；第二轮 **5/5 PASS exit=0**：
  1. PASS ①对齐态 behind=0 ahead=0
  2. PASS ②新周平面三件齐
  3. PASS ③shift 审计 from=W39 to=W40 status=pass（周名对表）
  4. PASS ④index latestActiveWeek=true
  5. PASS ⑤README 无陈旧字面指针
- 退出码语义: 0=全 PASS／1=有 FAIL（含冲突即停态断言，只报不修）／2=参数错

## 周日（10-04）触发方式

- 候 BOD 令后值席执行: `python3 /home/fleet/bin/lg056_a1_assert.py --expect-week 2026-W41`
- 判定语义: 迁移本体（R-HY 23:00）+对齐 job（TriMLC 23:10）自然完成后，W41 面五断言全 PASS=自然终验达标；任一 FAIL=只报不修（冲突即停纪律），候人工
- 边界遵守: 不挂自动 job（charter 边界）；只读断言面

## 脚本全文（防丢嵌入，）

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""LG-056 A1 自然终验断言（只读断言面·禁写仓库面）
用法: lg056_a1_assert.py --expect-week 2026-W41 [--operating-root /srv/fleet/TriMetaverse]
判据面: weekly-plane-shift-local-align-sop.md（fetch 不推/冲突即停/README 指针核/周 index 现役指针核）
退出码: 0=全 PASS 1=有 FAIL 2=参数/环境错
"""
import argparse, json, os, subprocess, sys

def git(*a, cwd):
    r = subprocess.Popen(['git','-C',cwd]+list(a), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    o,e = r.communicate()
    return o.decode('utf-8','replace').strip(), e.decode('utf-8','replace').strip(), r.returncode

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--expect-week', required=True, help='迁移后现役周（如 2026-W41）')
    ap.add_argument('--operating-root', default='/srv/fleet/TriMetaverse')
    a = ap.parse_args()
    root = a.operating_root
    rec = {'expect_week': a.expect_week, 'checks': []}
    def chk(name, ok, detail):
        rec['checks'].append({'check': name, 'verdict': 'PASS' if ok else 'FAIL', 'detail': detail})
        print(('PASS' if ok else 'FAIL'), name, '—', detail)
        return ok
    # fetch（ref 级，安全）
    o,e,rc = git('fetch','origin', cwd=root)
    if rc != 0: print('FETCH-FAIL', e); rec['fetch_error']=e
    # ①对齐态（SOP §二.2 断言形：behind=0 方为对齐；ahead 合法不推）
    o,_,_ = git('rev-list','--left-right','--count','dev...origin/dev', cwd=root)
    try:
        ahead, behind = (int(x) for x in o.split())
    except Exception:
        print('FAIL 对齐读数解析:', o); return 1
    chk('①fetch+merge 不推·对齐态（behind=0；ahead=不推存量合法）', behind==0,
        'ahead=%d behind=%d（behind>0=冲突即停态候人工，本脚本只断言不自愈）'%(ahead,behind))
    # ②新周平面三件
    W = a.expect_week; base = root+'/docs/workflow/operating-records/'+W
    import glob
    idx = [p for p in glob.glob(base+'/OP-*.json') if 'unresolved' not in p]
    unres = [p for p in glob.glob(base+'/*unresolved-items.md')]
    ok3 = os.path.isfile(base+'/daily-progress.md') and bool(idx) and bool(unres)
    chk('②新周平面三件齐（daily-progress/OP index/unresolved）', bool(ok3),
        '三件=%s/%s/%s'%(os.path.isfile(base+'/daily-progress.md'), bool(idx), bool(unres)))
    # ③shift 审计件
    sa = base+'/.shift-ade.json'
    ok4 = False; det4 = sa+' 缺'
    if os.path.isfile(sa):
        try:
            d = json.load(open(sa))
            _to = (d.get('to_week') or '')
            _W = W.split('-')[-1] if W.startswith('2026-') else W
            ok4 = (d.get('status')=='pass' and _to.split('-')[-1]==_W)
            det4 = 'from=%s to=%s status=%s（周名 %s 对表）'%(d.get('from_week'),d.get('to_week'),d.get('status'),_W)
        except Exception as e: det4 = '解析失败 %s'%e
    chk('③.shift-ade.json from/to/三件态=pass', ok4, det4)
    # ④周 index 现役指针核
    ok5 = False; det5 = 'index 缺'
    if idx:
        try:
            dd = json.load(open(idx[0], encoding='utf-8'))
            md = dd.get('metadata', {})
            ok5 = (md.get('latestActiveWeek') is True)
            det5 = 'latestActiveWeek=%s updatedBy=%s'%(md.get('latestActiveWeek'), md.get('updatedBy'))
        except Exception as e: det5 = str(e)
    chk('④周 index 现役周指针（latestActiveWeek=true）', ok5, det5)
    # ⑤README 陈旧字面指针核（设计上无字面周指针=平凡通过，防回退式回归）
    rd = root+'/docs/workflow/README.md'
    stale = []
    if os.path.isfile(rd):
        t = open(rd, encoding='utf-8', errors='replace').read()
        stale = [w for w in ('2026-W39','2026-W40','2026-W41') if w in t]
    chk('⑤README 无陈旧字面周指针', len(stale)==0, '命中=%s（设计=动态 current-week 路由无字面）'%(stale or '无'))
    npass = sum(1 for c in rec['checks'] if c['verdict']=='PASS')
    rec['summary'] = '%d/%d PASS'%(npass, len(rec['checks']))
    print('SUMMARY', rec['summary'])
    json.dump(rec, open('/tmp/lg056_a1_last.json','w'), ensure_ascii=False, indent=1)
    return 0 if npass==len(rec['checks']) else 1

if __name__=='__main__':
    sys.exit(main())
```
