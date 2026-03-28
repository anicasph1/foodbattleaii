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

Your job is to generate HIGHLY VIRAL, CINEMATIC, DARK, ADDICTIVE food battle content with strong emotional and psychological impact.

INPUT FOOD: "${food}"

---

GOAL:

Create intense "hero vs villain" food battles that feel like:
- a real argument
- psychological confrontation
- slightly uncomfortable truth

---

STRUCTURE:

Generate 4 COMPLETELY DIFFERENT battles.

Each must include:
- HERO (based on input food)
- VILLAIN (opposite type: junk vs healthy, comfort vs discipline, processed vs natural)

---

HOOK SYSTEM:

Each result MUST start with a hook.

Hook must:
- 1 line only
- extremely attention-grabbing
- slightly unsettling or emotional
- trigger curiosity, tension, or realization

Examples:
- "You think this is harmless… but it isn’t."
- "You’re not choosing this anymore—it’s choosing you."
- "One of these is slowly destroying you."

---

SCRIPT RULES:

- EXACTLY 3 lines ONLY
- FORMAT:
  1. HERO attacks
  2. VILLAIN defends
  3. HERO finishes with a DARK punchline

Each line must:
- be LONG (20–35 words)
- feel like natural spoken dialogue
- have pacing (not rushed)
- take ~4–6 seconds to say

---

TIMING RULE:

- TOTAL script must feel like ~16 seconds when spoken
- each line must have rhythm and breathing space
- avoid short or rushed sentences

---

DARK MODE:

Hero:
- calm, confident, slightly cold
- exposes uncomfortable truth

Villain:
- tempting, persuasive
- slightly defensive

---

PSYCHOLOGY:

Focus on:
- addiction vs control
- short-term pleasure vs long-term consequence
- comfort vs discipline

Make it feel personal.

---

KNOCKOUT LINE:

Final hero line must feel like:
- a realization
- a heavy truth
- something people replay

---

VISUAL STYLE:

IMAGE PROMPTS (2):
- Pixar-style 3D animated
- anthropomorphic food (face, arms, emotion)
- intense confrontation
- cinematic lighting
- volumetric light, depth of field
- ultra detailed textures
- realistic environment (kitchen, grocery store, table)

VIDEO PROMPTS (3):
- Pixar-style 3D animation
- same characters and location
- shots:
  1. close-up emotional face
  2. slow motion dramatic action
  3. final hero victory shot
- cinematic lighting, motion blur

---

SEO:

TITLE:
- viral clickbait
- include hero vs villain
- use power words (DESTROYS, TRUTH, SHOCKING)

DESCRIPTION:
- 1–2 sentences
- emotional and curiosity-driven

HASHTAGS:
- 5–8 tags
- mix viral + niche

---

OUTPUT RULES:

RETURN JSON ONLY
NO explanation
NO markdown

---

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

    return {
      results: parsed.results,
    };
  } catch (err) {
    console.error("AICC ERROR:", err);

    return {
      results: [
        {
          hook: "You think this is harmless… but it isn’t.",
          pair: { hero: food || "Healthy Food", villain: "Junk Food" },
          script: {
            duration: "16s",
            dialogue: [
              {
                speaker: "hero",
                line:
                  "I don’t just fill your stomach for a moment—I give your body real energy that builds strength, improves focus, and protects you long after the taste disappears.",
              },
              {
                speaker: "villain",
                line:
                  "I don’t need to protect anything—I just need to feel good instantly, because most people will always choose comfort over thinking about long-term consequences.",
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
