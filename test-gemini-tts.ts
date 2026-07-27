import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

console.log("=== System environment variables BEFORE dotenv.config ===");
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.slice(0, 4)}...${process.env.GEMINI_API_KEY.slice(-4)}` : "undefined");
console.log("GOOGLE_API_KEY:", process.env.GOOGLE_API_KEY ? `${process.env.GOOGLE_API_KEY.slice(0, 4)}...${process.env.GOOGLE_API_KEY.slice(-4)}` : "undefined");

dotenv.config();

console.log("\n=== System environment variables AFTER dotenv.config ===");
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.slice(0, 4)}...${process.env.GEMINI_API_KEY.slice(-4)}` : "undefined");
console.log("GOOGLE_API_KEY:", process.env.GOOGLE_API_KEY ? `${process.env.GOOGLE_API_KEY.slice(0, 4)}...${process.env.GOOGLE_API_KEY.slice(-4)}` : "undefined");

// Force removal of GOOGLE_API_KEY from environment to prevent SDK initialization bugs
delete process.env.GOOGLE_API_KEY;

// If GEMINI_API_KEY is the placeholder "MY_GEMINI_API_KEY", we should restore the original one if possible
if (process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
  console.log("\n⚠️ GEMINI_API_KEY was overwritten with placeholder 'MY_GEMINI_API_KEY'!");
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
  console.error("❌ GEMINI_API_KEY is not a valid API key.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function testModel(modelName) {
  console.log(`\nTesting voice synthesis with model: "${modelName}"...`);
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ role: "user", parts: [{ text: "Olá, sou o Linguo. Como posso ajudar?" }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } }
        }
      }
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    const audioPart = parts.find(p => p.inlineData?.data);
    if (audioPart) {
      console.log(`✅ SUCCESS! Model "${modelName}" successfully synthesized audio data.`);
      console.log(`   - Data size: ${audioPart.inlineData.data.length} chars (base64)`);
      console.log(`   - MimeType: ${audioPart.inlineData.mimeType}`);
      return true;
    } else {
      console.warn(`⚠️ Model "${modelName}" returned response, but no inline audio data was found in parts.`);
      console.log("   Parts structure:", JSON.stringify(parts, null, 2));
      return false;
    }
  } catch (err) {
    console.error(`❌ FAILED for model "${modelName}":`, err.message);
    return false;
  }
}

async function runTests() {
  const models = [
    "gemini-2.5-flash-preview-tts",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash"
  ];

  for (const model of models) {
    const ok = await testModel(model);
    if (ok) {
      console.log(`\n🎉 Best working model found: "${model}"`);
      break;
    }
  }
}

runTests();
