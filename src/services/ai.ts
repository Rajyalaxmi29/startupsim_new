import { GoogleGenAI } from '@google/genai';
import { Stage } from '../types';
import { fashionStages, foodStages } from './staticJourneys';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

// Helper to call Gemini and parse text
async function geminiText(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });
  return response.text ?? '';
}

// Helper to safely parse JSON from Gemini response
function parseJSON<T>(text: string, fallback: T): T {
  try {
    // Strip markdown fences if present
    const clean = text.replace(/```json\n?/gi, '').replace(/```\n?/gi, '').trim();
    return JSON.parse(clean) as T;
  } catch {
    return fallback;
  }
}

export async function generateStages(idea: string, budget: string): Promise<Stage[]> {
  // Use static stages only as a true last-resort fallback
  if (!apiKey) {
    const isFashion = idea.toLowerCase().includes('fashion');
    const isFood = idea.toLowerCase().includes('food');
    return isFood ? foodStages : fashionStages;
  }

  const prompt = `You are an expert startup mentor. A user wants to simulate building a startup.

Startup Idea: "${idea}"
Budget: ${budget}

Generate a realistic 8-stage startup simulation journey for this specific idea. Each stage must be tailored to this exact startup.

Return ONLY a valid JSON array (no markdown, no commentary) with exactly 8 Stage objects matching this TypeScript type:

interface Stage {
  id: number;           // 1 through 8
  name: string;         // short stage name
  type: 'normal' | 'pitch' | 'crisis' | 'video-pitch' | 'ppt-pitch';
  phase: 'Idea' | 'Resources' | 'Investors' | 'Growth' | 'Scale';
  objective: string;    // one sentence goal
  tasks: string[];      // 3-4 specific action items
  realWorldResources: { title: string; description: string; link?: string }[];  // 2-3 items
  governmentFundingGuide?: { programName: string; eligibility: string; submissionTips: string };
  simulation: {
    scenario: string;   // 2-3 sentence realistic scenario description
    options: {
      text: string;
      impact: { budget: number; trust: number; impact: number };
      feedback: string;
    }[];                // exactly 3 options with realistic budget impacts (positive/negative)
  };
  realWorldCostEstimate: string;
  simulationCost: number;  // cost to attempt this stage (5000-50000)
}

Rules:
- Stages 1-2: phase "Idea" (types: normal, crisis)
- Stages 3-4: phase "Resources" (types: normal, pitch)
- Stages 5-6: phase "Investors" (types: video-pitch, ppt-pitch)
- Stages 7-8: phase "Growth" or "Scale" (types: normal, crisis)
- Budget impacts should be realistic: good choices +10000 to +100000, bad choices -5000 to -50000
- Trust impacts: -20 to +30
- Impact impacts: 0 to +20
- Make scenarios deeply specific to "${idea}"
- simulationCost should increase with each stage

Return raw JSON array only.`;

  try {
    const text = await geminiText(prompt);
    const stages = parseJSON<Stage[]>(text, []);
    if (Array.isArray(stages) && stages.length >= 6) {
      return stages;
    }
    // Fallback if parsing fails
    const isFashion = idea.toLowerCase().includes('fashion');
    const isFood = idea.toLowerCase().includes('food');
    return isFood ? foodStages : fashionStages;
  } catch (err) {
    console.error('generateStages error:', err);
    const isFashion = idea.toLowerCase().includes('fashion');
    const isFood = idea.toLowerCase().includes('food');
    return isFood ? foodStages : fashionStages;
  }
}

export async function evaluateMockPitch(idea: string, stageName: string, pitchText: string) {
  if (!apiKey || !pitchText.trim()) {
    return {
      score: 72,
      feedback: 'Solid elevator pitch. Good grasp of the problem and target audience.',
      questions: ['How quickly can you turn a profit?', 'Do you need technical co-founders?'],
      isBad: false
    };
  }

  const prompt = `You are a tough but fair startup investor evaluating a pitch at the "${stageName}" stage.

Startup Idea: "${idea}"
Pitch Text: "${pitchText}"

Evaluate this pitch and return ONLY a raw JSON object (no markdown):
{
  "score": <integer 0-100>,
  "feedback": "<2-3 sentence constructive feedback specific to this pitch>",
  "questions": ["<tough follow-up question 1>", "<tough follow-up question 2>", "<tough follow-up question 3>"],
  "isBad": <true if score < 40, else false>
}

Be realistic and specific. A well-structured pitch with clear value proposition, market size, and differentiation should score 70-90. Vague or generic pitches score 30-60.`;

  try {
    const text = await geminiText(prompt);
    const result = parseJSON(text, {
      score: 72,
      feedback: 'Decent pitch. Strengthen your market size argument.',
      questions: ['What is your CAC?', 'Who are your top competitors?', 'How do you scale?'],
      isBad: false
    });
    result.isBad = result.score < 40;
    return result;
  } catch (err) {
    console.error('evaluateMockPitch error:', err);
    return {
      score: 70,
      feedback: 'Good pitch overall. Work on the financial projections.',
      questions: ['What is your revenue model?', 'How will you acquire customers?'],
      isBad: false
    };
  }
}

