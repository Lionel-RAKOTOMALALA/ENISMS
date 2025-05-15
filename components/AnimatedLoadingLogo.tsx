import React, { useRef, useEffect } from "react";
import { Animated, StyleSheet } from "react-native";
import Svg, { G, Path } from "react-native-svg";

export const AnimatedLoadingLogo = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Boucle infinie d'animation de fondu
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Svg
        width="189"
        height="194"
        viewBox="0 0 189 194"
        preserveAspectRatio="xMidYMid meet"
      >
        <G
          transform="translate(0.000000,194.000000) scale(0.100000,-0.100000)"
          fill="#000000"
          stroke="none"
        >
          <Path d="M0 970 l0 -970 945 0 945 0 0 970 0 970 -945 0 -945 0 0 -970z m992 639 l41 -21 28 21 c27 20 39 21 367 21 317 0 341 -1 363 -19 17 -13 23 -29 23 -56 0 -27 -6 -43 -23 -56 -22 -18 -45 -19 -322 -19 -164 0 -299 -2 -299 -5 0 -2 11 -20 24 -39 32 -48 50 -127 42 -190 -8 -68 -63 -178 -124 -246 l-49 -54 57 -52 c139 -129 156 -279 50 -442 -22 -35 -40 -65 -40 -67 0 -3 144 -5 319 -5 297 0 320 -1 342 -19 17 -13 23 -29 23 -56 0 -27 -6 -43 -23 -56 -22 -18 -46 -19 -363 -19 -323 0 -341 1 -379 21 l-41 20 -22 -20 c-22 -20 -32 -21 -365 -21 -204 0 -350 4 -361 10 -29 16 -42 67 -25 100 8 15 22 30 30 34 9 3 140 6 291 6 151 0 274 1 274 3 0 1 -37 41 -83 87 -100 101 -153 198 -170 309 l-11 71 -193 0 c-106 0 -193 2 -193 5 0 3 87 178 192 390 l193 385 193 0 c176 0 196 -2 234 -21z" />
          <Path d="M662 1468 c-5 -7 -60 -113 -121 -236 l-111 -223 81 3 81 3 23 57 c33 82 122 213 210 312 41 47 75 87 75 90 0 4 -51 6 -114 6 -79 0 -117 -4 -124 -12z" />
          <Path d="M974 1318 c-34 -35 -77 -83 -97 -108 -36 -46 -117 -178 -117 -192 0 -5 33 -8 74 -8 l74 0 62 68 c84 91 114 151 107 215 -2 30 -12 56 -23 68 -19 19 -20 18 -80 -43z" />
          <Path d="M725 818 c16 -77 26 -106 56 -153 34 -54 130 -150 178 -178 l30 -18 32 43 c96 131 78 216 -66 312 -36 24 -48 26 -138 26 l-99 0 7 -32z" />
        </G>
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});