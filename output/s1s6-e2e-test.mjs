// W30 S1-S6 E2E verification script
import http from 'node:http';

function req(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const r = http.request({
      hostname: '127.0.0.1', port: 8711, path, method,
      headers: data ? { 'content-type': 'application/json', 'content-length': Buffer.byteLength(data).toString() } : {}
    }, res => {
      let b = ''; res.on('data', c => b += c);
      res.on('end', () => resolve({ status: res.statusCode, body: b }));
    });
    r.on('error', reject);
    if (data) r.write(data);
    r.end();
  });
}

async function main() {
  let pass = 0, fail = 0;
  const check = (label, condition) => {
    if (condition) { console.log('  PASS:', label); pass++; }
    else { console.log('  FAIL:', label); fail++; }
  };
  
  // (1) healthz
  console.log('S1 (1) /healthz');
  let r = await req('GET', '/healthz');
  check('/healthz returns 200', r.status === 200);
  check('/healthz body has ok:true', r.body.includes('"ok":true'));
  
  // (5) sessions/recover
  console.log('S1 (5) POST /internal/v1/sessions/recover');
  r = await req('POST', '/internal/v1/sessions/recover', {});
  check('recover returns JSON', r.body.includes('"ok"'));
  
  // S2: tasks/submit
  console.log('S2 POST /internal/v1/tasks/submit');
  r = await req('POST', '/internal/v1/tasks/submit', { message: 'E2E test' });
  check('submit returns 201', r.status === 201);
  const sid = JSON.parse(r.body).sessionId;
  check('submit has sessionId', !!sid);
  
  // 400 validation
  r = await req('POST', '/internal/v1/tasks/submit', {});
  check('submit rejects empty message (400)', r.status === 400);
  
  // S2: SSE stream
  console.log('S2 SSE GET /sessions/' + sid + '/stream');
  await new Promise(resolve => {
    const sseUrl = '/internal/v1/sessions/' + sid + '/stream';
    const sseR = http.request({ hostname: '127.0.0.1', port: 8711, path: sseUrl, method: 'GET', timeout: 30000 }, sseRes => {
      let b = ''; sseRes.on('data', c => b += c);
      sseRes.on('end', () => {
        check('SSE returns 200', sseRes.statusCode === 200);
        check('SSE has delta events', b.includes('event: delta'));
        check('SSE has task_done', b.includes('event: task_done'));
        resolve();
      });
    });
    sseR.on('timeout', () => { check('SSE timeout', false); sseR.destroy(); resolve(); });
    sseR.on('error', () => { check('SSE error', false); resolve(); });
    sseR.end();
  });
  
  // S4: sessions list
  console.log('S4 GET /internal/v1/sessions');
  r = await req('GET', '/internal/v1/sessions');
  check('sessions returns 200', r.status === 200);
  check('sessions has count', r.body.includes('"count"'));
  
  // S4: cancel
  console.log('S4 POST /sessions/' + sid + '/cancel');
  r = await req('POST', '/internal/v1/sessions/' + sid + '/cancel', {});
  check('cancel returns 200', r.status === 200);
  const cancelBody = JSON.parse(r.body);
  check('cancel status is cancelled', cancelBody.status === 'cancelled');
  
  // 404 cancel
  r = await req('POST', '/internal/v1/sessions/nope/cancel', {});
  check('cancel non-existent returns 404', r.status === 404);
  
  console.log('\n=== Results: ' + pass + ' passed, ' + fail + ' failed ===');
  if (fail > 0) process.exit(1);
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
