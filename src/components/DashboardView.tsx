import { motion } from 'motion/react';
import { User } from 'firebase/auth';
import { ChevronRight, LayoutDashboard, History, CheckCircle2, TrendingUp, Lock, Target, RefreshCcw } from 'lucide-react';
import { GameState } from '../types';

export function DashboardView({ user, gameState, proposalStatus, onBack, onNavigateToPitch }: { 
  user: User, 
  gameState: GameState | null, 
  proposalStatus: { 
    status: string, 
    review: string,
    idea?: string,
    budget?: number,
    trust?: number,
    impact?: number,
    pitchText?: string
  } | null,
  onBack: () => void,
  onNavigateToPitch?: () => void
}) {
  const completedStages = gameState ? (gameState.stageStatus === 'final_pitch' || gameState.isGameOver ? gameState.stages.length : gameState.currentStage - 1) : 0;

  return (
    <div className="min-h-screen p-8 md:p-16 space-y-12 bg-[#f5f5f0]">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
          <ChevronRight className="w-5 h-5 rotate-180" /> Back to Journey
        </button>
        <div className="flex items-center gap-6">
          {gameState?.isGameOver && (
            <button 
              onClick={() => window.location.reload()} 
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-black/5 hover:bg-black/10 px-4 py-2 rounded-full transition-all"
            >
              <RefreshCcw className="w-3 h-3" /> New Journey
            </button>
          )}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-bold">{user.displayName}</div>
              <div className="text-[10px] text-muted uppercase tracking-widest">{user.email}</div>
            </div>
            <img src={user.photoURL || ''} className="w-10 h-10 rounded-full border border-black/5" alt="Profile" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-10 space-y-8">
            <div className="flex items-center gap-3 text-muted">
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Progress Overview</span>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Stages Completed</div>
                <div className="text-4xl font-serif">{completedStages}<span className="text-sm text-muted">/{gameState?.stages.length || 5}</span></div>
              </div>
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Total Impact</div>
                <div className="text-4xl font-serif">{gameState?.impact || 0}</div>
              </div>
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Investor Trust</div>
                <div className="text-4xl font-serif">{gameState?.trust || 0}%</div>
              </div>
            </div>

            <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(completedStages / (gameState?.stages.length || 5)) * 100}%` }}
                className="h-full bg-foreground"
              />
            </div>
          </div>

          <div className="glass-card p-10 space-y-8">
            <div className="flex items-center gap-3 text-muted">
              <History className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Stage Breakdown</span>
            </div>
            <div className="space-y-4">
              {gameState?.stages.map((stage, i) => {
                const isCompleted = i + 1 <= completedStages;
                const isCurrent = i + 1 === gameState.currentStage && !isCompleted;
                const attempts = gameState.stageAttempts[i + 1] || 0;
                
                return (
                  <div key={i} className={`p-6 rounded-2xl border flex items-center justify-between ${isCompleted ? 'bg-black/5 border-black/5' : isCurrent ? 'border-foreground shadow-sm' : 'border-dashed border-black/10 opacity-50'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isCompleted ? 'bg-foreground text-white' : isCurrent ? 'bg-black/5 text-foreground' : 'bg-black/5 text-muted'}`}>
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-medium">{stage.name}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted uppercase tracking-widest">{stage.type}</span>
                          {attempts > 0 && (
                            <span className="text-[10px] bg-black/5 px-2 py-0.5 rounded-full text-muted font-bold">
                              {attempts} {attempts === 1 ? 'Attempt' : 'Attempts'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                    {isCurrent && <TrendingUp className="w-5 h-5 text-foreground animate-pulse" />}
                    {!isCompleted && !isCurrent && <Lock className="w-4 h-4 text-muted" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className={`glass-card p-10 space-y-8 border-2 ${proposalStatus?.status === 'accepted' ? 'border-green-500/20' : proposalStatus?.status === 'rejected' ? 'border-red-500/20' : 'border-black/5'}`}>
            <div className="flex items-center gap-3 text-muted">
              <Target className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Final Proposal Status</span>
            </div>
            
            <div className="text-center space-y-6">
              {proposalStatus ? (
                <>
                  <div className={`text-5xl font-serif capitalize ${proposalStatus.status === 'accepted' ? 'text-green-600' : proposalStatus.status === 'rejected' ? 'text-red-500' : 'text-muted'}`}>
                    {proposalStatus.status}
                  </div>
                  
                  <div className="space-y-4 text-left">
                    <div className="p-6 rounded-2xl bg-black/5 text-sm text-muted leading-relaxed italic font-serif">
                      "{proposalStatus.review}"
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-[10px] uppercase tracking-widest font-bold">
                      <div className="p-4 rounded-xl bg-white border border-black/5">
                        <div className="text-muted mb-1">Final Budget</div>
                        <div>₹{proposalStatus.budget?.toLocaleString()}</div>
                      </div>
                      <div className="p-4 rounded-xl bg-white border border-black/5">
                        <div className="text-muted mb-1">Final Trust</div>
                        <div>{proposalStatus.trust}%</div>
                      </div>
                      <div className="p-4 rounded-xl bg-white border border-black/5">
                        <div className="text-muted mb-1">Final Impact</div>
                        <div>{proposalStatus.impact}</div>
                      </div>
                      <div className="p-4 rounded-xl bg-white border border-black/5">
                        <div className="text-muted mb-1">Startup Idea</div>
                        <div className="truncate">{proposalStatus.idea}</div>
                      </div>
                    </div>

                    {proposalStatus.pitchText && (
                      <div className="p-4 rounded-xl bg-white border border-black/5 space-y-2">
                        <div className="text-[10px] text-muted uppercase tracking-widest font-bold">Final Pitch Submission</div>
                        <p className="text-xs text-muted line-clamp-3 italic">"{proposalStatus.pitchText}"</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="text-4xl font-serif text-muted">Pending</div>
                  <p className="text-xs text-muted leading-relaxed">Complete all stages to receive your final investor review and proposal status.</p>
                  {gameState?.stageStatus === 'final_pitch' && onNavigateToPitch && (
                    <button 
                      onClick={onNavigateToPitch}
                      className="w-full bg-foreground text-white text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl hover:scale-[1.02] transition-all"
                    >
                      Submit Final Pitch
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="p-10 space-y-6 bg-black text-white rounded-3xl shadow-xl">
            <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-60">Strategic Tip</h4>
            <p className="text-sm leading-relaxed italic font-serif">
              "The best founders don't just build products; they build trust. Your progress reflects your ability to navigate uncertainty with data and conviction."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
