

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ActionModal from "../../../components/common/ActionModal";
import SearchBar from "../../../components/common/SearchBar";
import { THEME } from "../../../constants/theme";
import {
  MOCK_BANNERS,
  MOCK_ORDERS,
  MOCK_SERVICES,
  MOCK_USER,
} from "../../../data/mockData";
import {
  CATEGORY_ROUTES,
  PRODUCT_CATEGORIES,
} from "../../../data/Servicecategories";
import { Banner, FuelStation, ServiceItem } from "../../../types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BANNER_WIDTH = SCREEN_WIDTH - 32;
const BANNER_HEIGHT = 180;
const BANNER_INTERVAL_MS = 2000;

const HOME_BANNERS = [
  {
    id: "1",
    image:
      "https://res.cloudinary.com/yozeshlg/image/upload/v1794474225/Dieselify_On-Site_Delivery_Banner.png",
  },
  {
    id: "2",
    image:
      "https://res.cloudinary.com/yozeshlg/image/upload/v1794294900/Fuel_Quality_and_Kenyan_Cars__Fuel_quality_varies__Some_engines_are_sensitive.__High-compression_engines_knock_easily._Older_engines_tolerate_poor_fuel_better.__That_s_why_simple_engines_last_longer_he.jpg",
  },
  {
    id: "3",
    image:
      "https://res.cloudinary.com/yozeshlg/image/upload/v1794477176/Doorstep_Diesel_Delivery_Showcase.png",
  },
];

