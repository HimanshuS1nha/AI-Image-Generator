import React, { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";
import toast from "react-hot-toast";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const MainSection = ({
  input,
  setInput,
  generatedImage,
  handleGenerateImage,
  isPending,
}: {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  generatedImage: { src: string; aspectRatio: string } | undefined;
  handleGenerateImage: () => void;
  isPending: boolean;
}) => {
  const convertBase64ToBytes = useCallback((base64: string) => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }, []);

  const { mutate: handleSaveImage, isPending: saveImagePending } = useMutation({
    mutationKey: ["save-image"],
    mutationFn: async () => {
      const path = await save({
        filters: [
          {
            name: "image",
            extensions: ["png", "jpeg"],
          },
        ],
        title: "generated-image",
      });

      if (path) {
        await writeFile(
          path,
          convertBase64ToBytes(generatedImage!.src.split(",")[1])
        );

        return { aborted: false, path };
      }

      return { path, aborted: true };
    },
    onSuccess: (data) => {
      if (!data.aborted) {
        toast.success(`Image save successfully at ${data.path}`);
      }
    },
    onError: () => {
      toast.error("Error occured while saving the image");
    },
  });
  return (
    <div className="flex flex-col gap-y-6 w-full lg:w-[50%]">
      <div className="flex flex-col gap-y-4 py-2 px-2.5 rounded-lg bg-[#171a17]">
        <p>Prompt</p>
        <Textarea
          placeholder="Describe the image..."
          className="border-none resize-none bg-[#2d2f2f] h-28 rouned-lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex justify-end">
          <Button
            className="bg-gradient-to-br from-violet-800 via-indigo-700 to-indigo-800 cursor-pointer"
            disabled={!input || input.trim().length === 0 || isPending}
            onClick={handleGenerateImage}
          >
            Generate
          </Button>
        </div>
      </div>

      <div className="flex justify-center py-2 px-2.5 rounded-lg bg-[#171a17]">
        {generatedImage ? (
          <div className="relative">
            <img
              src={generatedImage.src}
              alt="Generated Image"
              style={{ aspectRatio: generatedImage.aspectRatio }}
              className="rounded-lg"
            />
            <Button
              className="absolute top-2.5 right-2.5"
              onClick={() => handleSaveImage()}
              disabled={saveImagePending}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 15V3" />
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="m7 10 5 5 5-5" />
              </svg>
            </Button>
          </div>
        ) : (
          <p className="text-gray-300 text-sm">
            No images to show. Type a prompt and click on Generate.
          </p>
        )}
      </div>
    </div>
  );
};

export default MainSection;
