
import { GoogleGenAI, Type } from "@google/genai";
import { DailyProjection } from "../types";

export const getFinancialInsights = async (projections: DailyProjection[]) => {
  // Manejo seguro para evitar crash si process no está definido en el navegador
  const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) 
    ? process.env.API_KEY 
    : '';

  if (!apiKey) {
    console.warn("IA: API_KEY no detectada. Los insights están desactivados.");
    return {
      summary: "Análisis automático no disponible. Configure la API Key en el entorno.",
      recommendations: ["Verificar variables de entorno", "Consultar guía de despliegue"],
      riskLevel: "N/A"
    };
  }

  const ai = new GoogleGenAI({ apiKey });
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
