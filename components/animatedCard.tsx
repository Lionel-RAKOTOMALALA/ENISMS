"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { StyleSheet, Animated, Easing, type ViewStyle } from "react-native"
import Colors from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"

interface AnimatedCardProps {
  children: React.ReactNode
  delay?: number
  style?: ViewStyle
}

export const AnimatedCard = ({ children, delay = 0, style }: AnimatedCardProps) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? "light"]

  const translateY = useRef(new Animated.Value(50)).current
  const opacity = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(0.9)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start()
  }, [])

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
          transform: [{ translateY }, { scale }],
          opacity,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8, // WhatsApp uses more subtle rounded corners
    padding: 16,
    marginBottom: 8, // Tighter spacing like WhatsApp
    borderWidth: 0, // WhatsApp doesn't use borders
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, // Very subtle shadow
    shadowRadius: 3,
    elevation: 1, // Subtle elevation
  },
})
