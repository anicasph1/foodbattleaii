import TopoBg from './components/TopoBg';
import { useState, useEffect } from 'react';
import type { BattleResult } from '@/types';
import { generateBattles } from '@/lib/utils';
import { motion } from 'framer-motion';

function App() {
  const [food, setFood] = useState('');
  const [results, setResults] = useState<BattleResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-white/30 transition"
            />

            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              type="submit"
              disabled={loading}
              className="bg-white text-black px-6 rounded-xl font-semibold"
            >
              {loading ? "..." : "Generate"}
            </motion.button>

          </div>
        </form>

        {error && (
          <p className="text-red-400 mb-6 text-sm">{error}</p>
        )}

        {/* RESULTS */}
        <div className="space-y-8">

          {results.map((item, i) => {
            const lines = item.script.dialogue;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:scale-[1.01] transition"
              >

                {/* TITLE */}
                <h3 className="text-lg font-semibold mb-4">
                  {item.pair.hero} vs {item.pair.villain}
                </h3>

                {/* 🔥 HOOK (NEW) */}
                {item.script.hook && (
                  <p className="text-red-500 font-semibold mb-4">
                    {item.script.hook}
                  </p>
                )}

                <div className="h-px bg-white/10 mb-4" />

                {/* SCRIPT */}
                <div className="space-y-3 text-sm leading-relaxed mb-4">
                  {lines.map((line, idx) => (
                    <p
                      key={idx}
                      className={
                        idx === 1
                          ? "text-white/50"
                          : idx === 2
                          ? "text-white font-medium"
                          : "text-white"
                      }
                    >
                      {line.line}
                    </p>
                  ))}
                </div>

                {/* IMAGE PROMPTS */}
                <p className="text-xs text-white/40 mb-1">Image Prompts</p>
                <ul className="text-xs text-white/70 mb-4 list-disc ml-4">
                  {item.imagePrompts.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>

                {/* COPY */}
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      [
                        item.script.hook,
                        ...item.script.dialogue.map((l) => l.line)
                      ].join("\n")
                    )
                  }
                  className="text-xs text-white/40 hover:text-white transition"
                >
                  Copy Script
                </button>

              </motion.div>
            );
          })}

        </div>

      </main>
    </div>
  );
}

export default App;
