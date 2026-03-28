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
            content: `
Create 4 UNIQUE viral food battles using "${food}"

STRICT:
- 3 lines ONLY (hero → villain → hero)
- Each line LONG, emotional, dramatic
- TikTok pacing (8s + 8s)
- Cinematic Pixar-level realism
- Same location (NOT fantasy world)

Include:
- imagePrompts (2 cinematic)
- videoPrompts (3 cinematic shots)
- SEO (title, description, hashtags)

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
}
`,
          },
        ],
        temperature: 0.9,
      }),
    });

    const data = await res.json();

    const text = data?.choices?.[0]?.message?.content;

    // 🔒 prevent crash
    if (!text) {
      throw new Error("No AI response");
    }

    // 🔒 clean possible bad formatting
    const clean = text.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(clean);

    return {
      results: parsed.results || [],
    };
  } catch (err) {
    console.error("AICC ERROR:", err);

    // ✅ SAFE fallback (para di mag black screen)
    return {
      results: [
        {
          pair: { hero: food || "Healthy Food", villain: "Junk Food" },
          script: {
            duration: "16s",
            dialogue: [
              {
                speaker: food || "Healthy Food",
                line:
                  "I fuel your body with real strength and long-lasting energy that actually builds your future and keeps you alive.",
              },
              {
                speaker: "Junk Food",
                line:
                  "I might taste better for a moment, but I'm silently destroying your health from the inside every single day.",
              },
              {
                speaker: food || "Healthy Food",
                line:
                  "Short pleasure isn't worth long-term damage—choose what truly makes you stronger and not what slowly kills you.",
              },
            ],
          },
          imagePrompts: [
            "healthy food cinematic lighting",
            "junk food greasy dramatic shot",
          ],
          videoPrompts: [
            "close-up healthy food glowing",
            "junk food falling apart slow motion",
            "final hero shot clean food",
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
