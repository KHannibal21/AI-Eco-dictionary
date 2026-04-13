import { HistoryItem } from '@/types';
import {
  addHistoryItem,
  clearHistory,
  getHistoryItems,
  removeHistoryItem,
} from '@/utils/storage';
import { useCallback, useEffect, useState } from 'react';

interface UseHistoryReturn {
  items: HistoryItem[];
  loading: boolean;
  refresh: () => Promise<void>;
  addItem: (item: HistoryItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

export function useHistory(): UseHistoryReturn {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getHistoryItems();
    setItems(data);
    setLoading(false);
  }, []);

  const addItem = useCallback(async (item: HistoryItem) => {
    await addHistoryItem(item);
    await load();
  }, [load]);

  const removeItem = useCallback(async (id: string) => {
    await removeHistoryItem(id);
    await load();
  }, [load]);

  const clearAll = useCallback(async () => {
    await clearHistory();
    await load();
  }, [load]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    items,
    loading,
    refresh: load,
    addItem,
    removeItem,
    clearAll,
  };
}