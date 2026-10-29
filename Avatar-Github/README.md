# Avatar Network

A private AI study assistant that runs entirely in the browser. Students upload their notes, handouts or PDFs and ask
questions. Answers draw on their own material first, with the source passage shown; when the notes don't cover a
question, the model answers from general knowledge and the answer is labelled that way. No account, no server, and
nothing leaves the device.

## What it does

- **Ask your notes.** Uploaded files are split into passages and indexed on the device. Questions are answered by
  Gemma 3 1B using the most relevant passages, with the excerpt and sources shown. Questions the notes don't cover are
  answered from the model's general knowledge and marked "not from your notes"; with no notes uploaded, the app says so.
- **Exact calculators.** Equations, percentages, molar mass, gas laws, Punnett squares and similar problems are solved
  by built-in calculators with worked steps, not by the language model.
- **Avatars.** Each Avatar is a persona with its own notebook of sources. Switch Avatars from the composer, like a
  model picker, or create your own. Four sample Avatars (Algebra, Biology, History, Chemistry) come with sample notes
  and 109 hand-written practice questions, all written for Avatar Network as demo material; **Avatar** (My Notes) is the default for your own uploads.
- **Goals and skills.** Set goals with a timeframe for an Avatar; active goals are sent with every question. Skills
  switch calculators on or off per Avatar, add teaching styles (flashcards, explain simply, Socratic, exam prep), or
  add your own instructions.
- **Practice and progress.** Practice questions are graded against an answer key; progress counts only questions
  you've answered.

## Interface

A familiar chat layout: **left bar** with New chat, Models (supported models, device check, download), About and
saved chats (Recents); **composer** with + (upload), the Avatar switcher and the Notebook (sources on/off, upload,
live context-window use); **right bar** with Set goals, Add skills and My Avatar (progress, settings, FAQs). On phones
both bars become drawers.

## How it works

| Piece | Implementation |
| --- | --- |
| Chat model | [Gemma 3 1B](https://huggingface.co/onnx-community/gemma-3-1b-it-ONNX) via transformers.js in a Web Worker. WebGPU `q4f16` (or `q4` without `shader-f16`), falling back to CPU WASM `int8`. |
| Retrieval | [EmbeddingGemma 300M](https://huggingface.co/onnx-community/embeddinggemma-300m-ONNX), WASM `q8`, in its own worker. 768-d output truncated to 256-d (Matryoshka); relevance threshold 0.45, calibrated on the built-in passages. |
| Storage | Uploads and passage vectors in IndexedDB; progress and settings in localStorage. |
| Download | About 1.1–1.3 GB depending on the device, offered in the chat the first time a question needs it and cached afterwards. Calculators and practice questions work before it finishes; the waiting question is answered when it's ready. A quiet device check (WebGPU, memory, storage, Data Saver) tailors the offer, and phones get a clear message instead of a download. |

Each model runs in its own worker so each gets its own 4 GB WASM heap. Stop works mid-generation through a shared
`SharedArrayBuffer` flag, which needs the cross-origin isolation headers below.

**Performance:** replies are fast on a laptop with WebGPU (recent Chrome or Edge, or Safari 26+ on macOS). Without WebGPU the CPU fallback works
but generates only a few tokens per second.

## Development

Requires [Bun](https://bun.sh).

```bash
bun install
bun run dev      # http://localhost:3000
bun test         # unit tests
bun run lint     # type check
bun run build    # production build in dist/
```

## Deployment

The app is static: deploy `dist/` to any static host, at the root or in a subfolder (asset paths are relative). The
AI engine needs cross-origin isolation, which these headers provide (already configured in `vercel.json` for Vercel
and `public/_headers` for Cloudflare Pages and Netlify):

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

**GitHub Pages** can't set headers, so `public/coi-serviceworker.js` adds them in the browser instead (the page reloads
once on the first visit). It does nothing on hosts that already send the headers. The workflow in
`.github/workflows/pages.yml` builds and deploys on every push to `main` once the repository is public; enable it under
Settings → Pages → Source: GitHub Actions.

Users download the models directly from Hugging Face (pinned to fixed commits in `src/services/modelConfig.ts`) and ONNX Runtime's WASM from jsDelivr, so the host serves only the ~5 MB app and no model hosting is needed. See
[`public/privacy.html`](public/privacy.html) for the data each third-party service sees.

## License

The code is released under the [MIT License](../LICENSE). The AI models are not part of this repository: Gemma 3 1B
and EmbeddingGemma are downloaded from Hugging Face by each user and are provided under Google's
[Gemma Terms of Use](https://ai.google.dev/gemma/terms). `public/coi-serviceworker.js` is MIT-licensed (Guido Zuidhof
and contributors). The sample Avatars' notes and practice questions were written for Avatar Network as demo material.
