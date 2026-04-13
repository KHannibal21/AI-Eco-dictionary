import { HistoryItem } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@eco_lexicon_history';
const MAX_HISTORY_ITEMS = 100; // ограничим, чтобы не раздувать хранилище

/**
 * Получить все элементы истории.
 */
export async function getHistoryItems(): Promise<HistoryItem[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return [];
    const items = JSON.parse(json) as HistoryItem[];
    // Сортируем по убыванию времени (новые сверху)
    return items.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

/**
 * Добавить новый элемент в историю.
 */
export async function addHistoryItem(item: HistoryItem): Promise<void> {
  try {
    const current = await getHistoryItems();
    // Добавляем в начало (новейшие первыми)
    const updated = [item, ...current];
    // Ограничиваем количество
    const trimmed = updated.slice(0, MAX_HISTORY_ITEMS);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to save history item:', error);
  }
}

/**
 * Очистить всю историю.
 */
export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}

/**
 * Удалить конкретный элемент по id.
 */
export async function removeHistoryItem(id: string): Promise<void> {
  try {
    const current = await getHistoryItems();
    const filtered = current.filter(item => item.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove history item:', error);
  }
}