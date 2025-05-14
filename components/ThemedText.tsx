import { Text, TextProps } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';

interface ThemedTextProps extends TextProps {
  type?: 'default' | 'defaultSemiBold' | 'title' | 'subtitle' | 'small' | 'link';
}

export function ThemedText({ style, type = 'default', ...otherProps }: ThemedTextProps) {
  const colorScheme = useColorScheme();
  
  const baseStyle = {
    color: Colors[colorScheme ?? 'light'].text,
  };
  
  const textStyles = {
    default: {
      fontSize: 16,
      lineHeight: 24,
    },
    defaultSemiBold: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600' as const,
    },
    title: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: 'bold' as const,
      color: Colors[colorScheme ?? 'light'].text,
    },
    subtitle: {
      fontSize: 18,
      lineHeight: 28,
      fontWeight: '600' as const,
    },
    small: {
      fontSize: 14,
      lineHeight: 20,
      color: Colors[colorScheme ?? 'light'].tabIconDefault,
    },
    link: {
      fontSize: 16,
      lineHeight: 24,
      color: Colors[colorScheme ?? 'light'].primary,
      textDecorationLine: 'underline' as const,
    },
  };

  return (
    <Text style={[baseStyle, textStyles[type], style]} {...otherProps} />
  );
}