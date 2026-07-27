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
function getGeminiClient(customKey?: string): GoogleGenAI {
  // Use client-provided key, fallback to GEMINI_API_KEY, fallback to GOOGLE_API_KEY if needed
  const key = customKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key || key === "MY_GEMINI_API_KEY") {
    throw new Error("Chave de API do Gemini não configurada no ambiente.");
  }
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Endpoint to parse uploaded ebook text into interactive Chinese learning sentences
app.post("/api/parse-ebook", async (req, res) => {
  const { text, targetLanguage, apiKey } = req.body;
  const targetLang = targetLanguage || "Mandarim (Chinês)";

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return res.status(400).json({ error: "O texto do ebook é obrigatório." });
  }

  try {
    const ai = getGeminiClient(apiKey);
    
    const prompt = `Analise o seguinte trecho de texto ou livro no idioma ${targetLang}. 
Extraia exatamente até 8 frases ou orações completas em ${targetLang} que façam sentido e sejam ótimas para prática de aprendizado de idiomas.
Para cada frase extraída, forneça:
1. As palavras/unidades do idioma ${targetLang} agrupadas em um vetor para prática no dialer (ex: para "Eu amo café" forneça ["Eu", "amo", "café"]).
2. A pronúncia/fonética/pinyin aproximado para estudantes lusófonos.
3. A tradução exata em português.
4. Uma explicação gramatical simples em português explicando a estrutura ou palavras difíceis.
5. Uma decomposição palavra por palavra (literalBreakdown) onde cada item tem: 'char' (palavra), 'pinyin' (pronúncia) e 'translation' (tradução em português).

Texto do livro/ebook:
${text}

Retorne estritamente um vetor JSON com as frases estruturadas de acordo com o esquema definido, sem tags markdown ou comentários.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "List of extracted interactive learning sentences.",
          items: {
            type: Type.OBJECT,
            properties: {
              characters: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array of words or characters in target language for dialysis assembly."
              },
              pinyin: { type: Type.STRING, description: "Phonetic romanization or pinyin guide." },
              translation: { type: Type.STRING, description: "Portuguese translation of the full sentence." },
              explanation: { type: Type.STRING, description: "Grammar breakdown and context explanation." },
              literalBreakdown: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    char: { type: Type.STRING },
                    pinyin: { type: Type.STRING },
                    translation: { type: Type.STRING }
                  },
                  required: ["char", "pinyin", "translation"]
                },
                description: "Word-by-word breakdown of characters."
              }
            },
            required: ["characters", "pinyin", "translation", "explanation", "literalBreakdown"]
          }
        }
      }
    });

    const resultText = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!resultText) {
      throw new Error("Resposta vazia da inteligência artificial.");
    }

    const sentences = JSON.parse(resultText);
    return res.json({ sentences });
  } catch (err: any) {
    console.error("Erro ao processar o ebook com Gemini:", err);
    return res.status(500).json({ 
      error: "Falha na análise da IA para o Ebook", 
      details: err.message 
    });
  }
});

// Endpoint for AI Voice Assistant conversational chat
app.post("/api/chat", async (req, res) => {
  const { message, history, systemInstruction, apiKey } = req.body;
  const startTime = Date.now();

  console.log(`\n--- [Gemini Chat Request] ---`);
  console.log(`[Input Message]: "${message}"`);
  console.log(`[History Turns]: ${history ? history.length : 0}`);

  if (!message || typeof message !== "string") {
    console.warn(`[Chat Warning]: Missing or invalid message parameter.`);
    return res.status(400).json({ error: "A mensagem é obrigatória." });
  }

  try {
    const ai = getGeminiClient(apiKey);
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
    
    // Synthesize voice natively using Gemini TTS, bypassing client Google TTS key errors
    let audioBase64: string | null = null;
    let mimeType = "audio/wav";
    
    try {
      console.log(`[Gemini TTS]: Synthesizing native voice with model gemini-2.5-flash-preview-tts...`);
      const ttsResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ role: "user", parts: [{ text: aiText }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } // Default friendly female voice
          }
        }
      });

      const ttsParts = ttsResponse.candidates?.[0]?.content?.parts || [];
      const audioPart = ttsParts.find((p: any) => p.inlineData?.data);
      if (audioPart) {
        audioBase64 = audioPart.inlineData.data;
        mimeType = audioPart.inlineData.mimeType || "audio/wav";
        console.log(`[Gemini TTS]: Native audio synthesized successfully.`);
      }
    } catch (ttsErr: any) {
      console.error("[Gemini TTS Error]: Failed to synthesize native voice:", ttsErr.message);
    }

    const duration = Date.now() - startTime;

    console.log(`[Gemini Response]: "${aiText}"`);
    console.log(`[Duration]: ${duration}ms`);
    console.log(`-------------------------------\n`);

    return res.json({ 
      text: aiText, 
      audio: audioBase64,
      mimeType: mimeType 
    });
  } catch (err: any) {
    const duration = Date.now() - startTime;
    console.error(`[Gemini Error] after ${duration}ms:`, err);
    console.log(`-------------------------------\n`);
    return res.status(500).json({ error: err.message });
  }
});

// Endpoint to synthesize text using Gemini native voice synthesis (bypassing client-side key limits/errors)
app.post("/api/speak", async (req, res) => {
  const { text, lang, apiKey } = req.body;
  if (!text) {
    return res.status(400).json({ error: "O texto é obrigatório para a fala." });
  }

  try {
    const ai = getGeminiClient(apiKey);
    console.log(`[Backend TTS Request]: "${text}" in ${lang || "auto"}`);
    
    const isChinese = lang?.toLowerCase().startsWith("zh");
    const voiceName = isChinese ? "Puck" : "Kore"; // Puck for Chinese, Kore for friendly female Portuguese/English

    const ttsResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ role: "user", parts: [{ text }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName } }
        }
      }
    });

    const ttsParts = ttsResponse.candidates?.[0]?.content?.parts || [];
    const audioPart = ttsParts.find((p: any) => p.inlineData?.data);
    
    if (audioPart) {
      console.log(`[Backend TTS Success]: Generated base64 audio content.`);
      return res.json({ audioContent: audioPart.inlineData.data });
    }
    throw new Error("Nenhum dado de áudio retornado pelo modelo Gemini.");
  } catch (err: any) {
    console.error("[Backend TTS Error]:", err.message);
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