// Active delivery (replace with real data from your API / state)
const ACTIVE_DELIVERY = {
  orderId: "DL-89421",
  details: "500 L Diesel",
  eta: "Arriving in 25 min",
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(
    null
  );
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedStation, setSelectedStation] = useState<FuelStation | null>(
    null
  );
  const [stationModalVisible, setStationModalVisible] = useState(false);
  const [activeBanner, setActiveBanner] = useState(0);
  const bannerScrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const next = (activeBanner + 1) % HOME_BANNERS.length;
      setActiveBanner(next);
      bannerScrollRef.current?.scrollTo({
        x: next * BANNER_WIDTH,
        animated: true,
      });
    }, BANNER_INTERVAL_MS);

    return () => clearTimeout(timer);
  }, [activeBanner]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const filteredServices = MOCK_SERVICES.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentOrders = MOCK_ORDERS.slice(0, 2);

  const handleConfirmBooking = () => {
    Alert.alert(
      "Service Requested",
      `Your request for ${selectedService?.title} has been logged. Our fleet manager will assign a dispenser unit shortly.`,
      [
        {
          text: "View Orders",
          onPress: () => router.push("/(tabs)/(orders)" as any),
        },
        { text: "OK" },
      ]
    );
  };

  const handleNotificationPress = () => {
    Alert.alert(
      "Notifications",
      "• Order #DL-89421 Bowser has arrived at your warehouse.\n• Rate Update: Diesel today at ₹89.62/L across all Bangalore depots.\n• Flat ₹2.50 cashback credited to your wallet.",
      [{ text: "Close" }]
    );
  };

  const handleTrackPress = () => {
    router.push({
      pathname: "/(tabs)/(track)",
      params: { orderId: ACTIVE_DELIVERY.orderId },
    } as any);
  };

  return (
    <View style={styles.root}>
      {/* Top Header Section with Gradient */}
      <LinearGradient
        colors={[THEME.colors.gradientStart, THEME.colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.8 }}
        style={[styles.headerContainer, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.headerTop}>
          {/* Logo & Brand */}
          <View style={styles.brandRow}>
            <View style={styles.brandBadge}>
              <Image
                source={{
                  uri:
                    "https://res.cloudinary.com/yozeshlg/image/upload/v1794304146/Gemini_Generated_Image_7bqx67bqx67bqx67.png",
                }}
                style={styles.brandLogo}
                resizeMode="cover"
              />
            </View>
            <View>
              <Text style={styles.brandName}>DIESEL LIFE</Text>
              <Text style={styles.brandTagline}>Smart On-Demand Fueling</Text>
            </View>
          </View>

          {/* Right Action Icons: Notification & Profile Avatar */}
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.notifButton}
              onPress={handleNotificationPress}
              activeOpacity={0.7}
              accessibilityLabel="Notifications"
            >
              <MaterialCommunityIcons
                name="bell-outline"
                size={22}
                color="#FFFFFF"
              />
              <View style={styles.unreadBadge} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.avatarButton}
              onPress={() => router.push("/(tabs)/(profile)" as any)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: MOCK_USER.avatarUrl }}
                style={styles.avatarImage}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting */}
        <View style={styles.greetingWrap}>
          <Text style={styles.greetingText}>Good Day,</Text>
          <Text style={styles.userName}>{MOCK_USER.name} </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchWrap}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search diesel services, bowser, pump station..."
          />
        </View>
      </LinearGradient>

      {/* Main Content Area */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[THEME.colors.primary]}
            tintColor={THEME.colors.primary}
          />
        }
      >
        {/* Home Image Carousel */}
        <ScrollView
          ref={bannerScrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x / BANNER_WIDTH
            );
            setActiveBanner(index);
          }}
        >
          {HOME_BANNERS.map((item) => (
            <View key={item.id} style={styles.homeBanner}>
              <Image
                source={{ uri: item.image }}
                style={styles.homeBannerImage}
                resizeMode="cover"
              />
            </View>
          ))}
        </ScrollView>

        <View style={styles.bannerDots}>
          {HOME_BANNERS.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.bannerDot,
                activeBanner === index && styles.bannerDotActive,
              ]}
            />
          ))}
        </View>

        {/* Our Services */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our Services</Text>

          <TouchableOpacity
            onPress={() => router.push("/(others)/Services" as any)}
          >
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.serviceGrid}>
          {PRODUCT_CATEGORIES.slice(0, 4).map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.serviceCard}
              activeOpacity={0.8}
              onPress={() => router.push(CATEGORY_ROUTES[category.id] as any)}
            >
              <View style={styles.serviceImageContainer}>
                <Image
                  source={{ uri: category.image }}
                  style={styles.serviceImage}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.serviceTitle} numberOfLines={2}>
                {category.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Active Delivery Card -> Track page */}

        <TouchableOpacity
          style={styles.activeCard}
          activeOpacity={0.9}
          onPress={handleTrackPress}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.activeTitle}>Active Delivery</Text>

            <Text style={styles.activeOrder}>
              Order #{ACTIVE_DELIVERY.orderId}
            </Text>

            <Text style={styles.activeSub}>
              {ACTIVE_DELIVERY.details} • {ACTIVE_DELIVERY.eta}
            </Text>

            <TouchableOpacity
              style={styles.trackBtn}
              activeOpacity={0.85}
              onPress={handleTrackPress}
              accessibilityLabel="Track order"
            >
              <Text style={styles.trackBtnText}>Track Order</Text>
            </TouchableOpacity>
          </View>

          <Image
            source={{
              uri: "https://res.cloudinary.com/yozeshlg/image/upload/v1794492813/Blue_Semi_Truck_With_Matching_Trailer_On_Highway_Commercial_Transportation_Long_Haul_Trucking_PNG_Transparent_Image_and_Clipart_for_Free_Download.jpg",
            }}
            style={styles.activeDeliveryImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Promotional / Offer Banners (Horizontal Scroll) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Special Offers & Passes</Text>
          <Text style={styles.sectionBadge}>Exclusive</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bannerScroll}
        >
          {MOCK_BANNERS.map((banner: Banner) => (
            <LinearGradient
              key={banner.id}
              colors={banner.gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bannerCard}
            >
              <View style={styles.bannerTagRow}>
                <View style={styles.bannerTag}>
                  <Text style={styles.bannerTagText}>{banner.tag}</Text>
                </View>
                <Text style={styles.bannerDiscount}>{banner.discount}</Text>
              </View>

              <Text style={styles.bannerTitle}>{banner.title}</Text>
              <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>

              <TouchableOpacity
                style={styles.bannerBtn}
                onPress={() => {
                  Alert.alert(
                    banner.title,
                    `Promo code applied for ${banner.discount}. Enjoy instant fueling savings!`,
                    [{ text: "Great" }]
                  );
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.bannerBtnText}>{banner.actionText}</Text>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={16}
                  color="#0875D1"
                />
              </TouchableOpacity>
            </LinearGradient>
          ))}
        </ScrollView>

        {/* Recent Orders */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/(orders)" as any)}
          >
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentOrdersList}>
          {recentOrders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.recentOrderCard}
              onPress={() => router.push("/(tabs)/(orders)" as any)}
              activeOpacity={0.8}
            >
              <View style={styles.recentOrderRow}>
                <View style={styles.recentOrderLeft}>
                  <Text style={styles.recentOrderId}>{order.id}</Text>
                  <Text style={styles.recentOrderService}>
                    {order.serviceName}
                  </Text>
                  <Text style={styles.recentOrderDate}>
                    {order.orderDate} • {order.orderTime}
                  </Text>
                </View>

                <View style={styles.recentOrderRight}>
                  <Text style={styles.recentOrderAmount}>
                    ₹{order.amount.toLocaleString("en-IN")}
                  </Text>
                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor:
                          order.status === "Completed"
                            ? "#DCFCE7"
                            : order.status === "In Progress"
                            ? "#E8F3FC"
                            : "#FEF3C7",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            order.status === "Completed"
                              ? "#15803D"
                              : order.status === "In Progress"
                              ? "#0875D1"
                              : "#B45309",
                        },
                      ]}
                    >
                      {order.status}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Why Diesel Life banner */}
        <View style={styles.whyCard}>
          <LinearGradient
            colors={["#0F172A", "#1E293B"]}
            style={styles.whyGradient}
          >
            <View style={styles.whyHeader}>
              <MaterialCommunityIcons
                name="shield-check"
                size={24}
                color="#22CCD8"
              />
              <Text style={styles.whyTitle}>PESO Certified & Guaranteed</Text>
            </View>
            <Text style={styles.whySubtitle}>
              Every liter delivered is filtered, 100% density verified, and
              digitally metered with automated zero-loss safety seals.
            </Text>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Booking Confirmation Modal */}
      <ActionModal
        visible={bookingModalVisible}
        onClose={() => setBookingModalVisible(false)}
        title={`Book ${selectedService?.title || "Service"}`}
        subtitle={selectedService?.subtitle}
        confirmText="Confirm Request"
        onConfirm={handleConfirmBooking}
      >
        {selectedService && (
          <View style={styles.bookingModalContent}>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Standard Diesel Rate</Text>
              <Text style={styles.modalValue}>
                {selectedService.pricePerLiter
                  ? `₹${selectedService.pricePerLiter}/L`
                  : "On Request"}
              </Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Estimated Arrival</Text>
              <Text style={styles.modalValue}>35 - 45 mins</Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Delivery Location</Text>
              <Text style={styles.modalValue} numberOfLines={1}>
                Logistic Tech Park, BLR
              </Text>
            </View>
          </View>
        )}
      </ActionModal>

      {/* Fuel Terminal Details Modal */}
      <ActionModal
        visible={stationModalVisible}
        onClose={() => setStationModalVisible(false)}
        title={selectedStation?.name || "Terminal Station"}
        subtitle={selectedStation?.address}
        confirmText="Call Terminal"
        cancelText="Close"
        onConfirm={() => {
          Alert.alert(
            "Calling Terminal",
            `Connecting to station dispatch at ${selectedStation?.phone}`
          );
        }}
      >
        {selectedStation && (
          <View style={styles.bookingModalContent}>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Fuel Price</Text>
              <Text style={styles.modalValue}>
                ₹{selectedStation.dieselPrice.toFixed(2)}/L
              </Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Distance</Text>
              <Text style={styles.modalValue}>{selectedStation.distance}</Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Hours</Text>
              <Text style={styles.modalValue}>
                {selectedStation.openStatus}
              </Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Bulk Bowser Dispatch</Text>
              <Text style={styles.modalValue}>Available 24x7</Text>
            </View>
          </View>
        )}
      </ActionModal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  brandLogo: {
    width: "100%",
    height: "100%",
  },
  brandBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  brandName: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  notifButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  unreadBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  greetingWrap: {
    marginTop: 14,
    marginBottom: 12,
  },
  greetingText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: "500",
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  searchWrap: {
    marginTop: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },

 
