import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Target,
  Coins, 
  Users, 
  Zap,
  TrendingUp,
  LogOut,
  ChevronRight,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { generateStages, evaluatePitch, evaluateVideoPitch, evaluateMockPitch, evaluatePptPitch } from './services/ai';
import { GameState, Stage } from './types';
import { localStore, localAuth, LocalUser } from './services/localStore';
// import { auth, signInWithGoogle, logout, saveUserProgress, saveStageHistory, saveFinalProposal, deleteProposal, db, handleFirestoreError, OperationType } from './firebase';
// import { onAuthStateChanged, User } from 'firebase/auth';
// import { doc, onSnapshot } from 'firebase/firestore';

// Components
import { Metric } from './components/Metric';
import { HomeView } from './components/HomeView';
import { MapView } from './components/MapView';
import { StageDetailView } from './components/StageDetailView';
import { SimulationView } from './components/SimulationView';
import { PitchView } from './components/PitchView';
import { VideoPitchView } from './components/VideoPitchView';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { MockPitchView } from './components/MockPitchView';
import { PptPitchView } from './components/PptPitchView';
import { ResultView } from './components/ResultView';
import CommunityPage from './pages/community/CommunityPage';

const INITIAL_METRICS = {
  trust: 0,
  impact: 0
};

