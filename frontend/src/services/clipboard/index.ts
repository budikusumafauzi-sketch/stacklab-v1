import { notificationService } from "../notification";

export const clipboard = {
  copy: async (text: string, silent = false) => {
    try {
      await navigator.clipboard.writeText(text);
      if (!silent) {
        notificationService.success("Copied to clipboard");
      }
      return true;
    } catch {
      notificationService.error("Failed to copy to clipboard");
      return false;
    }
  },
  paste: async () => {
    try {
      return await navigator.clipboard.readText();
    } catch {
      notificationService.error("Failed to read from clipboard");
      return "";
    }
  }
};
