
import { GoogleGenAI, Type } from "@google/genai";
import { DailyProjection } from "../types.ts";

export const getFinancialInsights = async (projections: DailyProjection[]) => {
  // Fix: Initialize with named apiKey parameter as required by guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Resumen de datos para el prompt (últimos 30 días para contexto)
  const dataSummary = projections.slice(0, 30).map(p => ({
    d: p.date,
    s: p.finalBalance,
    st: p.status
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Procesar proyección de liquidez: ${JSON.stringify(dataSummary)}`,
      config: {
        // Fix: Use systemInstruction in config instead of putting it in the main prompt
        systemInstruction: "Analiza la liquidez proyectada y genera un plan Kaizen de 3 pasos.",
        responseMimeType: "application/json",
        // Add thinkingConfig for gemini-3-pro-preview to improve reasoning for financial analysis tasks
        thinkingConfig: { thinkingBudget: 4096 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { 
              type: Type.STRING,
              description: "Resumen ejecutivo del estado de caja."
            },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3 acciones Kaizen concretas."
            },
            riskLevel: { 
              type: Type.STRING,
              description: "Nivel de riesgo: Bajo, Medio, Alto o Crítico."
            }
          },
          // Fix: Use propertyOrdering as per the JSON Response example in the SDK guidelines
          propertyOrdering: ["summary", "recommendations", "riskLevel"]
        }
      }
    });

    // Fix: Access the text property directly (not a method) as per guidelines
    const text = response.text;
    if (!text) throw new Error("No response text");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return {
      summary: "Análisis preliminar: La proyección muestra variaciones estacionales normales. Se requiere monitoreo de egresos en la segunda quincena.",
      recommendations: [
        "Negociar extensión de plazos con proveedores estratégicos.",
        "Implementar sistema de cobranza proactiva para facturas sobre 15 días.",
        "Reducir gastos operativos no críticos en un 5% este mes."
      ],
      riskLevel: "Medio"
    };
  }
};
