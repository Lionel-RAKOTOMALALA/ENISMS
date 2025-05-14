"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { FlatList, type FlatListProps, Animated, type ViewStyle } from "react-native"

interface AnimatedListProps<T> extends Omit<FlatListProps<T>, "renderItem"> {
  renderItem: ({ item, index }: { item: T; index: number }) => React.ReactNode
  containerStyle?: ViewStyle
}

export function AnimatedList<T>({ data, renderItem, containerStyle, ...rest }: AnimatedListProps<T>) {
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }, [])

  const renderAnimatedItem = ({ item, index }: { item: T; index: number }) => {
    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        }}
      >
        {renderItem({ item, index })}
      </Animated.View>
    )
  }

  return (
    <Animated.View style={[{ flex: 1 }, containerStyle]}>
      <FlatList data={data} renderItem={renderAnimatedItem} {...rest} />
    </Animated.View>
  )
}
