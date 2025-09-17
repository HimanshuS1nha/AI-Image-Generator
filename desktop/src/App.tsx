import { useLayoutEffect } from "react";
import { setTheme } from "@tauri-apps/api/app";

import { Button } from "./components/ui/button";

const App = () => {
  useLayoutEffect(() => {
    setTheme("dark");
  }, []);
  return <Button>Hello</Button>;
};

export default App;
