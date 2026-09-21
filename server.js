const express = require('express');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

const startTime = Date.now();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ヘルスチェック & システムステータス API
app.get('/api/health', (req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: `${uptimeSeconds} 秒`,
    server: {
      nodeVersion: process.version,
      platform: `${os.type()} ${os.release()} (${os.arch()})`,
      cpuCores: os.cpus().length,
      freeMemory: `${Math.round(os.freemem() / 1024 / 1024)} MB`,
      totalMemory: `${Math.round(os.totalmem() / 1024 / 1024)} MB`,
      processMemoryUsage: {
        rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`
      }
    },
    client: {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      headers: req.headers
    }
  });
});

// エコー API (データ送受信テスト)
app.all('/api/echo', (req, res) => {
  res.json({
    message: 'Echo response successful',
    method: req.method,
    query: req.query,
    body: req.body,
    headers: req.headers,
    timestamp: new Date().toISOString()
  });
});

// カスタムステータスコード & レスポンス遅延テスト API
app.all('/api/status/:code', (req, res) => {
  const code = parseInt(req.params.code, 10) || 200;
  const delay = parseInt(req.query.delay, 10) || 0;

  setTimeout(() => {
    res.status(code).json({
      status: code >= 200 && code < 300 ? 'success' : 'error',
      statusCode: code,
      delayMs: delay,
      message: `Returned response with HTTP Status Code ${code} after ${delay}ms delay.`,
      timestamp: new Date().toISOString()
    });
  }, Math.min(delay, 10000)); // 最大10秒制限
});

app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 LinuxQuest DummyApp Started!`);
  console.log(`Server is running at: http://localhost:${PORT}`);
  console.log(`=================================`);
});
