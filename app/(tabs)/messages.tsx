import { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Alert, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import * as SMS from 'expo-sms';
import { fetchStudents, saveMessage, Student } from '@/database/db';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function SendMessageToAllScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await fetchStudents();
        setStudents(data);
      } catch (error) {
        console.error('Error loading students:', error);
        Alert.alert('Erreur', 'Impossible de charger les étudiants');
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  const handleSendMessages = async () => {
    if (!message.trim()) {
      return Alert.alert('Message vide', 'Veuillez entrer un message');
    }

    if (students.length === 0) {
      return Alert.alert('Aucun destinataire', 'Aucun étudiant dans la base de données');
    }

    const phoneNumbers = students.map(student => student.phone);

    try {
      const isAvailable = await SMS.isAvailableAsync();

      if (isAvailable) {
        setIsSending(true);
        const { result } = await SMS.sendSMSAsync(phoneNumbers, message);

        if (result === 'sent' || result === 'unknown') {
          // Sauvegarde dans l'historique
          await saveMessage(message, phoneNumbers.length);
          Alert.alert('Succès', `Message envoyé à ${phoneNumbers.length} étudiant(s)`);
          setMessage('');
        }
      } else {
        Alert.alert('Non disponible', 'SMS non disponible sur cet appareil');
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      Alert.alert('Erreur', "Une erreur s'est produite lors de l'envoi du SMS");
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Header title="Envoyer un message à tous" showBack />
      <View style={styles.content}>
        <ThemedText style={styles.label}>Message</ThemedText>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Tapez votre message ici..."
          multiline
          numberOfLines={4}
          style={[styles.input, {
            backgroundColor: colors.background,
            borderColor: colors.border,
            color: colors.text,
          }]}
          placeholderTextColor={colors.inactive}
        />
        <Button
          title="Envoyer à tous"
          onPress={handleSendMessages}
          loading={isSending}
          disabled={isSending || !message.trim()}
          style={styles.button}
          fullWidth
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
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
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 8,
  },
});