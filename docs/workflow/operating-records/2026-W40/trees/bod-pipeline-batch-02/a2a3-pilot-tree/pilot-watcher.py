#!/usr/bin/env python3
# LG-057 A2 试点观察器（隔离测试树内，非在役件）：5 分钟超时催办触发
import json, time, datetime, urllib.request, os
D=os.path.dirname(os.path.abspath(__file__))
T0=json.load(open(D+'/tree-op.json'))['nodes']['N-A2']['created_at']
t0=datetime.datetime.strptime(T0,'%Y-%m-%dT%H:%M:%SZ')
TOKEN=[l.split('=',1)[1].strip().strip('"') for l in open('/srv/fleet/TriMC/docker/.env') if l.startswith('TRIMC_INTERNAL_TOKEN')][0]
def notify(title,body):
    req=urllib.request.Request('http://127.0.0.1:8712/internal/v1/notify',
        data=json.dumps({'source_seat':'m-duty-cos','target_daemon':'trimlc','target_seat':'bod','urgent':'normal','title':title,'body':body}).encode(),
        headers={'content-type':'application/json','X-Internal-Token':TOKEN})
    r=json.load(urllib.request.urlopen(req,timeout=8))
    return r.get('message_id')
trig=None
while True:
    now=datetime.datetime.utcnow()
    age=(now-t0).total_seconds()
    if age>=300:
        mid=None; err=None; att=0
        for att in range(1,6):
            try:
                mid=notify('〔LG-057 A2 试点〕5 分钟超时催办触发','试点节点 N-A2 挂起 %d 秒超阈（阈 300s）——超时催办触发实证（隔离测试树 a2a3-pilot-tree，非在役件）。'%int(age))
                break
            except Exception as e:
                err=str(e); print('notify attempt %d fail: %s'%(att,e)); time.sleep(15)
        trig={'triggered_at_utc':now.strftime('%Y-%m-%dT%H:%M:%SZ'),'detected_latency_s':round(age,1),'message_id':mid,'attempts':att,'last_error':err,'note':'attempt-1 裸崩案后加重试环；本轮遇 8710 失听事件实测重试环'}
        json.dump(trig,open(D+'/a2-trigger.json','w'),indent=1)
        print('TRIGGERED',trig); break
    time.sleep(15)
