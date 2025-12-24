
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const getCurrentDateInfo = () => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
  const shamsi = new Intl.DateTimeFormat('fa-IR', options).format(now);
  const gregorian = now.toDateString();
  return { shamsi, gregorian };
};

export const analyzeMarketSymbol = async (symbol: string, category: string): Promise<AnalysisResult & { politicalImpact: string; historicalContext: string; dataDate: string }> => {
  const { shamsi, gregorian } = getCurrentDateInfo();
  
  const prompt = `امروز ${shamsi} (برابر با ${gregorian}) است. 
  به عنوان تحلیلگر ارشد، نماد "${symbol}" (${category}) را منحصراً بر اساس داده‌های لحظه‌ای و اخبار امروز تحلیل کن.
  
  دستورالعمل حیاتی:
  ۱. با استفاده از googleSearch، آخرین قیمت و تغییرات را مستقیماً از سایت tgju.org یا منابع خبری معتبر برای امروز پیدا کن. داده‌های قدیمی‌تر از ۲۴ ساعت را نادیده بگیر.
  ۲. تحلیل سیاسی را بر اساس اخبار داغ همین امروز (تنش‌ها، مذاکرات، تصمیمات بانکی) انجام بده.
  ۳. تاریخ دقیق قیمتی که پیدا کردی را در فیلد dataDate ذکر کن.
  
  خروجی حتما JSON باشد.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          symbol: { type: Type.STRING },
          recommendation: { type: Type.STRING, enum: ['BUY', 'SELL', 'HOLD', 'NEUTRAL'] },
          confidence: { type: Type.NUMBER },
          technicalSummary: { type: Type.STRING },
          fundamentalSummary: { type: Type.STRING },
          politicalImpact: { type: Type.STRING },
          historicalContext: { type: Type.STRING },
          dataDate: { type: Type.STRING, description: 'تاریخ و ساعت دقیق داده استخراج شده' },
          risks: { type: Type.ARRAY, items: { type: Type.STRING } },
          targets: { type: Type.ARRAY, items: { type: Type.NUMBER } },
          stopLoss: { type: Type.NUMBER },
        },
        required: ['symbol', 'recommendation', 'confidence', 'technicalSummary', 'fundamentalSummary', 'politicalImpact', 'historicalContext', 'dataDate', 'risks', 'targets', 'stopLoss']
      }
    }
  });

  const result = JSON.parse(response.text || '{}');
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  
  const sources = groundingChunks
    .filter((chunk: any) => chunk.web)
    .map((chunk: any) => ({
      title: chunk.web.title,
      uri: chunk.web.uri
    }));

  return {
    ...result,
    sources
  };
};

export const getLiveMarketPrices = async (): Promise<any[]> => {
  const { shamsi } = getCurrentDateInfo();
  
  const prompt = `امروز ${shamsi} است. سریعاً به سایت tgju.org مراجعه کن و قیمت‌های لحظه‌ای (Live) زیر را استخراج کن. 
  داده‌ها باید دقیقاً مربوط به قیمت‌های امروز باشد. اگر بازار بسته است، آخرین قیمت پایانی امروز را بیاور:
  1. شاخص کل بورس
  2. دلار بازار آزاد
  3. سکه امامی
  4. طلای 18 عیار
  خروجی: [{name, symbol, price, changePercent}] بصورت JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            symbol: { type: Type.STRING },
            price: { type: Type.NUMBER },
            changePercent: { type: Type.NUMBER }
          },
          required: ['name', 'symbol', 'price', 'changePercent']
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
};

export const getDetailedMarketSentiment = async (): Promise<string> => {
  const { shamsi } = getCurrentDateInfo();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `امروز ${shamsi} است. بر اساس اخبار سیاسی و اقتصادی منتشر شده در ۲۴ ساعت گذشته و دیتای سایت tgju.org، یک تحلیل استراتژیک کوتاه از نبض امروز بازار ایران ارائه بده.`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  return response.text || 'خطا در دریافت اطلاعات';
};

export const getTopOpportunities = async (): Promise<any[]> => {
  const { shamsi } = getCurrentDateInfo();
  const prompt = `امروز ${shamsi} است. بر اساس اخبار امروز، وضعیت تابلو بورس ایران و قیمت‌های سایت tgju.org، لیستی از ۱۰ نماد (بورس، طلا یا ارز) که بیشترین احتمال سوددهی را در کوتاه مدت با کمترین ریسک دارند استخراج کن.
  خروجی دقیقا یک لیست JSON با این فرمت باشد:
  [{ "name": "نام نماد", "symbol": "نماد", "expectedReturn": "درصد سود تخمینی", "riskLevel": "Low/Medium", "recommendation": "BUY/HOLD" }]
  نمادها باید واقعی و بر اساس دیتای امروز باشند.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            symbol: { type: Type.STRING },
            expectedReturn: { type: Type.STRING },
            riskLevel: { type: Type.STRING },
            recommendation: { type: Type.STRING }
          },
          required: ['name', 'symbol', 'expectedReturn', 'riskLevel', 'recommendation']
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
};
