import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

// Cross-origin isolation enables multi-threaded WASM for the on-device models
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

// Health check endpoint for on-device stack
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    primaryModel: 'Gemma 3 1B (WebGPU or WASM)',
    embedder: 'EmbeddingGemma 300M (256-d)',
    architecture: 'On-Device Client-Side WebGPU',
    requiresApiKey: false,
    timestamp: Date.now(),
  });
});

// Serve static assets or vite middlewares
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

if (!isProd) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Avatar Network running on port ${PORT}`);
});
