"use client"
import { useEffect, useRef } from "react"
import { Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from "react-native"
import Colors from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import type { LabelPosition } from "@react-navigation/bottom-tabs/lib/typescript/src/types"

export const TabBarAnimated = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? "light"]

  const translateY = useRef(new Animated.Value(100)).current
  const opacity = useRef(new Animated.Value(0)).current

  const indicatorPosition = useRef(new Animated.Value(0)).current
  const tabWidth = Dimensions.get("window").width / state.routes.length

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  useEffect(() => {
    Animated.spring(indicatorPosition, {
      toValue: state.index * tabWidth,
      useNativeDriver: true,
      friction: 10,
      tension: 100,
    }).start()
  }, [state.index])

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.cardBackground,
          borderTopColor: "rgba(0,0,0,0.05)", // WhatsApp uses very subtle borders
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.indicator,
          {
            backgroundColor: colors.primary,
            width: tabWidth - 40,
            transform: [{ translateX: indicatorPosition }],
            left: 20,
          },
        ]}
      />

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label = options.tabBarLabel || options.title || route.name
        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        // Rendu du label en fonction de son type
        const renderLabel = () => {
          // Si le label est une fonction, on l'appelle avec les props appropriées
          if (typeof label === "function") {
            return label({
              focused: isFocused,
              color: isFocused ? colors.primary : colors.inactive,
              position: "below-icon" as LabelPosition,
              children: route.name,
            })
          }

          // Sinon, on affiche simplement le texte
          return (
            <Text
              style={[
                styles.label,
                {
                  color: isFocused ? colors.primary : colors.inactive,
                  fontWeight: isFocused ? "600" : "400",
                },
              ]}
            >
              {label}
            </Text>
          )
        }

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={route.name}
            onPress={onPress}
            style={styles.tab}
          >
            <Animated.View
              style={[
                styles.tabContent,
                {
                  opacity: isFocused ? 1 : 0.7,
                  transform: [
                    {
                      scale: isFocused ? 1 : 0.9,
                    },
                  ],
                },
              ]}
            >
              {options.tabBarIcon &&
                options.tabBarIcon({
                  focused: isFocused,
                  color: isFocused ? colors.primary : colors.inactive,
                  size: 24,
                })}
              {renderLabel()}
            </Animated.View>
          </TouchableOpacity>
        )
      })}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 60, // WhatsApp has a slightly shorter tab bar
    borderTopWidth: 1,
    paddingBottom: 8,
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
  indicator: {
    height: 3, // WhatsApp uses a thinner indicator
    borderRadius: 1.5,
    position: "absolute",
    top: 0,
  },
})
