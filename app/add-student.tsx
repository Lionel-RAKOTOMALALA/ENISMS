"use client"

import { useState } from "react"
import { StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, View } from "react-native"
import { router } from "expo-router"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import Colors from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"
import { AnimatedHeader } from "@/components/animatedHeader"
import { AnimatedInput } from "@/components/animatedInput"
import { AnimatedButton } from "@/components/animatedButton"
import { AnimatedCard } from "@/components/animatedCard"
import { UserPlus, User, Phone, GraduationCap, Save } from "lucide-react-native"
import { useStudentStore } from "@/store/studentStore"

export default function AddStudentScreen() {
  const { addStudent } = useStudentStore()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [level, setLevel] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? "light"]

  const handleAddStudent = async () => {
    // Validation
    if (!name.trim()) {
      return Alert.alert("Erreur", "Le nom est requis")
    }

    if (!phone.trim()) {
      return Alert.alert("Erreur", "Le numéro de téléphone est requis")
    }

    if (!level.trim()) {
      return Alert.alert("Erreur", "Le niveau est requis")
    }

    setIsSubmitting(true)

    try {
      await addStudent(name.trim(), phone.trim(), level.trim())
      Alert.alert("Succès", "Étudiant ajouté avec succès", [{ text: "OK", onPress: () => router.back() }])
    } catch (error) {
      console.error("Error adding student:", error)
      Alert.alert("Erreur", "Une erreur s'est produite lors de l'ajout de l'étudiant")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ThemedView style={styles.container}>
      <AnimatedHeader title="Ajouter un étudiant" showBack />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoid}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <AnimatedCard style={styles.formCard}>
            <View style={styles.iconContainer}>
              <UserPlus size={24} color={colors.primary} />
            </View>

            <ThemedText style={styles.formTitle}>Informations de l'étudiant</ThemedText>

            <AnimatedInput
              label="Nom et prénom"
              value={name}
              onChangeText={setName}
              placeholder="Entrez le nom complet"
              placeholderTextColor={colors.inactive}
              icon={<User size={20} color={colors.primary} />}
            />

            <AnimatedInput
              label="Numéro de téléphone"
              value={phone}
              onChangeText={setPhone}
              placeholder="Ex: 034 00 000 00"
              keyboardType="phone-pad"
              placeholderTextColor={colors.inactive}
              icon={<Phone size={20} color={colors.primary} />}
            />

            <AnimatedInput
              label="Niveau"
              value={level}
              onChangeText={setLevel}
              placeholder="Ex: L1, L2, M1, etc."
              placeholderTextColor={colors.inactive}
              icon={<GraduationCap size={20} color={colors.primary} />}
            />

            <AnimatedButton
              title="Ajouter l'étudiant"
              onPress={handleAddStudent}
              loading={isSubmitting}
              disabled={isSubmitting}
              style={styles.button}
              fullWidth
              icon={<Save size={20} color="#FFFFFF" />}
            />
          </AnimatedCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  )
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
  formCard: {
    padding: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(18, 140, 126, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    marginTop: 16,
  },
})