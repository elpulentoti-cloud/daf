
import { GoogleGenAI, Type } from "@google/genai";
import { DailyProjection } from "../types";

export const getFinancialInsights = async (projections: DailyProjection[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';

  const dataContext = projections.map(p => ({
    fecha: p.date,
    saldo: p.finalBalance,
    estado: p.status
  }));

  const prompt = `
    Como analista financiero experto de una Dirección de Administración y Finanzas (DAF), 
    analiza la siguiente proyección de caja y proporciona 3 recomendaciones estratégicas Kaizen para mejorar la liquidez.
    Datos: ${JSON.stringify(dataContext)}
    
    Responde en formato JSON con la siguiente estructura:
    {
      "summary": "Resumen ejecutivo de la situación",
      "recommendations": ["rec1", "rec2", "rec3"],
      "riskLevel": "Bajo|Medio|Alto"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            riskLevel: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error fetching Gemini insights:", error);
    return null;
  }
};
