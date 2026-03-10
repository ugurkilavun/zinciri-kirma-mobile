import { Colors } from "@/constants/themes";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 24,
  },

  // Body
  bodyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  bodyHeaderText: {
    fontSize: 48,
    fontWeight: "900",
    // color: "#10b981",
    color: Colors.light.mainColor2,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  bodyDescText: {
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
  },
});
