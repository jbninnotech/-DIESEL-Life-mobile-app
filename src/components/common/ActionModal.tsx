import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { THEME } from "../../constants/theme";

interface ActionModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  confirmDestructive?: boolean;
  children?: React.ReactNode;
}

export default function ActionModal({
  visible,
  onClose,
  title,
  subtitle,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  confirmDestructive = false,
  children,
}: ActionModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialCommunityIcons
                name="close"
                size={20}
                color={THEME.colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

          {children ? <View style={styles.content}>{children}</View> : null}

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelText}>{cancelText}</Text>
            </TouchableOpacity>

            {onConfirm && (
              <TouchableOpacity
                style={[
                  styles.btn,
                  confirmDestructive ? styles.destructBtn : styles.confirmBtn,
                ]}
                onPress={() => {
                  onConfirm();
                  onClose();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmText}>{confirmText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  subtitle: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    marginTop: 6,
    lineHeight: 20,
  },
  content: {
    marginVertical: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },
  btn: {
    flex: 1,
    height: 46,
    borderRadius: THEME.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: {
    backgroundColor: THEME.colors.borderLight,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.colors.textSecondary,
  },
  confirmBtn: {
    backgroundColor: THEME.colors.primary,
  },
  destructBtn: {
    backgroundColor: THEME.colors.danger,
  },
  confirmText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
