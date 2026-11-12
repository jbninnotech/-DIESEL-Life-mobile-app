import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { THEME } from "../../constants/theme";
import { ScreenHeader } from "../../components/common/ScreenHeader";

export default function NotificationSettingsScreen() {
  const insets = useSafeAreaInsets();
  const [orderTracking, setOrderTracking] = useState(true);
  const [bowserArrival, setBowserArrival] = useState(true);
  const [smsReceipts, setSmsReceipts] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [emailStatements, setEmailStatements] = useState(true);

  const handleSave = () => {
    Alert.alert("Preferences Saved", "Your notification preferences have been updated.");
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScreenHeader title="Notification Settings" subtitle="Push alerts & SMS dispatch updates" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Order & Fuel Delivery Updates</Text>

          <View style={styles.row}>
            <View style={styles.textCol}>
              <Text style={styles.rowTitle}>Bowser Live Tracking Alerts</Text>
              <Text style={styles.rowDesc}>
                Real-time notifications when the fuel bowser is dispatched and en route
              </Text>
            </View>
            <Switch
              value={orderTracking}
              onValueChange={setOrderTracking}
              trackColor={{ false: THEME.colors.border, true: THEME.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.textCol}>
              <Text style={styles.rowTitle}>Gate Arrival & Dispensing Pings</Text>
              <Text style={styles.rowDesc}>
                Chime when driver reaches site gate and starts diesel meter
              </Text>
            </View>
            <Switch
              value={bowserArrival}
              onValueChange={setBowserArrival}
              trackColor={{ false: THEME.colors.border, true: THEME.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.textCol}>
              <Text style={styles.rowTitle}>SMS Invoices & Receipts</Text>
              <Text style={styles.rowDesc}>
                Instant SMS containing delivered liters and digital fuel invoice link
              </Text>
            </View>
            <Switch
              value={smsReceipts}
              onValueChange={setSmsReceipts}
              trackColor={{ false: THEME.colors.border, true: THEME.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Market & Fleet Updates</Text>

          <View style={styles.row}>
            <View style={styles.textCol}>
              <Text style={styles.rowTitle}>Daily Diesel Rate Notifications</Text>
              <Text style={styles.rowDesc}>
                Morning notification when OMC retail fuel prices revise
              </Text>
            </View>
            <Switch
              value={priceAlerts}
              onValueChange={setPriceAlerts}
              trackColor={{ false: THEME.colors.border, true: THEME.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.textCol}>
              <Text style={styles.rowTitle}>Monthly Tax Statements</Text>
              <Text style={styles.rowDesc}>
                Email consolidated monthly GST input invoices to company email
              </Text>
            </View>
            <Switch
              value={emailStatements}
              onValueChange={setEmailStatements}
              trackColor={{ false: THEME.colors.border, true: THEME.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.textCol}>
              <Text style={styles.rowTitle}>Fleet Partner Discounts</Text>
              <Text style={styles.rowDesc}>
                Occasional bulk purchase rebates and wallet cashback promotions
              </Text>
            </View>
            <Switch
              value={promotions}
              onValueChange={setPromotions}
              trackColor={{ false: THEME.colors.border, true: THEME.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
          <MaterialCommunityIcons name="check-all" size={20} color="#FFFFFF" />
          <Text style={styles.saveBtnText}>Save Preferences</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  sectionCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: THEME.colors.primary,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  textCol: {
    flex: 1,
    paddingRight: 16,
  },
  rowTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  rowDesc: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.borderLight,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: THEME.radius.lg,
    marginTop: 8,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
