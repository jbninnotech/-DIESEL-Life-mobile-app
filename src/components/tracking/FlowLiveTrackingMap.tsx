import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useRef } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { THEME } from "../../constants/theme";
import { GeoCoordinates } from "../../types/booking.types";

const MapModule: any = Platform.OS === "web" ? null : require("react-native-maps");
const MapView: any = MapModule?.default;
const Marker: any = MapModule?.Marker;
const Polyline: any = MapModule?.Polyline;

interface Props {
  driverLocation: GeoCoordinates;
  destinationLocation: GeoCoordinates;
  routeCoordinates?: GeoCoordinates[];
  partnerName: string;
  isLiveTrackingActive: boolean;
  isDemoMode: boolean;
  lastUpdated: string;
  onRecenter?: () => void;
}

export const FlowLiveTrackingMap: React.FC<Props> = ({
  driverLocation,
  destinationLocation,
  routeCoordinates = [],
  partnerName,
  isLiveTrackingActive,
  isDemoMode,
  lastUpdated,
}) => {
  const mapRef = useRef<any>(null);

  const centerCoordinates = {
    latitude: (driverLocation.latitude + destinationLocation.latitude) / 2,
    longitude: (driverLocation.longitude + destinationLocation.longitude) / 2,
    latitudeDelta: Math.max(0.04, Math.abs(driverLocation.latitude - destinationLocation.latitude) * 2.2),
    longitudeDelta: Math.max(0.04, Math.abs(driverLocation.longitude - destinationLocation.longitude) * 2.2),
  };

  const handleRecenter = () => {
    mapRef.current?.animateToRegion(centerCoordinates, 600);
  };

  return (
    <View style={styles.mapContainer}>
      {/* Banner Notice about Live vs Demo */}
      <View style={styles.topStatusStrip}>
        <View style={styles.liveIndicator}>
          <View style={[styles.pulseDot, isLiveTrackingActive && styles.pulseDotLive]} />
          <Text style={styles.liveIndicatorText}>
            {isDemoMode ? "DEMO LIVE TRACKING (SIMULATED)" : "LIVE GPS TRACKING"}
          </Text>
        </View>
        <Text style={styles.lastUpdatedText}>Updated: {lastUpdated}</Text>
      </View>

      {MapView ? (
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={centerCoordinates}
          showsUserLocation={false}
          showsCompass={true}
        >
          {/* Driver Bowser Marker */}
          <Marker
            coordinate={driverLocation}
            title={`${partnerName} (Fuel Bowser)`}
            description="Smart Bowser Tanker en route"
          >
            <View style={styles.driverMarker}>
              <MaterialCommunityIcons name="truck-fast" size={20} color="#FFFFFF" />
            </View>
          </Marker>

          {/* Delivery Site Destination Marker */}
          <Marker
            coordinate={destinationLocation}
            title="Your Delivery Destination"
            description="Fuel drop-off point"
          >
            <View style={styles.destMarker}>
              <MaterialCommunityIcons name="gas-station" size={20} color="#FFFFFF" />
            </View>
          </Marker>

          {/* Polyline Route */}
          {Polyline && routeCoordinates.length > 1 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#0891B2"
              strokeWidth={4}
              lineDashPattern={[0]}
            />
          )}
        </MapView>
      ) : (
        <View style={styles.fallbackBox}>
          <ActivityIndicator size="small" color={THEME.colors.primary} />
          <Text style={styles.fallbackText}>Native Map Rendering (Preview Mode)</Text>
          <Text style={styles.coordsText}>
            Bowser: {driverLocation.latitude.toFixed(4)}, {driverLocation.longitude.toFixed(4)}
          </Text>
          <Text style={styles.coordsText}>
            Destination: {destinationLocation.latitude.toFixed(4)}, {destinationLocation.longitude.toFixed(4)}
          </Text>
        </View>
      )}

      {/* Recenter Button Overlay */}
      <TouchableOpacity style={styles.recenterBtn} onPress={handleRecenter} activeOpacity={0.8}>
        <MaterialCommunityIcons name="crosshairs" size={20} color={THEME.colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    width: "100%",
    height: 310,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#E2E8F0",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  topStatusStrip: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F59E0B",
  },
  pulseDotLive: {
    backgroundColor: "#22C55E",
  },
  liveIndicatorText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  lastUpdatedText: {
    color: "#94A3B8",
    fontSize: 10,
  },
  driverMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0284C7",
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
  },
  destMarker: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#16A34A",
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
  recenterBtn: {
    position: "absolute",
    bottom: 12,
    right: 12,
    zIndex: 10,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  fallbackBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#F1F5F9",
  },
  fallbackText: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  coordsText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
  },
});
