"use client"

import { Link, Stack } from "expo-router"
import { StyleSheet, View, Animated } from "react-native"
import { useEffect, useRef } from "react"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { AnimatedButton } from "@/components/animatedButton"
import Colors from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"
import { AlertTriangle } from "lucide-react-native"

export default function NotFoundScreen() {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? "light"]

  const fadeAnim = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(50)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: "Oops!", headerShown: false }} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + "20" }]}>
          <AlertTriangle size={64} color={colors.primary} />
        </View>

        <ThemedText style={styles.title}>Page introuvable</ThemedText>
        <ThemedText style={styles.description}>La page que vous recherchez n'existe pas ou a été déplacée.</ThemedText>

        <Link href="/" asChild>
          <AnimatedButton title="Retour à l'accueil" onPress={() => {}} style={styles.button} />
        </Link>
      </Animated.View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    opacity: 0.7,
  },
  button: {
    marginTop: 16,
    minWidth: 200,
  },
})
