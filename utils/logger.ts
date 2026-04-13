const isDev = __DEV__;

export function logInfo(...args: unknown[]): void {
  if (isDev) {
    console.log('ℹ️ [AI Eco‑Lexicon]', ...args);
  }
}

export function logError(...args: unknown[]): void {
  if (isDev) {
    console.error('❌ [AI Eco‑Lexicon]', ...args);
  }
}

export function logWarn(...args: unknown[]): void {
  if (isDev) {
    console.warn('⚠️ [AI Eco‑Lexicon]', ...args);
  }
}