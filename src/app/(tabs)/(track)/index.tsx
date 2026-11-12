import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Location from "expo-location";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomHeader from "@/components/Customheader";

const MapModule: any =
  Platform.OS === "web" ? null : require("react-native-maps");
const MapView: any = MapModule?.default;
const Marker: any = MapModule?.Marker;
const Polyline: any = MapModule?.Polyline;

type Coord = { latitude: number; longitude: number };

const COLORS = {
  primary: "#0875D1",
  green: "#16A34A",
  greenLight: "#DCFCE7",
  red: "#EF4444",
  text: "#0F172A",
  textSecondary: "#475569",
  muted: "#94A3B8",
  border: "#E2E8F0",
  bg: "#F8FAFC",
  white: "#FFFFFF",
};

const ORDER = { id: "#DL-89421", item: "500 L Diesel" };
const DRIVER = {
  name: "Rohit Sharma",
  phone: "+919999999999",
  avatarUrl: "",
};

const OTP_LENGTH = 4;
const MAX_OTP_ATTEMPTS = 3;

const PACKING_START = 3;
const DELIVERY_START = 8;
const DELIVERY_TICKS = 60;
const METRES_PER_MIN = 300;

const STEPS = [
  { title: "Order\nPlaced", icon: "check" },
  { title: "Out for\nDelivery", icon: "check" },
  { title: "Arriving\nSoon", icon: "clock-outline" },
];

const DEFAULT_REGION = {
  latitude: 20.5937,
  longitude: 78.9629,
  latitudeDelta: 20,
  longitudeDelta: 20,
};

const generateOtp = (): string =>
  String(Math.floor(Math.random() * 10 ** OTP_LENGTH)).padStart(
    OTP_LENGTH,
    "0"
  );

