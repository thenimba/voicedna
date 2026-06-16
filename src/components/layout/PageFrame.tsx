import { ReactNode } from "react";
import { Waveform } from "@/components/interview/Waveform";
import { LangToggle } from "@/components/LangToggle";
import { useT } from "@/lib/i18n";

interface Props {
  children: ReactNode;
  protocolTag?: string;
  roomTag?: string;
  status?: string;
  refLabel?: string;
  flush?: boolean;
}

export const PageFrame = ({
  children,
  protocolTag,
  roomTag,
  status,
  refLabel,
  flush = false,
}: Props) => {
  const { t } = useT();
  const _protocol = protocolTag ?? t("frame.protocol.default");
  const _room = roomTag ?? t("frame.room");
  const _status = status ?? t("frame.status");
  const _ref = refLabel ?? t("frame.ref.default");

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
        <header className="flex items-center justify-between px-5 md:px-6 py-3.5 border-b border-vd-border gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Waveform
              barCount={5}
              maxHeight={14}
              className="opacity-90 shrink-0"
            />
            <span className="font-mono-label text-[10px] tracking-[0.16em] text-vd-t3 truncate">
              {_protocol}
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-mono-label text-[10px] tracking-[0.16em] text-vd-t1 font-medium uppercase hidden sm:inline">
              {_room}
            </span>
            <LangToggle />
          </div>
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
              {_status}
            </span>
          </div>
          <span className="font-mono-label text-[10px] tracking-[0.12em] text-vd-t3 uppercase shrink-0 pl-3 hidden sm:inline">
            {_ref}
          </span>
        </footer>
      </div>
    </div>
  );
};
