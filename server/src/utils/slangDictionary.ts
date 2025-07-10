export interface SlangEntry {
  canonical: string; // canonical term or meaning
  meaning: string;
  context: string;
  examples: string[];
}

export const slangDictionary: Record<string, SlangEntry> = {
  // Ambiguous abbreviation -> entry
  gng: {
    canonical: "gang",
    meaning: "A close group of friends; your crew.",
    context: "Used casually online or in conversation to refer to one's friend group, often as a greeting or shout-out (e.g., 'what's good gng?').",
    examples: [
      "Pull up later, gng!",
      "Miss y'all, gng 💕",
    ],
  },
  // New ambiguous entries below
  fr: {
    canonical: "for real",
    meaning: "An expression of agreement or emphasis; truly, genuinely.",
    context: "Often used to confirm something, express disbelief, or ask if someone is serious (e.g., 'Are you serious, fr?').",
    examples: [
      "That movie was wild, fr.",
      "Fr, I'm so tired.",
    ],
  },
  cap: {
    canonical: "lie / exaggeration",
    meaning: "To lie or exaggerate; to fake or deceive.",
    context: "Used to call out someone for lying or to assure someone you're telling the truth (e.g., 'no cap'). 'Cap' itself means lying, 'no cap' means no lie.",
    examples: [
      "He's capping hard, that story ain't true.",
      "Are you capping or is that real?",
    ],
  },
  istg: {
    canonical: "I swear to God",
    meaning: "An expression used to emphasize a statement or show strong emotion, often frustration or determination.",
    context: "Used similarly to a more formal oath, but in a casual context, to add weight to what is being said (e.g., 'Istg I'm about to lose it.').",
    examples: [
      "Istg, this homework is killing me.",
      "I'm not doing that, istg.",
    ],
  },
  simp: {
    canonical: "simp",
    meaning: "Someone who is overly eager to please another person (often romantically), to the point of sacrificing their own dignity or self-respect.",
    context: "Used to describe someone who goes to extreme lengths for affection or attention, often in a flattering or overly submissive way. It's usually used in a derogatory or teasing manner.",
    examples: [
      "He's simping so hard over her, it's kinda embarrassing.",
      "Don't be a simp, stand up for yourself!",
    ],
  },
  bet: {
    canonical: "okay / agreed / sounds good",
    meaning: "An informal affirmative response, expressing agreement, acceptance, or confirmation.",
    context: "Used to say 'yes,' 'okay,' 'I'm in,' or 'you got it' (e.g., 'Wanna grab food later?' 'Bet.').",
    examples: [
      "I'll meet you at 8. Bet.",
      "Bet, I can definitely help with that.",
    ],
  },
  // Add more entries as they crop up
};