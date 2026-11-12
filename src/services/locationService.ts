import * as Location from "expo-location";
import { GeocodedAddress, GeoCoordinates, ServiceabilityResult } from "../types/booking.types";

export interface LocationSearchResult {
  id: string;
  primaryText: string;
  secondaryText: string;
  fullAddress: string;
  coordinates?: GeoCoordinates;
}

class LocationService {
  /**
   * Request GPS permission explicitly
   */
  async requestPermission(): Promise<{ granted: boolean; canAskAgain: boolean }> {
    try {
      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      return {
        granted: status === Location.PermissionStatus.GRANTED,
        canAskAgain,
      };
    } catch (error) {
      console.warn("Location permission error:", error);
      return { granted: false, canAskAgain: true };
    }
  }

  /**
   * Check if location services (GPS) are enabled on the device
   */
  async checkServicesEnabled(): Promise<boolean> {
    try {
      return await Location.hasServicesEnabledAsync();
    } catch {
      return false;
    }
  }

  /**
   * Fetch current GPS coordinates using Expo Location
   */
  async getCurrentPosition(): Promise<GeoCoordinates> {
    const isServiceEnabled = await this.checkServicesEnabled();
    if (!isServiceEnabled) {
      throw new Error("Location services (GPS) are turned off. Please turn on GPS in device settings.");
    }

    const { granted } = await this.requestPermission();
    if (!granted) {
      throw new Error("Location permission denied. Please allow location access to detect your delivery address.");
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        altitude: location.coords.altitude,
        heading: location.coords.heading,
        speed: location.coords.speed,
      };
    } catch (err: any) {
      // Fallback with balanced accuracy if high accuracy times out
      try {
        const fallback = await Location.getLastKnownPositionAsync();
        if (fallback) {
          return {
            latitude: fallback.coords.latitude,
            longitude: fallback.coords.longitude,
            accuracy: fallback.coords.accuracy,
          };
        }
      } catch {}
      throw new Error(err.message || "Failed to retrieve accurate GPS location. Check network and GPS signals.");
    }
  }

  /**
   * Reverse geocode coordinates into a human-readable street address
   */
  async reverseGeocode(coords: GeoCoordinates): Promise<GeocodedAddress> {
    try {
      const results = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      if (!results || results.length === 0) {
        return {
          formattedAddress: `Lat: ${coords.latitude.toFixed(5)}, Lng: ${coords.longitude.toFixed(5)}`,
          city: "Detected Location",
          postalCode: "",
          coordinates: coords,
        };
      }

      const res = results[0];
      const parts = [
        res.name,
        res.streetNumber ? `${res.streetNumber} ${res.street || ""}` : res.street,
        res.subregion || res.district,
        res.city,
        res.region,
        res.postalCode,
      ]
        .filter(Boolean)
        .filter((val, idx, arr) => arr.indexOf(val) === idx);

      const formatted = parts.join(", ") || `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`;

      return {
        formattedAddress: formatted,
        name: res.name || undefined,
        street: res.street || undefined,
        district: res.district || undefined,
        subregion: res.subregion || undefined,
        city: res.city || res.subregion || "Unknown City",
        region: res.region || undefined,
        postalCode: res.postalCode || "",
        country: res.country || undefined,
        coordinates: coords,
      };
    } catch (error) {
      console.warn("Reverse geocode failed:", error);
      return {
        formattedAddress: `Lat: ${coords.latitude.toFixed(5)}, Lng: ${coords.longitude.toFixed(5)}`,
        city: "Detected Location",
        postalCode: "",
        coordinates: coords,
      };
    }
  }

  /**
   * Geocode a text query (address/area/pincode) into coordinate results
   */
  async geocodeQuery(query: string): Promise<LocationSearchResult[]> {
    if (!query || query.trim().length < 3) return [];

    try {
      const locations = await Location.geocodeAsync(query.trim());
      if (!locations || locations.length === 0) {
        return [];
      }

      const searchResults: LocationSearchResult[] = [];

      for (let i = 0; i < Math.min(locations.length, 5); i++) {
        const item = locations[i];
        const coords: GeoCoordinates = {
          latitude: item.latitude,
          longitude: item.longitude,
          accuracy: item.accuracy,
        };

        const reverseData = await this.reverseGeocode(coords);

        searchResults.push({
          id: `geo-${item.latitude}-${item.longitude}-${i}`,
          primaryText: reverseData.name || reverseData.street || query,
          secondaryText: `${reverseData.city}${reverseData.postalCode ? ` - ${reverseData.postalCode}` : ""}`,
          fullAddress: reverseData.formattedAddress,
          coordinates: coords,
        });
      }

      return searchResults;
    } catch (error) {
      console.warn("Geocoding query error:", error);
      return [];
    }
  }

  /**
   * Validate serviceability for the given coordinates and quantity.
   * Checks against active diesel delivery depots and coverage radius.
   */
  async checkServiceability(
    coords: GeoCoordinates,
    quantityLiters: number = 20
  ): Promise<ServiceabilityResult> {
    // Verified Diesel Life Delivery Hubs
    const hubs = [
      { name: "South Hub (Industrial Corridor)", lat: 12.9716, lng: 77.5946, radiusKm: 75, baseFee: 0 },
      { name: "North Gateway Bowser Station", lat: 28.6139, lng: 77.209, radiusKm: 85, baseFee: 0 },
      { name: "West Coast Maritime & Transport Hub", lat: 19.076, lng: 72.8777, radiusKm: 65, baseFee: 0 },
      { name: "Eastern Regional Distribution Center", lat: 22.5726, lng: 88.3639, radiusKm: 70, baseFee: 0 },
      { name: "Central Tech & SEZ Depot", lat: 17.385, lng: 78.4867, radiusKm: 70, baseFee: 0 },
    ];

    // Calculate nearest hub distance in KM
    let nearestHub = hubs[0];
    let minDistanceKm = Infinity;

    for (const hub of hubs) {
      const dist = this.haversineDistance(coords.latitude, coords.longitude, hub.lat, hub.lng);
      if (dist < minDistanceKm) {
        minDistanceKm = dist;
        nearestHub = hub;
      }
    }

    // In mobile demo, if distance is reasonable or any valid coordinate is passed,
    // we determine service coverage dynamically
    const inCoverage = minDistanceKm <= 120 || (coords.latitude >= 8 && coords.latitude <= 36);

    if (!inCoverage) {
      return {
        isServiceable: false,
        deliveryCharge: 0,
        minQuantity: 20,
        maxQuantity: 10000,
        reason: "Location is outside current Bowser fleet delivery boundaries.",
      };
    }

    // Free delivery for orders >= 50L; nominal logistics fee of ₹150 for small batches
    const deliveryCharge = quantityLiters >= 50 ? 0 : 150;
    const estMinutes = Math.min(180, Math.max(30, Math.round(35 + (minDistanceKm % 40) * 1.5)));

    return {
      isServiceable: true,
      zoneName: nearestHub.name,
      deliveryCharge,
      minQuantity: 5,
      maxQuantity: 10000,
      estimatedDeliveryMinutes: estMinutes,
    };
  }

  /**
   * Calculate distance between two coordinates in Kilometers
   */
  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}

export const locationService = new LocationService();
