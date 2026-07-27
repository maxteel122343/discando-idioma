import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy-initialize Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required in Settings > Secrets");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Endpoint to parse uploaded ebook text into interactive Chinese learning sentences
app.post("/api/parse-ebook", async (req, res) => {
  const { text, targetLanguage } = req.body;
  const targetLang = targetLanguage || "Mandarim (Chinês)";

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return res.status(400).json({ error: "O texto do ebook é obrigatório." });
  }

  try {
    const ai = getGeminiClient();
    
    const prompt = `Analise o seguinte trecho de texto ou livro no idioma ${targetLang}. 
Extraia exatamente até 8 frases ou orações completas em ${targetLang} que façam sentido e sejam ótimas para prática de aprendizado de idiomas.
Para cada frase extraída, forneça:
1. As palavras/unidades do idioma ${targetLang} agrupadas em um vetor para prática no dialer (ex: para "Eu amo café" forneça ["Eu", "amo", "café"]).
2. A pronúncia/fonética/pinyin aproximado para estudantes lusófonos.
3. A tradução exata em português.
4. Uma explicação gramatical simples em português explicando a estrutura ou palavras difíceis.
5. Uma decomposição palavra por palavra (literalBreakdown) onde cada item tem: 'char' (palavra), 'pinyin' (pronúncia) e 'translation' (tradução em português).

Texto do livro/ebook:
"""
${text.slice(0, 3000)}
"""`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: `Você é um assistente especialista em ensino de ${targetLang} para falantes de português. Extraia frases úteis do texto em ${targetLang} e responda no formato JSON estruturado seguindo o esquema fornecido.`,
        responseSchema: {
          type: Type.ARRAY,
          description: "Lista de frases extraídas e detalhadas para aprendizado",
          items: {
            type: Type.OBJECT,
            required: ["characters", "pinyin", "translation", "explanation", "literalBreakdown"],
            properties: {
              characters: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Vetor de palavras que compõem a frase",
              },
              pinyin: {
                type: Type.STRING,
                description: "Pronúncia / guia fonético",
              },
              translation: {
                type: Type.STRING,
                description: "Tradução para o português",
              },
              explanation: {
                type: Type.STRING,
                description: "Dica de gramática ou vocabulário em português",
              },
              literalBreakdown: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: ["char", "pinyin", "translation"],
                  properties: {
                    char: { type: Type.STRING },
                    pinyin: { type: Type.STRING },
                    translation: { type: Type.STRING },
                  },
                },
                description: "Decomposição palavra por palavra",
              },
            },
          },
        },
      },
    });

    const parsedJson = JSON.parse(response.text || "[]");
    
    // Inject unique client-side IDs
    const enrichedSentences = parsedJson.map((item: any, idx: number) => ({
      id: `ebook-${Date.now()}-${idx}`,
      category: "Ebook",
      difficulty: item.characters.join("").length > 6 ? "Médio" : "Fácil",
      ...item,
    }));

    return res.json({ sentences: enrichedSentences });

  } catch (err: any) {
    console.error("Erro ao analisar ebook via Gemini:", err);
    return res.status(500).json({ 
      error: "Não foi possível analisar o livro via inteligência artificial.", 
      details: err.message 
    });
  }
});

// Endpoint for AI Voice Assistant conversational chat
app.post("/api/chat", async (req, res) => {
  const { message, history, systemInstruction } = req.body;
  const startTime = Date.now();

  console.log(`\n--- [Gemini Chat Request] ---`);
  console.log(`[Input Message]: "${message}"`);
  console.log(`[History Turns]: ${history ? history.length : 0}`);

  if (!message || typeof message !== "string") {
    console.warn(`[Chat Warning]: Missing or invalid message parameter.`);
    return res.status(400).json({ error: "A mensagem é obrigatória." });
  }

  try {
    const ai = getGeminiClient();
    const contents = history || [];
    contents.push({ role: "user", parts: [{ text: message }] });

    console.log(`[Gemini API Call]: Generating content with model gemini-3.5-flash...`);
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction || "Você é Linguo, o assistente de voz amigável do aplicativo de idiomas. Responda em poucas palavras (no máximo 2 frases curtas) em português de forma muito simpática.",
      },
    });

    const aiText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const duration = Date.now() - startTime;

    console.log(`[Gemini Response]: "${aiText}"`);
    console.log(`[Duration]: ${duration}ms`);
    console.log(`-------------------------------\n`);

    return res.json({ text: aiText });
  } catch (err: any) {
    const duration = Date.now() - startTime;
    console.error(`[Gemini Error] after ${duration}ms:`, err);
    console.log(`-------------------------------\n`);
    return res.status(500).json({ error: err.message });
  }
});

// Configure Vite or Static files depending on environment
async function setupViteAndListen() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupViteAndListen();
