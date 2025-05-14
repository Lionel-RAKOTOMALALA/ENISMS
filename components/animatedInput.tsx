"use client"

import { useEffect, useRef, useState } from "react"
import { StyleSheet, TextInput, View, Animated, type TextInputProps, Text, type ViewStyle } from "react-native"
import Colors from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"

interface AnimatedInputProps extends TextInputProps {
  label: string
  error?: string
  containerStyle?: ViewStyle
}

export const AnimatedInput = ({ label, error, containerStyle, style, ...props }: AnimatedInputProps) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? "light"]
  const [isFocused, setIsFocused] = useState(false)

  const labelPosition = useRef(new Animated.Value(props.value ? 1 : 0)).current
  const borderAnimation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(labelPosition, {
      toValue: isFocused || props.value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start()

    Animated.timing(borderAnimation, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }, [isFocused, props.value])

  const labelStyle = {
    position: "absolute",
    left: 12,
    top: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [17, -10],
    }),
    fontSize: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.inactive, colors.primary],
    }),
    backgroundColor: isFocused || props.value ? colors.background : "transparent",
    paddingHorizontal: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 8],
    }),
    zIndex: 1,
  } as any

  const borderColor = borderAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.primary],
  })

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.Text style={[styles.label, labelStyle]}>{label}</Animated.Text>

      <Animated.View
        style={[
          styles.inputContainer,
          {
            borderColor,
            backgroundColor: colors.background,
          },
        ]}
      >
        <TextInput
          style={[styles.input, { color: colors.text }, style]}
          placeholderTextColor={colors.inactive}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </Animated.View>

      {error && <Text style={[styles.errorText, { color: colors.error || "#ff3b30" }]}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8, // WhatsApp uses more subtle rounded corners
    height: 56,
    justifyContent: "center",
  },
  input: {
    paddingHorizontal: 12,
    fontSize: 16,
    height: "100%",
  },
  label: {
    fontWeight: "500",
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    marginLeft: 12,
  },
})
