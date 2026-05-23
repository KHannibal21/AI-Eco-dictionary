import { AnalysisError, GeminiResponse } from '@/types';
import { logError, logInfo } from '@/utils/logger';

// Читаем ключ из переменных окружения Expo
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

// Полный список моделей в порядке приоритета (от мощных к быстрым)
const MODEL_PRIORITY = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-image',
  'gemini-3.1-flash-lite',
  'gemini-3.1-flash-lite-preview',
  'gemini-3-pro',
  'gemini-3.1-pro-preview',
  'gemini-3.1-pro',
  'gemini-3-flash',
  'gemini-2.5-pro',
  'gemini-2.5-flash',
  'gemini-2.5-flash-image',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-2.0-flash-001',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash-lite-001',
  'gemini-2.5-flash-preview-09-2025',
  'gemini-flash-latest',
] as const;

type GeminiModel = (typeof MODEL_PRIORITY)[number];

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

// Системный промпт – требует строгий JSON
const PROMPT = `Act as an eco‑translator tool. Analyze the image carefully. Identify the single most prominent object or material that is the main subject of the photo, whether it is natural (tree, river, flower) or human‑made (plastic chair, smoke, litter, pipe, car exhaust). If the object is human‑made, treat it as an environmental element (e.g., plastic chair → plastic pollution; smoke → air pollution). Output valid JSON only, no extra text, exactly following this structure:
{
  "objectName": "string (English name of the main object, capitalized)",
  "definition": "string (concise English definition, max 15 words, include environmental relevance if man-made)",
  "ecoTerms": [
    {
      "term": "string (ecology term tightly related to the object)",
      "description": "string (short environmental context, max 20 words)"
    }
  ]
}
Provide at least 1 and at most 3 ecology terms. Never return commentary outside the JSON.`;

interface GeminiApiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    code: number;
    message: string;
  };
}

/**
 * Попытка выполнить запрос к конкретной модели.
 */
async function tryModel(
  model: GeminiModel,
  base64Image: string,
  timeoutMs = 15000
): Promise<GeminiResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = `${BASE_URL}/${model}:generateContent?key=${API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: PROMPT },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: base64Image,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `HTTP ${response.status}: ${errorData.error?.message || 'Unknown error'}`
      );
    }

    const data = (await response.json()) as GeminiApiResponse;

    // Проверяем наличие ошибки от API
    if (data.error) {
      throw new Error(`API error ${data.error.code}: ${data.error.message}`);
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('Empty response from model');
    }

    // Парсим JSON (Gemini может иногда возвращать markdown-блок с json)
    const jsonText = text.replace(/```json\s*|\s*```/g, '').trim();
    return JSON.parse(jsonText) as GeminiResponse;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      // Передаём ошибку с указанием модели
      throw new Error(`[${model}] ${error.message}`);
    }
    throw error;
  }
}

/**
 * Основная функция анализа изображения.
 * Последовательно перебирает модели из списка, пока одна не вернёт результат.
 */
export async function analyzeImage(
  base64Image: string
): Promise<GeminiResponse> {
  if (!API_KEY) {
    const error: AnalysisError = {
      code: 'NO_API_KEY',
      message: 'Gemini API key is missing. Check your .env file.',
    };
    logError(error.message);
    throw error;
  }

  const errors: string[] = [];

  for (const model of MODEL_PRIORITY) {
    try {
      logInfo(`Trying model: ${model}`);
      const result = await tryModel(model, base64Image);
      logInfo(`Success with model: ${model}`);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(msg);
      logError(`Model ${model} failed: ${msg}`);
      // Продолжаем со следующей моделью
    }
  }

  // Все модели исчерпаны
  const error: AnalysisError = {
    code: 'ALL_MODELS_FAILED',
    message: 'All Gemini models failed to process the image.',
  };
  logError(`${error.message}\nErrors:\n${errors.join('\n')}`);
  throw error;
}

/**
 * Вспомогательная функция для проверки доступности API ключа.
 */
export function isApiKeyConfigured(): boolean {
  return !!API_KEY;
}