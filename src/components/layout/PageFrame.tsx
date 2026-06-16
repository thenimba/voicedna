import { ReactNode } from "react";
import { Waveform } from "@/components/interview/Waveform";

interface Props {
  children: ReactNode;
  /** Mono tag on the top-left, after the mini waveform mark. */
  protocolTag?: string;
  /** Mono tag on the top-right of the frame. */
  roomTag?: string;
  /** Status line on the bottom-left of the frame. */
  status?: string;
  /** Mono caption on the bottom-right of the frame. */
  ref?: string;
  /** Hide the outer paper padding (used by Interview, which fills the screen). */
  flush?: boolean;
}

/**
 * Galley Proof page chrome: a framed editorial card with a mono marginalia
 * top bar and a status footer. Shared across Landing, Onboarding, Interview,
 * and Completion so every surface reads as a page from the same magazine.
 */
export const PageFrame = ({
  children,
  protocolTag = "VoiceDNA / Protocol 02",
  roomTag = "The Interview Room",
  status = "Secure Interview Protocol Active",
  ref: refLabel = "© VoiceDNA Labs",
  flush = false,
}: Props) => {
  return (
    <div
      className={`min-h-screen w-full bg-vd-paper flex items-stretch justify-center ${
        flush ? "p-0" : "p-4 md:p-8 lg:p-10"
      }`}
    >
      <div
        className={`w-full ${
          flush ? "" : "max-w-7xl"
        } bg-vd-surface border border-vd-border flex flex-col relative`}
      >
        {/* Top marginalia bar */}
        <header className="flex items-center justify-between px-5 md:px-6 py-3.5 border-b border-vd-border">
          <div className="flex items-center gap-3 min-w-0">
            <Waveform
              barCount={5}
              maxHeight={14}
              className="opacity-90 shrink-0"
            />
            <span className="font-mono-label text-[10px] tracking-[0.16em] text-vd-t3 truncate">
              {protocolTag}
            </span>
          </div>
          <span className="font-mono-label text-[10px] tracking-[0.16em] text-vd-t1 font-medium uppercase shrink-0 pl-3">
            {roomTag}
          </span>
        </header>

        {/* Body */}
        <div className="flex-1 flex flex-col">{children}</div>

        {/* Footer status */}
        <footer className="px-5 md:px-6 py-3.5 border-t border-vd-border flex items-center justify-between bg-vd-paper">
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-vd-green opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-vd-green" />
            </span>
            <span className="font-mono-label text-[10px] tracking-[0.12em] text-vd-t2 uppercase truncate">
              {status}
            </span>
          </div>
          <span className="font-mono-label text-[10px] tracking-[0.12em] text-vd-t3 uppercase shrink-0 pl-3 hidden sm:inline">
            {refLabel}
          </span>
        </footer>
      </div>
    </div>
  );
};
