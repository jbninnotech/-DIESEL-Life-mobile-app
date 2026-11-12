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
  MOCK_STATIONS,
  MOCK_USER,
} from "../../../data/mockData";
import { Banner, FuelStation, ServiceItem } from "../../../types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BANNER_WIDTH = SCREEN_WIDTH - 32;
const BANNER_HEIGHT = 180;
const BANNER_INTERVAL_MS = 5000;

const HOME_BANNERS = [
  {
    id: "1",
    image:
      "https://res.cloudinary.com/yozeshlg/image/upload/v1794294900/Fuel_Quality_and_Kenyan_Cars__Fuel_quality_varies__Some_engines_are_sensitive.__High-compression_engines_knock_easily._Older_engines_tolerate_poor_fuel_better.__That_s_why_simple_engines_last_longer_he.jpg",
  },
  {
    id: "2",
    image:
      "https://res.cloudinary.com/yozeshlg/image/upload/v1794296192/Deisel_Delivery.jpg",
  },
  {
    id: "3",
    image:
      "https://res.cloudinary.com/yozeshlg/image/upload/v1794206243/WhatsApp_Image_2026-11-09_at_12.06.37_PM.jpg",
  },
];

// Replace each image with your Cloudinary image link (png/jpg)
const PRODUCT_CATEGORIES = [
  {
    id: "1",
    title: "Emergency Diesel",
    image:
      "https://res.cloudinary.com/yozeshlg/image/upload/v1794294900/Fuel_Quality_and_Kenyan_Cars__Fuel_quality_varies__Some_engines_are_sensitive.__High-compression_engines_knock_easily._Older_engines_tolerate_poor_fuel_better.__That_s_why_simple_engines_last_longer_he.jpg",
  },
  {
    id: "2",
    title: "Diesel Delivery",
    image:
      "https://res.cloudinary.com/yozeshlg/image/upload/v1794296192/Deisel_Delivery.jpg",
  },
  {
    id: "3",
    title: "Doorstep Delivery",
    image:
      "https://res.cloudinary.com/yozeshlg/image/upload/v1794296197/Download_premium_png_of_PNG_Happy_delivery_person_riding_scooter_by_Pinn_about_delivery_man_png_delivery_png_delivery_boy_delivery_boy_png_and_delivery_man_motorcycle_15237807.jpg",
  },
  {
    id: "4",
    title: "Bulk Commercial",
    image:
      "https://res.cloudinary.com/yozeshlg/image/upload/v1794206243/WhatsApp_Image_2026-11-09_at_12.06.37_PM.jpg",
  },
];

