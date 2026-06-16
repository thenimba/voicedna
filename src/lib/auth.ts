import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export interface Profile {
  id: string;
  display_name: string | null;
  session_code: string;
  is_claimed: boolean;
}

/** Ensure the visitor has an auth session. Creates an anonymous one if not. */
export async function ensureAnonymousUser(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  if (data.session?.user) return data.session.user.id;

  const { data: anon, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  if (!anon.user) throw new Error("Anonymous sign-in returned no user");
  return anon.user.id;
}

export async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id ?? null;
}

export async function isAnonymous(): Promise<boolean> {
  const { data } = await supabase.auth.getUser();
  // Anonymous users have no email and is_anonymous flag
  return Boolean(data.user && !data.user.email);
}

export async function getProfile(): Promise<Profile | null> {
  const { data: session } = await supabase.auth.getSession();
  const uid = session.session?.user?.id;
  if (!uid) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, session_code, is_claimed")
    .eq("id", uid)
    .maybeSingle();
  if (error) return null;
  return data as Profile | null;
}

export async function updateDisplayName(name: string): Promise<void> {
  const uid = await getCurrentUserId();
  if (!uid) return;
  await supabase.from("profiles").update({ display_name: name }).eq("id", uid);
}

/** Convert an anonymous account into a permanent one with email + password. */
export async function claimWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.updateUser({ email, password });
  if (error) throw error;
  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: window.location.origin },
  });
  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  const result = await lovable.auth.signInWithOAuth("google", {
    redirect_uri: window.location.origin,
  });
  return result;
}

export async function signOut() {
  await supabase.auth.signOut();
}