const distanceBetween = (a: Coord, b: Coord): number => {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

const lerp = (a: Coord, b: Coord, t: number): Coord => ({
  latitude: a.latitude + (b.latitude - a.latitude) * t,
  longitude: a.longitude + (b.longitude - a.longitude) * t,
});

export default function TrackOrderScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<any>(null);

  const otp = useMemo(() => generateOtp(), []);

  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [error, setError] = useState("");
  const [destination, setDestination] = useState<Coord | null>(null);
  const [tick, setTick] = useState(0);

  const [delivered, setDelivered] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [attempts, setAttempts] = useState(0);

  const store = useMemo<Coord | null>(
    () =>
      destination
        ? {
            latitude: destination.latitude + 0.012,
            longitude: destination.longitude + 0.008,
          }
        : null,
    [destination]
  );

  const loadLocation = async () => {
    setLoading(true);
    setError("");
    setDenied(false);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setDenied(true);
        return;
      }

      const services = await Location.hasServicesEnabledAsync();
      if (!services) {
        setError("Location services are turned off. Please turn on GPS.");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setDestination({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    } catch {
      setError("Could not get your location. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocation();
  }, []);

  useEffect(() => {
    if (!destination) return;
    const id = setInterval(() => {
      setTick((t) => {
        if (t >= DELIVERY_START + DELIVERY_TICKS) {
          clearInterval(id);
          return t;
        }
        return t + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [destination]);

  const progress = Math.min(
    1,
    Math.max(0, (tick - DELIVERY_START) / DELIVERY_TICKS)
  );

  const stage = delivered
    ? 4
    : tick < PACKING_START
    ? 0
    : tick < DELIVERY_START
    ? 1
    : progress < 1
    ? 2
    : 3;

  const stepIndex =
    stage < 2 ? 0 : stage === 2 ? (progress < 0.7 ? 1 : 2) : 2;

  const rider: Coord | null =
    store && destination
      ? lerp(store, destination, stage >= 2 ? progress : 0)
      : null;

  const remaining =
    rider && destination ? distanceBetween(rider, destination) : 0;

  const etaMin =
    stage >= 3
      ? 0
      : stage < 2
      ? Math.ceil(
          (store && destination ? distanceBetween(store, destination) : 0) /
            METRES_PER_MIN
        ) + 3
      : Math.max(1, Math.ceil(remaining / METRES_PER_MIN));

  useEffect(() => {
    if (!store || !destination) return;
    mapRef.current?.fitToCoordinates([store, destination], {
      edgePadding: { top: 150, right: 60, bottom: 60, left: 60 },
      animated: true,
    });
  }, [store, destination]);

  const callDriver = () => Linking.openURL(`tel:${DRIVER.phone}`);

  const verifyOtp = () => {
    if (enteredOtp.length !== OTP_LENGTH) {
      setOtpError(`Enter the ${OTP_LENGTH}-digit OTP`);
      return;
    }

    if (enteredOtp === otp) {
      setOtpError("");
      setDelivered(true);
      return;
    }

    const used = attempts + 1;
    setAttempts(used);
    setEnteredOtp("");
    setOtpError(
      used >= MAX_OTP_ATTEMPTS
        ? "Too many wrong attempts. Please contact support."
        : `Wrong OTP. ${MAX_OTP_ATTEMPTS - used} attempt(s) left.`
    );
  };

  const statusLabel =
    stage === 4
      ? "Delivered"
      : stage === 3
      ? "Arrived"
      : stage === 2
      ? "On the Way"
      : "Preparing";

  const searchIcon = (
    <Pressable hitSlop={10}>
      <MaterialCommunityIcons name="magnify" size={24} color="#FFFFFF" />
    </Pressable>
  );

  if (denied) {
    return (
      <View style={styles.root}>
        <StatusBar style="light" />
        <CustomHeader title="" pageName="Track Delivery" />

        <View style={styles.centered}>
          <MaterialCommunityIcons
            name="map-marker-off-outline"
            size={60}
            color={COLORS.muted}
          />
          <Text style={styles.deniedTitle}>Location permission needed</Text>
          <Text style={styles.deniedText}>
            Allow location access so we can show your driver approaching your
            address.
          </Text>

          <Pressable style={styles.primaryBtn} onPress={loadLocation}>
            <Text style={styles.primaryBtnText}>Allow Location</Text>
          </Pressable>

          <Pressable onPress={() => Linking.openSettings()}>
            <Text style={styles.linkText}>Open app settings</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="light" />
      <CustomHeader title="" pageName="Track Delivery" rightIcon={searchIcon} />

      <View style={styles.flex}>
        {MapView ? (
          <MapView
            ref={mapRef}
            style={styles.flex}
            initialRegion={DEFAULT_REGION}
            showsMyLocationButton={false}
          >
            {store && destination && stage < 3 && (
              <Polyline
                coordinates={[rider ?? store, destination]}
                strokeColor={COLORS.primary}
                strokeWidth={5}
              />
            )}

            {store && (
              <Marker coordinate={store} anchor={{ x: 0.5, y: 0.5 }}>
                <View style={styles.storePin}>
                  <MaterialCommunityIcons
                    name="storefront-outline"
                    size={16}
                    color={COLORS.white}
                  />
                </View>
              </Marker>
            )}

            {destination && (
              <Marker coordinate={destination} anchor={{ x: 0.5, y: 1 }}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={44}
                  color={COLORS.red}
                />
              </Marker>
            )}

            {rider && stage >= 2 && stage < 4 && (
              <Marker coordinate={rider} anchor={{ x: 0.5, y: 0.5 }}>
                <View style={styles.truckPin}>
                  <MaterialCommunityIcons
                    name="truck-delivery"
                    size={26}
                    color={COLORS.primary}
                  />
                </View>
              </Marker>
            )}
          </MapView>
        ) : (
          <View style={[styles.flex, styles.centered]}>
            <MaterialCommunityIcons
              name="map-outline"
              size={50}
              color={COLORS.muted}
            />
            <Text style={styles.deniedText}>
              The live map is available on the Android and iOS app. Order
              status is shown below.
            </Text>
          </View>
        )}

        <View style={styles.orderCard}>
          <View style={styles.orderCheck}>
            <MaterialCommunityIcons
              name={stage === 4 ? "check-all" : "check"}
              size={28}
              color={COLORS.white}
            />
          </View>

          <View style={styles.flex}>
            <Text style={styles.orderTitle}>Order {ORDER.id}</Text>
            <Text style={styles.orderSub}>{ORDER.item}</Text>
          </View>

          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>{statusLabel}</Text>
          </View>
        </View>

        {loading && (
          <View style={styles.loadingBadge}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.loadingText}>Finding your location...</Text>
          </View>
        )}

        <View style={[styles.panel, { paddingBottom: insets.bottom + 14 }]}>
          <View style={styles.driverRow}>
            {DRIVER.avatarUrl ? (
              <Image source={{ uri: DRIVER.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <MaterialCommunityIcons
                  name="account"
                  size={34}
                  color={COLORS.primary}
                />
              </View>
            )}

            <View style={styles.flex}>
              <Text style={styles.driverName}>{DRIVER.name}</Text>
              <Text style={styles.driverRole}>Delivery Partner</Text>
            </View>

            <Pressable style={styles.callBtn} onPress={callDriver}>
              <MaterialCommunityIcons
                name="phone"
                size={22}
                color={COLORS.primary}
              />
            </Pressable>
          </View>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          {stage < 3 && (
            <>
              <View style={styles.etaRow}>
                <Text style={styles.etaLabel}>Estimated Arrival</Text>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={16}
                  color={COLORS.green}
                />
                <Text style={styles.etaValue}>{etaMin} min</Text>
              </View>

              <View style={styles.stepsRow}>
                {STEPS.map((s, i) => {
                  const done = i <= stepIndex;
                  return (
                    <React.Fragment key={s.title}>
                      <View style={styles.step}>
                        <View
                          style={[
                            styles.stepCircle,
                            done ? styles.stepDone : styles.stepPending,
                          ]}
                        >
                          <MaterialCommunityIcons
                            name={(done ? "check" : s.icon) as any}
                            size={16}
                            color={done ? COLORS.white : COLORS.primary}
                          />
                        </View>
                        <Text style={styles.stepText}>{s.title}</Text>
                      </View>

                      {i < STEPS.length - 1 && (
                        <View
                          style={[
                            styles.connector,
                            i < stepIndex && styles.connectorDone,
                          ]}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </View>
            </>
          )}

          {stage === 3 && (
            <View style={styles.otpCard}>
              <Text style={styles.otpLabel}>Delivery OTP</Text>
              <View style={styles.otpRow}>
                {otp.split("").map((d, i) => (
                  <View key={i} style={styles.otpBox}>
                    <Text style={styles.otpDigit}>{d}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.otpHint}>
                Share this OTP with {DRIVER.name} only after you receive your
                order.
              </Text>

              <View style={styles.verifyBox}>
                <Text style={styles.verifyTitle}>Driver enters OTP</Text>
                <View style={styles.verifyRow}>
                  <TextInput
                    style={styles.verifyInput}
                    value={enteredOtp}
                    onChangeText={(t) => {
                      setEnteredOtp(
                        t.replace(/[^0-9]/g, "").slice(0, OTP_LENGTH)
                      );
                      setOtpError("");
                    }}
                    keyboardType="number-pad"
                    maxLength={OTP_LENGTH}
                    placeholder="----"
                    placeholderTextColor={COLORS.muted}
                    editable={attempts < MAX_OTP_ATTEMPTS}
                  />
                  <Pressable
                    style={[
                      styles.verifyBtn,
                      attempts >= MAX_OTP_ATTEMPTS && styles.btnOff,
                    ]}
                    onPress={verifyOtp}
                    disabled={attempts >= MAX_OTP_ATTEMPTS}
                  >
                    <Text style={styles.primaryBtnText}>Verify</Text>
                  </Pressable>
                </View>
                {!!otpError && <Text style={styles.errorText}>{otpError}</Text>}
              </View>
            </View>
          )}

          {stage === 4 && (
            <View style={styles.deliveredCard}>
              <MaterialCommunityIcons
                name="check-decagram"
                size={34}
                color={COLORS.green}
              />
              <View style={styles.flex}>
                <Text style={styles.driverName}>OTP verified</Text>
                <Text style={styles.driverRole}>
                  Order {ORDER.id} was delivered successfully.
                </Text>
              </View>
            </View>
          )}

          {stage === 4 ? (
            <Pressable
              style={[styles.contactBtn, { backgroundColor: COLORS.green }]}
              onPress={() => router.back()}
            >
              <Text style={styles.primaryBtnText}>Done</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.contactBtn} onPress={callDriver}>
              <Text style={styles.primaryBtnText}>Contact Driver</Text>
            </Pressable>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  flex: {
    flex: 1,
  },

  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    gap: 12,
  },

  deniedTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },

  deniedText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },

  linkText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
    marginTop: 4,
  },

  storePin: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },

  truckPin: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.primary,
    elevation: 5,
  },

  orderCard: {
    position: "absolute",
    top: 14,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: COLORS.green,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  orderCheck: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  orderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
  },

  orderSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    marginTop: 2,
  },

  statusPill: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },

  statusPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.green,
  },

  loadingBadge: {
    position: "absolute",
    top: 90,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 4,
  },

  loadingText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  panel: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 18,
    elevation: 14,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
  },

  driverRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
  },

  avatar: {
    width: 62,
    height: 62,
    borderRadius: 14,
  },

  avatarFallback: {
    backgroundColor: "#E8F3FC",
    alignItems: "center",
    justifyContent: "center",
  },

  driverName: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
  },

  driverRole: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  callBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  etaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 16,
  },

  etaLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },

  etaValue: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.green,
  },

  stepsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    marginBottom: 16,
  },

  step: {
    alignItems: "center",
    width: 74,
    gap: 6,
  },

  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  stepDone: {
    backgroundColor: COLORS.green,
  },

  stepPending: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },

  stepText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
  },

  connector: {
    flex: 1,
    height: 2,
    marginTop: 13,
    backgroundColor: COLORS.border,
  },

  connectorDone: {
    backgroundColor: COLORS.green,
  },

  errorText: {
    color: "#DC2626",
    fontSize: 12,
    marginTop: 6,
  },

  otpCard: {
    backgroundColor: COLORS.greenLight,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    marginBottom: 14,
  },

  otpLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.green,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
  },

  otpRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },

  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
  },

  otpDigit: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.text,
  },

  otpHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 12,
  },

  verifyBox: {
    alignSelf: "stretch",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 10,
  },

  verifyTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 8,
  },

  verifyRow: {
    flexDirection: "row",
    gap: 10,
  },

  verifyInput: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingHorizontal: 14,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 6,
    color: COLORS.text,
  },

  verifyBtn: {
    height: 46,
    borderRadius: 10,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
  },

  btnOff: {
    opacity: 0.4,
  },

  deliveredCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: COLORS.greenLight,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },

  contactBtn: {
    height: 54,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  primaryBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },
});