import TopoBg from './components/TopoBg';
import { useState, useEffect } from 'react';
import type { BattleResult } from '@/types';
import { generateBattles } from '@/lib/utils';

function App() {
  const [food, setFood] = useState('');
  const [results, setResults] = useState<BattleResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // dark mode always on (Apple style)
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!food.trim()) {
      setError('Enter a food');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await generateBattles(food);
      setResults(data.results || []);
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">

      {/* TOPO BACKGROUND */}
      <TopoBg />

      {/* HEADER */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between">
          <h1 className="text-sm font-semibold tracking-tight">
            Tyzn Shorts
          </h1>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-4xl mx-auto px-6 py-20">

        {/* HERO */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-4">
            Viral Food Battles
          </h2>

          <p className="text-white/60">
            Dark cinematic scripts for TikTok & Shorts
          </p>
        </div>

        {/* INPUT */}
        <form onSubmit={handleGenerate} className="mb-16">
          <div className="flex gap-3">

            <input
              value={food}
              onChange={(e) => setFood(e.target.value)}
              placeholder="Enter food..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-white/30"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-white text-black px-6 rounded-xl font-semibold"
            >
              {loading ? "..." : "Generate"}
            </button>

          </div>
        </form>

        {/* ERROR */}
        {error && (
          <p className="text-red-400 mb-6 text-sm">{error}</p>
        )}

        {/* RESULTS */}
        <div className="space-y-6">

          {results.map((item, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
            >

              {/* TITLE */}
              <h3 className="text-lg font-semibold mb-3">
                {item.pair.hero} vs {item.pair.villain}
              </h3>

              {/* SCRIPT */}
              <div className="space-y-2 text-white/80 text-sm mb-4">
                {item.script.dialogue.map((line, idx) => (
                  <p key={idx}>
                    <span className="text-white font-medium">
                      {line.speaker}:
                    </span>{" "}
                    {line.line}
                  </p>
                ))}
              </div>

              {/* IMAGE PROMPTS */}
              <div className="text-xs text-white/50 mb-2">
                Image Prompts:
              </div>
              <ul className="text-xs text-white/70 mb-4 list-disc ml-4">
                {item.imagePrompts.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>

              {/* VIDEO PROMPTS */}
              <div className="text-xs text-white/50 mb-2">
                Video Prompts:
              </div>
              <ul className="text-xs text-white/70 mb-4 list-disc ml-4">
                {item.videoPrompts.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>

              {/* SEO */}
              <div className="text-xs text-white/50 mb-1">
                SEO:
              </div>
              <p className="text-xs text-white/70">
                {item.seo.title}
              </p>

              {/* COPY */}
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    item.script.dialogue
                      .map((l) => `${l.speaker}: ${l.line}`)
                      .join("\n")
                  )
                }
                className="mt-4 text-xs text-white/50 hover:text-white"
              >
                Copy
              </button>

            </div>
          ))}

        </div>

      </main>
    </div>
  );
}

export default App;
