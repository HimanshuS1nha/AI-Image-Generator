import { useLayoutEffect, useState } from "react";
import { setTheme } from "@tauri-apps/api/app";

import ConfigSection from "./components/config-section";

import { aspectRatios } from "./constants/aspect-ratios";

const App = () => {
  const [aspectRatio, setAspectRatio] = useState(aspectRatios[0].value);

  useLayoutEffect(() => {
    setTheme("dark");
  }, []);
  return (
    <div className="flex gap-x-4 px-4 mt-4">
      <ConfigSection
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
      />
    </div>
  );
};

export default App;
