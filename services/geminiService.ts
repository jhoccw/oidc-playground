
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getOIDCHelp = async (query: string, context?: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `As an OIDC/OAuth2 expert, help with this query: ${query}${context ? `\n\nContext: ${context}` : ''}`,
    config: {
      systemInstruction: `You are the OIDC Master Assistant. 
      You help developers debug OpenID Connect flows, explain JWT claims, and troubleshoot common errors like 'invalid_grant', 'mismatched_redirect_uri', or 'nonce mismatch'.
      Keep answers technical, concise, and professional. Use markdown for code and lists.`,
    },
  });
  return response.text;
};
