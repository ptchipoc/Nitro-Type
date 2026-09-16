export const VirtualKeyboard = ({ activeKey }: { activeKey: string }) => {
  const rows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ç"],
    ["z", "x", "c", "v", "b", "n", "m", ",", "."],
  ];

  return (
    <div className="relative w-full max-w-3xl mx-auto select-none mt-8 h-[200px]">
      <div className="space-y-2 relative z-10">
        {rows.map((row, rIdx) => (
          <div
            key={`row-${rIdx}`}
            className={`flex justify-center gap-1 ${rIdx === 1 ? "ml-4" : rIdx === 2 ? "ml-8" : ""}`}
          >
            {row.map((key) => {
              const isActive = activeKey.toLowerCase() === key.toLowerCase();
              return (
                <div
                  key={`key-${key}`}
                  className={`w-12 h-12 rounded-lg border transition-all flex items-center justify-center font-mono text-sm shadow-sm ${
                    isActive
                      ? "bg-primary border-primary text-primary-foreground scale-110 z-10 shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                      : "bg-card/40 border-border text-muted-foreground"
                  }`}
                >
                  {key.toUpperCase()}
                </div>
              );
            })}
          </div>
        ))}
        {/* Space bar */}
        <div className="flex justify-center mt-2">
          <div
            className={`w-64 h-12 rounded-lg border transition-all flex items-center justify-center font-mono text-sm shadow-sm ${
              activeKey === " "
                ? "bg-primary border-primary text-primary-foreground scale-105 z-10"
                : "bg-card/40 border-border text-muted-foreground"
            }`}
          >
            SPACE
          </div>
        </div>
      </div>
    </div>
  );
};
