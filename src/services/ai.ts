import OpenAI from 'openai';
import { Stage } from '../types';
import { fashionStages, foodStages } from './staticJourneys';

// Keep the config here so you can easily switch back to AI later.
const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || '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';

const ai = new OpenAI({
  apiKey: apiKey,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'StartupSim'
  },
  dangerouslyAllowBrowser: true
});

export async function generateStages(idea: string, budget: string): Promise<Stage[]> {
  const isFashion = idea.toLowerCase().includes('fashion');
  const isFood = idea.toLowerCase().includes('food');

  if (isFood) {
    return foodStages;
  }
  // Default to fashion stages if they select fashion, or as a generic fallback.
  return fashionStages;
}

export async function evaluateVideoPitch(idea: string, stageName: string, videoBase64: string, mimeType: string) {
  // Static Mock Evaluation
  return {
    score: 85,
    feedback: 'This was a highly competent text/video pitch representation. Very clear value proposition and convincing delivery for the static mock.',
    questions: ['How do you defend against a large competitor?', 'Can you explain your CAC/LTV ratio?', 'What is the backup plan if supply chain fails?'],
    isBad: false
  };
}

export async function evaluatePptPitch(idea: string, stageName: string, pptContent: string) {
  // Static Mock Evaluation
  return {
    score: 80,
    feedback: 'Your pitch deck summary touches all the right bases. Good market size slide, and the moat makes sense for this stage. Focus a bit more on revenue channels.',
    questions: ['How will you capture your first 1,000 customers?', 'What is your biggest cost driver initially?', 'Is your pricing tier solid enough to sustain?'],
    isBad: false
  };
}

export async function evaluateMockPitch(idea: string, stageName: string, pitchText: string) {
  // Static Mock Evaluation
  return {
    score: 82,
    feedback: 'Solid text or elevator pitch. The feasibility seems realistic enough, and you have grasped your core customer problem well.',
    questions: ['How quickly can you turn a profit?', 'Do you need technical co-founders immediately?'],
    isBad: false
  };
}

export async function evaluatePitch(idea: string, pitchText: string) {
  // Static Mock Evaluation
  return {
    score: 88,
    feedback: 'Excellent final pitch! It is venture scale, metrics look compelling, and there is a clear path to profitability on paper.',
    questions: ['What keeps competitors from copying this tomorrow?', 'How will you utilize the $100M raised?', 'Who handles the hiring for expansion?'],
    isBad: false
  };
}
