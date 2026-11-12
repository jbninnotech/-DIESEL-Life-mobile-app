import React from "react";
import { View, StyleSheet } from "react-native";
import { ProfileMenuSection } from "./ProfileMenuSection";
import { ProfileMenuItem } from "./ProfileMenuItem";
import { THEME } from "../../constants/theme";

interface ActivitySectionProps {
  onMyOrders: () => void;
  onBookingHistory: () => void;
  onReorderHistory: () => void;
  onTrackActiveOrder: () => void;
  activeOrdersCount?: number;
}

export const ActivitySection: React.FC<ActivitySectionProps> = ({
  onMyOrders,
  onBookingHistory,
  onReorderHistory,
  onTrackActiveOrder,
  activeOrdersCount = 2,
}) => {
  return (
    <ProfileMenuSection title="B. My Activity" icon="chart-timeline-variant">
      <ProfileMenuItem
        icon="clipboard-list-outline"
        title="My Orders"
        subtitle="Current status & complete order pipeline"
        badge={activeOrdersCount > 0 ? `${activeOrdersCount} Active` : undefined}
        badgeColor={THEME.colors.secondary}
        onPress={onMyOrders}
      />
      <View style={styles.divider} />
      <ProfileMenuItem
        icon="history"
        title="Booking History"
        subtitle="Past doorstep diesel deliveries & receipts"
        onPress={onBookingHistory}
      />
      <View style={styles.divider} />
      <ProfileMenuItem
        icon="repeat"
        title="Reorder History"
        subtitle="Quick 1-click repeat of recent deliveries"
        onPress={onReorderHistory}
      />
      <View style={styles.divider} />
      <ProfileMenuItem
        icon="crosshairs-gps"
        title="Track Active Order"
        subtitle="Live GPS bowser dispensing tracker"
        badge="Live"
        badgeColor={THEME.colors.primary}
        onPress={onTrackActiveOrder}
      />
    </ProfileMenuSection>
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: THEME.colors.borderLight,
    marginLeft: 68,
  },
});
