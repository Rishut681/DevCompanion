import express from "express";
import { analyzeCode, testConnection } from "../services/aiService.js";

const router = express.Router();

// POST /api/analyze - Analyze code
router.post("/", async (req, res) => {
  const { code, language } = req.body;

  // Validation
  if (!code || typeof code !== "string") {
    return res.status(400).json({ 
      error: "Code is required and must be a string",
      details: "Please provide valid code to analyze"
    });
  }

  if (!code.trim()) {
    return res.status(400).json({ 
      error: "Code cannot be empty",
      details: "Please provide some code to analyze"
    });
  }

  try {
    console.log(`📝 Analyzing ${language || 'unknown'} code (${code.length} characters)...`);
    
    const result = await analyzeCode(code, language || "javascript");
    
    console.log("✅ Analysis completed successfully");
    return res.json(result);
    
  } catch (error) {
    console.error("❌ Error analyzing code:", error);
    
    return res.status(500).json({ 
      error: "AI analysis failed",
      details: error.message,
      explanation: "Failed to analyze code. Please try again.",
      issues: ["Analysis service encountered an error"],
      suggestions: [
        "Check your internet connection",
        "Verify API key configuration",
        "Try with a smaller code snippet"
      ],
      conceptTags: [],
      testCases: []
    });
  }
});

// GET /api/analyze/test - Test API connection
router.get("/test", async (req, res) => {
  try {
    const result = await testConnection();
    
    if (result.success) {
      return res.json({ 
        ok: true, 
        message: "Gemini API connection successful",
        details: result.message 
      });
    } else {
      return res.status(500).json({ 
        ok: false, 
        error: "API connection failed",
        details: result.error 
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      ok: false, 
      error: "Failed to test connection",
      details: error.message 
    });
  }
});

// GET /api/analyze/health - Health check
router.get("/health", (req, res) => {
  res.json({ 
    ok: true, 
    service: "code-analyzer",
    timestamp: new Date().toISOString(),
    apiConfigured: !!process.env.GEMINI_API_KEY
  });
});

export default router;