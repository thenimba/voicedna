import { cn } from "@/lib/utils";

interface Props {
  barCount?: number;
  maxHeight?: number;
  className?: string;
}

export const Waveform = ({ barCount = 20, maxHeight = 40, className }: Props) => {
  // Generate deterministic bar heights that look like a waveform
  const heights = Array.from({ length: barCount }, (_, i) => {
    const center = barCount / 2;
    const distFromCenter = Math.abs(i - center) / center;
    const base = (1 - distFromCenter * 0.7) * maxHeight;
    // Add some variation
    const variation = Math.sin(i * 1.7) * maxHeight * 0.25;
    return Math.max(8, Math.min(maxHeight, base + variation));
  });

  return (
    <div className={cn("flex items-end justify-center gap-[3px]", className)}>
      {heights.map((h, i) => {
        const opacity = 0.4 + (h / maxHeight) * 0.6;
        return (
          <div
            key={i}
            className="w-[3px] rounded-full bg-vd-accent"
            style={{ height: `${h}px`, opacity }}
          />
        );
      })}
    </div>
  );
};
