// server.js - 一个简单的静态文件服务器
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// 提供静态文件（index.html, CSS, JS等）
app.use(express.static(__dirname));

// 所有路由都返回 index.html，让前端路由处理（如果你的应用是单页面应用）
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});