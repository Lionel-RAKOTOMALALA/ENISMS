import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { UserRound } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Button } from './Button';
import { router } from 'expo-router';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export function EmptyState({ 
  title, 
  description, 
  icon, 
  action 
}: EmptyStateProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {icon || <UserRound size={48} color={colors.primary} />}
      </View>
      <ThemedText type="title" style={styles.title}>{title}</ThemedText>
      <ThemedText style={styles.description}>{description}</ThemedText>
      
      {action && (
        <Button 
          title={action.label} 
          onPress={action.onPress} 
          style={styles.button}
        />
      )}
    </View>
  );
}

export function StudentEmptyState() {
  return (
    <EmptyState
      title="Aucun étudiant"
      description="Vous n'avez pas encore ajouté d'étudiants. Commencez par en ajouter un."
      action={{
        label: "Ajouter un étudiant",
        onPress: () => router.push('/add-student')
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  button: {
    minWidth: 200,
  },
});