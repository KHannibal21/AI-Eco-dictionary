import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ResultCard } from '@/components/ui/result-card';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { GeminiResponse } from '@/types';

export default function ResultScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const params = useLocalSearchParams<{ data: string; timestamp?: string }>();

  // Парсим данные из параметров
  let resultData: GeminiResponse | null = null;
  try {
    if (params.data) {
      resultData = JSON.parse(params.data) as GeminiResponse;
    }
  } catch (error) {
    console.error('Failed to parse result data:', error);
  }

  // Если данных нет — возвращаемся назад
  if (!resultData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <IconSymbol name="xmark.circle.fill" size={64} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.text }]}>
            No data available
          </Text>
          <TouchableOpacity
            style={[styles.errorButton, { backgroundColor: colors.tint }]}
            onPress={() => router.back()}>
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleShare = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      const termsText = resultData.ecoTerms
        .map((t) => `• ${t.term}: ${t.description}`)
        .join('\n');
      
      const message = `🌿 ${resultData.objectName}\n\n${resultData.definition}\n\nEcology Terms:\n${termsText}\n\n— AI Eco‑Lexicon`;
      
      await Share.share({
        message,
        title: `AI Eco‑Lexicon: ${resultData.objectName}`,
      });
    } catch (error) {
      // Пользователь отменил или ошибка — игнорируем
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      {/* Заголовок с кнопками */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <IconSymbol name="chevron.left" size={28} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>Result</Text>

        <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
          <IconSymbol name="square.and.arrow.up" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Основной контент */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <ResultCard data={resultData} />

        {/* Дополнительная информация (время сканирования, если передано) */}
        {'timestamp' in params && params.timestamp && (
          <Text style={[styles.timestamp, { color: colors.icon }]}>
            Scanned: {new Date(params.timestamp as string).toLocaleString()}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 0 : 8,
    paddingBottom: 8,
    borderBottomWidth: 0,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  timestamp: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 24,
  },
  errorButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});