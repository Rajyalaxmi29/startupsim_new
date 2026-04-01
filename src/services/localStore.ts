import { GameState } from "../types";

const USER_KEY = 'startupsim_user';
const PROGRESS_KEY = 'startupsim_progress_';
const PROPOSAL_KEY = 'startupsim_proposal_';

export interface LocalUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export const localAuth = {
  login: (email: string, password: string): LocalUser => {
    // Basic mock login - in a real app, you'd verify against a stored list
    const user: LocalUser = {
      uid: btoa(email), // simple hash for UID
      email,
      displayName: email.split('@')[0],
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  },
  logout: () => {
    localStorage.removeItem(USER_KEY);
  },
  getCurrentUser: (): LocalUser | null => {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  }
};

export const localStore = {
  saveProgress: (userId: string, data: { gameState: GameState }) => {
    localStorage.setItem(`${PROGRESS_KEY}${userId}`, JSON.stringify(data.gameState));
  },
  getProgress: (userId: string): GameState | null => {
    const data = localStorage.getItem(`${PROGRESS_KEY}${userId}`);
    return data ? JSON.parse(data) : null;
  },
  saveFinalProposal: (userId: string, status: string, review: string, details: any) => {
    const proposal = { status, review, ...details, timestamp: new Date().toISOString() };
    localStorage.setItem(`${PROPOSAL_KEY}${userId}`, JSON.stringify(proposal));
  },
  saveStageHistory: (userId: string, stageName: string, score: number, feedback: string) => {
    const historyKey = `startupsim_history_${userId}`;
    const existing = localStorage.getItem(historyKey);
    const history = existing ? JSON.parse(existing) : [];
    history.push({ stageName, score, feedback, timestamp: new Date().toISOString() });
    localStorage.setItem(historyKey, JSON.stringify(history));
  },
  getProposal: (userId: string) => {
    const data = localStorage.getItem(`${PROPOSAL_KEY}${userId}`);
    return data ? JSON.parse(data) : null;
  },
  deleteProposal: (userId: string) => {
    localStorage.removeItem(`${PROPOSAL_KEY}${userId}`);
  }
};
