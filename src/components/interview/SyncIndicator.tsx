import { useEffect, useState } from "react";
import { Check, Loader2, AlertCircle, Copy } from "lucide-react";
import { onSyncStatus, type SyncStatus } from "@/lib/interview-sync";
import { getProfile, type Profile } from "@/lib/auth";
import { toast } from "sonner";

export const SyncIndicator = () => {
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    getProfile().then(setProfile);
    return onSyncStatus((s) => setStatus(s));
  }, []);

  const copyCode = async () => {
    if (!profile?.session_code) return;
    await navigator.clipboard.writeText(profile.session_code);
    toast.success("Session code copied");
  };

  const icon = {
    idle: null,
    syncing: <Loader2 className="w-3 h-3 animate-spin" />,
    synced: <Check className="w-3 h-3 text-vd-green" />,
    error: <AlertCircle className="w-3 h-3 text-vd-amber" />,
    offline: <AlertCircle className="w-3 h-3 text-vd-t3" />,
  }[status];

  const label = {
    idle: "Ready",
    syncing: "Syncing…",
    synced: "Synced",
    error: "Retry pending",
    offline: "Offline",
  }[status];

  return (
    <div className="flex items-center gap-3">
      {profile?.session_code && (
        <button
          onClick={copyCode}
          title="Copy session code"
          className="font-mono-label text-[10px] tracking-[0.14em] text-vd-t3 hover:text-vd-t1 transition-colors flex items-center gap-1.5"
        >
          {profile.session_code}
          <Copy className="w-3 h-3" />
        </button>
      )}
      <span className="font-mono-label text-[10px] tracking-[0.14em] text-vd-t3 flex items-center gap-1.5">
        {icon}
        {label}
      </span>
    </div>
  );
};
