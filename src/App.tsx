import TopoBg from "@/components/TopoBg";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  
  Sparkles, 
  Zap, 
  Flame, 
  TrendingUp, 
  Moon, 
  Sun,
  ChefHat,
  Swords,
  ArrowRight,
  Loader2,
  AlertCircle,
  Copy
} from 'lucide-react';
import BattleCard from '@/components/BattleCard';
import type { BattleResult } from '@/types';
import { cn, generateBattles } from '@/lib/utils';

function App() {
  const [food, setFood] = useState('');
  const [results, setResults] = useState<BattleResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Initialize dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!food.trim()) {
      setError('Please enter a food name');
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const data = await generateBattles(food.trim());
      
      if (data.results && Array.isArray(data.results)) {
        setResults(data.results);
        setHasGenerated(true);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500",
      darkMode ? "bg-slate-950" : "bg-slate-50"
    )}>
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className={cn(
          "absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[120px] opacity-30 transition-colors duration-500",
          darkMode ? "bg-purple-600" : "bg-purple-400"
        )} />
        <div className={cn(
          "absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[100px] opacity-20 transition-colors duration-500",
          darkMode ? "bg-pink-600" : "bg-pink-400"
        )} />
        <div className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] opacity-10 transition-colors duration-500",
          darkMode ? "bg-cyan-600" : "bg-cyan-400"
        )} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-50" />
        
        {/* Noise overlay */}
        <div className="absolute inset-0 noise-overlay" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Swords className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Tyzn Shorts</h1>
              <p className={cn(
                "text-xs transition-colors",
                darkMode ? "text-white/50" : "text-slate-500"
              )}>
                Viral Food Battle Generator
              </p>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={toggleDarkMode}
            className={cn(
              "p-3 rounded-xl transition-all duration-300",
              darkMode 
                ? "bg-white/10 hover:bg-white/20 text-white" 
                : "bg-slate-200 hover:bg-slate-300 text-slate-700"
            )}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-12"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <span className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4",
                darkMode 
                  ? "bg-white/10 text-white/80 border border-white/10" 
                  : "bg-slate-200 text-slate-700 border border-slate-300"
              )}>
                <Sparkles className="w-4 h-4 text-amber-400" />
                AI-Powered Viral Content
                <Sparkles className="w-4 h-4 text-amber-400" />
              </span>
            </motion.div>

            <motion.h2 
              variants={itemVariants}
              className={cn(
                "text-4xl md:text-6xl font-bold mb-4 leading-tight",
                darkMode ? "text-white" : "text-slate-900"
              )}
            >
              Create <span className="gradient-text">Viral Food Battles</span>
              <br />
              in Seconds
            </motion.h2>

            <motion.p 
              variants={itemVariants}
              className={cn(
                "text-lg max-w-2xl mx-auto mb-8",
                darkMode ? "text-white/60" : "text-slate-600"
              )}
            >
              Generate dramatic Hero vs Villain food content for TikTok, YouTube Shorts, and Instagram Reels. 
              AI-powered scripts, prompts, and SEO in one click.
            </motion.p>

            {/* Feature Pills */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-3 mb-10"
            >
              {[
                { icon: Zap, text: '16-Second Format' },
                { icon: Flame, text: 'Hero vs Villain' },
                { icon: TrendingUp, text: 'Viral-Optimized' },
                { icon: ChefHat, text: 'Pixar-Style' },
              ].map((feature, i) => (
                <div 
                  key={i}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm",
                    darkMode 
                      ? "bg-white/5 text-white/70 border border-white/10" 
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  )}
                >
                  <feature.icon className="w-4 h-4 text-purple-400" />
                  {feature.text}
                </div>
              ))}
            </motion.div>

            {/* Input Form */}
            <motion.form 
              variants={itemVariants}
              onSubmit={handleGenerate}
              className="max-w-xl mx-auto"
            >
              <div className={cn(
                "relative p-2 rounded-2xl transition-all duration-300",
                darkMode 
                  ? "bg-white/5 border border-white/10" 
                  : "bg-white border border-slate-200 shadow-lg"
              )}>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <ChefHat className={cn(
                      "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors",
                      darkMode ? "text-white/40" : "text-slate-400"
                    )} />
                    <input
                      type="text"
                      value={food}
                      onChange={(e) => setFood(e.target.value)}
                      placeholder="Enter a food (e.g., Pizza, Burger, Sushi...)"
                      className={cn(
                        "w-full pl-12 pr-4 py-4 rounded-xl text-lg outline-none transition-all duration-300 input-glow",
                        darkMode 
                          ? "bg-white/5 text-white placeholder:text-white/30 border border-white/10 focus:border-purple-500/50" 
                          : "bg-slate-50 text-slate-900 placeholder:text-slate-400 border border-slate-200 focus:border-purple-500"
                      )}
                      disabled={loading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !food.trim()}
                    className={cn(
                      "px-6 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300",
                      "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500",
                      "text-white shadow-lg shadow-purple-500/25",
                      "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
                      "btn-shine"
                    )}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="hidden sm:inline">Generating...</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Generate</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.form>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 max-w-xl mx-auto"
                >
                  <div className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl",
                    darkMode 
                      ? "bg-red-500/10 border border-red-500/30 text-red-300" 
                      : "bg-red-50 border border-red-200 text-red-600"
                  )}>
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Results Grid */}
          <AnimatePresence>
            {hasGenerated && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Results Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between"
                >
                  <h3 className={cn(
                    "text-2xl font-bold",
                    darkMode ? "text-white" : "text-slate-900"
                  )}>
                    Generated Battles
                    <span className="ml-3 text-sm font-normal text-white/50">
                      ({results.length} results)
                    </span>
                  </h3>
                  <button
                    onClick={() => {
                      const allContent = results.map((r, i) => 
                        `Battle #${i + 1}: ${r.pair.hero} vs ${r.pair.villain}\n\nScript:\n${r.script.dialogue.map(d => `${d.speaker}: ${d.line}`).join('\n')}\n\n---\n`
                      ).join('\n');
                      navigator.clipboard.writeText(allContent);
                    }}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      darkMode 
                        ? "bg-white/10 hover:bg-white/20 text-white" 
                        : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                    )}
                  >
                    <Copy className="w-4 h-4" />
                    Copy All
                  </button>
                </motion.div>

                {/* Cards Grid */}
                {results.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {results.map((result, index) => (
                      <BattleCard 
                        key={index} 
                        result={result} 
                        index={index} 
                      />
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      "text-center py-16 rounded-2xl",
                      darkMode 
                        ? "bg-white/5 border border-white/10" 
                        : "bg-slate-100 border border-slate-200"
                    )}
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-purple-400" />
                    </div>
                    <p className={cn(
                      "text-lg font-medium",
                      darkMode ? "text-white/70" : "text-slate-600"
                    )}>
                      No battles generated yet
                    </p>
                    <p className={cn(
                      "text-sm mt-1",
                      darkMode ? "text-white/40" : "text-slate-400"
                    )}>
                      Enter a food name and click Generate to create viral content
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={cn(
              "mt-20 pt-8 border-t text-center",
              darkMode 
                ? "border-white/10 text-white/40" 
                : "border-slate-200 text-slate-500"
            )}
          >
            <p className="text-sm">
              Made with <span className="text-red-400">♥</span> for viral content creators
            </p>
            <p className="text-xs mt-2 opacity-60">
              Generate dramatic food battles for TikTok, YouTube Shorts & Instagram Reels
            </p>
          </motion.footer>
        </div>
      </main>
    </div>
  );
}

export default App;
