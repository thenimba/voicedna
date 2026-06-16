import { supabase } from "@/integrations/supabase/client";
import type { InterviewState, QAPair } from "./interview-store";
import { getCurrentUserId, ensureAnonymousUser } from "./auth";

let pushTimer: ReturnType<typeof setTimeout> | null = null;
let draftTimer: ReturnType<typeof setTimeout> | null = null;

export type SyncStatus = "idle" | "syncing" | "synced" | "error" | "offline";

type Listener = (status: SyncStatus, at: number) => void;
const listeners = new Set<Listener>();

function emit(status: SyncStatus) {
  listeners.forEach((l) => l(status, Date.now()));
}

export function onSyncStatus(l: Listener): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

function stateToRow(state: InterviewState, userId: string) {
  return {
    user_id: userId,
    user_name: state.userName,
    mode: state.mode,
    status: state.status,
    current_category_index: state.currentCategoryIndex,
    current_question_in_category: state.currentQuestionInCategory,
    total_questions_answered: state.totalQuestionsAnswered,
    current_question: state.currentQuestion,
    is_follow_up: state.isFollowUp,
    follow_up_count: state.followUpCount,
    qa_pairs: state.qaPairs as unknown as import("@/integrations/supabase/types").Json,
    last_synced_at: new Date().toISOString(),
  };
}

function rowToState(row: any): InterviewState {
  return {
    userName: row.user_name ?? "",
    mode: row.mode ?? "quick-profile",
    currentCategoryIndex: row.current_category_index ?? 0,
    currentQuestionInCategory: row.current_question_in_category ?? 0,
    totalQuestionsAnswered: row.total_questions_answered ?? 0,
    qaPairs: (row.qa_pairs as QAPair[]) ?? [],
    currentQuestion: row.current_question ?? "",
    isFollowUp: !!row.is_follow_up,
    followUpCount: row.follow_up_count ?? 0,
    status: row.status ?? "not_started",
  };
}

/** Push state to Cloud (debounced 500ms). Ensures anonymous user exists first. */
export function schedulePush(state: InterviewState) {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => void pushNow(state), 500);
}

export async function pushNow(state: InterviewState) {
  try {
    emit("syncing");
    const uid = await ensureAnonymousUser();
    const { error } = await supabase
      .from("interview_sessions")
      .upsert(stateToRow(state, uid), { onConflict: "user_id" });
    if (error) throw error;
    emit("synced");
  } catch (e) {
    console.warn("[sync] push failed", e);
    emit("error");
  }
}

/** Push only the draft (in-progress textarea) — debounced 2s. */
export function scheduleDraftPush(draft: string) {
  if (draftTimer) clearTimeout(draftTimer);
  draftTimer = setTimeout(async () => {
    try {
      const uid = await getCurrentUserId();
      if (!uid) return;
      await supabase
        .from("interview_sessions")
        .update({ draft_answer: draft, last_synced_at: new Date().toISOString() })
        .eq("user_id", uid);
    } catch (e) {
      console.warn("[sync] draft push failed", e);
    }
  }, 2000);
}

/** Fetch session for the current user. Returns null if none. */
export async function pullSession(): Promise<{
  state: InterviewState;
  draft: string;
} | null> {
  const uid = await getCurrentUserId();
  if (!uid) return null;
  const { data, error } = await supabase
    .from("interview_sessions")
    .select("*")
    .eq("user_id", uid)
    .maybeSingle();
  if (error || !data) return null;
  return { state: rowToState(data), draft: data.draft_answer ?? "" };
}

/** Delete the current user's session (used by "Start new"). */
export async function deleteSession() {
  const uid = await getCurrentUserId();
  if (!uid) return;
  await supabase.from("interview_sessions").delete().eq("user_id", uid);
}
