import express from "express";
import { analyzeCode } from "../services/aiService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { code, language } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Code is required" });
  }

  try {
    const result = await analyzeCode(code, language);
    return res.json(result);
  } catch (error) {
    console.error("Error analyzing code:", error);
    return res.status(500).json({ error: "AI analysis failed" });
  }
});

export default router;
