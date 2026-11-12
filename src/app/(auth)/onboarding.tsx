import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  onDone?: () => void;
};

type Slide = {
  id: string;
  image: string;
  title: string;
  description: string;
};

const ACCENT = "#FF8A00";


const BUTTON_GRADIENT = ["#44dbe0", "#66c7b5", "#48eed0"] as const;
const DOT_COLOR = "#00fff7";

const SLIDES: Slide[] = [
  {
    id: "1",
    image:
      "https://res.cloudinary.com/yozeshlg/image/upload/v1794498671/Diesel_Life_City_Highway.png",
    title: "Diesel Delivered To You",
    description:
      "Order premium diesel from your phone and get it delivered directly to your location.",
  },
  {
    id: "2",
    image:
      "https://res.cloudinary.com/yozeshlg/image/upload/v1794498440/Analysis_output_2.png",
    title: "Track Your Tanker Live",
    description:
      "Follow your diesel delivery in real time and know exactly when your tanker arrives.",
  },
  {
    id: "3",
    image:
      "https://res.cloudinary.com/yozeshlg/image/upload/v1794498445/Analysis_output_1_1.png",
    title: "Safe, Fast & Reliable",
    description:
      "Enjoy safe fuel delivery, professional drivers and reliable service at your doorstep.",
  },
];

export default function Onboarding({ onDone }: Props) {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const listRef = useRef<FlatList<Slide>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const [index, setIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const isLast = index === SLIDES.length - 1;

  const finish = useCallback(() => {
    if (onDone) {
      onDone();
      return;
    }
    router.replace("/(auth)/login");
  }, [onDone, router]);

  const next = () => {
    if (isLast) {
      finish();
      return;
    }
    // scrollToOffset is more reliable than scrollToIndex with animated lists
    listRef.current?.scrollToOffset({
      offset: width * (index + 1),
      animated: true,
    });
    setIndex(index + 1);
  };

  const onMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setIndex(Math.max(0, Math.min(newIndex, SLIDES.length - 1)));
  };

  const markLoaded = (id: string) =>
    setLoadedImages((prev) => ({ ...prev, [id]: true }));

  const markFailed = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
    markLoaded(id);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Animated.FlatList
        ref={listRef as any}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        getItemLayout={(_, i) => ({
          length: width,
          offset: width * i,
          index: i,
        })}
        renderItem={({ item, index: slideIndex }) => {
          const inputRange = [
            (slideIndex - 1) * width,
            slideIndex * width,
            (slideIndex + 1) * width,
          ];

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.2, 1, 0.2],
            extrapolate: "clamp",
          });

          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [30, 0, 30],
            extrapolate: "clamp",
          });

          return (
            <View style={[styles.slide, { width }]}>
              <ImageBackground
                source={{ uri: item.image }}
                resizeMode="cover"
                style={styles.backgroundImage}
                onLoadEnd={() => markLoaded(item.id)}
                onError={() => markFailed(item.id)}
              >
                {!loadedImages[item.id] && (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={ACCENT} />
                  </View>
                )}

                {failedImages[item.id] && (
                  <View style={styles.loadingContainer}>
                    <Ionicons name="image-outline" size={48} color={ACCENT} />
                  </View>
                )}

                <LinearGradient
                  colors={[
                    "rgba(0,0,0,0.05)",
                    "rgba(0,0,0,0.20)",
                    "rgba(0,0,0,0.75)",
                    "rgba(0,0,0,0.98)",
                  ]}
                  locations={[0, 0.4, 0.7, 1]}
                  style={styles.imageGradient}
                  pointerEvents="none"
                />

                <Animated.View
                  style={[
                    styles.slideContent,
                    { opacity, transform: [{ translateY }] },
                  ]}
                >
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                </Animated.View>
              </ImageBackground>
            </View>
          );
        }}
      />

      {/* Overlay: box-none lets swipes pass through to the slides,
          while the buttons inside still receive taps */}
      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topBar} pointerEvents="box-none">
          {!isLast ? (
            <Pressable onPress={finish} hitSlop={12} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          ) : (
            <View />
          )}
        </View>

        <View style={styles.footer} pointerEvents="box-none">
          <View style={styles.dots} pointerEvents="none">
            {SLIDES.map((_, dotIndex) => {
              const inputRange = [
                (dotIndex - 1) * width,
                dotIndex * width,
                (dotIndex + 1) * width,
              ];

              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [8, 28, 8],
                extrapolate: "clamp",
              });

              const dotOpacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.4, 1, 0.4],
                extrapolate: "clamp",
              });

              return (
                <Animated.View
                  key={dotIndex}
                  style={[styles.dot, { width: dotWidth, opacity: dotOpacity }]}
                />
              );
            })}
          </View>

          <Pressable
            onPress={next}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <LinearGradient
              colors={BUTTON_GRADIENT}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {isLast ? "Get Started" : "Next"}
              </Text>
              <Ionicons name="arrow-forward" size={21} color="#fff" />
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  slide: { flex: 1, backgroundColor: "#000" },

  backgroundImage: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },

  imageGradient: { ...StyleSheet.absoluteFill },

  loadingContainer: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#101820",
  },

  slideContent: {
    paddingHorizontal: 28,
    paddingBottom: 185,
  },

  title: {
    fontSize: 35,
    fontWeight: "900",
    color: "#fff",
    lineHeight: 43,
    letterSpacing: 0.2,
  },

  description: {
    marginTop: 14,
    fontSize: 16,
    lineHeight: 25,
    color: "#E5E7EB",
    maxWidth: 330,
  },

  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: "space-between",
  },

  topBar: {
    height: 55,
    paddingHorizontal: 25,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  skipButton: { paddingVertical: 8, paddingHorizontal: 5 },

  skipText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  footer: {
    paddingHorizontal: 26,
    paddingBottom: 20,
    alignItems: "center",
  },

  dots: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  dot: {
    height: 8,
    borderRadius: 5,
    backgroundColor: DOT_COLOR,
    marginHorizontal: 4,
  },

  button: {
    width: "100%",
    height: 58,
    borderRadius: 18,
    shadowColor: "#FF6A00",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },

  buttonGradient: {
    flex: 1,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  buttonPressed: { transform: [{ scale: 0.97 }], opacity: 0.9 },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});