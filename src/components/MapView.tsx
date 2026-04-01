import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { Lock, ArrowLeft, Check } from 'lucide-react';
import { GameState, Stage } from '../types';

const phaseColors = [
  { bg: "bg-blue-500", text: "text-blue-500", shadow: "shadow-blue-500/50" },
  { bg: "bg-pink-500", text: "text-pink-500", shadow: "shadow-pink-500/50" },
  { bg: "bg-orange-500", text: "text-orange-500", shadow: "shadow-orange-500/50" },
  { bg: "bg-yellow-400", text: "text-yellow-500", shadow: "shadow-yellow-400/50" },
  { bg: "bg-lime-500", text: "text-lime-600", shadow: "shadow-lime-500/50" },
  { bg: "bg-emerald-500", text: "text-emerald-600", shadow: "shadow-emerald-500/50" },
  { bg: "bg-purple-500", text: "text-purple-600", shadow: "shadow-purple-500/50" }
];

export function MapView({ gameState, onSelectStage, onBack }: { 
  gameState: GameState, 
  onSelectStage: (stage: Stage) => void,
  onBack: () => void 
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);
  
  // Fancy Scroll-driven 3D Effect for the container
  const { scrollXProgress } = useScroll({ container: scrollContainerRef });
  const springScroll = useSpring(scrollXProgress, { stiffness: 100, damping: 30 });
  const containerRotateY = useTransform(springScroll, [0, 1], [5, -5]);

  useEffect(() => {
    const activeStage = gameState.stages.find(s => s.id === gameState.currentStage);
    if (activeStage && scrollContainerRef.current) {
      const el = document.getElementById(`stage-${activeStage.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [gameState.currentStage, gameState.stages]);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative py-20 bg-white min-h-screen perspective-1000 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-12 mb-12 relative z-40">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-muted hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium font-serif">Back to Home</span>
        </button>
      </div>

      <motion.div 
        ref={scrollContainerRef}
        className="relative overflow-x-auto pb-32 pt-32 hide-scrollbar z-40"
        style={{ rotateY: containerRotateY, transformStyle: "preserve-3d" }}
      >
        <div className="flex items-center min-w-max px-[30vw] relative" style={{ transformStyle: "preserve-3d" }}>
          {/* Central Horizontal Line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-black/10 -translate-y-1/2" style={{ transform: "translateZ(-20px)" }} />

          {gameState.stages.map((stage, index) => {
            const isLocked = stage.id > gameState.currentStage;
            const isCompleted = stage.id < gameState.currentStage;
            const isCurrent = stage.id === gameState.currentStage;
            const isTop = index % 2 === 0;
            const colors = phaseColors[index % phaseColors.length];
            const isHovered = hoveredStage === stage.id;

            return (
              <motion.div 
                key={stage.id} 
                id={`stage-${stage.id}`}
                className={`relative flex flex-col items-center w-48 md:w-64 shrink-0 transition-all duration-300 ${hoveredStage !== null && !isHovered ? 'z-10' : 'z-50'}`}
                initial={{ opacity: 0, y: 50, filter: 'blur(0px)' }}
                animate={{ 
                  opacity: hoveredStage !== null && !isHovered ? 0.4 : 1, 
                  filter: hoveredStage !== null && !isHovered ? 'blur(4px)' : 'blur(0px)',
                  y: 0 
                }}
                transition={{ delay: index * 0.1, type: "spring" }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Vertical Connector */}
                <div 
                  className={`absolute left-1/2 -translate-x-1/2 w-px bg-black/10 ${isTop ? 'bottom-1/2 h-16 md:h-24' : 'top-1/2 h-16 md:h-24'}`} 
                  style={{ transform: "translateZ(-10px)" }}
                />

                {/* Label and Box Container */}
                <div className={`flex flex-col items-center ${isTop ? 'mb-32 md:mb-48' : 'mt-32 md:mt-48'}`} style={{ transformStyle: 'preserve-3d' }}>
                  {isTop && (
                    <motion.div 
                      whileHover={{ scale: 1.1, translateZ: 30 }}
                      className={`mb-4 text-sm md:text-base font-serif italic text-center max-w-[140px] cursor-default ${isCurrent ? 'text-black font-bold' : isCompleted ? colors.text : 'text-muted'}`}
                    >
                      {stage.name}
                    </motion.div>
                  )}

                  {/* Main Smaller Box */}
                  <div 
                    className="relative z-50 py-4 px-4" 
                    style={{ transformStyle: 'preserve-3d' }}
                    onMouseEnter={() => setHoveredStage(stage.id)}
                    onMouseLeave={() => setHoveredStage(null)}
                  >
                    <motion.div
                      whileHover={!isLocked ? { scale: 1.25, rotateX: isTop ? 15 : -15, rotateY: 15, z: 50 } : {}}
                      onClick={() => !isLocked && onSelectStage(stage)}
                      className={`
                        relative w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-500
                        ${isLocked ? 'bg-white border-2 border-black/10 shadow-sm' : ''}
                        ${isCurrent ? 'bg-black text-white shadow-2xl scale-110 ring-4 ring-black/20' : ''}
                        ${isCompleted ? `${colors.bg} text-white shadow-xl ${colors.shadow}` : ''}
                      `}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {isLocked ? (
                        <Lock className="w-7 h-7 md:w-8 md:h-8 text-black/20" style={{ transform: "translateZ(10px)" }} />
                      ) : isCompleted ? (
                        <Check className="w-7 h-7 md:w-8 md:h-8 text-white" strokeWidth={3} style={{ transform: "translateZ(20px)" }} />
                      ) : (
                        <span className="text-2xl md:text-3xl font-serif font-bold" style={{ transform: "translateZ(20px)" }}>
                          {index + 1}
                        </span>
                      )}
                    </motion.div>

                    {/* Hover Info Box */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, x: 20, rotateY: 45 }}
                          animate={{ opacity: 1, x: 0, rotateY: 0 }}
                          exit={{ opacity: 0, scale: 0.9, rotateY: 45 }}
                          className={`absolute left-full ml-4 md:ml-8 top-1/2 -translate-y-1/2 w-[240px] bg-white rounded-xl p-4 shadow-2xl border border-black/10 pointer-events-none z-[100] origin-left`}
                        >
                          <h4 className="font-bold text-sm text-foreground mb-1 line-clamp-1">{stage.name}</h4>
                          <p className="text-xs text-muted line-clamp-2 leading-relaxed">{stage.objective}</p>
                          <div className={`mt-3 text-[10px] font-bold tracking-wider uppercase ${isCompleted ? colors.text : isCurrent ? 'text-black' : 'text-muted'}`}>
                            {stage.phase} PHASE
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {!isTop && (
                    <motion.div 
                      whileHover={{ scale: 1.1, translateZ: 30 }}
                      className={`mt-4 text-sm md:text-base font-serif italic text-center max-w-[140px] cursor-default ${isCurrent ? 'text-black font-bold' : isCompleted ? colors.text : 'text-muted'}`}
                    >
                      {stage.name}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Custom Scrollbar UI */}
      <div className="max-w-4xl mx-auto px-12 mt-4 relative z-10">
        <div className="relative flex items-center">
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-3 h-3 border-l-2 border-b-2 border-black/20 rotate-45" />
          <div className="h-1 md:h-2 bg-[#E5E5E5] rounded-full w-full relative overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-black rounded-full"
              style={{ width: useTransform(scrollXProgress, [0, 1], ['0%', '100%']) }} 
            />
          </div>
          <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-3 h-3 border-r-2 border-t-2 border-black/20 rotate-45" />
        </div>
      </div>
    </motion.div>
  );
}
