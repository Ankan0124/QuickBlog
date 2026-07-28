import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEIMINI_API_KEY});

async function main(prompt) {
    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
    })
    return response.text;
}

export default main;