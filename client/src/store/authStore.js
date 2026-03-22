import { create } from "zustand";

const useAuthStore = create((set) => ({
  user:   JSON.parse(localStorage.getItem("user"))  || null,
  token:  localStorage.getItem("token")             || null,
  accent: localStorage.getItem("accent")            || "earthy",
  mode:   localStorage.getItem("mode")              || "earthy",

  login: (userData) => {
    localStorage.setItem("user",  JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
    set({ user: userData, token: userData.token });
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  setAccent: (accent) => {
    localStorage.setItem("accent", accent);
    set({ accent });
  },

  setMode: (mode) => {
    localStorage.setItem("mode", mode);
    set({ mode });
  },
}));

export default useAuthStore;