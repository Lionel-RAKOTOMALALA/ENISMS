import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Student, deleteStudent } from '@/database/db';
import { ThemedText } from './ThemedText';
import { Card } from './Card';
import { Phone, Trash2 } from 'lucide-react-native';
import * as SMS from 'expo-sms';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface StudentItemProps {
  student: Student;
  onDelete: () => void;
}

export function StudentItem({ student, onDelete }: StudentItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleSendSMS = async () => {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      await SMS.sendSMSAsync([student.phone], '');
    } else {
      Alert.alert('Error', 'SMS is not available on this device');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmation',
      `Voulez-vous vraiment supprimer "${student.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteStudent(student.id);
              onDelete();
            } catch (error) {
              Alert.alert('Erreur', 'Échec de la suppression');
            }
          },
        },
      ]
    );
  };

  return (
    <Card>
      <View style={styles.container}>
        <View style={styles.info}>
          <ThemedText type="defaultSemiBold">{student.name}</ThemedText>
          <ThemedText>{student.phone}</ThemedText>
          <View style={styles.levelBadge}>
            <ThemedText style={styles.levelText}>{student.level}</ThemedText>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.primary }]} 
            onPress={handleSendSMS}
          >
            <Phone size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.error }]} 
            onPress={handleDelete}
          >
            <Trash2 size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  levelBadge: {
    backgroundColor: '#EAF5FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  levelText: {
    fontSize: 12,
    color: '#1C9963',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});