import React from "react";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const MainSection = ({
  input,
  setInput,
  generatedImage,
}: {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  generatedImage: { src: string; aspectRatio: string } | undefined;
}) => {
  return (
    <div className="flex flex-col gap-y-6 w-[50%]">
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
            disabled={!input || input.trim().length === 0}
          >
            Generate
          </Button>
        </div>
      </div>

      <div className="flex justify-center py-2 px-2.5 rounded-lg bg-[#171a17]">
        {generatedImage ? (
          <img
            src={generatedImage.src}
            alt="Generated Image"
            style={{ aspectRatio: generatedImage.aspectRatio }}
          />
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
