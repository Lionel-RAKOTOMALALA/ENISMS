import { View, ViewProps } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';

interface ThemedViewProps extends ViewProps {
  variant?: 'default' | 'card';
}

export function ThemedView({ style, variant = 'default', ...otherProps }: ThemedViewProps) {
  const colorScheme = useColorScheme();
  
  const backgroundColor = 
    variant === 'card' 
      ? Colors[colorScheme ?? 'light'].cardBackground
      : Colors[colorScheme ?? 'light'].background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}