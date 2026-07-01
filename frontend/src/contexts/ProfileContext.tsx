import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ProfileData {
  photo: string | null;
  fullName: string;
  title: string;
  email: string;
  bio: string;
  location: string;
  github: string;
  linkedin: string;
  website: string;
  skills: string[];
}

export const DEFAULT_PROFILE: ProfileData = {
  photo: null,
  fullName: "Developer",
  title: "Software Engineer",
  email: "dev@example.com",
  bio: "Passionate developer building awesome tools.",
  location: "San Francisco, CA",
  github: "",
  linkedin: "",
  website: "",
  skills: ["React", "TypeScript", "Node.js"],
};

const STORAGE_KEY = "stacklab_profile_data";

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (updates: Partial<ProfileData>) => void;
  saveProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse profile data from local storage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const updateProfile = (updates: Partial<ProfileData>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const saveProfile = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  };

  if (!isLoaded) return null; // Or a loading spinner

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, saveProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
