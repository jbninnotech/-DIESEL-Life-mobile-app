import React from "react";
import { View, StyleSheet } from "react-native";
import { CustomInput } from "../common/CustomInput";

interface CustomerDetailsProps {
  contactName: string;
  onChangeContactName: (text: string) => void;
  contactNumber: string;
  onChangeContactNumber: (text: string) => void;
  deliveryInstructions?: string;
  onChangeDeliveryInstructions?: (text: string) => void;
  nameError?: string;
  phoneError?: string;
}

export const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  contactName,
  onChangeContactName,
  contactNumber,
  onChangeContactNumber,
  deliveryInstructions = "",
  onChangeDeliveryInstructions,
  nameError,
  phoneError,
}) => {
  return (
    <View style={styles.container}>
      <CustomInput
        label="Contact Person Name"
        icon="account-outline"
        placeholder="Recipient or on-site supervisor"
        value={contactName}
        onChangeText={onChangeContactName}
        error={nameError}
        required
      />

      <CustomInput
        label="10-Digit Mobile Number"
        icon="phone-outline"
        placeholder="9876543210"
        value={contactNumber}
        onChangeText={(t) => onChangeContactNumber(t.replace(/\D/g, "").slice(0, 10))}
        keyboardType="phone-pad"
        error={phoneError}
        required
      />

      {onChangeDeliveryInstructions && (
        <CustomInput
          label="Doorstep Delivery Instructions (Optional)"
          icon="note-text-outline"
          placeholder="e.g. Gate pass required, fuel tank located at basement B2"
          value={deliveryInstructions}
          onChangeText={onChangeDeliveryInstructions}
          multiline
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
});
