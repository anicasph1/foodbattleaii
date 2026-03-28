import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Copy, 
  Check, 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  Hash, 
  ChevronDown, 
  ChevronUp,
  Swords,
  Zap
} from 'lucide-react';
import type { BattleResult } from '@/types';
import { cn } from '@/lib/utils';

interface BattleCardProps {
  result: BattleResult;
  index: number;
}

export default function BattleCard({ result, index }: BattleCardProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleCopy = async (content: string, section: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }
  };

  const glowColors = [
    'from-purple-500/20 via-pink-500/20 to-cyan-500/20',
    'from-cyan-500/20 via-purple-500/20 to-pink-500/20',
    'from-pink-500/20 via-cyan-500/20 to-purple-500/20',
    'from-amber-500/20 via-orange-500/20 to-red-500/20',
    'from-emerald-500/20 via-teal-500/20 to-cyan-500/20',
  ];

  const glowColor = glowColors[index % glowColors.length];

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "relative rounded-2xl overflow-hidden",
        "glass card-hover"
      )}
    >
      {/* Animated gradient border */}
      <div className={cn(
        "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-50",
        glowColor
      )} />
      
      {/* Inner content */}
      <div className="relative p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-300 text-xs font-semibold pulse-badge">
                <Zap className="w-3 h-3" />
                VIRAL
              </span>
              <span className="text-white/40 text-xs">{result.script.duration}</span>
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2 flex-wrap">
              <span className="text-emerald-400">{result.pair.hero}</span>
              <Swords className="w-5 h-5 text-amber-400" />
              <span className="text-rose-400">{result.pair.villain}</span>
            </h3>
          </div>
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center text-white font-bold text-sm border border-white/10">
            #{index + 1}
          </div>
        </div>

        {/* Script Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white/70 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Script
            </h4>
            <button
              onClick={() => handleCopy(
                result.script.dialogue.map(d => `${d.speaker.toUpperCase()}: ${d.line}`).join('\n\n'),
                'script'
              )}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white"
              title="Copy script"
            >
              {copiedSection === 'script' ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="space-y-2">
            {result.script.dialogue.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className={cn(
                  "p-3 rounded-lg text-sm leading-relaxed",
                  line.speaker === 'hero' 
                    ? 'bg-emerald-500/10 border-l-2 border-emerald-400' 
                    : line.speaker === 'villain'
                    ? 'bg-rose-500/10 border-l-2 border-rose-400'
                    : 'bg-amber-500/10 border-l-2 border-amber-400'
                )}
              >
                <span className={cn(
                  "text-xs font-bold uppercase tracking-wider mb-1 block",
                  line.speaker === 'hero' 
                    ? 'text-emerald-400' 
                    : line.speaker === 'villain'
                    ? 'text-rose-400'
                    : 'text-amber-400'
                )}>
                  {line.speaker}
                </span>
                <span className="text-white/90 italic">&ldquo;{line.line}&rdquo;</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Expandable Sections */}
        <div className="space-y-2">
          {/* Image Prompts */}
          <div className="rounded-lg overflow-hidden bg-white/5">
            <button
              onClick={() => toggleSection('images')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <span className="text-sm font-medium text-white/70 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-400" />
                Image Prompts ({result.imagePrompts.length})
              </span>
              {expandedSection === 'images' ? (
                <ChevronUp className="w-4 h-4 text-white/50" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white/50" />
              )}
            </button>
            <AnimatePresence>
              {expandedSection === 'images' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 space-y-3">
                    {result.imagePrompts.map((prompt, i) => (
                      <div key={i} className="relative group">
                        <p className="text-xs text-white/60 leading-relaxed pr-8">{prompt}</p>
                        <button
                          onClick={() => handleCopy(prompt, `image-${i}`)}
                          className="absolute top-0 right-0 p-1.5 rounded-md hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          {copiedSection === `image-${i}` ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-white/50" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Video Prompts */}
          <div className="rounded-lg overflow-hidden bg-white/5">
            <button
              onClick={() => toggleSection('videos')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <span className="text-sm font-medium text-white/70 flex items-center gap-2">
                <Video className="w-4 h-4 text-cyan-400" />
                Video Prompts ({result.videoPrompts.length})
              </span>
              {expandedSection === 'videos' ? (
                <ChevronUp className="w-4 h-4 text-white/50" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white/50" />
              )}
            </button>
            <AnimatePresence>
              {expandedSection === 'videos' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 space-y-3">
                    {result.videoPrompts.map((prompt, i) => (
                      <div key={i} className="relative group">
                        <p className="text-xs text-white/60 leading-relaxed pr-8">{prompt}</p>
                        <button
                          onClick={() => handleCopy(prompt, `video-${i}`)}
                          className="absolute top-0 right-0 p-1.5 rounded-md hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          {copiedSection === `video-${i}` ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-white/50" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SEO Section */}
          <div className="rounded-lg overflow-hidden bg-white/5">
            <button
              onClick={() => toggleSection('seo')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <span className="text-sm font-medium text-white/70 flex items-center gap-2">
                <Hash className="w-4 h-4 text-pink-400" />
                SEO & Hashtags
              </span>
              {expandedSection === 'seo' ? (
                <ChevronUp className="w-4 h-4 text-white/50" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white/50" />
              )}
            </button>
            <AnimatePresence>
              {expandedSection === 'seo' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 space-y-3">
                    <div className="relative group">
                      <span className="text-xs text-white/40 uppercase tracking-wider">Title</span>
                      <p className="text-sm text-white/80 pr-8">{result.seo.title}</p>
                      <button
                        onClick={() => handleCopy(result.seo.title, 'seo-title')}
                        className="absolute top-4 right-0 p-1.5 rounded-md hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        {copiedSection === 'seo-title' ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-white/50" />
                        )}
                      </button>
                    </div>
                    <div className="relative group">
                      <span className="text-xs text-white/40 uppercase tracking-wider">Description</span>
                      <p className="text-sm text-white/80 pr-8">{result.seo.description}</p>
                      <button
                        onClick={() => handleCopy(result.seo.description, 'seo-desc')}
                        className="absolute top-4 right-0 p-1.5 rounded-md hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        {copiedSection === 'seo-desc' ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-white/50" />
                        )}
                      </button>
                    </div>
                    <div>
                      <span className="text-xs text-white/40 uppercase tracking-wider">Hashtags</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {result.seo.hashtags.map((tag, i) => (
                          <span 
                            key={i} 
                            className="px-2 py-1 rounded-md bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-xs text-purple-300 border border-purple-500/30"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Copy All Button */}
        <button
          onClick={() => handleCopy(
            JSON.stringify(result, null, 2),
            'all'
          )}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-sm transition-all duration-300 btn-shine flex items-center justify-center gap-2"
        >
          {copiedSection === 'all' ? (
            <>
              <Check className="w-4 h-4" />
              Copied All!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Complete Battle
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
