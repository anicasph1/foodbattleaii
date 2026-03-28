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
              "You are a viral TikTok food battle generator with cinematic storytelling.",
          },
          {
            role: "user",
            content: `Create 4 UNIQUE viral food battles using "${food}"

STRICT:
- 3 lines ONLY (hero → villain → hero)
- Each line LONG, emotional, dramatic
- TikTok pacing (8s + 8s)
- Cinematic Pixar-level realism
- Same location

RETURN JSON ONLY:
{
  "results": [
    {
      "pair": { "hero": "", "villain": "" },
      "script": {
        "duration": "16s",
        "dialogue": [
          { "speaker": "", "line": "" },
          { "speaker": "", "line": "" },
          { "speaker": "", "line": "" }
        ]
      },
      "imagePrompts": [],
      "videoPrompts": [],
      "seo": {
        "title": "",
        "description": "",
        "hashtags": []
      }
    }
  ]
}`,
          },
        ],
        temperature: 0.9,
      }),
    });

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;

    if (!text) throw new Error("No AI response");

    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return { results: parsed.results || [] };

  } catch (err) {
    console.error("AICC ERROR:", err);

    return {
      results: [
        {
          pair: { hero: food, villain: "Junk Food" },
          script: {
            duration: "16s",
           dialogue: [
  { speaker: "hero", line: "I fuel your body with real strength and long-lasting energy that builds your future." },
  { speaker: "villain", line: "I may taste good now, but I slowly destroy your health from within." },
  { speaker: "hero", line: "Short pleasure isn't worth long-term damage—choose what makes you stronger." }
],
          },
          imagePrompts: [],
          videoPrompts: [],
          seo: {
            title: `${food} vs Junk Food`,
            description: "Healthy vs unhealthy",
            hashtags: ["#food", "#viral"],
          },
        },
      ],
    };
  }
}
