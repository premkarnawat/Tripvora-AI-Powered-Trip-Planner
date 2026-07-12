"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function loginUser(email: string, password: string, clientRedirectTo: string | null) {
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

  let destination = "/dashboard";
  if (clientRedirectTo && clientRedirectTo.startsWith("/") && !clientRedirectTo.startsWith("//")) {
    destination = clientRedirectTo;
  } else if (targetRole === "admin" || targetRole === "super_admin") {
    destination = "/admin";
  } else if (targetRole === "agency") {
    destination = "/agency";
  }

  redirect(destination);
}
