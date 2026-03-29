export interface ScriptLine {
  speaker: string;
  line: string;
}

export interface Script {
  duration: string;
  dialogue: ScriptLine[];
}

export interface BattleResult {
  hook: string; // ✅ nasa top-level (IMPORTANT)
  pair: {
    hero: string;
    villain: string;
  };
  script: Script;
  imagePrompts: string[];
  videoPrompts: string[];
  seo: {
    title: string;
    description: string;
    hashtags: string[];
  };
}