export default function App() {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'home' | 'map' | 'stage' | 'result' | 'dashboard'>('home');
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);
  const [pitchText, setPitchText] = useState('');
  const [mockPitchFeedback, setMockPitchFeedback] = useState<{ score: number; feedback: string; questions: string[]; isBad?: boolean } | null>(null);
  const [videoFeedback, setVideoFeedback] = useState<{ score: number; feedback: string; questions: string[]; isBad?: boolean } | null>(null);
  const [pptFeedback, setPptFeedback] = useState<{ score: number; feedback: string; questions: string[]; isBad?: boolean } | null>(null);
  const [pitchError, setPitchError] = useState<string | null>(null);
  const [proposalStatus, setProposalStatus] = useState<{ status: string; review: string } | null>(null);
  const [showLowBudgetWarning, setShowLowBudgetWarning] = useState(false);
  const [showApiKeyWarning, setShowApiKeyWarning] = useState(false);
  const initialLoadRef = useRef(false);

  // API Key Check
  useEffect(() => {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MISSING_API_KEY' || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
      setShowApiKeyWarning(true);
    }
  }, []);

  // Low Budget Warning
  useEffect(() => {
    if (gameState && gameState.budget < 10000 && !gameState.isGameOver) {
      setShowLowBudgetWarning(true);
    } else {
      setShowLowBudgetWarning(false);
    }
  }, [gameState?.budget, gameState?.isGameOver]);
  const navigate = useNavigate();
  const location = useLocation();

  // Sync view state with location if needed
  useEffect(() => {
    if (location.pathname === '/community') {
      setView('dashboard'); // Just to avoid home view logic if needed
    }
  }, [location]);

  // Auth Listener (Local)
  useEffect(() => {
    const currentUser = localAuth.getCurrentUser();
    setUser(currentUser);
    setAuthLoading(false);
  }, []);

  const handleLogin = (email: string, pass: string) => {
    setLoading(true);
    const loggedUser = localAuth.login(email, pass);
    setUser(loggedUser);
    setLoading(false);
  };

  const handleLogout = () => {
    localAuth.logout();
    setUser(null);
    setView('home');
  };

  // Load Progress from Local Storage
  useEffect(() => {
    if (!user) return;

    const loadedState = localStore.getProgress(user.uid);
    if (loadedState) {
      setGameState({
        ...loadedState,
        performanceHistory: loadedState.performanceHistory || [],
        stageAttempts: loadedState.stageAttempts || {}
      });
      // If game state exists, move to map if at home and first load
      if (view === 'home' && !initialLoadRef.current) {
        setView('map');
        initialLoadRef.current = true;
      }
    }

    const savedProposal = localStore.getProposal(user.uid);
    if (savedProposal) {
      setProposalStatus(savedProposal);
    }
  }, [user, view]);

  const handleStart = async (idea: string, budget: string) => {
    if (!user) {
      alert("Please sign in to start your journey!");
      return;
    }
    setLoading(true);
    try {
      const stages = await generateStages(idea, budget);
      const numericBudget = parseInt(budget.replace(/[^0-9]/g, '')) || 100000;
      const newGameState: GameState = {
        idea,
        audience: "Investors & Stakeholders",
        budget: numericBudget,
        ...INITIAL_METRICS,
        currentStage: 1,
        stages,
        isGameOver: false,
        stageStatus: 'overview',
        performanceHistory: [],
        stageAttempts: {}
      };
      setGameState(newGameState);
      localStore.saveProgress(user.uid, { gameState: newGameState });
      localStore.deleteProposal(user.uid);
      setView('map');
    } catch (error) {
      console.error("Failed to start journey:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChoice = async (impact: { budget: number; trust: number; impact: number }, feedback: string) => {
    if (!gameState || !user) return;
    
    const updatedState = {
      ...gameState,
      budget: Math.max(0, gameState.budget + impact.budget),
      trust: Math.min(100, Math.max(0, gameState.trust + impact.trust)),
      impact: Math.max(0, gameState.impact + impact.impact),
      performanceHistory: [...gameState.performanceHistory, (impact.budget > 0 ? 30 : 10) + (impact.trust > 0 ? 40 : 10) + (impact.impact > 0 ? 30 : 10)]
    };
    
    setGameState(updatedState);
    setSimulationResult(feedback);
    localStore.saveProgress(user.uid, { gameState: updatedState });
  };

  const handleMockPitchSubmit = async (text: string) => {
    if (!gameState || !selectedStage || !user) return;
    setLoading(true);
    try {
      const feedback = await evaluateMockPitch(gameState.idea, selectedStage.name, text);
      setMockPitchFeedback(feedback);
      
      let budgetChange = 0;
      if (feedback.score > 70) budgetChange = feedback.score * 5000;
      else if (feedback.score >= 40) budgetChange = feedback.score * 1000;
      else budgetChange = -(40 - feedback.score) * 2000;

      const impact = {
        budget: budgetChange,
        trust: Math.floor(feedback.score / 2) - 10,
        impact: Math.floor(feedback.score / 10)
      };
      
      const updatedState = {
        ...gameState,
        budget: Math.max(0, gameState.budget + impact.budget),
        trust: Math.min(100, Math.max(0, gameState.trust + impact.trust)),
        impact: Math.max(0, gameState.impact + impact.impact),
        performanceHistory: [...gameState.performanceHistory, feedback.score]
      };
      
      setGameState(updatedState);
      localStore.saveProgress(user.uid, { gameState: updatedState });
      localStore.saveStageHistory(user.uid, selectedStage.name, feedback.score, feedback.feedback);
    } catch (error) {
      console.error("Mock pitch evaluation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoPitchSubmit = async (videoBase64: string, mimeType: string) => {
    if (!gameState || !selectedStage || !user) return;
    setLoading(true);
    setPitchError(null);
    try {
      const feedback = await evaluateVideoPitch(gameState.idea, selectedStage.name, videoBase64, mimeType);
      setVideoFeedback(feedback);
      
      let budgetChange = 0;
      if (feedback.score > 70) budgetChange = feedback.score * 8000;
      else if (feedback.score >= 40) budgetChange = feedback.score * 2000;
      else budgetChange = -(40 - feedback.score) * 3000;

      const impact = {
        budget: budgetChange,
        trust: Math.floor(feedback.score / 1.5) - 15,
        impact: Math.floor(feedback.score / 8)
      };
      
      const updatedState = {
        ...gameState,
        budget: Math.max(0, gameState.budget + impact.budget),
        trust: Math.min(100, Math.max(0, gameState.trust + impact.trust)),
        impact: Math.max(0, gameState.impact + impact.impact),
        stageStatus: 'feedback',
        performanceHistory: [...gameState.performanceHistory, feedback.score]
      };
      
      setGameState(updatedState);
      localStore.saveProgress(user.uid, { gameState: updatedState });
      localStore.saveStageHistory(user.uid, selectedStage.name, feedback.score, feedback.feedback);
    } catch (error) {
      console.error("Video pitch evaluation failed:", error);
      setPitchError("Video pitch evaluation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePptPitchSubmit = async (text: string) => {
    if (!gameState || !selectedStage || !user) return;
    setLoading(true);
    try {
      const feedback = await evaluatePptPitch(gameState.idea, selectedStage.name, text);
      setPptFeedback(feedback);
      
      let budgetChange = 0;
      if (feedback.score > 70) budgetChange = feedback.score * 10000;
      else if (feedback.score >= 40) budgetChange = feedback.score * 3000;
      else budgetChange = -(40 - feedback.score) * 4000;

      const impact = {
        budget: budgetChange,
        trust: Math.floor(feedback.score / 1.2) - 20,
        impact: Math.floor(feedback.score / 5)
      };
      
      const updatedState = {
        ...gameState,
        budget: Math.max(0, gameState.budget + impact.budget),
        trust: Math.min(100, Math.max(0, gameState.trust + impact.trust)),
        impact: Math.max(0, gameState.impact + impact.impact),
        stageStatus: 'feedback',
        performanceHistory: [...gameState.performanceHistory, feedback.score]
      };
      
      setGameState(updatedState);
      localStore.saveProgress(user.uid, { gameState: updatedState });
      localStore.saveStageHistory(user.uid, selectedStage.name, feedback.score, feedback.feedback);
    } catch (error) {
      console.error("PPT pitch evaluation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSimulation = async () => {
    if (!gameState || !selectedStage || !user) return;
    
    const cost = selectedStage.simulationCost || 0;
    if (gameState.budget < cost) {
      alert(`Insufficient budget! You need $${cost.toLocaleString()} to attempt this stage, but you only have $${gameState.budget.toLocaleString()}.`);
      return;
    }

    const updatedState = { 
      ...gameState, 
      budget: gameState.budget - cost,
      stageStatus: 'simulation' as const,
      stageAttempts: {
        ...gameState.stageAttempts,
        [gameState.currentStage]: (gameState.stageAttempts[gameState.currentStage] || 0) + 1
      }
    };
    setGameState(updatedState);
    localStore.saveProgress(user.uid, { gameState: updatedState });
  };

  const handleRetryStage = async (type: 'video' | 'mock' | 'ppt') => {
    if (!gameState || !selectedStage || !user) return;
    
    const cost = selectedStage.simulationCost || 0;
    if (gameState.budget < cost) {
      alert(`Insufficient budget to retry! You need $${cost.toLocaleString()} to retry, but you only have $${gameState.budget.toLocaleString()}.`);
      return;
    }

    const updatedState = {
      ...gameState,
      budget: gameState.budget - cost,
      stageStatus: 'simulation' as const,
      stageAttempts: {
        ...gameState.stageAttempts,
        [gameState.currentStage]: (gameState.stageAttempts[gameState.currentStage] || 0) + 1
      }
    };

    if (type === 'video') {
      setVideoFeedback(null);
      setPitchError(null);
    } else if (type === 'mock') {
      setMockPitchFeedback(null);
    } else if (type === 'ppt') {
      setPptFeedback(null);
    }

    setGameState(updatedState);
    localStore.saveProgress(user.uid, { gameState: updatedState });
  };

  const nextStage = async () => {
    if (!gameState || !user) return;
    const isLastStage = gameState.currentStage === gameState.stages.length;
    
    if (isLastStage && gameState.stageStatus === 'feedback') {
      const updatedState = { ...gameState, stageStatus: 'final_pitch' as any };
      setGameState(updatedState);
      localStore.saveProgress(user.uid, { gameState: updatedState });
      setView('stage');
    } else if (isLastStage && selectedStage?.type === 'normal' && simulationResult) {
      // For normal stages that are the last stage
      const updatedState = { ...gameState, stageStatus: 'final_pitch' as any };
      setGameState(updatedState);
      localStore.saveProgress(user.uid, { gameState: updatedState });
      setView('stage');
    } else {
      const updatedState = { 
        ...gameState, 
        currentStage: gameState.currentStage + 1,
        stageStatus: 'overview' as const
      };
      setGameState(updatedState);
      setSimulationResult(null);
      setMockPitchFeedback(null);
      setVideoFeedback(null);
      setPptFeedback(null);
      setPitchText('');
      localStore.saveProgress(user.uid, { gameState: updatedState });
      setView('map');
    }
  };

  const handlePitchSubmit = async () => {
    if (!gameState || !user) return;
    setLoading(true);
    try {
      const feedback = await evaluatePitch(gameState.idea, pitchText);
      const isAccepted = feedback.score >= 70;
      const status = isAccepted ? 'accepted' : 'rejected';
      
      const updatedState = { ...gameState, pitchFeedback: feedback, isGameOver: true };
      setGameState(updatedState);
      
      localStore.saveProgress(user.uid, { gameState: updatedState });
      localStore.saveFinalProposal(user.uid, status as any, feedback.feedback, {
        idea: gameState.idea,
        budget: gameState.budget,
        trust: gameState.trust,
        impact: gameState.impact,
        pitchText: pitchText
      });
      
      setView('result');
    } catch (error) {
      console.error("Pitch evaluation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f0]">
        <div className="w-12 h-12 border-4 border-black/10 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginView onLogin={handleLogin} loading={loading} />;
  }

  return (
    <div className="min-h-screen bg-white text-foreground selection:bg-foreground selection:text-white font-sans">
      {/* API Key Warning */}
      <AnimatePresence>
        {showApiKeyWarning && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-amber-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-lg"
          >
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <div>
              <div className="font-bold">Gemini API Key Missing</div>
              <div className="text-xs opacity-80">AI features will not work. Please add your GEMINI_API_KEY to the .env file and restart the server.</div>
            </div>
            <button onClick={() => setShowApiKeyWarning(false)} className="ml-4 p-2 hover:bg-white/10 rounded-full">
              <LogOut className="w-4 h-4 rotate-90" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Low Budget Warning */}
      <AnimatePresence>
        {showLowBudgetWarning && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] bg-red-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4"
          >
            <AlertTriangle className="w-6 h-6" />
            <div>
              <div className="font-bold">Critical Budget Warning</div>
              <div className="text-xs opacity-80">Your budget is below ₹10,000. Manage resources carefully!</div>
            </div>
            <button onClick={() => setShowLowBudgetWarning(false)} className="ml-4 p-2 hover:bg-white/10 rounded-full">
              <LogOut className="w-4 h-4 rotate-90" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Bar */}
      {view !== 'dashboard' && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md h-20 border-b border-black/5">
          <div className="max-w-7xl mx-auto flex justify-between items-center px-8 h-full">
            <div className="flex items-center gap-12">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => { setView('home'); navigate('/'); }}
                className="text-3xl tracking-tight font-serif text-foreground cursor-pointer"
              >
                StartupSim<span className="text-xs align-top ml-0.5">®</span>
              </motion.div>
              
              <div className="hidden md:flex items-center gap-8 text-sm">
                {['Home', 'Simulation', 'Dashboard', 'Community'].map((item, i) => (
                  <motion.button 
                    key={item}
                    onClick={() => {
                      if (item === 'Community') {
                        navigate('/community');
                        return;
                      }
                      navigate('/');
                      if (item === 'Dashboard') {
                        setView('dashboard');
                        return;
                      }
                      if (view !== 'home') setView('home');
                      const id = item.toLowerCase() === 'home' ? 'hero' : item.toLowerCase();
                      setTimeout(() => {
                        const el = document.getElementById(id);
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, view !== 'home' ? 100 : 0);
                    }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`${(item === 'Home' && view === 'home' && location.pathname === '/') || (item === 'Dashboard' && view === 'dashboard') || (item === 'Community' && location.pathname === '/community') ? 'text-foreground font-medium' : 'text-muted'} transition-colors hover:text-foreground cursor-pointer bg-transparent border-none p-0`}
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/5">
                <img src={user.photoURL || ''} className="w-6 h-6 rounded-full" alt="User" />
                <span className="text-xs font-medium hidden sm:inline">{user.displayName || user.email.split('@')[0]}</span>
                <button onClick={handleLogout} className="p-1 hover:text-red-500 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
              
              {view === 'home' && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => {
                    if (gameState) {
                      setView('map');
                    } else {
                      document.getElementById('start-form')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="bg-foreground text-white rounded-full px-6 py-2.5 text-sm transition-all shadow-lg"
                >
                  {gameState ? 'Resume Simulation' : 'Begin Simulation'}
                </motion.button>
              )}
            </div>
          </div>
        </nav>
      )}

      {/* Dashboard Metrics */}
      {gameState && view !== 'home' && (
        <motion.div 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-20 left-0 right-0 z-40 p-4 bg-white/80 backdrop-blur-md border-b border-black/5"
        >
          <div className="max-w-7xl mx-auto flex justify-center gap-4">
            <Metric icon={<Target className="text-foreground w-5 h-5" />} label="Stages" value={`${gameState.currentStage - 1}/${gameState.stages.length}`} />
            <Metric icon={<Coins className="text-foreground w-5 h-5" />} label="Budget" value={`₹${(gameState.budget || 0).toLocaleString()}`} />
            <Metric icon={<Users className="text-foreground w-5 h-5" />} label="Trust" value={`${gameState.trust}%`} />
            <Metric icon={<Zap className="text-foreground w-5 h-5" />} label="Impact" value={gameState.impact} />
          </div>
        </motion.div>
      )}

      <main className={`${view === 'home' && location.pathname === '/' ? '' : 'pt-48 pb-20 px-4 max-w-5xl mx-auto'}`}>
        <Routes>
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/" element={
            <AnimatePresence mode="wait">
          {view === 'home' && (
            <HomeView onStart={handleStart} loading={loading} />
          )}

          {view === 'dashboard' && user && (
            <DashboardView 
              user={user} 
              gameState={gameState} 
              proposalStatus={proposalStatus} 
              onBack={() => setView(gameState ? 'map' : 'home')} 
              onNavigateToPitch={() => {
                if (gameState && gameState.stageStatus === 'final_pitch') {
                  setSelectedStage(gameState.stages[gameState.stages.length - 1]);
                  setView('stage');
                }
              }}
            />
          )}

          {view === 'map' && gameState && (
            <MapView 
              gameState={gameState} 
              onBack={() => setView('home')}
              onSelectStage={(stage) => {
                setSelectedStage(stage);
                if (gameState) {
                  const updatedState = { ...gameState, stageStatus: 'overview' as const };
                  setGameState(updatedState);
                  setView('stage');
                  localStore.saveProgress(user.uid, { gameState: updatedState });
                }
              }} 
            />
          )}

          {view === 'stage' && selectedStage && gameState && (
            <>
              {gameState.stageStatus === 'overview' && (
                <StageDetailView 
                  stage={selectedStage} 
                  onStartSimulation={handleStartSimulation}
                  onBack={() => setView('map')}
                  onSkip={nextStage}
                />
              )}

              {gameState.stageStatus === 'simulation' && (
                <>
                  {selectedStage.type === 'video-pitch' && (
                    <VideoPitchView 
                      stage={selectedStage}
                      feedback={videoFeedback}
                      onSubmit={handleVideoPitchSubmit}
                      onNext={nextStage}
                      onRetry={() => handleRetryStage('video')}
                      onBack={() => setView('map')}
                      loading={loading}
                      evaluationError={pitchError}
                    />
                  )}
                  {selectedStage.type === 'pitch' && (
                    <MockPitchView 
                      stage={selectedStage}
                      feedback={mockPitchFeedback}
                      onSubmit={handleMockPitchSubmit}
                      onNext={nextStage}
                      onRetry={() => handleRetryStage('mock')}
                      onBack={() => setView('map')}
                      loading={loading}
                    />
                  )}
                  {selectedStage.type === 'ppt-pitch' && (
                    <PptPitchView 
                      stage={selectedStage}
                      feedback={pptFeedback}
                      onSubmit={handlePptPitchSubmit}
                      onNext={nextStage}
                      onRetry={() => handleRetryStage('ppt')}
                      onBack={() => setView('map')}
                      loading={loading}
                    />
                  )}
                  {selectedStage.type === 'normal' && (
                    <SimulationView 
                      stage={selectedStage}
                      result={simulationResult}
                      onChoice={handleChoice}
                      onNext={nextStage}
                      onBack={() => setView('map')}
                    />
                  )}
                  {selectedStage.type === 'crisis' && (
                    <SimulationView 
                      stage={selectedStage}
                      result={simulationResult}
                      onChoice={handleChoice}
                      onNext={nextStage}
                      onBack={() => setView('map')}
                    />
                  )}
                </>
              )}

              {gameState.stageStatus === 'feedback' && (
                <>
                  {selectedStage.type === 'video-pitch' && videoFeedback && (
                    <VideoPitchView 
                      stage={selectedStage}
                      feedback={videoFeedback}
                      onSubmit={handleVideoPitchSubmit}
                      onNext={nextStage}
                      onRetry={() => handleRetryStage('video')}
                      onBack={() => setView('map')}
                      loading={loading}
                      evaluationError={pitchError}
                    />
                  )}
                  {selectedStage.type === 'pitch' && mockPitchFeedback && (
                    <MockPitchView 
                      stage={selectedStage}
                      feedback={mockPitchFeedback}
                      onSubmit={handleMockPitchSubmit}
                      onNext={nextStage}
                      onRetry={() => handleRetryStage('mock')}
                      onBack={() => setView('map')}
                      loading={loading}
                    />
                  )}
                  {selectedStage.type === 'ppt-pitch' && pptFeedback && (
                    <PptPitchView 
                      stage={selectedStage}
                      feedback={pptFeedback}
                      onSubmit={handlePptPitchSubmit}
                      onNext={nextStage}
                      onRetry={() => handleRetryStage('ppt')}
                      onBack={() => setView('map')}
                      loading={loading}
                    />
                  )}
                </>
              )}

              {gameState.stageStatus === 'final_pitch' && (
                <PitchView 
                  pitchText={pitchText}
                  setPitchText={setPitchText}
                  onSubmit={handlePitchSubmit}
                  onBack={() => setView('map')}
                  loading={loading}
                />
              )}
            </>
          )}

          {view === 'result' && (
            gameState?.pitchFeedback ? (
              <ResultView 
                feedback={gameState.pitchFeedback} 
                onRestart={() => window.location.reload()} 
                onBack={() => setView('map')}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-20 glass-card text-center max-w-2xl mx-auto">
                <div className="w-12 h-12 border-4 border-black/10 border-t-foreground rounded-full animate-spin mb-6" />
                <h3 className="text-2xl font-serif mb-2">Finalizing Investment Verdict</h3>
                <p className="text-muted italic">Consulting with the board of partners. Please wait...</p>
              </div>
            )
          )}
        </AnimatePresence>
          } />
        </Routes>
      </main>
    </div>
  );
}
