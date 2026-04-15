import { GoogleGenAI } from '@google/genai';

const apiKey = "AIzaSyAcTHeJsRTkNgSM8UyEiRfJ3_1GWJEwNfI";
const ai = new GoogleGenAI({ apiKey });

async function geminiText(prompt) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });
  return response.text ?? '';
}

async function test() {
  console.log("Testing Gemini API with provided key...");
  try {
    const res = await geminiText("Say hello world in exactly two words.");
    console.log("Response:", res);
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
