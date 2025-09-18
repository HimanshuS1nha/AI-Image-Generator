import React from "react";

import { cn } from "@/lib/utils";

import { aspectRatios } from "@/constants/aspect-ratios";

const ConfigSection = ({
  aspectRatio,
  setAspectRatio,
}: {
  aspectRatio: string;
  setAspectRatio: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="flex flex-col gap-y-4 p-3 rounded-lg w-[25%] bg-[#171a17] h-fit">
      <p>Aspect Ratio</p>

      <div className="flex gap-2 items-center flex-wrap">
        {aspectRatios.map((ratio) => {
          return (
            <div
              key={ratio.value}
              className={cn(
                "px-3 py-1.5 rounded-lg flex items-center justify-center border-[0.5px] border-gray-500 cursor-pointer",
                ratio.value === aspectRatio ? "bg-primary" : "bg-black"
              )}
              onClick={() => setAspectRatio(ratio.value)}
            >
              <p className="text-sm">
                {ratio.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConfigSection;