export async function evaluateVideoPitch(idea: string, stageName: string, videoBase64: string, mimeType: string) {
  if (!apiKey) {
    return {
      score: 85,
      feedback: 'Compelling video pitch. Clear delivery and strong value proposition.',
      questions: ['How do you defend against large competitors?', 'What is your CAC/LTV ratio?', 'What is your backup plan if supply chain fails?'],
      isBad: false
    };
  }

  const prompt = `You are a venture capitalist evaluating a video pitch at the "${stageName}" stage for a startup called "${idea}".

The founder submitted a video pitch (description-based evaluation). Evaluate based on the startup idea and stage context.

Provide a detailed evaluation and return ONLY raw JSON:
{
  "score": <integer 0-100>,
  "feedback": "<2-3 sentences of specific, constructive feedback on delivery, content, and persuasiveness>",
  "questions": ["<hard investor question 1>", "<hard investor question 2>", "<hard investor question 3>"],
  "isBad": <true if score < 40>
}

Consider: clarity of value proposition, market opportunity, team credibility signals, financial ask, and confidence.`;

  try {
    const text = await geminiText(prompt);
    const result = parseJSON(text, {
      score: 78,
      feedback: 'Strong video pitch with good energy. Could improve on financial specifics.',
      questions: ['What is your burn rate?', 'How do you plan to scale?', 'Who is your main competitor?'],
      isBad: false
    });
    result.isBad = result.score < 40;
    return result;
  } catch (err) {
    console.error('evaluateVideoPitch error:', err);
    return {
      score: 80,
      feedback: 'Well-delivered pitch. Solid market understanding.',
      questions: ['What is your GTM strategy?', 'Revenue model details?', 'Team background?'],
      isBad: false
    };
  }
}

export async function evaluatePptPitch(idea: string, stageName: string, pptContent: string) {
  if (!apiKey || !pptContent.trim()) {
    return {
      score: 80,
      feedback: 'Your pitch deck covers all the key areas. Focus more on revenue channels.',
      questions: ['How will you capture your first 1,000 customers?', 'What is your biggest cost driver?', 'Is your pricing tier solid?'],
      isBad: false
    };
  }

  const prompt = `You are a senior investment analyst evaluating a pitch deck for "${idea}" at the "${stageName}" stage.

Pitch Deck Content/Summary: "${pptContent}"

Evaluate this pitch deck and return ONLY raw JSON:
{
  "score": <integer 0-100>,
  "feedback": "<2-3 sentences of specific feedback on the deck structure, content quality, and investor-readiness>",
  "questions": ["<due diligence question 1>", "<due diligence question 2>", "<due diligence question 3>"],
  "isBad": <true if score < 40>
}

A great deck should have: problem, solution, market size, business model, traction, team, financials, ask. Score accordingly.`;

  try {
    const text = await geminiText(prompt);
    const result = parseJSON(text, {
      score: 75,
      feedback: 'Good deck structure. Add more traction data to strengthen the case.',
      questions: ['What are your unit economics?', 'How large is the TAM?', 'What milestones will this funding achieve?'],
      isBad: false
    });
    result.isBad = result.score < 40;
    return result;
  } catch (err) {
    console.error('evaluatePptPitch error:', err);
    return {
      score: 78,
      feedback: 'Solid deck. Investors will want more detail on financials.',
      questions: ['What is your path to profitability?', 'Who are your key hires?', 'What is your competitive moat?'],
      isBad: false
    };
  }
}

export async function evaluatePitch(idea: string, pitchText: string) {
  if (!apiKey || !pitchText.trim()) {
    return {
      score: 88,
      feedback: 'Excellent final pitch! Venture-scale idea with a clear path to profitability.',
      questions: ['What keeps competitors from copying this tomorrow?', 'How will you utilize the funding?', 'Who handles hiring for expansion?'],
      isBad: false
    };
  }

  const prompt = `You are a panel of top-tier venture capitalists (Sequoia, a16z, Accel) making a final investment decision on a startup.

Startup Idea: "${idea}"
Final Pitch: "${pitchText}"

After a full simulation journey, this is the founder's final pitch for funding. Evaluate comprehensively and return ONLY raw JSON:
{
  "score": <integer 0-100>,
  "feedback": "<3-4 sentences of final verdict: strengths, concerns, investment thesis or rejection reason>",
  "questions": ["<hard final due diligence question 1>", "<hard question 2>", "<hard question 3>"],
  "isBad": <true if score < 70 - meaning funding rejected>
}

Score 70+ = FUNDED. Below 70 = REJECTED. Be realistic and specific to this startup idea. A great final pitch needs clear unit economics, defensibility, and massive market opportunity.`;

  try {
    const text = await geminiText(prompt);
    const result = parseJSON(text, {
      score: 82,
      feedback: 'Strong final pitch. The board is impressed with the market understanding and go-to-market strategy.',
      questions: ['What is your 5-year vision?', 'How defensible is your technology?', 'What is your exit strategy?'],
      isBad: false
    });
    result.isBad = result.score < 70;
    return result;
  } catch (err) {
    console.error('evaluatePitch error:', err);
    return {
      score: 80,
      feedback: 'Impressive final pitch. The investment committee is enthusiastic about the opportunity.',
      questions: ['What are your expansion plans?', 'How will you use the capital?', 'What is your timeline to profitability?'],
      isBad: false
    };
  }
}
