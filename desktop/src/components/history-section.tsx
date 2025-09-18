const HistorySection = () => {
  const recentPrompts = [
    "Pikachu coming out of a pokeball",
    "A family enjoying at the beach",
    "A car race competition",
  ];
  return (
    <div className="flex flex-col gap-y-4 p-3 rounded-lg w-[25%] bg-[#171a17] h-fit">
      <p>Last 3 Prompts</p>

      <div className="flex flex-col gap-y-2.5">
        {recentPrompts.map((prompt) => {
          return (
            <div key={prompt} className="p-2 rounded-lg bg-[#2d2f2f]">
              <p className="text-sm">{prompt}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistorySection;
