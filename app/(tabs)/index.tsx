import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Constants
import { Colors } from "@/constants/themes";
// !TEST
import { IsDark } from "@/constants/tempThemeSelector";

export default function HomeScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: IsDark
          ? Colors.dark.background
          : Colors.light.background,
      }}
    >
      <View>
        <Text
          style={{
            color: IsDark ? Colors.light.background : Colors.dark.background,
            alignSelf: "center",
          }}
        >
          Welcome
        </Text>
      </View>
    </SafeAreaView>
  );
}
