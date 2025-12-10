import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, getQueryFn } from "./queryClient";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export type User = {
  id: string;
  username: string;
  email?: string;
  role: "user" | "admin";
  cubes: number;
};

export type ModuleType = "free" | "cube";

export type Module = {
  id: string;
  title: string;
  description: string;
  type: ModuleType;
  cubeCost: number;
  isSpecial: boolean;
  imageUrl?: string;
  createdByAdminId?: string;
};

export type Page = {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  type: "text" | "code" | "video";
  image?: string;
  order: number;
};

export type Question = {
  id: string;
  pageId: string;
  text: string;
  answerHash: string;
  cubeReward: number;
  order: number;
};

export type GiftCode = {
  id: string;
  code: string;
  value: number;
  active: boolean;
  usedByUserId?: string;
  usedAt?: string;
};

export type UserProgress = {
  id: string;
  userId: string;
  pageId: string;
  completedAt: string;
};

export type QuestionSolved = {
  id: string;
  userId: string;
  questionId: string;
  solvedAt: string;
};

export function useUser() {
  return useQuery<User | null>({
    queryKey: ["/api/auth/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      return res.json() as Promise<User>;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/auth/me"], user);
      toast({
        title: "Access Granted",
        description: `Welcome back, ${user.username}.`,
      });
      setLocation(user.role === 'admin' ? '/admin' : '/');
    },
    onError: (error: Error) => {
      toast({
        title: "Access Denied",
        description: error.message || "Invalid credentials.",
        variant: "destructive",
      });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (credentials: { username: string; password: string; email: string }) => {
      const res = await apiRequest("POST", "/api/auth/register", credentials);
      return res.json() as Promise<User>;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/auth/me"], user);
      toast({
        title: "Access Granted",
        description: `Welcome, ${user.username}.`,
      });
      setLocation(user.role === 'admin' ? '/admin' : '/');
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout", {});
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/me"], null);
      queryClient.clear();
      setLocation("/login");
    },
  });
}

export function useModules() {
  return useQuery<Module[]>({
    queryKey: ["/api/modules"],
    enabled: true,
  });
}

export function useModule(id: string) {
  return useQuery<Module>({
    queryKey: [`/api/modules/${id}`],
    enabled: !!id,
  });
}

export function useModulePages(moduleId: string) {
  return useQuery<Page[]>({
    queryKey: [`/api/modules/${moduleId}/pages`],
    enabled: !!moduleId,
  });
}

export function usePage(pageId: string) {
  return useQuery<Page>({
    queryKey: [`/api/pages/${pageId}`],
    enabled: !!pageId,
  });
}

export function usePageQuestions(pageId: string) {
  return useQuery<Question[]>({
    queryKey: [`/api/pages/${pageId}/questions`],
    enabled: !!pageId,
  });
}

export function useProgress() {
  return useQuery<{
    completedPages: UserProgress[];
    solvedQuestions: QuestionSolved[];
  }>({
    queryKey: ["/api/progress"],
  });
}

export function useSubmitAnswer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ questionId, answer }: { questionId: string; answer: string }) => {
      const res = await apiRequest("POST", `/api/questions/${questionId}/submit`, { answer });
      return res.json() as Promise<{ message: string; cubesAwarded: number }>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      toast({
        title: "Flag Captured!",
        description: `${data.message} +${data.cubesAwarded} cubes`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Invalid Flag",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useRedeemGiftCode() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (code: string) => {
      const res = await apiRequest("POST", "/api/gift-codes/redeem", { code });
      return res.json() as Promise<{ message: string; value: number }>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Gift Code Redeemed!",
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Redemption Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useGiftCodes() {
  return useQuery<GiftCode[]>({
    queryKey: ["/api/gift-codes"],
  });
}

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["/api/users"],
  });
}

export function useCreateModule() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (module: Partial<Module>) => {
      const res = await apiRequest("POST", "/api/modules", module);
      return res.json() as Promise<Module>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/modules"] });
      toast({
        title: "Module Created",
        description: "The module has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateModule() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Module> }) => {
      await apiRequest("PUT", `/api/modules/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/modules"] });
      toast({
        title: "Module Updated",
        description: "The module has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteModule() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/modules/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/modules"] });
      toast({
        title: "Module Deleted",
        description: "The module has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useCreatePage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (page: Partial<Page>) => {
      const res = await apiRequest("POST", "/api/pages", page);
      return res.json() as Promise<Page>;
    },
    onSuccess: (page) => {
      queryClient.invalidateQueries({ queryKey: [`/api/modules/${page.moduleId}/pages`] });
      toast({
        title: "Page Created",
        description: "The page has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdatePage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Page> }) => {
      await apiRequest("PUT", `/api/pages/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/modules"] });
      toast({
        title: "Page Updated",
        description: "The page has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeletePage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/pages/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/modules"] });
      toast({
        title: "Page Deleted",
        description: "The page has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (question: Partial<Question> & { answer: string }) => {
      const res = await apiRequest("POST", "/api/questions", question);
      return res.json() as Promise<Question>;
    },
    onSuccess: (question) => {
      queryClient.invalidateQueries({ queryKey: [`/api/pages/${question.pageId}/questions`] });
      toast({
        title: "Question Created",
        description: "The question has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Question> & { answer?: string } }) => {
      await apiRequest("PUT", `/api/questions/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      toast({
        title: "Question Updated",
        description: "The question has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/questions/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      toast({
        title: "Question Deleted",
        description: "The question has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useCreateGiftCode() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (giftCode: Partial<GiftCode>) => {
      const res = await apiRequest("POST", "/api/gift-codes", giftCode);
      return res.json() as Promise<GiftCode>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gift-codes"] });
      toast({
        title: "Gift Code Created",
        description: "The gift code has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateGiftCode() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<GiftCode> }) => {
      await apiRequest("PUT", `/api/gift-codes/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gift-codes"] });
      toast({
        title: "Gift Code Updated",
        description: "The gift code has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteGiftCode() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/gift-codes/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gift-codes"] });
      toast({
        title: "Gift Code Deleted",
        description: "The gift code has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
