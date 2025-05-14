"use client"

import { useState, useEffect } from "react"
import { StyleSheet, ActivityIndicator, View } from "react-native"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { fetchMessages, type Message } from "@/database/db"
import Colors from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"
import { History } from "lucide-react-native"
import { AnimatedHeader } from "@/components/animatedHeader"
import { AnimatedCard } from "@/components/animatedCard"
import { AnimatedList } from "@/components/animatedList"
import { EmptyStateAnimated } from "@/components/EmptyStateAnimated"

export default function MessageHistoryScreen() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? "light"]

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await fetchMessages()
        setMessages(data)
      } catch (error) {
        console.error("Error loading messages:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMessages()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const renderItem = ({ item, index }: { item: Message; index: number }) => (
    <AnimatedCard delay={index * 100} style={styles.messageCard}>
      <ThemedText style={styles.messageContent}>{item.content}</ThemedText>
      <View style={styles.messageFooter}>
        <View style={styles.recipientBadge}>
          <ThemedText style={styles.recipientText}>
            {item.recipient_count} destinataire{item.recipient_count > 1 ? "s" : ""}
          </ThemedText>
        </View>
        <ThemedText style={styles.dateText}>{formatDate(item.sent_at)}</ThemedText>
      </View>
    </AnimatedCard>
  )

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      <AnimatedHeader title="Historique des messages" showBack />

      {messages.length === 0 ? (
        <EmptyStateAnimated
          title="Aucun message"
          description="Vous n'avez pas encore envoyé de messages."
          icon={<History size={48} color={colors.primary} />}
        />
      ) : (
        <AnimatedList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  messageCard: {
    marginBottom: 16,
  },
  messageContent: {
    marginBottom: 16,
    fontSize: 16,
    lineHeight: 22,
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recipientBadge: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recipientText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#007AFF",
  },
  dateText: {
    fontSize: 12,
    opacity: 0.6,
  },
})
