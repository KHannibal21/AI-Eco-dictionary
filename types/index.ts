/**
 * AI Eco‑Lexicon Type Definitions
 */

export interface EcoTerm {
  term: string;
  description: string;
}

export interface GeminiResponse {
  objectName: string;
  definition: string;
  ecoTerms: EcoTerm[];
}

export interface HistoryItem extends GeminiResponse {
  id: string;
  timestamp: string;
  imageThumbnail?: string; // base64 thumbnail (optional)
}

export type AnalysisError = {
  code: 'NO_API_KEY' | 'ALL_MODELS_FAILED' | 'INVALID_RESPONSE' | 'NETWORK_ERROR';
  message: string;
  model?: string;
};