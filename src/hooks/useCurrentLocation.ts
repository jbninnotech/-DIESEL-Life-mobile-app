import { useState, useCallback, useEffect } from "react";
import { locationService } from "../services/locationService";
import { GeocodedAddress, GeoCoordinates, ServiceabilityResult } from "../types/booking.types";

interface UseCurrentLocationReturn {
  coordinates: GeoCoordinates | null;
  addressData: GeocodedAddress | null;
  serviceability: ServiceabilityResult | null;
  isLoading: boolean;
  error: string | null;
  permissionGranted: boolean;
  detectLocation: () => Promise<GeocodedAddress | null>;
  setCustomCoordinates: (coords: GeoCoordinates) => Promise<GeocodedAddress | null>;
  clearError: () => void;
}

export function useCurrentLocation(initialAutoDetect = false): UseCurrentLocationReturn {
  const [coordinates, setCoordinates] = useState<GeoCoordinates | null>(null);
  const [addressData, setAddressData] = useState<GeocodedAddress | null>(null);
  const [serviceability, setServiceability] = useState<ServiceabilityResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  const clearError = useCallback(() => setError(null), []);

  const evaluateLocation = useCallback(
    async (coords: GeoCoordinates): Promise<GeocodedAddress> => {
      setCoordinates(coords);
      const address = await locationService.reverseGeocode(coords);
      setAddressData(address);

      const serv = await locationService.checkServiceability(coords);
      setServiceability(serv);

      return address;
    },
    []
  );

  const detectLocation = useCallback(async (): Promise<GeocodedAddress | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const { granted } = await locationService.requestPermission();
      setPermissionGranted(granted);
      if (!granted) {
        throw new Error(
          "Location permission was denied. You can manually enter or search your delivery location."
        );
      }

      const coords = await locationService.getCurrentPosition();
      const addr = await evaluateLocation(coords);
      return addr;
    } catch (err: any) {
      const msg = err.message || "Unable to acquire current location.";
      setError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [evaluateLocation]);

  const setCustomCoordinates = useCallback(
    async (coords: GeoCoordinates): Promise<GeocodedAddress | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const addr = await evaluateLocation(coords);
        return addr;
      } catch (err: any) {
        setError(err.message || "Failed to resolve selected coordinates.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [evaluateLocation]
  );

  useEffect(() => {
    if (initialAutoDetect) {
      detectLocation();
    }
  }, [initialAutoDetect, detectLocation]);

  return {
    coordinates,
    addressData,
    serviceability,
    isLoading,
    error,
    permissionGranted,
    detectLocation,
    setCustomCoordinates,
    clearError,
  };
}
