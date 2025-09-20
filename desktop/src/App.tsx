import { useEffect, useLayoutEffect, useState } from "react";
import { setTheme } from "@tauri-apps/api/app";
import { invoke } from "@tauri-apps/api/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getStore, load } from "@tauri-apps/plugin-store";

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
  const [recentPrompts, setRecentPrompts] = useState<string[]>([]);

  const { mutate: handleGenerateImage, isPending } = useMutation({
    mutationKey: ["generate-image"],
    mutationFn: async () => {
      const data = await invoke("generate_image", {
        prompt: input,
        aspectRatio,
      });

      return data as string;
    },
    onSuccess: async (data) => {
      setGeneratedImage({ src: data, aspectRatio });

      const newRecentPrompts = [input, ...recentPrompts];
      if (newRecentPrompts.length > 3) {
        newRecentPrompts.pop();
      }
      setRecentPrompts(newRecentPrompts);

      setInput("");

      const store = await getStore("recent-prompts.json");
      if (store) {
        await store.set("recentPrompts", newRecentPrompts);
        await store.save();
      }
    },
    onError: (error: string) => {
      toast.error(error);
    },
  });

  const { data } = useQuery({
    queryKey: ["get-recent-prompts"],
    queryFn: async () => {
      const store = await load("recent-prompts.json", {
        autoSave: false,
        defaults: {},
      });

      const data = await store.get<string[]>("recentPrompts");

      return data;
    },
  });

  useLayoutEffect(() => {
    setTheme("dark");
  }, []);

  useEffect(() => {
    if (data) {
      setRecentPrompts(data);
    }
  }, [data]);
  return (
    <div className="flex justify-center mt-4 px-4">
      <div className="flex flex-col lg:flex-row gap-4 max-w-[1200px] w-full justify-center">
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

        <HistorySection recentPrompts={recentPrompts} />
      </div>
    </div>
  );
};

export default App;
