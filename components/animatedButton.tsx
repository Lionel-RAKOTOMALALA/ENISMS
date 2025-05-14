"use client"

import type React from "react"
import { useRef } from "react"
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
} from "react-native"
import Colors from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"

interface AnimatedButtonProps {
  title: string
  onPress: () => void
  style?: ViewStyle
  textStyle?: TextStyle
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  variant?: "primary" | "secondary" | "outline"
  icon?: React.ReactNode
}

export const AnimatedButton = ({
  title,
  onPress,
  style,
  textStyle,
  loading = false,
  disabled = false,
  fullWidth = false,
  variant = "primary",
  icon,
}: AnimatedButtonProps) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? "light"]

  const scale = useRef(new Animated.Value(1)).current

  const getBackgroundColor = () => {
    if (disabled) return colors.inactive

    switch (variant) {
      case "secondary":
        return colors.secondary
      case "outline":
        return "transparent"
      default:
        return colors.primary
    }
  }

  const getTextColor = () => {
    if (disabled) return "#888"

    switch (variant) {
      case "outline":
        return colors.primary
      default:
        return "#fff"
    }
  }

  const getBorderColor = () => {
    if (variant === "outline") {
      return colors.primary
    }
    return "transparent"
  }

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start()
  }

  return (
    <Animated.View style={[styles.container, fullWidth && styles.fullWidth, { transform: [{ scale }] }]}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[
          styles.button,
          fullWidth && styles.fullWidth,
          {
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
            borderWidth: variant === "outline" ? 1.5 : 0,
          },
          style,
        ]}
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            {icon && <Text style={styles.iconContainer}>{icon}</Text>}
            <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  button: {
    borderRadius: 24, // More rounded corners like WhatsApp
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 0, // WhatsApp buttons are flat
  },
  fullWidth: {
    width: "100%",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  iconContainer: {
    marginRight: 8,
  },
})
