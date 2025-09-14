import {
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useMemo } from "react";
import tw from "twrnc";
import { Feather } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import Message from "@/components/message";
import SaveImageModal from "@/components/save-image-modal";

import { aspectRatios } from "@/constants/aspect-ratios";

import { MessageType } from "@/types";

export default function Index() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const [aspectRatio, setAspectRatio] = useState(aspectRatios[0].value);
  const [isSaveImageDialogVisible, setIsSaveImageDialogVisible] =
    useState(false);
  const [selectedImageBase64, setSelectedImageBase64] = useState<string>();

  const images = useMemo(
    () => [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD-nJDUXoWmPYZ5nCO8ox68R33NIuq2S7z-Q&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZv83NYOEzjNslVFcBHiEqQXFxndpG0AS2CQ&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVXnoQzmaPaH3IXSUF3SGDpovWDFLzPJEk1A&s",
      "https://images.pexels.com/photos/11204757/pexels-photo-11204757.jpeg",
    ],
    []
  );

  const { mutate: handleGenerateImage, isPending } = useMutation({
    mutationKey: ["generate-image"],
    mutationFn: async () => {
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/generate`,
        { prompt: input, aspectRatio }
      );

      return data as { image: string };
    },
    onMutate: () => {
      setMessages((prev) => [...prev, { role: "user", content: input }]);
      setInput("");
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "ai", aspectRatio, image: data.image },
      ]);
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data.error) {
        Alert.alert("Error", error.response.data.error);
      } else {
        Alert.alert(
          "Error",
          "Error occured while generating the image. Please try again later"
        );
      }
    },
  });
  return (
    <View style={tw`bg-black flex-1 px-2`}>
      <SaveImageModal
        isVisible={isSaveImageDialogVisible}
        setIsVisible={setIsSaveImageDialogVisible}
        selectedImageBase64={selectedImageBase64}
        setSelectedImageBase64={setSelectedImageBase64}
      />

      <View style={tw`flex-1 pb-4`}>
        {messages.length > 0 ? (
          <FlashList
            data={messages}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => {
              return (
                <Message
                  message={item}
                  saveImage={(base64) => {
                    setSelectedImageBase64(base64);
                    setIsSaveImageDialogVisible(true);
                  }}
                />
              );
            }}
            maintainVisibleContentPosition={{ startRenderingFromBottom: true }}
          />
        ) : (
          <View style={tw`flex-1 justify-center items-center gap-y-8`}>
            <Text
              style={tw`text-white text-3xl font-semibold w-[70%] text-center`}
            >
              Create your own masterpiece
            </Text>

            <View style={tw`flex-row flex-wrap gap-4 w-[90%]`}>
              {images.map((image) => {
                return (
                  <Image
                    source={{ uri: image }}
                    style={tw`w-[45%] h-40 rounded-lg`}
                    key={image}
                  />
                );
              })}
            </View>
          </View>
        )}
      </View>

      <View style={tw`pb-7 w-full gap-y-3`}>
        <ScrollView horizontal contentContainerStyle={tw`gap-x-4`}>
          {aspectRatios.map((item) => {
            return (
              <Pressable
                style={tw`${
                  item.value === aspectRatio ? "bg-indigo-600" : "bg-gray-700"
                } px-4 py-1.5 rounded-full`}
                key={item.value}
                onPress={() => setAspectRatio(item.value)}
              >
                <Text style={tw`text-white`}>{item.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={tw`flex-row gap-x-3.5 items-center`}>
          <TextInput
            style={tw`border-b border-b-white flex-1 text-white`}
            placeholder="Type here..."
            placeholderTextColor={"#d1d5dc"}
            value={input}
            onChangeText={(text) => setInput(text)}
          />

          <Pressable
            style={tw`${
              isPending || input.trim().length === 0
                ? "bg-indigo-300"
                : "bg-indigo-600"
            } p-1.5 rounded-full`}
            disabled={isPending || input.trim().length === 0}
            onPress={() => handleGenerateImage()}
          >
            <Feather name="send" size={24} color="white" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
