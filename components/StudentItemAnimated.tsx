"use client"

import { useRef, useState } from "react"
import { StyleSheet, View, Text, TouchableOpacity, Alert, Animated, Easing } from "react-native"
import { Trash2, MessageSquare, User, Phone, BookOpen } from "lucide-react-native"
import { type Student, deleteStudent } from "@/database/db"
import Colors from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"
import * as SMS from "expo-sms"
import { AnimatedCard } from "./animatedCard"
import { getOperator } from "@/utils/operator"

interface StudentItemProps {
  student: Student
  onDelete: () => void
  delay?: number
}

export const StudentItemAnimated = ({ student, onDelete, delay = 0 }: StudentItemProps) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? "light"]
  const [isDeleting, setIsDeleting] = useState(false)

  const scaleAnim = useRef(new Animated.Value(1)).current
  const opacityAnim = useRef(new Animated.Value(1)).current

  const handleDelete = () => {
    Alert.alert("Confirmation", `Voulez-vous vraiment supprimer ${student.name} ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          setIsDeleting(true)

          // Animation de suppression
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 0.9,
              duration: 300,
              useNativeDriver: true,
              easing: Easing.out(Easing.cubic),
            }),
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(async () => {
            try {
              await deleteStudent(student.id)
              onDelete()
            } catch (error) {
              console.error("Error deleting student:", error)
              Alert.alert("Erreur", "Une erreur s'est produite lors de la suppression")

              // Réinitialiser l'animation si erreur
              Animated.parallel([
                Animated.timing(scaleAnim, {
                  toValue: 1,
                  duration: 300,
                  useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                  toValue: 1,
                  duration: 300,
                  useNativeDriver: true,
                }),
              ]).start()
            } finally {
              setIsDeleting(false)
            }
          })
        },
      },
    ])
  }

  const handleSendSMS = async () => {
    try {
      const isAvailable = await SMS.isAvailableAsync()
      if (isAvailable) {
        await SMS.sendSMSAsync([student.phone], "")
      } else {
        Alert.alert("Non disponible", "SMS non disponible sur cet appareil")
      }
    } catch (error) {
      console.error("Error sending SMS:", error)
      Alert.alert("Erreur", "Une erreur s'est produite lors de l'envoi du SMS")
    }
  }

  const operatorColor = () => {
    const operator = getOperator(student.phone)
    switch (operator) {
      case "YAS":
        return "#FF9500"
      case "Airtel":
        return "#FF3B30"
      case "Orange":
        return "#FF9500"
      default:
        return colors.inactive
    }
  }

  return (
    <AnimatedCard delay={delay * 100}>
      <Animated.View
        style={[
          styles.container,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <User size={16} color={colors.primary} style={styles.icon} />
            <Text style={[styles.name, { color: colors.text }]}>{student.name}</Text>
          </View>

          <View style={styles.detailsRow}>
            <View style={[styles.levelBadge, { backgroundColor: colors.primary + "15" }]}>
              <BookOpen size={12} color={colors.primary} style={styles.badgeIcon} />
              <Text style={[styles.levelText, { color: colors.primary }]}>{student.level}</Text>
            </View>

            <View style={[styles.operatorBadge, { backgroundColor: operatorColor() + "15" }]}>
              <Text style={[styles.operatorText, { color: operatorColor() }]}>{getOperator(student.phone)}</Text>
            </View>
          </View>

          <View style={styles.phoneRow}>
            <Phone size={14} color={colors.inactive} style={styles.icon} />
            <Text style={[styles.phone, { color: colors.inactive }]}>{student.phone}</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary + "15" }]}
            onPress={handleSendSMS}
            disabled={isDeleting}
          >
            <MessageSquare size={18} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#FF3B30" + "15" }]}
            onPress={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 size={18} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </AnimatedCard>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  detailsRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeIcon: {
    marginRight: 4,
  },
  levelText: {
    fontSize: 12,
    fontWeight: "500",
  },
  operatorBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  operatorText: {
    fontSize: 12,
    fontWeight: "500",
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  phone: {
    fontSize: 14,
  },
  icon: {
    marginRight: 6,
  },
  actionsContainer: {
    flexDirection: "row",
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
})