const CATEGORY_ROUTES: Record<string, string> = {
  "1": "/(tabs)/(book)",
  "2": "/(tabs)/(book)",
  "3": "/(tabs)/(book)",
  "4": "/(tabs)/(book)",
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

  const handleBookService = (service: ServiceItem) => {
    setSelectedService(service);
    setBookingModalVisible(true);
  };

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

  const handleStationPress = (station: FuelStation) => {
    setSelectedStation(station);
    setStationModalVisible(true);
  };

  const handleNotificationPress = () => {
    Alert.alert(
      "Notifications",
      "• Order #DL-89421 Bowser has arrived at your warehouse.\n• Rate Update: Diesel today at ₹89.62/L across all Bangalore depots.\n• Flat ₹2.50 cashback credited to your wallet.",
      [{ text: "Close" }]
    );
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

        {/* Quick Summary Cards (Dashboard) */}
        {/* <View style={styles.statsGrid}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => router.push("/(tabs)/(wallet)" as any)}
            activeOpacity={0.8}
          >
            <View style={[styles.statIconWrap, { backgroundColor: "#DCFCE7" }]}>
              <MaterialCommunityIcons
                name="wallet-outline"
                size={22}
                color="#16A34A"
              />
            </View>
            <Text style={styles.statLabel}>Wallet Balance</Text>
            <Text style={styles.statValue}>
              ₹{MOCK_USER.walletBalance.toLocaleString("en-IN")}
            </Text>
            <Text style={styles.statSub}>Tap to top up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => router.push("/(tabs)/(orders)" as any)}
            activeOpacity={0.8}
          >
            <View style={[styles.statIconWrap, { backgroundColor: "#E8F3FC" }]}>
              <MaterialCommunityIcons
                name="truck-fast-outline"
                size={22}
                color="#0875D1"
              />
            </View>
            <Text style={styles.statLabel}>Active Orders</Text>
            <Text style={styles.statValue}>{MOCK_USER.activeOrdersCount}</Text>
            <Text style={styles.statSub}>1 Arrived at site</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => router.push("/(tabs)/(orders)" as any)}
            activeOpacity={0.8}
          >
            <View style={[styles.statIconWrap, { backgroundColor: "#FEF3C7" }]}>
              <MaterialCommunityIcons
                name="clipboard-check-outline"
                size={22}
                color="#D97706"
              />
            </View>
            <Text style={styles.statLabel}>Total Orders</Text>
            <Text style={styles.statValue}>{MOCK_USER.totalOrdersCount}</Text>
            <Text style={styles.statSub}>All-time fulfilled</Text>
          </TouchableOpacity>

          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: "#F3E8FF" }]}>
              <MaterialCommunityIcons
                name="star-circle-outline"
                size={22}
                color="#9333EA"
              />
            </View>
            <Text style={styles.statLabel}>Loyalty Points</Text>
            <Text style={styles.statValue}>
              {MOCK_USER.loyaltyPoints.toLocaleString("en-IN")}
            </Text>
            <Text style={styles.statSub}>{MOCK_USER.memberTier}</Text>
          </View>
        </View> */}
        {/* Product Categories (Horizontal Scroll) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our Services</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {PRODUCT_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryItem}
              activeOpacity={0.8}
              onPress={() => router.push(CATEGORY_ROUTES[category.id] as any)}
            >
              <View style={styles.categoryImageBox}>
                <Image
                  source={{ uri: category.image }}
                  style={styles.categoryImage}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.categoryLabel} numberOfLines={3}>
                {category.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

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

        {/* Diesel Services Section */}
        {/* <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Diesel Services</Text>
          <Text style={styles.sectionCount}>
            {filteredServices.length} Services
          </Text>
        </View> */}

        {/* <View style={styles.servicesGrid}>
          {filteredServices.map((service: ServiceItem) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceCard}
              onPress={() => handleBookService(service)}
              activeOpacity={0.8}
            >
              <View style={styles.serviceHeader}>
                <View style={styles.serviceIconCircle}>
                  <MaterialCommunityIcons
                    name={service.icon as any}
                    size={24}
                    color={THEME.colors.primary}
                  />
                </View>
                {service.tag && (
                  <View style={styles.serviceBadge}>
                    <Text style={styles.serviceBadgeText}>{service.tag}</Text>
                  </View>
                )}
              </View>

              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.serviceSubtitle} numberOfLines={2}>
                {service.subtitle}
              </Text>

              <View style={styles.serviceFooter}>
                {service.pricePerLiter ? (
                  <View>
                    <Text style={styles.servicePriceLabel}>Today's Rate</Text>
                    <Text style={styles.servicePrice}>
                      ₹{service.pricePerLiter.toFixed(2)}
                      <Text style={styles.servicePerL}>/L</Text>
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.servicePriceLabel}>Custom Quote</Text>
                )}

                <View style={styles.bookPill}>
                  <Text style={styles.bookPillText}>Book</Text>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={16}
                    color="#FFFFFF"
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View> */}

        {/* Nearby Fuel Stations Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Fuel Terminals</Text>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Terminals",
                "Displaying verified Diesel Life PESO depots nearest to your GPS coordinates."
              )
            }
          >
            <Text style={styles.seeAllText}>View Map</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stationsList}>
          {MOCK_STATIONS.map((station: FuelStation) => (
            <TouchableOpacity
              key={station.id}
              style={styles.stationCard}
              onPress={() => handleStationPress(station)}
              activeOpacity={0.85}
            >
              <View style={styles.stationIcon}>
                <MaterialCommunityIcons
                  name="gas-station-outline"
                  size={26}
                  color={THEME.colors.primary}
                />
              </View>

              <View style={styles.stationInfo}>
                <View style={styles.stationTitleRow}>
                  <Text style={styles.stationName} numberOfLines={1}>
                    {station.name}
                  </Text>
                  <View style={styles.ratingBadge}>
                    <MaterialCommunityIcons
                      name="star"
                      size={13}
                      color="#F59E0B"
                    />
                    <Text style={styles.ratingText}>{station.rating}</Text>
                  </View>
                </View>

                <Text style={styles.stationAddress} numberOfLines={1}>
                  {station.address}
                </Text>

                <View style={styles.stationDetailsRow}>
                  <View style={styles.metaItem}>
                    <MaterialCommunityIcons
                      name="map-marker-distance"
                      size={14}
                      color={THEME.colors.textMuted}
                    />
                    <Text style={styles.metaText}>{station.distance}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={14}
                      color={THEME.colors.secondary}
                    />
                    <Text
                      style={[
                        styles.metaText,
                        { color: THEME.colors.secondary },
                      ]}
                    >
                      {station.openStatus}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activities Section */}
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

        {/* Recommended Services / Why Diesel Life banner */}
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

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flexBasis: "48%",
    flexGrow: 1,
    backgroundColor: THEME.colors.surface,
    padding: 14,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  statIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    fontWeight: "600",
  },
  statValue: {
    fontSize: 19,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
    marginTop: 4,
  },
  statSub: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 4,
    fontWeight: "500",
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
  sectionCount: {
    fontSize: 12,
    fontWeight: "600",
    color: THEME.colors.textMuted,
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
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  serviceCard: {
    flexBasis: "48%",
    flexGrow: 1,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    justifyContent: "space-between",
  },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  serviceIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: THEME.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceBadge: {
    backgroundColor: THEME.colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  serviceBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: THEME.colors.secondaryDark,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
    marginBottom: 4,
  },
  serviceSubtitle: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    lineHeight: 16,
    marginBottom: 12,
  },
  serviceFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: THEME.colors.borderLight,
    paddingTop: 10,
  },
  servicePriceLabel: {
    fontSize: 10,
    color: THEME.colors.textMuted,
  },
  servicePrice: {
    fontSize: 13,
    fontWeight: "800",
    color: THEME.colors.primary,
  },
  servicePerL: {
    fontSize: 10,
    fontWeight: "600",
    color: THEME.colors.textMuted,
  },
  bookPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  bookPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  stationsList: {
    gap: 10,
    marginBottom: 20,
  },
  stationCard: {
    flexDirection: "row",
    backgroundColor: THEME.colors.surface,
    padding: 14,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  stationIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: THEME.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  stationInfo: {
    flex: 1,
  },
  stationTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stationName: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#B45309",
  },
  stationAddress: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
    marginBottom: 6,
  },
  stationDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: "500",
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
  // Product categories
  categoryScroll: {
    gap: 12,
    paddingBottom: 8,
    marginBottom: 16,
  },
  categoryItem: {
    width: 84,
    alignItems: "center",
  },
  categoryImageBox: {
    width: 84,
    height: 84,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: THEME.colors.border,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: THEME.colors.textPrimary,
    textAlign: "center",
    lineHeight: 16,
  },
});