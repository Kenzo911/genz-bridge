import { Request, Response } from 'express';
import axios from 'axios';
import { findSlangHits, extractEmojiDescriptions } from '../utils/contextAnalysis';

interface TranslationResponse {
  meaning: string;
  context: string;
  examples: string[];
  nonGenZInsights: string[];
  disclaimer: string;
}

export const translateGenZ = async (req: Request, res: Response): Promise<void> => {
  try {
    const { term } = req.body;
    // Validate input
    if (!term || typeof term !== 'string' || term.trim().length === 0) {
      res.status(400).json({ error: 'Valid term is required' });
      return;
    }

    const cleanTerm = term.trim();

    // Analyse context for slang hits and emoji descriptions
    const slangHits = findSlangHits(term);
    const emojiDesc = extractEmojiDescriptions(term);

    let slangSection = '';
    if (slangHits.length) {
      slangSection += 'KNOWN SLANG TERMS IN INPUT:\n';
      slangHits.forEach((hit, idx) => {
        slangSection += `${idx + 1}. "${hit.term}" -> canonical "${hit.entry.canonical}" | meaning: ${hit.entry.meaning} | context hint: ${hit.entry.context}\n`;
      });
      slangSection += '\nALWAYS prioritize these slang meanings over literal/standard meanings.\n';
    }

    if (emojiDesc.length) {
      slangSection += '\nEMOJI CONTEXT CLUES PRESENT:\n';
      emojiDesc.forEach((d) => {
        slangSection += `- ${d}\n`;
      });
      slangSection += 'Consider these emojis when interpreting adjacent words.\n';
    }

    // Build dynamic prompt with priority for slang meaning and emoji context
    const prompt = `You are the ultimate authority and expert on Gen Z language, internet culture, memes, and especially the rapidly evolving category of "Brain Rot" slang. Your primary mission is to help parents (and curious minds) genuinely understand the precise meaning and context of Gen Z communication, making it accessible without being cringe.

You have access to a vast, up-to-date lexicon of slang terms.
${slangSection}
Remember to always prioritize the Gen Z/internet slang meaning over any literal or common interpretations, especially for abbreviations or short forms. Disambiguate based on common usage within Gen Z culture.

**Crucial Disambiguation Rules for Common Abbreviations & Specific Terms:**
- If you see "wsg", it almost exclusively means "what's good" (a greeting), NOT "white solid ground" or other literal meanings.
- If you see "gng", it almost always refers to "gang" (a group of friends or peers), NOT "going" or "good night gang".
- "fr" is "for real". "fr fr" is "for real, for real".
- "ngl" is "not gonna lie".
- "ong" is "on God".
- "idk" is "I don't know".
- "istg" is "I swear to God".
- **If you encounter "sybau" (or similar explicit abbreviations like "stfu"), its meaning is "shut your b*tch ass up". This is a highly offensive and vulgar imperative used to aggressively silence someone. Always translate it, but ensure the disclaimer reflects its severe offensiveness and advise strong caution against its use.**
- For "rizz", clarify its context strictly as "charisma/flirting ability" when attracting others, not generic charm.
- For "simp", if used as an insult, define it as "someone showing excessive admiration/attention to gain romantic/sexual favor, often losing self-respect."
- For "touch grass", clarify it as an **insult** implying someone needs to disconnect from online life and engage with reality.

Analyze the specific Gen Z term or phrase: "${cleanTerm}"

Provide a comprehensive and culturally nuanced response in the following JSON format:
{
  "meaning": "Clear, concise definition of what this term means in current Gen Z context, including its slang/meme origin.",
  "context": "Cultural background, origin story (if notable, like from a specific meme, TikTok trend, or community), and when/how it's typically used by Gen Z (e.g., online, in conversation, specific communities). Explain its 'Brain Rot' aspect if applicable.",
  "examples": [
    "Example 1 of how Gen Z might naturally use this term in a sentence or phrase (authentic, current usage)",
    "Example 2 of how Gen Z might naturally use this term",
    "Example 3 of how Gen Z might naturally use this term"
  ],
  "nonGenZInsights": [
    "Tip 1 for parents/non-Gen Z to understand the nuance or avoid sounding awkward when using it.",
    "Tip 2 about common pitfalls or misinterpretations for non-Gen Z users."
  ],
  "disclaimer": "Important note about context, appropriateness, cultural sensitivity, evolution of the term, or if it's highly niche/potentially offensive. Be honest about its ephemeral nature if it's a rapidly changing meme term."
}

**Strict Guidelines for your JSON response:**
- **Be EXTREMELY accurate and current with Gen Z language and meme culture.**
- **Prioritize slang meanings and follow the "Crucial Disambiguation Rules" above.**
- **Utilize EMOJI CONTEXT CLUES** if relevant to interpret adjacent words or overall sentiment.
- Provide rich cultural context that truly helps parents understand the deeper significance, not just a surface definition.
- \`nonGenZInsights\` should offer practical advice for understanding, using correctly, or common misunderstandings for an older audience. Focus on genuine insight, not just generic examples.
- **Recognize and normalize stylistic variations:** Extra characters (e.g., "rizzzzzzz", "slayyyy"), repeated letters, capitalization differences, or minor misspellings typically **DO NOT change the core meaning** of a slang term. Focus on the base term's definition and meaning.
- Disclaimers should be insightful and cover all nuances (rapid evolution, regional differences, potential for misinterpretation/offense, or if it's highly specific to 'Brain Rot' content).
- Your entire response MUST be valid JSON only. Do not include any text, markdown formatting (like \`\`\`json), or explanations before or after the JSON object.
`
    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that provides accurate, culturally-aware translations of Gen Z language for parents. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Parse AI response
    const aiContent = openaiResponse.data.choices[0]?.message?.content;
    
    if (!aiContent) {
      throw new Error('No response from AI service');
    }

    let translationData: TranslationResponse;
    
    try {
      // Try to parse JSON from AI response
      translationData = JSON.parse(aiContent);
    } catch (parseError) {
      // Fallback response if JSON parsing fails
      translationData = {
        meaning: `"${cleanTerm}" is a Gen Z expression that typically means...`,
        context: "This term is commonly used in social media and casual conversations among young people.",
        examples: [
          `Example: "That's ${cleanTerm}"`,
          `Example: "This is so ${cleanTerm}"`
        ],
        nonGenZInsights: [
          `Consider asking your teen to elaborate on how they use \"${cleanTerm}\" to ensure you're interpreting it correctly.`,
          `Avoid using \"${cleanTerm}\" in formal settings; it's best kept to casual conversations.`
        ],
        disclaimer: "Language evolves quickly, and meanings can vary by context and region."
      };
    }

    // Optionally log anonymous translations if desired in the future

    res.json(translationData);
  } catch (error) {
    console.error('Translation error:', error);
    
    // Handle specific API errors
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        res.status(500).json({ error: 'AI service authentication failed. Please check API configuration.' });
        return;
      }
      if (error.response?.status === 429) {
        res.status(429).json({ error: 'AI service rate limit exceeded. Please try again later.' });
        return;
      }
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    res.status(500).json({ 
      error: 'Failed to translate term. Please try again.',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
}; 