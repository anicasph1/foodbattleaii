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
              "You are an elite viral TikTok food battle generator creating cinematic, high-converting content.",
          },
          {
            role: "user",
            content: `
You are an elite viral TikTok food battle creator.

Your job is to generate HIGHLY VIRAL, CINEMATIC, ADDICTIVE food battles that feel like real confrontations.

INPUT FOOD: "${food}"

GOAL:
Create intense "hero vs villain" food battles that feel like real arguments, not quotes.

---

STRUCTURE:

Generate 4 COMPLETELY DIFFERENT battles.

Each must include:
- HERO (based on input)
- VILLAIN (opposite type: junk vs healthy, cheap vs premium, etc.)

---

SCRIPT RULES (STRICT):

- EXACTLY 3 lines ONLY
- FORMAT:
  1. HERO attacks
  2. VILLAIN defends
  3. HERO finishes strong

- Each line:
  • 12–20 words
  • emotional
  • aggressive
  • spoken dialogue

❌ no quotes  
❌ no narration  
✅ must feel like argument  

---

VISUAL STYLE:

IMAGE PROMPTS (2):
- Pixar-style 3D animated
- anthropomorphic food (face, arms, emotion)
- intense confrontation
- cinematic lighting, volumetric light
- depth of field
- ultra detailed textures
- realistic environment (kitchen, grocery)

VIDEO PROMPTS (3):
- Pixar-style 3D animation
- same characters + location
- shots:
  1. close-up emotion
  2. slow motion action
  3. hero victory shot
- cinematic lighting, motion blur

---

SEO:

TITLE:
- viral clickbait
- include hero vs villain
- use power words (DESTROYS, SHOCKING, TRUTH)

DESCRIPTION:
- 1–2 lines
- emotional + curiosity

HASHTAGS:
- 5–8 tags
- mix viral + niche

---

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
      }),
    });

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;

    if (!text) throw new Error("No AI response");

    // clean markdown if meron
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

    // fallback para di mag crash
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
                  "I fuel your body with real strength and lasting energy instead of slowly destroying your health from within.",
              },
              {
                speaker: "villain",
                line:
                  "I may taste better right now, but I am the reason your body pays the price later without you noticing.",
              },
              {
                speaker: "hero",
                line:
                  "Short pleasure isn't worth long-term damage—choose what actually builds your body, not what breaks it.",
              },
            ],
          },
          imagePrompts: [
            "Pixar-style broccoli hero glowing cinematic lighting grocery store",
            "junk food greasy villain dramatic shadow cinematic Pixar style",
          ],
          videoPrompts: [
            "close-up emotional broccoli face Pixar style",
            "junk food slow motion fall cinematic",
            "final hero victory clean aesthetic shot Pixar",
          ],
          seo: {
            title: `${food} DESTROYS Junk Food (SHOCKING TRUTH)`,
            description:
              "This isn't just food—it's a battle between real health and hidden damage. Who really wins?",
            hashtags: [
              "#foodbattle",
              "#viralfood",
              "#foodtok",
              "#tiktokfood",
              "#healthyvsjunk",
            ],
          },
        },
      ],
    };
  }
}
