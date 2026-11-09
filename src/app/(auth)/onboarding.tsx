import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  StatusBar,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";

type Props = {
  onDone?: () => void;
};

const ACCENT = "#35d1e6";

export default function SplashAnimation({ onDone }: Props) {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const photoWidth = Math.min(width - 40, 420);
  const photoHeight = photoWidth * 0.66;

  const photoX = useRef(new Animated.Value(-width)).current; // starts off-screen left
  const photoOpacity = useRef(new Animated.Value(0)).current;
  const photoScale = useRef(new Animated.Value(0.92)).current;
  const lineOpacity = useRef(new Animated.Value(0)).current;
  const lineY = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    const finish = () => {
      if (onDone) return onDone();
      router.replace("/(auth)/login");
    };

    const animation = Animated.sequence([
      // 1. The tanker drives in from the left and slows to a stop
      Animated.parallel([
        Animated.timing(photoX, {
          toValue: 0,
          duration: 1300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(photoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(photoScale, {
          toValue: 1,
          duration: 1300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      // 2. Tagline fades up under the photo
      Animated.parallel([
        Animated.timing(lineOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(lineY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // 3. Hold for a moment, then open the next screen
      Animated.delay(700),
    ]);

    animation.start(({ finished }) => {
      if (finished) finish();
    });

    return () => animation.stop();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content"  />

      <Animated.View
        style={[
          styles.photoShadow,
          {
            opacity: photoOpacity,
            transform: [{ translateX: photoX }, { scale: photoScale }],
          },
        ]}
      >
        <Image
          source={{uri:"https://res.cloudinary.com/yozeshlg/image/upload/v1793962329/Screenshot_2026-11-06_144808.png"}}
          style={{ width: photoWidth, height: photoHeight, borderRadius: 24 }}
          resizeMode="cover"
        />
      </Animated.View>

      <Animated.Text
        style={[
          styles.tagline,
          { opacity: lineOpacity, transform: [{ translateY: lineY }] },
        ]}
      >
        On-Site Diesel Delivery
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ACCENT,
    alignItems: "center",
    justifyContent: "center",
  },
  photoShadow: {
    borderRadius: 24,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  tagline: {
    marginTop: 32,
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
});