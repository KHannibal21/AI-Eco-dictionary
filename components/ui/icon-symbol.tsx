import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
export type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  'house.fill': 'home',
  'camera.fill': 'camera-alt',
  'camera': 'camera-alt',
  'clock.arrow.circlepath': 'history',
  'leaf.fill': 'eco',
  'leaf': 'eco',
  'tree.fill': 'park',
  'tree': 'park',
  'arrow.triangle.2.circlepath': 'autorenew',
  'trash.fill': 'delete',
  'square.and.arrow.up': 'share',
  'square.and.arrow.down': 'download',
  'magnifyingglass': 'search',
  'xmark.circle.fill': 'cancel',
  'book.fill': 'menu-book',
  'drop.fill': 'water-drop',
  'cloud.fill': 'cloud',
  'checkmark.circle.fill': 'check-circle',
  'info.circle': 'info',
  'photo.on.rectangle': 'photo-library',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
} as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}