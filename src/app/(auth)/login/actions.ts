"use server";

import { createClient } from "@/lib/supabase/server";

export async function loginUser(email: string, password: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data?.user) {
    return { error: error?.message || "Authentication failed." };
  }

  // Get user role
  let targetRole = "traveler";
  try {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", data.user.id)
      .single();

    targetRole = profile?.role || data.user.user_metadata?.role || "traveler";
  } catch {
    targetRole = data.user.user_metadata?.role || "traveler";
  }

  return { success: true, role: targetRole };
}
