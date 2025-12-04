import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzeCode(code, language = "javascript") {
  try {
    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    // Normalize language name
    const languageMap = {
      'cpp': 'C++',
      'c++': 'C++',
      'cplusplus': 'C++',
      'javascript': 'JavaScript',
      'js': 'JavaScript',
      'typescript': 'TypeScript',
      'ts': 'TypeScript',
      'python': 'Python',
      'py': 'Python',
      'java': 'Java',
      'go': 'Go',
      'rust': 'Rust',
      'php': 'PHP',
      'ruby': 'Ruby',
      'swift': 'Swift',
      'kotlin': 'Kotlin',
      'csharp': 'C#',
      'c#': 'C#'
    };

    const normalizedLanguage = languageMap[language.toLowerCase()] || language;

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Create the prompt with explicit language context
    const prompt = `
You are an expert code reviewer specializing in ${normalizedLanguage}.

CRITICAL INSTRUCTIONS:
1. The code provided below is written in ${normalizedLanguage.toUpperCase()}
2. Analyze it as ${normalizedLanguage} code ONLY
3. Do NOT assume it's in any other programming language
4. All suggestions and issues should be relevant to ${normalizedLanguage}

Analyze the following ${normalizedLanguage} code and respond in PURE JSON format with these exact fields:
{
  "explanation": "A clear 2-3 sentence explanation of what this ${normalizedLanguage} code does",
  "issues": [
    "List potential bugs, security vulnerabilities, or poor practices specific to ${normalizedLanguage}",
    "Include memory leaks, undefined behavior, or language-specific issues",
    "If no issues found, return an empty array"
  ],
  "suggestions": [
    "List improvements or optimizations specific to ${normalizedLanguage}",
    "Include modern ${normalizedLanguage} best practices and idioms",
    "Suggest better algorithms or data structures if applicable"
  ],
  "conceptTags": [
    "List programming concepts used (e.g., 'loops', 'recursion', 'pointers')",
    "Include ${normalizedLanguage}-specific features (e.g., 'templates', 'RAII', 'async/await')",
    "Add relevant algorithms or design patterns"
  ],
  "testCases": [
    {
      "description": "Brief description of what this test validates",
      "input": "Sample input (or {} if not applicable)",
      "expectedOutput": "Expected result for this input"
    }
  ]
}

IMPORTANT FORMAT RULES:
- Respond ONLY with valid JSON
- Do NOT include markdown code blocks or \`\`\`json tags
- Do NOT include any explanatory text outside the JSON
- Ensure all strings are properly escaped
- All arrays must be valid even if empty: []

${normalizedLanguage.toUpperCase()} CODE TO ANALYZE:
\`\`\`${language}
${code}
\`\`\`

Remember: This is ${normalizedLanguage.toUpperCase()} code. Analyze it in the context of ${normalizedLanguage} programming language standards and best practices.
    `.trim();

    console.log(`🔍 Analyzing ${normalizedLanguage} code...`);

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("📥 Received response from Gemini");

    // Clean up the response
    let cleanedText = text
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .replace(/^[\s\n]+/, "")
      .replace(/[\s\n]+$/, "")
      .trim();

    // Parse JSON
    let parsed;
    try {
      parsed = JSON.parse(cleanedText);
      console.log("✅ Successfully parsed JSON response");
    } catch (parseErr) {
      console.warn("⚠️ Could not parse JSON output. Attempting to extract...");
      console.log("Raw response:", text.substring(0, 500));
      
      // Attempt to extract JSON from the text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
          console.log("✅ Extracted and parsed JSON from response");
        } catch (e) {
          console.error("❌ Failed to extract JSON:", e.message);
          // If still fails, return structured fallback
          parsed = {
            explanation: `This ${normalizedLanguage} code: ${text.substring(0, 300)}`,
            issues: ["Could not generate structured analysis. Please try again."],
            suggestions: [`Ensure the ${normalizedLanguage} code is syntactically correct`],
            conceptTags: [normalizedLanguage, "analysis-error"],
            testCases: [],
          };
        }
      } else {
        parsed = {
          explanation: text.length > 300 ? text.substring(0, 300) + "..." : text,
          issues: [],
          suggestions: [],
          conceptTags: [normalizedLanguage],
          testCases: [],
        };
      }
    }

    // Ensure all required fields exist and are properly formatted
    const validated = {
      explanation: parsed.explanation || `Analysis of ${normalizedLanguage} code completed`,
      issues: Array.isArray(parsed.issues) ? parsed.issues.filter(i => i && i.trim()) : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.filter(s => s && s.trim()) : [],
      conceptTags: Array.isArray(parsed.conceptTags) ? parsed.conceptTags.filter(t => t && t.trim()) : [normalizedLanguage],
      testCases: Array.isArray(parsed.testCases) ? parsed.testCases.map(tc => ({
        description: tc.description || "Test case",
        input: tc.input !== undefined ? tc.input : {},
        expectedOutput: tc.expectedOutput !== undefined ? tc.expectedOutput : null
      })) : [],
    };

    // Add language tag if not present
    if (!validated.conceptTags.includes(normalizedLanguage)) {
      validated.conceptTags.unshift(normalizedLanguage);
    }

    console.log(`✅ Analysis complete: ${validated.issues.length} issues, ${validated.suggestions.length} suggestions`);

    return validated;

  } catch (err) {
    console.error("❌ Gemini analysis failed:", err);
    
    // Return detailed error information
    return {
      explanation: `Analysis failed: ${err.message}`,
      issues: [
        "Failed to connect to Gemini API",
        err.message.includes("API key") ? "Invalid or missing API key" : "Network or API error",
        err.message
      ],
      suggestions: [
        "Check your GEMINI_API_KEY in .env file",
        "Verify your API key at https://aistudio.google.com/app/apikey",
        "Ensure you have internet connectivity",
        "Check if the API endpoint is accessible",
        "Try again in a few moments"
      ],
      conceptTags: ["error", "api-failure"],
      testCases: [],
    };
  }
}

// Optional: Test function to verify API connection
export async function testConnection() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return { success: false, error: "API key not configured" };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent("Respond with: 'Gemini API is working correctly!'");
    const response = await result.response;
    const text = response.text();

    return { success: true, message: text };
  } catch (err) {
    return { success: false, error: err.message };
  }
}