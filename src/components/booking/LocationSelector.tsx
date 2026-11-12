import React from "react";
import { View, StyleSheet } from "react-native";
import { GeocodedAddress, GeoCoordinates, ServiceabilityResult } from "../../types/booking.types";
import { LocationSearchResult } from "../../services/locationService";
import { CurrentLocationButton } from "./CurrentLocationButton";
import { LocationSearchInput } from "./LocationSearchInput";
import { DeliveryAddressCard } from "./DeliveryAddressCard";
import { DeliveryMap } from "./DeliveryMap";
import { ErrorMessage } from "../common/ErrorMessage";

interface LocationSelectorProps {
  coordinates: GeoCoordinates;
  addressData: GeocodedAddress | null;
  serviceability: ServiceabilityResult | null;
  isLoading: boolean;
  error: string | null;
  isConfirmed: boolean;
  onDetectLocation: () => void;
  onSelectSearchResult: (result: LocationSearchResult) => void;
  onPinNudged: (coords: GeoCoordinates) => void;
  onConfirmLocation: () => void;
  onEditAddress?: () => void;
  onClearError?: () => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  coordinates,
  addressData,
  serviceability,
  isLoading,
  error,
  isConfirmed,
  onDetectLocation,
  onSelectSearchResult,
  onPinNudged,
  onConfirmLocation,
  onEditAddress,
  onClearError,
}) => {
  return (
    <View style={styles.container}>
      {/* 1. Detect My Current Location Button */}
      <CurrentLocationButton
        onPress={onDetectLocation}
        isLoading={isLoading}
        hasLocation={!!addressData}
      />

      {/* 2. Error message if any */}
      {error && (
        <ErrorMessage
          message={error}
          onRetry={onDetectLocation}
        />
      )}

      {/* 3. Address Search Bar */}
      <View style={styles.searchWrap}>
        <LocationSearchInput onLocationSelect={onSelectSearchResult} />
      </View>

      {/* 4. Interactive Draggable Pin Map View */}
      <DeliveryMap
        coordinates={coordinates}
        address={addressData?.formattedAddress}
        onSelectOnMap={onPinNudged}
        interactive={true}
      />

      {/* 5. Address Card with Serviceability and Confirmation */}
      {addressData && (
        <DeliveryAddressCard
          addressData={addressData}
          serviceability={serviceability}
          isConfirmed={isConfirmed}
          onConfirm={onConfirmLocation}
          onRefresh={onDetectLocation}
          onEdit={onEditAddress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  searchWrap: {
    marginTop: 10,
    marginBottom: 4,
  },
});
