import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { THEME } from "../../constants/theme";
import { GeoCoordinates } from "../../types/booking.types";

interface DeliveryMapProps {
  coordinates: GeoCoordinates;
  address?: string;
  onSelectOnMap?: (newCoords: GeoCoordinates) => void;
  interactive?: boolean;
}

export const DeliveryMap: React.FC<DeliveryMapProps> = ({
  coordinates,
  address,
  onSelectOnMap,
  interactive = true,
}) => {
  const openInExternalMaps = () => {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${coordinates.latitude},${coordinates.longitude}`;
    const label = encodeURIComponent(address || "Diesel Delivery Drop Point");
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
      default: `https://www.google.com/maps/search/?api=1&query=${latLng}`,
    });

    if (url) {
      Linking.openURL(url).catch((err) => console.warn("Failed to open maps", err));
    }
  };

  // Micro adjustments for pinpoint drag simulation on platforms
  const nudgeCoordinate = (deltaLat: number, deltaLng: number) => {
    if (onSelectOnMap) {
      onSelectOnMap({
        latitude: coordinates.latitude + deltaLat,
        longitude: coordinates.longitude + deltaLng,
        accuracy: coordinates.accuracy,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Visual Map Surface */}
      <View style={styles.mapGridBackground}>
        {/* Radar concentric rings */}
        <View style={styles.radarRingOuter}>
          <View style={styles.radarRingInner} />
        </View>

        {/* Central Draggable Delivery Marker */}
        <View style={styles.markerContainer}>
          <View style={styles.markerCallout}>
            <Text style={styles.markerCalloutText} numberOfLines={1}>
              {address ? address.split(",")[0] : "Target Delivery Spot"}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="map-marker"
            size={40}
            color={THEME.colors.danger}
            style={styles.pinIcon}
          />
          <View style={styles.markerShadow} />
        </View>

        {/* Interactive Nudge Pin Controls */}
        {interactive && onSelectOnMap && (
          <View style={styles.nudgeControls}>
            <TouchableOpacity
              style={styles.nudgeBtn}
              onPress={() => nudgeCoordinate(0.0005, 0)}
              hitSlop={8}
            >
              <MaterialCommunityIcons name="chevron-up" size={18} color={THEME.colors.textPrimary} />
            </TouchableOpacity>
            <View style={styles.nudgeRow}>
              <TouchableOpacity
                style={styles.nudgeBtn}
                onPress={() => nudgeCoordinate(0, -0.0005)}
                hitSlop={8}
              >
                <MaterialCommunityIcons name="chevron-left" size={18} color={THEME.colors.textPrimary} />
              </TouchableOpacity>
              <View style={styles.pinCenterBadge}>
                <MaterialCommunityIcons name="crosshairs" size={14} color={THEME.colors.primary} />
              </View>
              <TouchableOpacity
                style={styles.nudgeBtn}
                onPress={() => nudgeCoordinate(0, 0.0005)}
                hitSlop={8}
              >
                <MaterialCommunityIcons name="chevron-right" size={18} color={THEME.colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.nudgeBtn}
              onPress={() => nudgeCoordinate(-0.0005, 0)}
              hitSlop={8}
            >
              <MaterialCommunityIcons name="chevron-down" size={18} color={THEME.colors.textPrimary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Open in Map App pill */}
        <TouchableOpacity
          onPress={openInExternalMaps}
          style={styles.externalMapBtn}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="google-maps" size={14} color="#FFFFFF" />
          <Text style={styles.externalMapText}>View in GPS Maps</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.coordsFooter}>
        <Text style={styles.coordsText}>
          Coordinates: {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
        </Text>
        <Text style={styles.coordsHint}>Use the compass arrows to fine-tune Bowser drop location</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: THEME.radius.lg,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.surface,
    marginBottom: 12,
  },
  mapGridBackground: {
    height: 180,
    backgroundColor: "#E2EEF8",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  radarRingOuter: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: "rgba(8, 117, 209, 0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  radarRingInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: "rgba(8, 117, 209, 0.4)",
    backgroundColor: "rgba(8, 117, 209, 0.05)",
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerCallout: {
    backgroundColor: THEME.colors.textPrimary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: -4,
    maxWidth: 160,
  },
  markerCalloutText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  pinIcon: {
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  markerShadow: {
    width: 12,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0,0,0,0.25)",
    marginTop: -2,
  },
  nudgeControls: {
    position: "absolute",
    right: 10,
    top: 10,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: THEME.radius.md,
    padding: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nudgeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  nudgeBtn: {
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
  },
  pinCenterBadge: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  externalMapBtn: {
    position: "absolute",
    left: 10,
    bottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  externalMapText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  coordsFooter: {
    padding: 10,
    backgroundColor: THEME.colors.surface,
  },
  coordsText: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  coordsHint: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
});
