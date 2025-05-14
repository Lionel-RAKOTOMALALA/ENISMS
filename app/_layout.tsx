"use client"

import { useEffect } from "react"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { initDB } from "@/database/db"
import { Alert } from "react-native"
import { useFrameworkReady } from "@/hooks/useFrameworkReady"

export default function RootLayout() {
  useFrameworkReady()

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await initDB()
        console.log("Base de données initialisée avec succès.")
      } catch (error) {
        console.error("Erreur lors de l'initialisation de la base de données:", error)
        Alert.alert("Erreur", "Impossible d'initialiser la base de données.")
      }
    }

    initializeDatabase()
  }, [])

  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: "transparent" },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-student"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="send-message"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="message-history"
          options={{
            presentation: "card",
            animation: "slide_from_right",
          }}
        />
      </Stack>
    </>
  )
}
