import { useState } from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  TextInput,
  Alert 
} from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { insertStudent } from '@/database/db';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function AddStudentScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [level, setLevel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleAddStudent = async () => {
    // Validation
    if (!name.trim()) {
      return Alert.alert('Erreur', 'Le nom est requis');
    }
    
    if (!phone.trim()) {
      return Alert.alert('Erreur', 'Le numéro de téléphone est requis');
    }
    
    if (!level.trim()) {
      return Alert.alert('Erreur', 'Le niveau est requis');
    }
    
    setIsSubmitting(true);
    
    try {
      await insertStudent(name.trim(), phone.trim(), level.trim());
      Alert.alert(
        'Succès', 
        'Étudiant ajouté avec succès',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error adding student:', error);
      Alert.alert('Erreur', "Une erreur s'est produite lors de l'ajout de l'étudiant");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Header title="Ajouter un étudiant" showBack />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <ThemedText style={styles.label}>Nom et prénom</ThemedText>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.background,
              borderColor: colors.border,
              color: colors.text
            }]}
            value={name}
            onChangeText={setName}
            placeholder="Entrez le nom complet"
            placeholderTextColor={colors.inactive}
          />
          
          <ThemedText style={styles.label}>Numéro de téléphone</ThemedText>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.background,
              borderColor: colors.border,
              color: colors.text
            }]}
            value={phone}
            onChangeText={setPhone}
            placeholder="Ex: 034 00 000 00"
            keyboardType="phone-pad"
            placeholderTextColor={colors.inactive}
          />
          
          <ThemedText style={styles.label}>Niveau</ThemedText>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.background,
              borderColor: colors.border,
              color: colors.text
            }]}
            value={level}
            onChangeText={setLevel}
            placeholder="Ex: L1, L2, M1, etc."
            placeholderTextColor={colors.inactive}
          />
          
          <Button
            title="Ajouter l'étudiant"
            onPress={handleAddStudent}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.button}
            fullWidth
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    marginTop: 8,
  },
});