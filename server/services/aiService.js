import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function analyzeCode(code) {
  try {
    const prompt = `
You are a professional code reviewer.
Analyze the following code, and respond in pure JSON format with these fields:
{
  "explanation": "What the code does in plain English",
  "issues": ["list of potential bugs or poor practices"],
  "suggestions": ["possible improvements or optimizations"],
  "conceptTags": ["core concepts or topics involved"],
  "testCases": [
    { "description": "short description", "input": {}, "expectedOutput": any }
  ]
}

Code to analyze:
${code}
    `;

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    // New SDK: `response.output_text` contains the text output
    let output = response.output_text || response.text || "";

    // --- 🧠 Clean up markdown formatting ---
    output = output
      .replace(/^```json\s*/i, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(output);
    } catch (err) {
      console.warn("⚠️ Could not parse JSON output, returning raw text instead.");
      parsed = {
        explanation: output,
        issues: [],
        suggestions: [],
        conceptTags: [],
        testCases: [],
      };
    }

    return parsed;
  } catch (err) {
    console.error("Gemini analysis failed:", err);
    return {
      explanation: "Gemini analysis failed or API key missing.",
      issues: ["Error connecting to Gemini API"],
      suggestions: ["Check model name and API key validity"],
      conceptTags: [],
      testCases: [],
    };
  }
}