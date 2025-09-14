import { View, Text, Modal, Pressable, TextInput, Alert } from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import { AntDesign } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import RNFS from "react-native-fs";
import RNBlobUtil from "react-native-blob-util";

const SaveImageModal = ({
  isVisible,
  setIsVisible,
  selectedImageBase64,
  setSelectedImageBase64,
}: {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedImageBase64: string | undefined;
  setSelectedImageBase64: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
}) => {
  const [filename, setFilename] = useState("");

  const { mutate: handleSaveImage, isPending } = useMutation({
    mutationKey: ["save-image"],
    mutationFn: async () => {
      const filepath = RNFS.DocumentDirectoryPath + `/${filename}.png`;

      await RNFS.writeFile(filepath, selectedImageBase64 as string, "base64");

      await RNBlobUtil.MediaCollection.copyToMediaStore(
        {
          name: "generated-image.png",
          mimeType: "image/png",
          parentFolder: "",
        },
        "Download",
        filepath
      );

      await RNFS.unlink(filepath);
    },
    onSuccess: () => {
      Alert.alert("Success", `Image saved successfully to Downloads`, [
        {
          text: "Ok",
          onPress: () => {
            setFilename("");
            setSelectedImageBase64(undefined);
            setIsVisible(false);
          },
        },
      ]);
    },
    onError: () => {
      Alert.alert("Error", "Error occured while saving the image");
    },
  });
  return (
    <Modal
      visible={isVisible}
      onRequestClose={() => setIsVisible(false)}
      transparent
    >
      <View style={tw`flex-1 bg-gray-900/60 items-center justify-center`}>
        <View style={tw`w-[75%] bg-black p-4 rounded-lg gap-y-6`}>
          <Pressable
            style={tw`absolute right-3 top-3`}
            onPress={() => setIsVisible(false)}
          >
            <AntDesign name="close" size={20} color={"white"} />
          </Pressable>

          <Text style={tw`text-center text-white text-lg font-medium mt-6`}>
            Save Image
          </Text>

          <TextInput
            style={tw`border border-white rounded-lg px-3 text-white`}
            placeholder="Enter file name"
            placeholderTextColor={"#d1d5dc"}
            value={filename}
            onChangeText={(text) => setFilename(text)}
          />

          <Pressable
            style={tw`bg-indigo-600 justify-center items-center py-2 rounded-lg`}
            onPress={() => handleSaveImage()}
            disabled={
              !filename ||
              filename.trim().length === 0 ||
              isPending ||
              !selectedImageBase64
            }
          >
            <Text style={tw`text-white font-medium`}>Save</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default SaveImageModal;
