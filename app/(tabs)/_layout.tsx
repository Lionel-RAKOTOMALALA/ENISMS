import { Tabs } from "expo-router"
import { MessageSquare, Users } from "lucide-react-native"
import Colors from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"
import { TabBarAnimated } from "@/components/TabBarAnimated"

export default function TabLayout() {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? "light"]

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.cardBackground,
          height: 70,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
      tabBar={(props) => <TabBarAnimated {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Étudiants",
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}
