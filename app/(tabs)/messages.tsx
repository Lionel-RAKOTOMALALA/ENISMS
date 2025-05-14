"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, TextInput, Alert, ActivityIndicator, TouchableOpacity } from "react-native"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import * as SMS from "expo-sms"
import { fetchStudents, saveMessage, type Student } from "@/database/db"
import Colors from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"
import { AnimatedHeader } from "@/components/animatedHeader"
import { AnimatedButton } from "@/components/animatedButton"
import { AnimatedCard } from "@/components/animatedCard"
import { History, Send } from "lucide-react-native"
import { router } from "expo-router"

export default function SendMessageToAllScreen() {
  const [students, setStudents] = useState<Student[]>([])
  const [message, setMessage] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)

  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? "light"]

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await fetchStudents()
        setStudents(data)
      } catch (error) {
        console.error("Error loading students:", error)
        Alert.alert("Erreur", "Impossible de charger les étudiants")
      } finally {
        setLoading(false)
      }
    }

    loadStudents()
  }, [])

  const handleSendMessages = async () => {
    if (!message.trim()) {
      return Alert.alert("Message vide", "Veuillez entrer un message")
    }

    if (students.length === 0) {
      return Alert.alert("Aucun destinataire", "Aucun étudiant dans la base de données")
    }

    const phoneNumbers = students.map((student) => student.phone)

    try {
      const isAvailable = await SMS.isAvailableAsync()

      if (isAvailable) {
        setIsSending(true)
        const { result } = await SMS.sendSMSAsync(phoneNumbers, message)

        if (result === "sent" || result === "unknown") {
          // Sauvegarde dans l'historique
          await saveMessage(message, phoneNumbers.length)
          Alert.alert("Succès", `Message envoyé à ${phoneNumbers.length} étudiant(s)`)
          setMessage("")
        }
      } else {
        Alert.alert("Non disponible", "SMS non disponible sur cet appareil")
      }
    } catch (error) {
      console.error("Error sending SMS:", error)
      Alert.alert("Erreur", "Une erreur s'est produite lors de l'envoi du SMS")
    } finally {
      setIsSending(false)
    }
  }

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      <AnimatedHeader title="Envoyer un message à tous" />

      <View style={styles.content}>
        <AnimatedCard style={styles.statsCard}>
          <ThemedText style={styles.statsTitle}>Statistiques</ThemedText>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>{students.length}</ThemedText>
              <ThemedText style={styles.statLabel}>Étudiants</ThemedText>
            </View>
            <View style={styles.statDivider} />
            <TouchableOpacity style={styles.statItem} onPress={() => router.push("/message-history")}>
              <View style={styles.historyIconContainer}>
                <History size={20} color={colors.primary} />
              </View>
              <ThemedText style={styles.statLabel}>Historique</ThemedText>
            </TouchableOpacity>
          </View>
        </AnimatedCard>

        <AnimatedCard delay={100} style={styles.messageCard}>
          <ThemedText style={styles.messageTitle}>Nouveau message</ThemedText>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Tapez votre message ici..."
            multiline
            numberOfLines={6}
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            placeholderTextColor={colors.inactive}
          />

          <AnimatedButton
            title="Envoyer à tous"
            onPress={handleSendMessages}
            loading={isSending}
            disabled={isSending || !message.trim()}
            style={styles.button}
            fullWidth
            icon={<Send size={18} color="#fff" />}
          />
        </AnimatedCard>
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 16,
  },
  statsCard: {
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#ddd",
    opacity: 0.5,
  },
  historyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
  messageCard: {
    marginBottom: 16,
  },
  messageTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    minHeight: 150,
    textAlignVertical: "top",
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    marginTop: 8,
  },
})
