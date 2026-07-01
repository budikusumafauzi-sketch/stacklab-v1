export const env = {
  get VITE_API_URL(): string {
    const url = import.meta.env.VITE_API_URL;
    if (!url) {
      console.warn("VITE_API_URL is missing in environment variables. Falling back to default.");
      return "http://localhost:8000";
    }
    return url;
  },
  get MODE(): string {
    return import.meta.env.MODE || "development";
  },
  get IS_PROD(): boolean {
    return import.meta.env.PROD;
  },
  get IS_DEV(): boolean {
    return import.meta.env.DEV;
  }
} as const;
