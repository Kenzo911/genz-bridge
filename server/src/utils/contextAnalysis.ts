import { slangDictionary, SlangEntry } from "./slangDictionary";

const emojiHints: Record<string, string> = {
  "🌹": "rose emoji often implies camaraderie, affection, or a friendly vibe",
  "😂": "tears of joy emoji indicates something is funny",
  "🔥": "fire emoji implies something is impressive or exciting",
  "💀": "skull emoji implies something is hilarious or shocking (\"dead\" from laughter)",
};

export interface SlangHit {
  term: string;
  entry: SlangEntry;
}

export function findSlangHits(text: string): SlangHit[] {
  const hits: Record<string, SlangHit> = {};
  const lower = text.toLowerCase();

  // Split by non-word but keep emojis
  const words = lower.split(/[^a-z0-9]+/g);

  for (const word of words) {
    if (slangDictionary[word]) {
      hits[word] = { term: word, entry: slangDictionary[word] };
    }
  }
  return Object.values(hits);
}

export function extractEmojiDescriptions(text: string): string[] {
  const descriptions: string[] = [];
  for (const [emoji, meaning] of Object.entries(emojiHints)) {
    if (text.includes(emoji)) {
      descriptions.push(`${emoji} (${meaning})`);
    }
  }
  return descriptions;
} 