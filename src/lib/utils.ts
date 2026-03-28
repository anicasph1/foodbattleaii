import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { BattleResult } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function generateBattles(
  food: string
): Promise<{ results: BattleResult[] }> {
  try {
    const res = await fetch("https://api.ai.cc/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_AICC_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.9,
        messages: [
          {
            role: "system",
            content:
              "You are an elite viral TikTok food battle generator creating cinematic, dark, high-converting content.",
          },
          {
            role: "user",
            content: `
You are an elite viral TikTok food battle creator.

Generate HIGHLY VIRAL, DARK, CINEMATIC food battles.

INPUT FOOD: "${food}"

RULES:

- 4 UNIQUE battles
- include HOOK
- EXACTLY 3 dialogue lines
- each line LONG (20–35 words)
- must feel like REAL ARGUMENT

HOOK:
- 1 line
- emotional / uncomfortable / viral

STYLE:
- hero = truth / discipline
- villain = temptation / comfort

TIMING:
- total ~16 seconds spoken

VISUAL:
- Pixar 3D style
- anthropomorphic food
- cinematic lighting

SEO:
- clickbait title
- emotional description
- 5–8 hashtags

RETURN JSON ONLY

FORMAT:
{
  "results": [
    {
      "hook": "",
      "pair": { "hero": "", "villain": "" },
      "script": {
        "duration": "16s",
        "dialogue": [
          { "speaker": "hero", "line": "" },
          { "speaker": "villain", "line": "" },
          { "speaker": "hero", "line": "" }
        ]
      },
      "imagePrompts": ["", ""],
      "videoPrompts": ["", "", ""],
      "seo": {
        "title": "",
        "description": "",
        "hashtags": []
      }
    }
  ]
}
`,
          },
        ],
      }),
    });

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;

    if (!text) throw new Error("No AI response");

    const clean = text.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      throw new Error("Invalid JSON from AI");
    }

    if (!parsed.results) throw new Error("Bad structure");

    return { results: parsed.results };
  } catch (err) {
    console.error("AICC ERROR:", err);

    return {
      results: [
        {
          hook: "You think this is harmless… but it isn’t.",
          pair: { hero: food, villain: "Junk Food" },
          script: {
            duration: "16s",
            dialogue: [
              {
                speaker: "hero",
                line:
                  "I don’t just fill your stomach for a moment—I give your body real energy that builds strength and protects your health long after the taste disappears.",
              },
              {
                speaker: "villain",
                line:
                  "I don’t need to be healthy, I just need to feel good instantly, because people will always choose comfort over thinking about long-term consequences.",
              },
              {
                speaker: "hero",
                line:
                  "And that’s exactly why you’re the problem—you win for seconds, but I decide what they become when those choices finally catch up to them.",
              },
            ],
          },
          imagePrompts: [
            "Pixar-style broccoli hero glowing cinematic grocery lighting",
            "junk food villain greasy dramatic Pixar lighting confrontation",
          ],
          videoPrompts: [
            "close-up broccoli emotional face Pixar",
            "junk food slow motion cinematic",
            "hero victory clean lighting Pixar",
          ],
          seo: {
            title: `${food} DESTROYS Junk Food (THE TRUTH)`,
            description:
              "This isn’t just food—it’s a battle between instant pleasure and long-term damage.",
            hashtags: [
              "#foodbattle",
              "#viralfood",
              "#foodtok",
              "#healthyvsjunk",
              "#tiktokfood",
            ],
          },
        },
      ],
    };
  }
}
