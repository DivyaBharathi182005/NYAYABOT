// services/lawyerMatcher.js - matches user's legal issue to lawyer categories
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LAWYERS = JSON.parse(readFileSync(path.join(__dirname, '../data/lawyers.json'), 'utf-8'));

// Maps crime/issue keywords to a lawyer category
const CATEGORY_KEYWORDS = {
  criminal: ['murder', 'assault', 'theft', 'robbery', 'kidnap', 'rape', 'hurt', 'attack', 'threat', 'bail', 'fir', 'crime'],
  family: ['divorce', 'custody', 'dowry', '498a', 'marriage', 'maintenance', 'domestic violence', 'wife', 'husband'],
  civil: ['property', 'land', 'tenant', 'landlord', 'contract', 'rent', 'boundary', 'inheritance', 'will'],
  cyber: ['online', 'cyber', 'hacking', 'phishing', 'otp', 'fraud call', 'social media', 'fake profile', 'data'],
  labour: ['salary', 'termination', 'employer', 'workplace', 'pf', 'gratuity', 'job', 'employment'],
};

export function detectCategory(issueText) {
  const lower = issueText.toLowerCase();
  let best = { category: 'criminal', matches: 0 }; // default fallback

  Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
    const matches = keywords.filter(kw => lower.includes(kw)).length;
    if (matches > best.matches) best = { category, matches };
  });

  return best.category;
}

export function matchLawyers(issueText, topK = 3) {
  const category = detectCategory(issueText);
  const inCategory = LAWYERS.filter(l => l.category === category);
  const others = LAWYERS.filter(l => l.category !== category);
  const ranked = [...inCategory, ...others]; // category matches first
  return { category, lawyers: ranked.slice(0, topK) };
}
export { LAWYERS };