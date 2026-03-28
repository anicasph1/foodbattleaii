export interface FoodPair {
  hero: string;
  villain: string;
}

export interface DialogueLine {
  speaker: 'hero' | 'villain' | 'narrator';
  line: string;
}

export interface Script {
  duration: string;
  dialogue: DialogueLine[];
}

export interface SEO {
  title: string;
  description: string;
  hashtags: string[];
}

export interface BattleResult {
  pair: FoodPair;
  script: Script;
  imagePrompts: string[];
  videoPrompts: string[];
  seo: SEO;
}

export interface GenerateResponse {
  results: BattleResult[];
}

export interface ApiError {
  error: string;
  fallback?: BattleResult[];
}
