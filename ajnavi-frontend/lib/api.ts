export const getApiUrl = (): string => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname && hostname !== "localhost" && hostname !== "127.0.0.1") {
      return `${window.location.protocol}//${hostname}:4000`;
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
};
