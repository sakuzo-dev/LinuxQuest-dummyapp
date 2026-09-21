document.addEventListener('DOMContentLoaded', () => {
  const elStatus = document.getElementById('val-status');
  const elUptime = document.getElementById('val-uptime');
  const elNodeVersion = document.getElementById('val-node-version');
  const elPlatform = document.getElementById('val-platform');
  const elMemory = document.getElementById('val-memory');
  const elClientIp = document.getElementById('val-client-ip');

  const btnRefreshStatus = document.getElementById('btn-refresh-status');
  const btnTestHealth = document.getElementById('btn-test-health');
  const btnTestEcho = document.getElementById('btn-test-echo');
  const btnTestStatus = document.getElementById('btn-test-status');

  const echoInput = document.getElementById('echo-input');
  const statusCodeSelect = document.getElementById('status-code-select');
  const delayInput = document.getElementById('delay-input');

  const responseOutput = document.getElementById('response-output');
  const responseMeta = document.getElementById('response-meta');

  // システムステータスの更新関数
  async function fetchStatus() {
    try {
      const startTime = performance.now();
      const res = await fetch('/api/health');
      const duration = Math.round(performance.now() - startTime);

      if (res.ok) {
        const data = await res.json();
        elStatus.textContent = 'オンライン';
        elStatus.className = 'value badge-success';
        elUptime.textContent = data.uptime;
        elNodeVersion.textContent = data.server.nodeVersion;
        elPlatform.textContent = data.server.platform;
        elMemory.textContent = `${data.server.processMemoryUsage.heapUsed} (Total: ${data.server.totalMemory})`;
        elClientIp.textContent = data.client.ip;

        return { data, duration, status: res.status };
      } else {
        elStatus.textContent = 'エラー';
        elStatus.className = 'value badge-danger';
      }
    } catch (err) {
      elStatus.textContent = 'オフライン / 接続不能';
      elStatus.className = 'value badge-danger';
      console.error('Status fetch failed:', err);
    }
  }

  // レスポンス出力エリアへの出力
  function renderResponse(title, status, duration, data) {
    responseMeta.textContent = `${title} | Status: ${status} | RTT: ${duration}ms`;
    responseOutput.textContent = JSON.stringify(data, null, 2);
  }

  // イベントリスナー
  btnRefreshStatus.addEventListener('click', async () => {
    const result = await fetchStatus();
    if (result) {
      renderResponse('GET /api/health', result.status, result.duration, result.data);
    }
  });

  btnTestHealth.addEventListener('click', async () => {
    const result = await fetchStatus();
    if (result) {
      renderResponse('GET /api/health', result.status, result.duration, result.data);
    }
  });

  btnTestEcho.addEventListener('click', async () => {
    const message = echoInput.value || 'Hello';
    const startTime = performance.now();
    try {
      const res = await fetch('/api/echo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, clientTimestamp: new Date().toISOString() })
      });
      const duration = Math.round(performance.now() - startTime);
      const data = await res.json();
      renderResponse('POST /api/echo', res.status, duration, data);
    } catch (err) {
      renderResponse('POST /api/echo', 'ERROR', 0, { error: err.message });
    }
  });

  btnTestStatus.addEventListener('click', async () => {
    const code = statusCodeSelect.value;
    const delay = parseInt(delayInput.value, 10) || 0;
    const startTime = performance.now();

    try {
      const res = await fetch(`/api/status/${code}?delay=${delay}`);
      const duration = Math.round(performance.now() - startTime);
      const data = await res.json();
      renderResponse(`GET /api/status/${code}`, res.status, duration, data);
    } catch (err) {
      renderResponse(`GET /api/status/${code}`, 'ERROR', 0, { error: err.message });
    }
  });

  // 初期起動時のステータスロード
  fetchStatus();
});
