import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { THEME } from "../../constants/theme";

export interface LocationCoords {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
}

interface CurrentLocationButtonProps {
  onPress: () => void;
  isLoading: boolean;
  hasLocation: boolean;
  location?: LocationCoords | null;
  addressLabel?: string;
}

export const CurrentLocationButton: React.FC<CurrentLocationButtonProps> = ({
  onPress,
  isLoading,
  hasLocation,
  location,
  addressLabel,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const mapRef = useRef<MapView | null>(null);

  // Pulse animation while detecting GPS
  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.04,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isLoading, pulseAnim]);

  // Animate map camera whenever coordinates change
  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: location.latitudeDelta || 0.005,
          longitudeDelta: location.longitudeDelta || 0.005,
        },
        800
      );
    }
  }, [location]);

  return (
    <View style={styles.container}>
      {/* Trigger Button */}
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <TouchableOpacity
          onPress={onPress}
          disabled={isLoading}
          activeOpacity={0.8}
          style={[styles.btn, hasLocation && styles.btnActive]}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={THEME.colors.primary} />
          ) : (
            <MaterialCommunityIcons
              name={hasLocation ? "crosshairs-gps" : "crosshairs"}
              size={18}
              color={hasLocation ? THEME.colors.primary : THEME.colors.textSecondary}
            />
          )}
          <Text style={[styles.btnText, hasLocation && styles.btnTextActive]}>
            {isLoading
              ? "Locating Bowser GPS..."
              : hasLocation
              ? "Update Current GPS Location"
              : "Detect Current GPS Location"}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Map Preview Card (Only visible once location is detected) */}
      {hasLocation && location && (
        <View style={styles.mapCard}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_DEFAULT}
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: location.latitudeDelta || 0.005,
              longitudeDelta: location.longitudeDelta || 0.005,
            }}
            showsUserLocation={false}
            showsCompass={false}
            scrollEnabled={true}
            zoomEnabled={true}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Bowser Location"
              description={addressLabel || "Current detected GPS coordinates"}
            >
              {/* Custom Bowser Pin */}
              <View style={styles.markerContainer}>
                <View style={styles.markerPin}>
                  <MaterialCommunityIcons
                    name="fuel"
                    size={16}
                    color="#FFFFFF"
                  />
                </View>
                <View style={styles.markerArrow} />
              </View>
            </Marker>
          </MapView>

          {/* Location Details Footer */}
          <View style={styles.mapFooter}>
            <MaterialCommunityIcons
              name="map-marker-radius"
              size={16}
              color={THEME.colors.primary}
            />
            <Text style={styles.footerText} numberOfLines={1}>
              {addressLabel ||
                `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 12,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: THEME.radius.md,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  btnActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.primaryLight,
  },
  btnText: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  btnTextActive: {
    color: THEME.colors.primary,
  },
  /* Map Preview Styles */
  mapCard: {
    height: 180,
    width: "100%",
    borderRadius: THEME.radius.md,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.surface,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  map: {
    flex: 1,
    width: "100%",
  },
  mapFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: THEME.colors.surface,
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  footerText: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
    fontWeight: "600",
    flex: 1,
  },
  /* Custom Pin */
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerPin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: THEME.colors.primary,
    marginTop: -1,
  },
});