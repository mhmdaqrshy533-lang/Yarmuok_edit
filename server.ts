import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client with standard user-agent for AI Studio
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Sigma Academic API online" });
});

app.post("/api/gemini/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt parameter" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server" });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    if (!text) {
      return res.status(500).json({ error: "Empty response received from Gemini" });
    }

    // Try parsing the response to ensure it's valid JSON
    try {
      const parsed = JSON.parse(text);
      return res.json(parsed);
    } catch (parseErr) {
      // If there's markdown formatting, try cleaning it up
      const cleanedText = text.replace(/```json\s?/g, '').replace(/```\s?/g, '').trim();
      const parsedCleaned = JSON.parse(cleanedText);
      return res.json(parsedCleaned);
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ 
      error: "Failed to generate questions using Gemini API", 
      details: error.message || error 
    });
  }
});

// Vite Middleware for Asset Handling
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sigma School Academy is running on http://localhost:${PORT}`);
  });
}

setupVite();
