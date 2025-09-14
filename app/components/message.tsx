import { View, Text, Pressable, Image, Alert } from "react-native";
import React from "react";
import tw from "twrnc";
import { Feather } from "@expo/vector-icons";

import { MessageType } from "@/types";

const Message = ({
  message,
  saveImage,
}: {
  message: MessageType;
  saveImage: (base64: string) => void;
}) => {
  return (
    <View style={tw`mb-4 ${message.role === "user" ? "items-end" : ""}`}>
      <View
        style={tw`p-3 rounded-xl max-w-[90%] ${
          message.role === "user"
            ? "bg-gray-700 rounded-br-none"
            : "bg-indigo-600 rounded-bl-none"
        }`}
      >
        {message.role === "user" ? (
          <Text style={tw`text-white`}>{message.content}</Text>
        ) : (
          <>
            <Image
              source={{ uri: message.image }}
              style={tw`aspect-${message.aspectRatio} rounded-lg`}
            />

            <View style={tw`flex-row absolute bottom-5 right-5`}>
              <Pressable
                style={tw`p-2 bg-indigo-600 rounded-full shadow`}
                onPress={() => saveImage(message.image.split(",")[1])}
              >
                <Feather name="download" size={24} color="white" />
              </Pressable>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default Message;
