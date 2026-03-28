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
        messages: [
          {
            role: "system",
            content:
              "You are an elite viral TikTok food battle generator that creates cinematic, high-converting content.",
          },
          {
            role: "user",
            content: `
You are an elite viral content creator specializing in TikTok food battles.

Your job is to create HIGH-CONVERTING, ADDICTIVE, CINEMATIC food battle scripts.

INPUT FOOD: "${food}"

GOAL:
Make it feel like a REAL confrontation between two foods — not quotes, not narration.

STRICT STRUCTURE:
Create 4 UNIQUE battles.

Each battle must include:
1. HERO FOOD (based on input)
2. VILLAIN FOOD (opposite type, e.g. junk vs healthy)

SCRIPT RULES:
- EXACTLY 3 lines ONLY
- Format MUST be:
  HERO attacks →
  VILLAIN defends →
  HERO finishes strong

- Each line must be:
  • LONG (12–20 words)
  • Emotional
  • Aggressive
  • Spoken dialogue

❌ NO quotes
❌ NO narration
✅ MUST feel like argument

CINEMATIC:
- Same location
- Pixar realism
- grounded

ALWAYS INCLUDE:
- imagePrompts (2)
- videoPrompts (3)
- seo

RETURN JSON ONLY:

{
  "results": [
    {
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
        temperature: 0.9,
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

    return {
      results: parsed.results,
    };
  } catch (err) {
    console.error("AICC ERROR:", err);

    // fallback para hindi mag crash
    return {
      results: [
        {
          pair: { hero: food || "Healthy Food", villain: "Junk Food" },
          script: {
            duration: "16s",
            dialogue: [
              {
                speaker: "hero",
                line:
                  "I give your body real energy that builds strength instead of slowly destroying your health from within.",
              },
              {
                speaker: "villain",
                line:
                  "I may taste better right now, but I am the reason your body pays the price later.",
              },
              {
                speaker: "hero",
                line:
                  "Short pleasure isn't worth long-term damage—choose what actually keeps you alive and strong.",
              },
            ],
          },
          imagePrompts: [
            "healthy food cinematic lighting",
            "junk food greasy dramatic shot",
          ],
          videoPrompts: [
            "close-up healthy food glow",
            "junk food slow motion oil drip",
            "final hero clean aesthetic shot",
          ],
          seo: {
            title: `${food} vs Junk Food`,
            description: "Healthy vs unhealthy food battle",
            hashtags: ["#food", "#viral", "#health"],
          },
        },
      ],
    };
  }
}
