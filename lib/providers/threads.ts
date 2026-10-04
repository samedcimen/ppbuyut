import "server-only";
import { instagram } from "./instagram";
import type { Provider } from "./types";

const NOTE = "Threads, Instagram hesabının profil fotoğrafını kullanır; fotoğraf Instagram'dan alındı.";

// Threads pages send every logged-out request (bots included) to a login wall.
// A Threads profile is an Instagram account with the same username and photo.
export const threads: Provider = {
  id: "threads",
  async fetchAvatar(username) {
    const result = await instagram.fetchAvatar(username);
    return { ...result, note: result.note ?? NOTE };
  },
};
