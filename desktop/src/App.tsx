import { useLayoutEffect, useState } from "react";
import { setTheme } from "@tauri-apps/api/app";

import ConfigSection from "./components/config-section";
import MainSection from "./components/main-section";

import { aspectRatios } from "./constants/aspect-ratios";

const App = () => {
  const [aspectRatio, setAspectRatio] = useState(aspectRatios[0].value);
  const [input, setInput] = useState("");
  const [generatedImage, setGeneratedImage] = useState<{
    src: string;
    aspectRatio: string;
  }>();

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
      />
    </div>
  );
};

export default App;
