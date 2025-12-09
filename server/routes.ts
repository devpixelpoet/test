import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";
import {
  insertUserSchema,
  insertModuleSchema,
  insertPageSchema,
  insertQuestionSchema,
  insertGiftCodeSchema,
} from "@shared/schema";
import { fromError } from "zod-validation-error";

const PgSession = connectPgSimple(session);

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });

  app.use(
    session({
      store: new PgSession({
        pool,
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || "hackthebox-secret-key-change-in-prod",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username or password" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return done(null, false, { message: "Incorrect username or password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  const isAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  const isAdmin = (req: any, res: any, next: any) => {
    if (req.isAuthenticated() && req.user?.role === "admin") {
      return next();
    }
    res.status(403).json({ message: "Forbidden" });
  };

  app.post("/api/auth/register", async (req, res) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: fromError(result.error).toString() });
      }

      const { username, password, email, role } = result.data;

      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userRole = username.toLowerCase().includes("admin") ? "admin" : (role || "user");

      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        role: userRole,
      });

      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error logging in after registration" });
        }
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    const { password: _, ...userWithoutPassword } = req.user as any;
    res.json(userWithoutPassword);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", isAuthenticated, (req, res) => {
    const { password: _, ...userWithoutPassword } = req.user as any;
    res.json(userWithoutPassword);
  });

  app.get("/api/modules", isAuthenticated, async (req, res) => {
    try {
      const modules = await storage.getAllModules();
      res.json(modules);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/modules/:id", isAuthenticated, async (req, res) => {
    try {
      const module = await storage.getModule(req.params.id);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      res.json(module);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/modules", isAdmin, async (req, res) => {
    try {
      const result = insertModuleSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: fromError(result.error).toString() });
      }

      const module = await storage.createModule(result.data);
      res.status(201).json(module);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/modules/:id", isAdmin, async (req, res) => {
    try {
      await storage.updateModule(req.params.id, req.body);
      res.json({ message: "Module updated successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/modules/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteModule(req.params.id);
      res.json({ message: "Module deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/modules/:id/pages", isAuthenticated, async (req, res) => {
    try {
      const pages = await storage.getPagesByModuleId(req.params.id);
      res.json(pages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/pages/:id", isAuthenticated, async (req, res) => {
    try {
      const page = await storage.getPage(req.params.id);
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.json(page);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/pages", isAdmin, async (req, res) => {
    try {
      const result = insertPageSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: fromError(result.error).toString() });
      }

      const page = await storage.createPage(result.data);
      res.status(201).json(page);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/pages/:id", isAdmin, async (req, res) => {
    try {
      await storage.updatePage(req.params.id, req.body);
      res.json({ message: "Page updated successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/pages/:id", isAdmin, async (req, res) => {
    try {
      await storage.deletePage(req.params.id);
      res.json({ message: "Page deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/pages/:id/questions", isAuthenticated, async (req, res) => {
    try {
      const questions = await storage.getQuestionsByPageId(req.params.id);
      res.json(questions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/questions", isAdmin, async (req, res) => {
    try {
      const result = insertQuestionSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: fromError(result.error).toString() });
      }

      const question = await storage.createQuestion(result.data);
      res.status(201).json(question);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/questions/:id", isAdmin, async (req, res) => {
    try {
      await storage.updateQuestion(req.params.id, req.body);
      res.json({ message: "Question updated successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/questions/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteQuestion(req.params.id);
      res.json({ message: "Question deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/questions/:id/submit", isAuthenticated, async (req, res) => {
    try {
      const { answer } = req.body;
      const questionId = req.params.id;
      const userId = (req.user as any).id;

      const question = await storage.getQuestion(questionId);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }

      const alreadySolved = await storage.isQuestionSolved(userId, questionId);
      if (alreadySolved) {
        return res.status(400).json({ message: "Question already solved" });
      }

      const isCorrect = await bcrypt.compare(answer, question.answerHash);
      if (!isCorrect) {
        return res.status(400).json({ message: "Incorrect answer" });
      }

      await storage.markQuestionSolved({ userId, questionId });

      const user = await storage.getUser(userId);
      if (user && question.cubeReward > 0) {
        await storage.updateUserCubes(userId, user.cubes + question.cubeReward);
      }

      res.json({ 
        message: "Correct answer!", 
        cubesAwarded: question.cubeReward 
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/progress", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const progress = await storage.getUserProgress(userId);
      const solvedQuestions = await storage.getSolvedQuestions(userId);
      
      res.json({
        completedPages: progress,
        solvedQuestions
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/gift-codes", isAdmin, async (req, res) => {
    try {
      const giftCodes = await storage.getAllGiftCodes();
      res.json(giftCodes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/gift-codes", isAdmin, async (req, res) => {
    try {
      const result = insertGiftCodeSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: fromError(result.error).toString() });
      }

      const giftCode = await storage.createGiftCode(result.data);
      res.status(201).json(giftCode);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/gift-codes/:id", isAdmin, async (req, res) => {
    try {
      await storage.updateGiftCode(req.params.id, req.body);
      res.json({ message: "Gift code updated successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/gift-codes/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteGiftCode(req.params.id);
      res.json({ message: "Gift code deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/gift-codes/redeem", isAuthenticated, async (req, res) => {
    try {
      const { code } = req.body;
      const userId = (req.user as any).id;

      const giftCode = await storage.redeemGiftCode(code, userId);
      res.json({ 
        message: `Gift code redeemed! ${giftCode.value} cubes added.`,
        value: giftCode.value 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/users", isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  return httpServer;
}
