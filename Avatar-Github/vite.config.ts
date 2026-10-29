import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

// Cross-origin isolation enables multi-threaded WASM for the on-device models
// (production hosts set the same headers via vercel.json and public/_headers; GitHub Pages gets them from
// public/coi-serviceworker.js). require-corp rather than credentialless, which Safari doesn't support.
const isolationHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
};

// transformers.js loads ONNX Runtime's WASM from jsDelivr at runtime (a versioned copy of the
// npm package), so the 27 MB copy Vite would emit is never requested. Leaving it out keeps the
// build small and under static hosts' per-file limits (Cloudflare Pages: 25 MiB).
const dropBundledOrtWasm = (): Plugin => ({
  name: 'drop-bundled-ort-wasm',
  apply: 'build',
  generateBundle(_options, bundle) {
    for (const file of Object.keys(bundle)) {
      if (/ort-wasm.*\.wasm$/.test(file)) delete bundle[file];
    }
  },
});

export default defineConfig(() => {
  return {
    // Relative asset paths, so the build works from a subfolder (GitHub Pages: user.github.io/repo/)
    base: './',
    plugins: [react(), tailwindcss()],
    worker: {
      // The model worker imports transformers.js, which code-splits
      format: 'es',
      plugins: () => [dropBundledOrtWasm()],
    },
    preview: {
      headers: isolationHeaders,
    },
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      strictPort: true,
      allowedHosts: true,
      headers: isolationHeaders,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
