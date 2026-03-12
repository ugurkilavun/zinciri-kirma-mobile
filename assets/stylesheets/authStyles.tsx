import { Colors } from "@/constants/themes";
import { StyleSheet } from "react-native";

export const authStyles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    paddingHorizontal: 24,
  },

  // Top
  topContainer: {
    marginTop: 25,
    marginBottom: 32,
    height: "auto"
  },
  top: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  topStrongText: {
    fontSize: 30,
    fontWeight: "900",
  },
  topSmallText: {
    fontSize: 18,
    fontWeight: "700",
  },

  // Body
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 32,
  },
  forgotPasswordText: {
    color: Colors.light.mainColorGreen,
    fontWeight: "900",
    fontSize: 14,
  },

  // Bottom
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    gap: 16,
  },
  bottomLine: {
    flex: 1,
    height: 2,
  },
  bottomLineText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#9ca3af",
    textTransform: "uppercase",
  },

  bottomLoginOptionContainer: {
    gap: 12,
    marginBottom: 32,
  },
  bottomButton: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  bottomButtonText: {
    fontWeight: "900",
    fontSize: 18,
  },
});
