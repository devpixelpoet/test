import { create } from "zustand";

export type ModuleType = "free" | "cube";

export interface Page {
  id: string;
  title: string;
  content: string; // HTML/Markdown
  type: "text" | "code" | "video";
  image?: string;
  questions?: {
    id: string;
    text: string;
    answer: string;
  }[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  type: ModuleType;
  cubeCost: number;
  isSpecial: boolean;
  progress: number; // 0-100
  pages: Page[];
  unlocked: boolean;
}

export interface User {
  id: string;
  username: string;
  role: "user" | "admin";
  cubes: number;
}

export interface GiftCode {
  id: string;
  code: string;
  value: number;
  active: boolean;
}

interface AppState {
  user: User | null;
  modules: Module[];
  giftCodes: GiftCode[];
  login: (username: string, role: "user" | "admin") => void;
  logout: () => void;
  redeemCode: (code: string) => boolean;
  unlockModule: (moduleId: string) => boolean;
  updateModule: (module: Module) => void;
  addModule: (module: Module) => void;
  deleteModule: (moduleId: string) => void;
  updateGiftCode: (code: GiftCode) => void;
  addGiftCode: (code: GiftCode) => void;
  deleteGiftCode: (id: string) => void;
}

const MOCK_PAGES: Page[] = [
  {
    id: "p1",
    title: "Introduction",
    content: "<p>Welcome to the module. This is the first step in your journey.</p>",
    type: "text",
    questions: [
      { id: "q1", text: "What is the flag?", answer: "CTF{welcome}" },
      { id: "q2", text: "What port is SSH?", answer: "22" }
    ]
  },
  {
    id: "p2",
    title: "Basic Enumeration",
    content: "<p>Enumeration is key. Use nmap to scan the target.</p><pre>nmap -sC -sV 10.10.10.10</pre>",
    type: "code",
    questions: [
      { id: "q3", text: "How many ports are open?", answer: "3" }
    ]
  }
];

const INITIAL_MODULES: Module[] = [
  {
    id: "m1",
    title: "Linux Fundamentals",
    description: "Learn the basics of the Linux operating system.",
    type: "free",
    cubeCost: 0,
    isSpecial: false,
    progress: 30,
    pages: MOCK_PAGES,
    unlocked: true,
  },
  {
    id: "m2",
    title: "Web Exploitation I",
    description: "Introduction to common web vulnerabilities.",
    type: "cube",
    cubeCost: 100,
    isSpecial: false,
    progress: 0,
    pages: MOCK_PAGES,
    unlocked: false,
  },
  {
    id: "m3",
    title: "Advanced Penetration",
    description: "Deep dive into network pentesting.",
    type: "cube",
    cubeCost: 500,
    isSpecial: true, // Special module
    progress: 0,
    pages: MOCK_PAGES,
    unlocked: false,
  },
];

const INITIAL_CODES: GiftCode[] = [
  { id: "c1", code: "WELCOME100", value: 100, active: true },
  { id: "c2", code: "HACKER2024", value: 500, active: true },
];

export const useStore = create<AppState>((set, get) => ({
  user: {
    id: "u1",
    username: "Neo",
    role: "user", // Default to user, can login as admin
    cubes: 50,
  },
  modules: INITIAL_MODULES,
  giftCodes: INITIAL_CODES,

  login: (username, role) => set({
    user: { id: "u1", username, role, cubes: 50 }
  }),

  logout: () => set({ user: null }),

  redeemCode: (code) => {
    const state = get();
    const giftCode = state.giftCodes.find(c => c.code === code && c.active);
    if (giftCode) {
      set((state) => ({
        user: state.user ? { ...state.user, cubes: state.user.cubes + giftCode.value } : null,
        // In a real app, we'd mark code as used. For mockup, we leave it active or toggle mock state.
      }));
      return true;
    }
    return false;
  },

  unlockModule: (moduleId) => {
    const state = get();
    const module = state.modules.find(m => m.id === moduleId);
    if (module && state.user && state.user.cubes >= module.cubeCost) {
      set((state) => ({
        user: state.user ? { ...state.user, cubes: state.user.cubes - module.cubeCost } : null,
        modules: state.modules.map(m => m.id === moduleId ? { ...m, unlocked: true } : m)
      }));
      return true;
    }
    return false;
  },

  updateModule: (updatedModule) => set((state) => ({
    modules: state.modules.map(m => m.id === updatedModule.id ? updatedModule : m)
  })),

  addModule: (newModule) => set((state) => ({
    modules: [...state.modules, newModule]
  })),

  deleteModule: (moduleId) => set((state) => ({
    modules: state.modules.filter(m => m.id !== moduleId)
  })),

  updateGiftCode: (updatedCode) => set((state) => ({
    giftCodes: state.giftCodes.map(c => c.id === updatedCode.id ? updatedCode : c)
  })),

  addGiftCode: (newCode) => set((state) => ({
    giftCodes: [...state.giftCodes, newCode]
  })),

  deleteGiftCode: (id) => set((state) => ({
    giftCodes: state.giftCodes.filter(c => c.id !== id)
  })),
}));
