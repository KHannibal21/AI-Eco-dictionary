import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CameraView } from '@/components/camera-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { analyzeImage, isApiKeyConfigured } from '@/services/gemini';
import { addHistoryItem } from '@/utils/storage';

export default function CameraScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Проверка наличия API ключа при монтировании
  const hasApiKey = isApiKeyConfigured();

  const handleCapture = useCallback(
    async (base64Image: string) => {
      if (isProcessing) return;

      // Предупреждение если ключ не настроен
      if (!hasApiKey) {
        Alert.alert(
          'API Key Missing',
          'Please add your Gemini API key to the .env file as EXPO_PUBLIC_GEMINI_API_KEY',
          [{ text: 'OK' }]
        );
        return;
      }

      setIsProcessing(true);
      setProcessingError(null);

      try {
        const result = await analyzeImage(base64Image);

        if (result) {
          // Сохраняем в историю
          const historyItem = {
            id: Date.now().toString(),
            ...result,
            timestamp: new Date().toISOString(),
            // Опционально можно добавить миниатюру (но base64 может быть большим)
            // imageThumbnail: base64Image,
          };
          await addHistoryItem(historyItem);

          // Переходим на экран результата
          router.push({
            pathname: '/result',
            params: { data: JSON.stringify(result) },
          });
        } else {
          throw new Error('No result returned from AI');
        }
      } catch (error) {
        let errorMessage = 'Failed to analyze image.';

        if (error instanceof Error) {
          if (error.message.includes('ALL_MODELS_FAILED')) {
            errorMessage =
              'All Gemini models are currently unavailable. Please check your internet connection and try again later.';
          } else if (error.message.includes('NO_API_KEY')) {
            errorMessage = 'API key is missing. Check your .env file.';
          } else {
            errorMessage = error.message;
          }
        }

        setProcessingError(errorMessage);
        setShowErrorModal(true);
        console.error('Capture error:', error);
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing, hasApiKey, router]
  );

  const handleDismissError = () => {
    setShowErrorModal(false);
    setProcessingError(null);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>AI Eco‑Lexicon</Text>
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
          Point camera at nature
        </Text>
      </View>

      {/* Камера */}
      <View style={styles.cameraContainer}>
        <CameraView onCapture={handleCapture} isProcessing={isProcessing} />
      </View>

      {/* Индикатор загрузки (оверлей) */}
      {isProcessing && (
        <View style={styles.loadingOverlay}>
          <View style={[styles.loadingBox, { backgroundColor: colors.cardBackground }]}>
            <ActivityIndicator size="large" color={colors.tint} />
            <Text style={[styles.loadingText, { color: colors.text }]}>
              Analyzing with AI...
            </Text>
            <Text style={[styles.loadingSubtext, { color: colors.secondaryText }]}>
              This may take a few seconds
            </Text>
          </View>
        </View>
      )}

      {/* Модальное окно ошибки */}
      <Modal
        visible={showErrorModal}
        transparent
        animationType="fade"
        onRequestClose={handleDismissError}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <IconSymbol name="xmark.circle.fill" size={48} color={colors.error} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>Analysis Failed</Text>
            <Text style={[styles.modalMessage, { color: colors.secondaryText }]}>
              {processingError}
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.tint }]}
              onPress={handleDismissError}>
              <Text style={styles.modalButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 24,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 220,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 14,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});