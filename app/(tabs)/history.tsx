import { useFocusEffect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { HistoryItem } from '@/types';
import { clearHistory, getHistoryItems, removeHistoryItem } from '@/utils/storage';

export default function HistoryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [items, setItems] = useState<HistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = useCallback(async () => {
    const data = await getHistoryItems();
    setItems(data);
  }, []);

  // Загружаем историю при фокусе на экран
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all saved scans?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearHistory();
            setItems([]);
          },
        },
      ]
    );
  };

  const handleDeleteItem = async (id: string) => {
    await removeHistoryItem(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleItemPress = (item: HistoryItem) => {
    router.push({
      pathname: '/result',
      params: { data: JSON.stringify(item) },
    });
  };

  const renderRightActions = (id: string) => {
    return (
      <TouchableOpacity
        style={[styles.deleteButton, { backgroundColor: colors.error }]}
        onPress={() => handleDeleteItem(id)}>
        <IconSymbol name="trash.fill" size={24} color="#fff" />
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item.id)}
      overshootRight={false}
      containerStyle={styles.swipeableContainer}>
      <TouchableOpacity
        style={[styles.item, { backgroundColor: colors.cardBackground }]}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.7}>
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text style={[styles.objectName, { color: colors.text }]}>
              {item.objectName}
            </Text>
            <IconSymbol
              name="chevron.right"
              size={20}
              color={colors.icon}
              style={styles.chevron}
            />
          </View>
          <Text
            style={[styles.definition, { color: colors.secondaryText }]}
            numberOfLines={2}>
            {item.definition}
          </Text>
          <View style={styles.metaRow}>
            <Text style={[styles.timestamp, { color: colors.icon }]}>
              {new Date(item.timestamp).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
            {item.ecoTerms && item.ecoTerms.length > 0 && (
              <View style={styles.termsBadge}>
                <Text style={[styles.termsBadgeText, { color: colors.tint }]}>
                  {item.ecoTerms.length} term{item.ecoTerms.length !== 1 ? 's' : ''}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <IconSymbol name="leaf" size={64} color={colors.icon + '40'} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No scans yet
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.secondaryText }]}>
        Go to the Camera tab and capture your first nature object
      </Text>
      <TouchableOpacity
        style={[styles.emptyButton, { backgroundColor: colors.tint }]}
        onPress={() => router.push('/(tabs)')}>
        <Text style={styles.emptyButtonText}>Open Camera</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>History</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
            <Text style={[styles.clearText, { color: colors.error }]}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.tint}
            colors={[colors.tint]}
          />
        }
        ListEmptyComponent={ListEmptyComponent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 0 : 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  clearButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  clearText: {
    fontSize: 16,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    flexGrow: 1,
  },
  swipeableContainer: {
    marginBottom: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },
  item: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  objectName: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  chevron: {
    marginLeft: 8,
  },
  definition: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 13,
  },
  termsBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
  },
  termsBadgeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    marginLeft: 0,
  },
  deleteText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: -40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});