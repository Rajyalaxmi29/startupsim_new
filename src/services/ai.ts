import OpenAI from "openai";
import { Stage } from "../types";

const apiKey = ""; 

if (!apiKey) {
  console.error("GEMINI_API_KEY is not set. Please check your .env file.");
}

const ai = new OpenAI({
  apiKey: apiKey,
  baseURL: "https://api.groq.com/openai/v1",
  dangerouslyAllowBrowser: true
});

function parseJSONResponse(text: string) {
  try {
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse JSON:", text);
    throw e;
  }
}

export async function generateStages(idea: string, budget: string): Promise<Stage[]> {
  const prompt = `Generate a 10-stage simulation journey for a startup idea: "${idea}" with an initial budget of "${budget}".
    The journey should be a professional, realistic path that a founder would take, organized into phases: 'Idea', 'Resources', 'Investors', 'Growth', 'Scale'.
    
    Assign a 'type' to each stage:
    - 'normal': Standard operational challenges.
    - 'pitch': A mock text pitch (e.g., elevator pitch).
    - 'video-pitch': A mock video pitch (e.g., for a demo day).
    - 'ppt-pitch': A mock pitch deck (PPT) evaluation (e.g., for a VC meeting).
    - 'crisis': An unexpected, high-stakes problem.
    
    Ensure at least 1 stage is 'video-pitch', 1 is 'ppt-pitch', 2 are 'pitch' and 1 is 'crisis'.
    
    You MUST return the output strictly as a JSON object with a single property "stages", which is an array of exactly 10 stage objects.
    Each stage object MUST have the exact following shape:
    {
      "id": number (1-10),
      "name": string,
      "type": string ("normal" | "pitch" | "crisis" | "video-pitch" | "ppt-pitch"),
      "phase": string ("Idea" | "Resources" | "Investors" | "Growth" | "Scale"),
      "objective": string,
      "tasks": array of 3 strings,
      "realWorldResources": array of 2 objects with { "title": string, "description": string, "link": string },
      "governmentFundingGuide": object with { "programName": string, "eligibility": string, "submissionTips": string },
      "simulation": object with {
        "scenario": string,
        "options": array of 3 objects with {
          "text": string,
          "impact": { "budget": number, "trust": number, "impact": number },
          "feedback": string
        }
      },
      "realWorldCostEstimate": string,
      "simulationCost": number
    }
    
    Return ONLY valid JSON. No conversational text.`;

  const response = await ai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  const parsed = parseJSONResponse(response.choices[0].message?.content || '{"stages": []}');
  return parsed.stages as Stage[];
}

export async function evaluateVideoPitch(idea: string, stageName: string, videoBase64: string, mimeType: string) {
  const maxRetries = 2;
  let lastError: any = null;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      const prompt = `You are a highly critical, high-stakes Angel Investor evaluating a mock VIDEO pitch for the startup idea: "${idea}" at the stage: "${stageName}".
            Assume standard analysis. Make sure to assess:
            1. Clarity of value proposition.
            2. Confidence and body language.
            3. Substantiated claims vs. hype.
            4. Professionalism.

            Be tough but fair. If the pitch is vague, over-hyped, or lacks substance, give a low score and set 'isBad' to true.
            
            You MUST return the output strictly as a JSON object with the exact following shape:
            {
              "score": number (0-100),
              "feedback": string,
              "questions": array of 3 strings,
              "isBad": boolean
            }
            
            Return ONLY valid JSON. No conversational text.`;

      const response = await ai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      return parseJSONResponse(response.choices[0].message?.content || "{}");
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed:`, error);
      lastError = error;
      if (i < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
      }
    }
  }

  throw lastError;
}

export async function evaluatePptPitch(idea: string, stageName: string, pptContent: string) {
  const prompt = `You are a VC Partner evaluating a Pitch Deck (PPT) summary for the startup idea: "${idea}" at the stage: "${stageName}".
    The user's pitch deck content/summary: "${pptContent}"
    
    Evaluate the deck for:
    1. Market size (TAM/SAM/SOM).
    2. Business model clarity.
    3. Competitive advantage (Moat).
    4. Financial projections realism.
    
    Provide a score out of 100, detailed feedback from a VC's perspective (be critical and practical), and 3 tough questions.
    If the deck is weak, set 'isBad' to true.
    
    You MUST return the output strictly as a JSON object with the exact following shape:
    {
      "score": number (0-100),
      "feedback": string,
      "questions": array of 3 strings,
      "isBad": boolean
    }
    
    Return ONLY valid JSON. No conversational text.`;

  const response = await ai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return parseJSONResponse(response.choices[0].message?.content || "{}");
}

export async function evaluateMockPitch(idea: string, stageName: string, pitchText: string) {
  const prompt = `You are a highly critical Angel Investor evaluating a mock pitch for the startup idea: "${idea}" at the stage: "${stageName}".
    The user's pitch: "${pitchText}"
    
    Evaluate the pitch for:
    1. Clarity and impact.
    2. Feasibility of the model.
    3. Founder's grasp of the problem.
    
    Be tough. If the pitch is weak, vague, or unrealistic, give a low score and set 'isBad' to true.
    Provide a score out of 100, detailed feedback from an angel investor's perspective, and 2 tough questions for the user to answer.
    
    You MUST return the output strictly as a JSON object with the exact following shape:
    {
      "score": number (0-100),
      "feedback": string,
      "questions": array of 2 strings,
      "isBad": boolean
    }
    
    Return ONLY valid JSON. No conversational text.`;

  const response = await ai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return parseJSONResponse(response.choices[0].message?.content || "{}");
}

export async function evaluatePitch(idea: string, pitchText: string) {
  const prompt = `You are a Lead Investor evaluating a final startup pitch for the idea: "${idea}".
    Pitch: "${pitchText}"
    
    This is the final evaluation. Be extremely critical. Look for scalability, unit economics, and market fit.
    If the pitch is not venture-scale or lacks a clear path to impact/profit, set 'isBad' to true.
    
    Provide a score out of 100, detailed feedback from an investor's perspective, and 3 hard questions to consider.
    
    You MUST return the output strictly as a JSON object with the exact following shape:
    {
      "score": number (0-100),
      "feedback": string,
      "questions": array of 3 strings,
      "isBad": boolean
    }
    
    Return ONLY valid JSON. No conversational text.`;

  const response = await ai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return parseJSONResponse(response.choices[0].message?.content || "{}");
}