/* Active Delivery Card */
activeCard: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#E6F4EA",
  borderRadius: 18,
  paddingHorizontal: 15,
  paddingVertical: 16,
  // marginHorizontal: 0,
  marginBottom: 18,
  minHeight: 155,
  borderWidth: 1,
  borderColor: "#D1EAD8",
  overflow: "hidden",
},

activeTitle: {
  fontSize: 15,
  fontWeight: "800",
  color: "#15803D",
  marginBottom: 6,
},

activeOrder: {
  fontSize: 14,
  fontWeight: "800",
  color: THEME.colors.textPrimary,
  marginTop: 2,
},

activeSub: {
  fontSize: 11,
  fontWeight: "500",
  color: THEME.colors.textSecondary,
  marginTop: 5,
  marginBottom: 13,
},

trackBtn: {
  backgroundColor: THEME.colors.primary,
  paddingHorizontal: 19,
  paddingVertical: 9,
  borderRadius: 20,
  alignSelf: "flex-start",
  elevation: 2,
},

trackBtnText: {
  fontSize: 12,
  fontWeight: "800",
  color: "#FFFFFF",
},

activeDeliveryImage: {
  width: 115,
  height: 115,
  marginLeft: 5,
  alignSelf: "center",
},


  // Our Services list
  serviceList: { gap: 10, marginBottom: 16 },
  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: THEME.colors.surface,
    padding: 12,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  serviceRowImage: { width: 64, height: 64, borderRadius: 12 },
  serviceRowTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  serviceRowSub: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },

  homeBanner: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: THEME.radius.lg,
    overflow: "hidden",
    backgroundColor: "#0F172A",
  },
  homeBannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerDots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 10,
    marginBottom: 16,
  },
  bannerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#CBD5E1",
  },
  bannerDotActive: {
    width: 18,
    backgroundColor: THEME.colors.primary,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  
  sectionBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.colors.primary,
    backgroundColor: THEME.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.colors.primary,
  },
  bannerScroll: {
    gap: 14,
    paddingBottom: 8,
    marginBottom: 16,
  },
  bannerCard: {
    width: SCREEN_WIDTH * 0.78,
    borderRadius: THEME.radius.lg,
    padding: 18,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  bannerTagRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  bannerTag: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  bannerTagText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  bannerDiscount: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  bannerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 17,
    marginBottom: 16,
  },
  bannerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: "flex-start",
    gap: 4,
  },
  bannerBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0875D1",
  },
  recentOrdersList: {
    gap: 10,
    marginBottom: 20,
  },
  recentOrderCard: {
    backgroundColor: THEME.colors.surface,
    padding: 14,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  recentOrderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recentOrderLeft: {
    flex: 1,
  },
  recentOrderId: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.primary,
  },
  recentOrderService: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
    marginTop: 2,
  },
  recentOrderDate: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  recentOrderRight: {
    alignItems: "flex-end",
  },
  recentOrderAmount: {
    fontSize: 15,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
    marginBottom: 4,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },
  whyCard: {
    borderRadius: THEME.radius.lg,
    overflow: "hidden",
    marginTop: 4,
  },
  whyGradient: {
    padding: 18,
  },
  whyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  whyTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  whySubtitle: {
    fontSize: 12,
    color: "#94A3B8",
    lineHeight: 18,
  },
  bookingModalContent: {
    gap: 12,
  },
  modalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: THEME.colors.border,
  },
  modalLabel: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
  },
  modalValue: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },

  serviceGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 14,
    marginBottom: 20,
  },

  serviceCard: {
    width: "23%",
    alignItems: "center",
  },

  serviceImageContainer: {
    width: "100%",
    height: 65,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  serviceImage: {
    width: "90%",
    height: "90%",
  },

  serviceTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
    textAlign: "center",
    marginTop: 7,
    lineHeight: 15,
  },
});
