"use client"

import { useEffect, useState } from "react"
import { StyleSheet, View, Alert, TextInput, RefreshControl, ActivityIndicator } from "react-native"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import Colors from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"
import { getOperator } from "@/utils/operator"
import * as SMS from "expo-sms"
import { AnimatedHeader } from "@/components/animatedHeader"
import { StudentItemAnimated } from "@/components/StudentItemAnimated"
import { AnimatedList } from "@/components/animatedList"
import { EmptyStateAnimated } from "@/components/EmptyStateAnimated"
import { Users, Send, MessageSquare, RefreshCw } from "lucide-react-native"
import { AnimatedButton } from "@/components/animatedButton"
import { ModalAnimated } from "@/components/ModalAnimated"
import { AnimatedLogo } from "@/components/AnimatedLogo"
import { useStudentStore } from "@/store/studentStore"
import { Student } from "@/database/db"

export default function StudentsScreen() {
  const { students, loadStudents, shouldRefresh, resetRefreshFlag } = useStudentStore()
  const [refreshing, setRefreshing] = useState(false)
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null)
  const [message, setMessage] = useState<string>("")
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(true)

  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? "light"]

  useEffect(() => {
    loadStudents().finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (shouldRefresh) {
      loadStudents()
      resetRefreshFlag()
    }
  }, [shouldRefresh])

  const onRefresh = () => {
    setRefreshing(true)
    loadStudents().finally(() => setRefreshing(false))
  }

  // Trier par opérateur
  const studentsByOperator = students.reduce<Record<string, Student[]>>((groups, student) => {
    const operator = getOperator(student.phone)
    if (!groups[operator]) {
      groups[operator] = []
    }
    groups[operator].push(student)
    return groups
  }, {})

  const handleSendMessages = async (operator: string) => {
    const filteredStudents = studentsByOperator[operator] ?? []
    const phoneNumbers = filteredStudents.map((student) => student.phone)

    if (phoneNumbers.length === 0) {
      return Alert.alert("Aucun destinataire", `Aucun étudiant trouvé pour l'opérateur ${operator}`)
    }

    try {
      const isAvailable = await SMS.isAvailableAsync()
      if (isAvailable) {
        const { result } = await SMS.sendSMSAsync(phoneNumbers, message)
        if (result === "sent" || result === "unknown") {
          Alert.alert("Succès", `Message envoyé à ${phoneNumbers.length} étudiant(s) de l'opérateur ${operator}`)
          setMessage("")
          setModalVisible(false)
        }
      } else {
        Alert.alert("Non disponible", "SMS non disponible sur cet appareil")
      }
    } catch (error) {
      console.error("Error sending SMS:", error)
      Alert.alert("Erreur", "Une erreur s'est produite lors de l'envoi du SMS")
    }
  }

  const openModal = (operator: string) => {
    setSelectedOperator(operator)
    setModalVisible(true)
  }

  const renderGroup = (operator: string, students: Student[]) => (
    <View key={operator} style={styles.operatorGroup}>
      <View style={styles.operatorHeader}>
        <View style={styles.operatorLabelContainer}>
          <MessageSquare size={18} color={colors.primary} style={styles.operatorIcon} />
          <ThemedText style={styles.operatorLabel}>{`${operator} (${students.length})`}</ThemedText>
        </View>
        <AnimatedButton
          title="Envoyer à tous"
          onPress={() => openModal(operator)}
          style={styles.sendButton}
          variant="outline"
          icon={<Send size={16} color={colors.primary} />}
        />
      </View>
      {students.map((student, index) => (
        <StudentItemAnimated key={student.id} student={student} onDelete={() => loadStudents()} delay={index * 0.1} />
      ))}
    </View>
  )

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <AnimatedLogo size={100} color={colors.primary} />
      </ThemedView>
    )
  }

  if (students.length === 0) {
    return (
      <ThemedView style={styles.centered}>
        <AnimatedLogo size={60} color={colors.primary} />
        <EmptyStateAnimated
          title="Aucun étudiant"
          description="Ajoutez des étudiants pour commencer à gérer votre classe."
          icon={<Users size={48} color={colors.primary} />}
        />
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      <AnimatedHeader title="Étudiants par opérateur" showAdd />
      <AnimatedList
        data={Object.entries(studentsByOperator)}
        renderItem={({ item }) => renderGroup(item[0], item[1])}
        keyExtractor={(item) => item[0]}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
      <ModalAnimated visible={modalVisible} onClose={() => setModalVisible(false)}>
        <View style={styles.modalHeader}>
          <AnimatedLogo size={30} color={colors.primary} />
          <ThemedText style={styles.modalTitle}>
            Envoyer un message à tous les étudiants utilisateurs de {selectedOperator}
          </ThemedText>
        </View>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Tapez votre message ici..."
          multiline
          numberOfLines={4}
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
          title="Envoyer"
          onPress={() => handleSendMessages(selectedOperator!)}
          disabled={!message.trim()}
          style={styles.modalButton}
          fullWidth
          icon={<Send size={18} color="#FFFFFF" />}
        />
        <AnimatedButton
          title="Annuler"
          onPress={() => setModalVisible(false)}
          style={{ marginVertical: 8 }}
          variant="outline"
          fullWidth
          icon={<RefreshCw size={18} color={colors.primary} />}
        />
      </ModalAnimated>
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
  list: {
    padding: 16,
  },
  operatorGroup: {
    marginBottom: 24,
  },
  operatorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  operatorLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  operatorIcon: {
    marginRight: 8,
  },
  operatorLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sendButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    textAlignVertical: "top",
    marginBottom: 16,
    fontSize: 16,
  },
  modalButton: {
    marginVertical: 8,
  },
})