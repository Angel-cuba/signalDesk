import { useCallback, useEffect, useState } from "react";
import {
  createProfile,
  getProfile,
  updateProfile,
} from "../services/profileService";

import { useAuth } from "../context/AuthContext";
import type { Profile, ProfileUpdate } from "../types/profile";

export const useProfile = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (id: string): Promise<Profile> => {
    const existingProfile = await getProfile(id);

    return existingProfile ?? createProfile(id);
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const load = async () => {
      try {
        const result = await fetchProfile(userId);
        setProfile(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    void load();

    return () => {
      setProfile(null);
    };
  }, [userId, fetchProfile]);

  const reloadProfile = useCallback(async () => {
    if (!userId) {
      throw new Error("User is not authenticated");
    }

    try {
      setLoading(true);
      setError(null);

      const result = await fetchProfile(userId);

      setProfile(result);

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reload profile");

      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchProfile]);

  const saveProfile = async (changes: ProfileUpdate) => {
    if (!userId) {
      throw new Error("User is not authenticated");
    }

    try {
      setSaving(true);
      setError(null);

      const updatedProfile = await updateProfile(userId, changes);

      setProfile(updatedProfile);

      return updatedProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");

      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    loading,
    saving,
    error,
    saveProfile,
    reloadProfile,
  };
};
