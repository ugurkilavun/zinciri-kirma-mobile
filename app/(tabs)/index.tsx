import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#11181C" }}>
      <View>
        <Text
          style={{
            color: "white",
            alignSelf: "center",
          }}
        >
          Welcome
        </Text>
      </View>
    </SafeAreaView>
  );
}