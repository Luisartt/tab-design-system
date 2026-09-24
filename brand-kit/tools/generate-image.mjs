#!/usr/bin/env node
// TAB on-brand photo generator (fal.ai queue API).
//
// The API key is read from FAL_KEY and never written to disk.
// Node's fetch ignores HTTPS_PROXY unless NODE_USE_ENV_PROXY=1 (Node >= 22.21).
//
// Batch from a shot list:
//   FAL_KEY=... node generate-image.mjs --shots ../photos/shots.json --models nano-banana-pro,seedream-5-pro --out ../photos/candidates
//   ...add --only 01-peer-board,03-owner to regenerate specific shots
// Single image:
//   FAL_KEY=... node generate-image.mjs --prompt "A business owner..." --aspect 4:5 --models nano-banana-pro --out ../photos/candidates
//
// Every prompt gets the house style from photo-style.json appended, so new shots stay on brand.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

// Seedream wants explicit pixels (1024^2 .. 2048^2 total); Nano Banana takes a ratio.
const SEEDREAM_SIZES = {
  '16:9': { width: 2560, height: 1440 },
  '4:5': { width: 1600, height: 2000 },
  '1:1': { width: 2048, height: 2048 },
  '3:2': { width: 2400, height: 1600 },
  '9:16': { width: 1440, height: 2560 },
};

const MODELS = {
  'nano-banana-pro': {
    endpoint: 'fal-ai/nano-banana-pro',
    input: (prompt, aspect) => ({ prompt, aspect_ratio: aspect, resolution: '2K', output_format: 'jpeg', num_images: 1 }),
  },
  'nano-banana-2': {
    endpoint: 'fal-ai/nano-banana-2',
    input: (prompt, aspect) => ({ prompt, aspect_ratio: aspect, resolution: '2K', output_format: 'jpeg', num_images: 1 }),
  },
  'seedream-5-pro': {
    endpoint: 'bytedance/seedream/v5/pro/text-to-image',
    input: (prompt, aspect) => ({ prompt, image_size: SEEDREAM_SIZES[aspect] ?? 'auto_2K', output_format: 'jpeg', num_images: 1 }),
  },
};

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) args[argv[i].slice(2)] = argv[i + 1]?.startsWith('--') || argv[i + 1] === undefined ? true : argv[++i];
  }
  return args;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function falRequest(url, key, init = {}, attempt = 0) {
  try {
    const res = await fetch(url, { ...init, headers: { Authorization: `Key ${key}`, 'Content-Type': 'application/json', ...init.headers } });
    const body = await res.text();
    if (!res.ok) throw Object.assign(new Error(`${res.status} ${url}: ${body.slice(0, 400)}`), { status: res.status });
    return JSON.parse(body);
  } catch (err) {
    // Retry transport errors and 5xx; a 4xx is a real rejection.
    if (attempt < 4 && !(err.status >= 400 && err.status < 500)) {
      await sleep(2000 * 2 ** attempt);
      return falRequest(url, key, init, attempt + 1);
    }
    throw err;
  }
}

async function runFal(endpoint, input, key) {
  const job = await falRequest(`https://queue.fal.run/${endpoint}`, key, { method: 'POST', body: JSON.stringify(input) });
  for (let i = 0; i < 180; i++) {
    const s = await falRequest(job.status_url, key);
    if (s.status === 'COMPLETED') return falRequest(job.response_url, key);
    if (s.status !== 'IN_QUEUE' && s.status !== 'IN_PROGRESS') throw new Error(`${endpoint}: unexpected status ${JSON.stringify(s)}`);
    await sleep(2000);
  }
  throw new Error(`${endpoint}: timed out`);
}

async function generate({ id, prompt, aspect }, modelName, style, outDir, key) {
  const model = MODELS[modelName];
  if (!model) throw new Error(`Unknown model "${modelName}". Options: ${Object.keys(MODELS).join(', ')}`);
  const fullPrompt = `${prompt}\n\n${style.style}\n\nAvoid: ${style.avoid}`;
  const started = Date.now();
  const out = await runFal(model.endpoint, model.input(fullPrompt, aspect), key);
  const image = out.images?.[0];
  if (!image?.url) throw new Error(`${modelName} returned no image: ${JSON.stringify(out).slice(0, 300)}`);
  const bytes = Buffer.from(await (await fetch(image.url)).arrayBuffer());
  const base = join(outDir, `${id}--${modelName}`);
  await writeFile(`${base}.jpg`, bytes);
  await writeFile(`${base}.json`, JSON.stringify({
    id, model: modelName, endpoint: model.endpoint, aspect, prompt, style: style.name,
    seed: out.seed ?? null, width: image.width ?? null, height: image.height ?? null,
    seconds: Math.round((Date.now() - started) / 1000), generated_at: new Date().toISOString(),
  }, null, 2) + '\n');
  return `${base}.jpg`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const key = process.env.FAL_KEY;
  if (!key) throw new Error('Set FAL_KEY in the environment (never commit it).');
  const style = JSON.parse(await readFile(join(here, 'photo-style.json'), 'utf8'));
  const models = String(args.models ?? 'nano-banana-pro').split(',');
  const outDir = resolve(args.out ?? join(here, '../photos/candidates'));
  await mkdir(outDir, { recursive: true });

  let shots;
  if (args.shots) {
    shots = JSON.parse(await readFile(resolve(args.shots), 'utf8'));
    if (args.only) shots = shots.filter((s) => String(args.only).split(',').includes(s.id));
  } else if (args.prompt) {
    shots = [{ id: args.id ?? `custom-${Date.now()}`, prompt: args.prompt, aspect: args.aspect ?? '16:9' }];
  } else {
    throw new Error('Pass --shots <file.json> or --prompt "<text>"');
  }

  const jobs = shots.flatMap((shot) => models.map((m) => ({ shot, m })));
  const results = await Promise.allSettled(jobs.map(({ shot, m }) => generate(shot, m, style, outDir, key)));
  results.forEach((r, i) => {
    const { shot, m } = jobs[i];
    console.log(r.status === 'fulfilled' ? `ok    ${shot.id} [${m}] -> ${r.value}` : `FAIL  ${shot.id} [${m}]: ${r.reason.message}`);
  });
  if (results.some((r) => r.status === 'rejected')) process.exitCode = 1;
}

main().catch((err) => { console.error(err.message); process.exit(1); });
