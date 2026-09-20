// scripts/buildEmbeddings.js - run once: node scripts/buildEmbeddings.js
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { getEmbedding } from '../services/embeddingService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IPC_DATA = JSON.parse(readFileSync(path.join(__dirname, '../data/ipc_data.json'), 'utf-8'));

async function run() {
  const embeddings = [];
  for (let i = 0; i < IPC_DATA.length; i++) {
    const s = IPC_DATA[i];
    const text = `${s.offense}. ${s.description}`.slice(0, 500);
    try {
      const vec = await getEmbedding(text);
      embeddings.push({ section_number: s.section_number, vector: vec });
      console.log(`[${i + 1}/${IPC_DATA.length}] embedded section ${s.section_number}`);
    } catch (err) {
      console.error(`Failed on ${s.section_number}:`, err.message);
      embeddings.push({ section_number: s.section_number, vector: null });
    }
    await new Promise(r => setTimeout(r, 200)); // stay under HF rate limits
  }
  writeFileSync(path.join(__dirname, '../data/ipc_embeddings.json'), JSON.stringify(embeddings));
  console.log('Done → data/ipc_embeddings.json');
}
run();