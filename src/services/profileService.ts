import { supabaseClient } from "../lib/supabase";
import { Profile, ProfileUpdate } from "../types/profile";

export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as Profile | null;
};

export const createProfile = async (userId: string): Promise<Profile> => {
  const { data, error } = await supabaseClient
    .from("profiles")
    .insert({
      id: userId,
      display_name: "",
      risk_profile: "balanced",
      watchlist: [],
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Profile;
};

export const updateProfile = async (
  userId: string,
  changes: ProfileUpdate,
): Promise<Profile> => {
  const { data, error } = await supabaseClient
    .from("profiles")
    .update({
      ...changes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Profile;
};
