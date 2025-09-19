import { useLayoutEffect, useState } from "react";
import { setTheme } from "@tauri-apps/api/app";
import { invoke } from "@tauri-apps/api/core";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import ConfigSection from "./components/config-section";
import MainSection from "./components/main-section";
import HistorySection from "./components/history-section";

import { aspectRatios } from "./constants/aspect-ratios";

const App = () => {
  const [aspectRatio, setAspectRatio] = useState(aspectRatios[0].value);
  const [input, setInput] = useState("");
  const [generatedImage, setGeneratedImage] = useState<{
    src: string;
    aspectRatio: string;
  }>();

  const { mutate: handleGenerateImage, isPending } = useMutation({
    mutationKey: ["generate-image"],
    mutationFn: async () => {
      const data = await invoke("generate_image", {
        prompt: input,
        aspectRatio,
      });

      return data as string;
    },
    onSuccess: (data) => {
      setGeneratedImage({ src: data, aspectRatio });
    },
    onError: (error: string) => {
      toast.error(error);
    },
  });

  useLayoutEffect(() => {
    setTheme("dark");
  }, []);
  return (
    <div className="flex gap-x-4 px-4 mt-4">
      <ConfigSection
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
      />

      <MainSection
        input={input}
        setInput={setInput}
        generatedImage={generatedImage}
        handleGenerateImage={handleGenerateImage}
        isPending={isPending}
      />

      <HistorySection />
    </div>
  );
};

export default App;
