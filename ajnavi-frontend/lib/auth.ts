export type AjnaviProfile = {
  name: string;
  gender: string;
  country: string;
  bio: string;
  interests: string[];
  over18: boolean;
};

const EMAIL_KEY = "ajnavi_email";
const PROFILE_KEY = "ajnavi_profile";

export const getDefaultProfile = (email?: string | null): AjnaviProfile => {
  const defaultName = email ? email.split("@")[0] : "Stranger";
  return {
    name: defaultName,
    gender: "prefer-not-to-say",
    country: "India",
    bio: "",
    interests: ["Music", "Tech"],
    over18: true,
  };
};

export const authStore = {
  getEmail: () => typeof window === "undefined" ? null : localStorage.getItem(EMAIL_KEY),
  setEmail: (email: string) => localStorage.setItem(EMAIL_KEY, email),
  getProfile: (): AjnaviProfile | null => {
    if (typeof window === "undefined") return null;
    const value = localStorage.getItem(PROFILE_KEY);
    if (!value) return null;
    try { return JSON.parse(value) as AjnaviProfile; } catch { return null; }
  },
  setProfile: (profile: AjnaviProfile) => localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)),
  clear: () => { localStorage.removeItem(EMAIL_KEY); localStorage.removeItem(PROFILE_KEY); },
};

export const isCompleteProfile = (profile: AjnaviProfile | null) => Boolean(
  profile?.name?.trim() && profile.gender && profile.country && profile.interests?.length && profile.over18,
);
