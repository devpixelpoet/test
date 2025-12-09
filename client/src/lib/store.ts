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
    cubeReward?: number;
    solved?: boolean;
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
  imageUrl?: string;
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
  redeemCode: (code: string) => number; // Returns value redeemed, or 0 if failed
  unlockModule: (moduleId: string) => boolean;
  updateModule: (module: Module) => void;
  addModule: (module: Module) => void;
  deleteModule: (moduleId: string) => void;
  updateGiftCode: (code: GiftCode) => void;
  addGiftCode: (code: GiftCode) => void;
  deleteGiftCode: (id: string) => void;
  solveQuestion: (moduleId: string, pageId: string, questionId: string) => number; // Returns cubes earned
}

const MOCK_PAGES_LINUX: Page[] = [
  {
    id: "p1",
    title: "Introduction to Linux",
    content: "<p>Linux is a family of open-source Unix-like operating systems based on the Linux kernel.</p>",
    type: "text",
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=1000",
    questions: [
      { id: "q1", text: "Who created Linux?", answer: "Linus Torvalds", cubeReward: 10, solved: false }
    ]
  },
  {
    id: "p2",
    title: "File System Hierarchy",
    content: "<p>Everything in Linux is a file. The root directory is represented by /.</p>",
    type: "text",
    questions: [
      { id: "q2", text: "Which directory contains configuration files?", answer: "/etc", cubeReward: 15, solved: false }
    ]
  }
];

const MOCK_PAGES_WEB: Page[] = [
  {
    id: "p3",
    title: "Understanding HTTP",
    content: "<p>HTTP is the foundation of data communication for the World Wide Web.</p>",
    type: "text",
    image: "https://images.unsplash.com/photo-1558494949-ef526b0042a0?auto=format&fit=crop&q=80&w=1000",
    questions: [
      { id: "q3", text: "What port does HTTP use by default?", answer: "80", cubeReward: 10, solved: false }
    ]
  },
  {
    id: "p4",
    title: "SQL Injection",
    content: "<p>SQL injection is a code injection technique that might destroy your database.</p><pre>SELECT * FROM users WHERE name = '' OR '1'='1';</pre>",
    type: "code",
    questions: [
      { id: "q4", text: "What character is often used to start an injection?", answer: "'", cubeReward: 25, solved: false }
    ]
  }
];

const MOCK_PAGES_ADVANCED: Page[] = [
  {
    id: "p5",
    title: "Buffer Overflow",
    content: "<p>A buffer overflow occurs when a program writes more data to a buffer than it can hold.</p>",
    type: "text",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000",
    questions: [
      { id: "q5", text: "What memory segment stores local variables?", answer: "Stack", cubeReward: 50, solved: false }
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
    imageUrl: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?auto=format&fit=crop&q=80&w=600"
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
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600"
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
    imageUrl: "https://images.unsplash.com/photo-1563206767-5b1d97299337?auto=format&fit=crop&q=80&w=600"
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
        // Mock mark as used
        giftCodes: state.giftCodes.map(c => c.id === giftCode.id ? { ...c, active: false } : c)
      }));
      return giftCode.value;
    }
    return 0;
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

  solveQuestion: (moduleId, pageId, questionId) => {
    const state = get();
    const moduleIndex = state.modules.findIndex(m => m.id === moduleId);
    if (moduleIndex === -1) return 0;
    
    const module = state.modules[moduleIndex];
    const pageIndex = module.pages.findIndex(p => p.id === pageId);
    if (pageIndex === -1) return 0;
    
    const page = module.pages[pageIndex];
    const questionIndex = page.questions?.findIndex(q => q.id === questionId);
    if (questionIndex === undefined || questionIndex === -1) return 0;
    
    const question = page.questions![questionIndex];
    if (question.solved) return 0; // Already solved

    const reward = question.cubeReward || 0;

    // Update state to mark solved and award cubes
    const newModules = [...state.modules];
    newModules[moduleIndex].pages[pageIndex].questions![questionIndex].solved = true;

    set((state) => ({
       modules: newModules,
       user: state.user ? { ...state.user, cubes: state.user.cubes + reward } : null
    }));

    return reward;
  }
}));
