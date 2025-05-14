"use client"

import { useEffect, useRef } from "react"
import { StyleSheet, View, Text, TouchableOpacity, Animated } from "react-native"
import { router } from "expo-router"
import { ArrowLeft, Plus } from "lucide-react-native"
import Colors from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"

interface AnimatedHeaderProps {
  title: string
  showBack?: boolean
  showAdd?: boolean
  onAddPress?: () => void
}

export const AnimatedHeader = ({ title, showBack = false, showAdd = false, onAddPress }: AnimatedHeaderProps) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? "light"]

  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(-20)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const handleBack = () => {
    router.back()
  }

  const handleAdd = () => {
    if (onAddPress) {
      onAddPress()
    } else {
      router.push("/add-student")
    }
  }

  return (
    <Animated.View
      style={[
        styles.header,
        {
          backgroundColor: colors.cardBackground,
          borderBottomColor: colors.border,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.headerContent}>
        {showBack && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.primary} />
          </TouchableOpacity>
        )}

        <Text style={[styles.title, { color: colors.text }, showBack && styles.titleWithBack]}>{title}</Text>

        {showAdd && (
          <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
            <Plus size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 0, // WhatsApp headers don't have visible borders
    elevation: 1, // Subtle shadow instead
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18, // WhatsApp uses slightly smaller title
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  titleWithBack: {
    textAlign: "left", // WhatsApp aligns title to left when back button is present
    marginLeft: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20, // Circular buttons
  },
  addButton: {
    padding: 8,
    borderRadius: 20, // Circular buttons
  },
})
