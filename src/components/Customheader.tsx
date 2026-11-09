import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomHeader = ({
  title,
  pageName,
  rightIcon,
  titleContainerStly,
  middleTextStyle,
  rightIconStyle,
}: {
  title: string;
  pageName?: string;
  rightIcon?: any;
  titleContainerStly?: any;
  middleTextStyle?: any;
  rightIconStyle?: any;
}) => {
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <LinearGradient
      colors={["#16A34A", "#0875D1"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.gradient, { paddingTop: insets.top + 8 }]}
    >
      <View style={styles.row}>
        <View style={[styles.left, titleContainerStly]}>
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.backButton}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={22}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <Text
            className="text-white font-PoppinsSemiBold"
            style={[styles.pageName, middleTextStyle]}
            numberOfLines={1}
          >
            {pageName || title}
          </Text>
        </View>

        {rightIcon ? (
          <View style={[styles.right, rightIconStyle]}>{rightIcon}</View>
        ) : null}
      </View>
    </LinearGradient>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  gradient: {
    width: "100%",
    paddingBottom: 14,
    paddingHorizontal: 16,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
  },

  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  pageName: {
    flexShrink: 1,
    marginLeft: 12,
    fontSize: 17,
    color: "#FFFFFF",
    fontWeight: "600",
  },

  right: {
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: 12,
  },
});
