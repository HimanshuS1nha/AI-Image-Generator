import { Text, View, TextInput, Pressable } from "react-native";
import React from "react";
import tw from "twrnc";
import { Feather } from "@expo/vector-icons";

export default function Index() {
  return (
    <View style={tw`bg-black flex-1 px-2`}>
      <View style={tw`flex-1 pb-4`}></View>

      <View style={tw`flex-row gap-x-3.5 items-center`}>
        <TextInput
          style={tw`border-b border-b-white flex-1 text-white`}
          placeholder="Type here..."
          placeholderTextColor={"#d1d5dc"}
        />

        <Pressable style={tw`bg-indigo-600 p-1.5 rounded-full`}>
          <Feather name="send" size={24} color="white" />
        </Pressable>
      </View>
    </View>
  );
}
