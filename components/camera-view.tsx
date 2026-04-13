import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CameraView as ExpoCameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface CameraViewProps {
  onCapture: (base64Image: string) => void;
  isProcessing: boolean;
}

export function CameraView({ onCapture, isProcessing }: CameraViewProps) {
  const cameraRef = useRef<ExpoCameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const takePicture = async () => {
    if (!cameraRef.current || isProcessing) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.9,
        skipProcessing: Platform.OS === 'android', // улучшает скорость на Android
      });
      if (photo?.base64) {
        onCapture(photo.base64);
      } else {
        Alert.alert('Error', 'Failed to capture image.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take picture.');
      console.error(error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        base64: true,
        quality: 0.9,
      });
      if (!result.canceled && result.assets[0].base64) {
        onCapture(result.assets[0].base64);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image from gallery.');
      console.error(error);
    }
  };

  if (!permission) {
    // Пока разрешение загружается, показываем пустой контейнер
    return <View style={[styles.container, { backgroundColor: colors.background }]} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={[styles.permissionButton, { backgroundColor: colors.tint }]}
          onPress={requestPermission}>
          <IconSymbol name="camera" size={32} color="#fff" />
          <Text style={styles.permissionText}>Grant Camera Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ExpoCameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        autofocus="on"
        flash="off"
      />
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.sideButton, { backgroundColor: 'rgba(0,0,0,0.3)' }]}
          onPress={pickImage}
          disabled={isProcessing}>
          <IconSymbol name="photo.on.rectangle" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.captureButton,
            { borderColor: colors.tint },
            isProcessing && styles.captureButtonDisabled,
          ]}
          onPress={takePicture}
          disabled={isProcessing}>
          {isProcessing ? (
            <ActivityIndicator size="large" color={colors.tint} />
          ) : (
            <View style={[styles.captureInner, { backgroundColor: colors.tint }]} />
          )}
        </TouchableOpacity>

        {/* Пустой элемент для симметрии */}
        <View style={styles.sideButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  camera: { flex: 1 },
  controls: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
  },
  sideButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  permissionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    gap: 12,
  },
  permissionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});