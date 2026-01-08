
import { GoogleGenAI, Type } from "@google/genai";
import { TheoryResponse, ImageSize } from "../types";

const THEORY_PROMPT = `You are a world-class music theorist and luthier expert. 
Given a request for a scale or chord, provide detailed structured data for visualization on Piano, Guitar (6-string E standard), and Violin (4-string GDAE).
For Violin, 'position' is the number of half-steps from the nut (0-12).
Return ONLY JSON.`;

const THEORY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    type: { type: Type.STRING, description: 'scale or chord' },
    notes: { type: Type.ARRAY, items: { type: Type.STRING } },
    intervals: { type: Type.ARRAY, items: { type: Type.STRING } },
    description: { type: Type.STRING },
    pianoKeys: { 
      type: Type.ARRAY, 
      items: { type: Type.INTEGER }, 
      description: 'Indices of keys to highlight (0=C, 1=C#, ..., 11=B)' 
    },
    guitarPositions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          note: { type: Type.STRING },
          fret: { type: Type.INTEGER },
          string: { type: Type.INTEGER, description: '1-6, 1 is high E' },
          isRoot: { type: Type.BOOLEAN }
        },
        required: ['note', 'fret', 'string']
      }
    },
    violinPositions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          note: { type: Type.STRING },
          position: { type: Type.INTEGER, description: 'Half-steps from nut (0-12)' },
          string: { type: Type.INTEGER, description: '1-4, 1 is E string, 4 is G string' },
          isRoot: { type: Type.BOOLEAN }
        },
        required: ['note', 'position', 'string']
      }
    }
  },
  required: ['name', 'type', 'notes', 'intervals', 'description', 'pianoKeys', 'guitarPositions', 'violinPositions']
};

export const getTheoryData = async (query: string): Promise<TheoryResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze and provide fingerings for Violin, Guitar, and Piano for: ${query}`,
    config: {
      systemInstruction: THEORY_PROMPT,
      responseMimeType: 'application/json',
      responseSchema: THEORY_SCHEMA
    }
  });
  
  return JSON.parse(response.text);
};

export const generateMusicImage = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `A vibrant, high-energy music visualization of: ${prompt}. Cinematic lighting, abstract musical elements, strings and orchestral themes.` }]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image data received");
};

export const createTheoryChat = () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: 'You are HarmoniQ, an expert AI music tutor specializing in string instruments, especially the violin. Help users with fingerings, intonation, and theory. Be encouraging and helpful.'
    }
  });
};
