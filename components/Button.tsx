import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { Colors } from "@/constants/themes";
// !TEST
import { IsDark } from "@/constants/tempThemeSelector";

const Button = ({
  children,
  onPress,
  variant = "primary",
  icon: Icon,
  disabled,
}: any) => {
  const getBackgroundColor = () => {
    if (disabled) return variant === "primary" ? "#d7fabd" : "#e5e7eb";
    return variant === "primary" ? Colors.light.mainColorGreen : "transparent";
  };

  const getTextColor = () => {
    if (disabled) return variant === "primary" ? "#ffffff" : "#9ca3af";
    return variant === "primary" ? "#ffffff" : Colors.light.mainColorGreen;
  };

  const getBorderColor = () => {
    if (disabled) return variant === "primary" ? "#b9e995" : "#d1d5db";
    return variant === "primary"
      ? IsDark
        ? Colors.dark.borderBottomColorGreen
        : Colors.light.borderBottomColorGreen
      : IsDark
        ? "#374151"
        : "#e5e7eb";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={{
        width: "100%",
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
        backgroundColor: getBackgroundColor(),
        // Border
        borderColor:
          variant !== "primary" ? getBorderColor() : getBorderColor(),
        borderTopWidth: variant !== "primary" ? 2 : 0,
        borderLeftWidth: variant !== "primary" ? 2 : 0,
        borderRightWidth: variant !== "primary" ? 2 : 0,
        borderBottomWidth: 4,
        borderBottomColor: getBorderColor(),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      {Icon && <Icon size={20} color={getTextColor()} />}
      {/* <ActivityIndicator color="#fff" size="small" /> */}
      <Text style={{ fontWeight: "900", fontSize: 18, color: getTextColor() }}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
