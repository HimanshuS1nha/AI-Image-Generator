import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Text, View } from "react-native";
import tw from "twrnc";
import { Entypo } from "@expo/vector-icons";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerTitle: (props) => {
            return (
              <View
                style={tw`flex-row gap-x-3 items-center justify-center`}
                {...props}
              >
                <Entypo name="image" size={24} color="white" />
                <Text style={tw`text-white font-semibold text-lg`}>
                  AI Image Generator
                </Text>
              </View>
            );
          },
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "#000",
          },
          statusBarStyle: "light",
        }}
      />
    </QueryClientProvider>
  );
}
