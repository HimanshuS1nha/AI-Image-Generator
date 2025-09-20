const HistorySection = ({ recentPrompts }: { recentPrompts: string[] }) => {
  return (
    <div className="flex flex-col gap-y-4 p-3 rounded-lg w-full lg:w-[25%] border-[0.5px] border-gray-500 bg-[#111311] h-fit">
      <p>Last 3 Prompts</p>

      <div className="flex flex-col gap-y-2">
        {recentPrompts.length > 0 ? (
          recentPrompts.map((prompt) => {
            return (
              <div key={prompt} className="p-2.5 rounded-lg bg-[#2d2f2f]">
                <p className="text-sm">{prompt}</p>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-rose-300">No data to show</p>
        )}
      </div>
    </div>
  );
};

export default HistorySection;
