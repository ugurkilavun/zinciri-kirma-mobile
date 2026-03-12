import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
// !TEST
import { IsDark } from "@/constants/tempThemeSelector";
import { Colors } from "@/constants/themes";

const InputField = ({
  label,
  icon: Icon,
  type,
  value,
  onChange,
  placeholder,
  showPasswordToggle,
}: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (isFocused) return Colors.light.mainColorGreen;
    return IsDark ? "#374151" : "#e5e7eb";
  };

  const getBackgroundColor = () => {
    if (isFocused) return IsDark ? "#111827" : "#ffffff";
    return IsDark ? "#1f2937" : "#f9fafb";
  };

  const targetRef = useRef(null);
  const [hight, setHight] = useState(0);

  useEffect(() => {
    const itemRef: any = targetRef.current;
    if (itemRef) {
      itemRef.measure(
        (x: any, y: any, width: any, height: any, pageX: any, pageY: any) => {
          setHight(height);
        },
      );
    }
  }, []);

  return (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: "900",
          color: IsDark ? "#9ca3af" : "#9ca3af",
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: 1,
          marginLeft: 4,
        }}
      >
        {label}
      </Text>
      <View style={{ position: "relative" }} ref={targetRef}>
        <View
          style={{
            position: "absolute",
            top: (hight - 20) / 2,
            left: 16,
            zIndex: 1,
          }}
        >
          <Icon size={20} color="#9ca3af" />
        </View>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          secureTextEntry={type === "password" && !showPassword}
          selectionColor={Colors.light.mainColorGreen}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            width: "100%",
            backgroundColor: getBackgroundColor(),
            borderWidth: 2,
            borderColor: getBorderColor(),
            borderRadius: 16,
            paddingVertical: 16,
            paddingLeft: 48,
            paddingRight: showPasswordToggle ? 48 : 16,
            fontSize: 18,
            fontWeight: "700",
            color: IsDark ? "#ffffff" : "#111827",
          }}
        />
        {showPasswordToggle && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ position: "absolute", top: (hight - 20) / 2, right: 16 }}
          >
            {showPassword ? (
              <EyeOff size={20} color="#9ca3af" />
            ) : (
              <Eye size={20} color="#9ca3af" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default InputField;
