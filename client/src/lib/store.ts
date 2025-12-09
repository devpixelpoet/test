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

const MOCK_PAGES_LINUX: Page[] = [
  {
    id: "p1",
    title: "Introduction to Linux",
    content: "<p>Linux is a family of open-source Unix-like operating systems based on the Linux kernel.</p>",
    type: "text",
    questions: [
      { id: "q1", text: "Who created Linux?", answer: "Linus Torvalds" }
    ]
  },
  {
    id: "p2",
    title: "File System Hierarchy",
    content: "<p>Everything in Linux is a file. The root directory is represented by /.</p>",
    type: "text",
    questions: [
      { id: "q2", text: "Which directory contains configuration files?", answer: "/etc" }
    ]
  }
];

const MOCK_PAGES_WEB: Page[] = [
  {
    id: "p3",
    title: "Understanding HTTP",
    content: "<p>HTTP is the foundation of data communication for the World Wide Web.</p>",
    type: "text",
    questions: [
      { id: "q3", text: "What port does HTTP use by default?", answer: "80" }
    ]
  },
  {
    id: "p4",
    title: "SQL Injection",
    content: "<p>SQL injection is a code injection technique that might destroy your database.</p><pre>SELECT * FROM users WHERE name = '' OR '1'='1';</pre>",
    type: "code",
    questions: [
      { id: "q4", text: "What character is often used to start an injection?", answer: "'" }
    ]
  }
];

const MOCK_PAGES_ADVANCED: Page[] = [
  {
    id: "p5",
    title: "Buffer Overflow",
    content: "<p>A buffer overflow occurs when a program writes more data to a buffer than it can hold.</p>",
    type: "text",
    questions: [
      { id: "q5", text: "What memory segment stores local variables?", answer: "Stack" }
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
    pages: MOCK_PAGES_LINUX,
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
    pages: MOCK_PAGES_WEB,
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
    pages: MOCK_PAGES_ADVANCED,
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
