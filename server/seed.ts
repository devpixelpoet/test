import bcrypt from "bcryptjs";
import { storage } from "./storage";

async function seed() {
  try {
    console.log("🌱 Starting database seeding...");

    console.log("Creating admin user...");
    const hashedAdminPassword = await bcrypt.hash("admin123", 10);
    const admin = await storage.createUser({
      username: "admin",
      email: "admin@hackthebox.local",
      password: hashedAdminPassword,
      role: "admin",
    });
    console.log("✅ Admin user created:", admin.username);

    console.log("Creating test user...");
    const hashedUserPassword = await bcrypt.hash("test123", 10);
    const testUser = await storage.createUser({
      username: "neo",
      email: "neo@hackthebox.local",
      password: hashedUserPassword,
      role: "user",
    });
    await storage.updateUserCubes(testUser.id, 50);
    console.log("✅ Test user created:", testUser.username);

    console.log("Creating modules...");
    const linuxModule = await storage.createModule({
      title: "Linux Fundamentals",
      description: "Master the essential Linux commands and file system navigation. Perfect for beginners starting their cybersecurity journey.",
      type: "linux",
      cubeCost: 0,
      isSpecial: false,
      imageUrl: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop",
      createdByAdminId: admin.id,
    });
    console.log("✅ Module created:", linuxModule.title);

    const webModule = await storage.createModule({
      title: "Web Exploitation I",
      description: "Learn web application vulnerabilities including XSS, SQL injection, and CSRF. Understand how hackers exploit web apps.",
      type: "web",
      cubeCost: 100,
      isSpecial: false,
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop",
      createdByAdminId: admin.id,
    });
    console.log("✅ Module created:", webModule.title);

    const pentestModule = await storage.createModule({
      title: "Advanced Penetration Testing",
      description: "Advanced red team techniques, privilege escalation, and lateral movement. For experienced hackers only.",
      type: "pentest",
      cubeCost: 500,
      isSpecial: true,
      imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop",
      createdByAdminId: admin.id,
    });
    console.log("✅ Module created:", pentestModule.title);

    console.log("Creating pages for Linux Fundamentals...");
    const page1 = await storage.createPage({
      moduleId: linuxModule.id,
      title: "Introduction to Linux",
      content: `# Welcome to Linux Fundamentals

Linux is the backbone of cybersecurity. Understanding the Linux operating system is crucial for anyone aspiring to work in information security.

## Why Linux?

- **Open Source**: You can see and modify the source code
- **Security**: Built with security in mind from the ground up
- **Flexibility**: Runs on anything from servers to embedded devices
- **Community**: Massive community support and documentation

## What You'll Learn

In this module, you'll master:
- File system navigation
- User and permission management
- Package management
- Process monitoring
- Network configuration

Let's begin your journey into the world of Linux!`,
      type: "lesson",
      image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&auto=format&fit=crop",
      order: 1,
    });

    const page2 = await storage.createPage({
      moduleId: linuxModule.id,
      title: "Basic Commands",
      content: `# Essential Linux Commands

Every hacker needs to know these fundamental commands.

## File System Navigation

\`\`\`bash
pwd     # Print working directory
ls      # List files
cd      # Change directory
mkdir   # Make directory
rm      # Remove files
\`\`\`

## File Operations

\`\`\`bash
cat file.txt        # Display file contents
less file.txt       # Page through file
head -n 10 file.txt # First 10 lines
tail -n 10 file.txt # Last 10 lines
grep pattern file   # Search for pattern
\`\`\`

## System Information

\`\`\`bash
whoami      # Current user
uname -a    # System information
df -h       # Disk usage
free -h     # Memory usage
\`\`\`

Now let's test your knowledge!`,
      type: "lesson",
      image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop",
      order: 2,
    });

    const page3 = await storage.createPage({
      moduleId: linuxModule.id,
      title: "Challenge: File System",
      content: `# File System Challenge

You've learned the basics. Now it's time to prove your skills!

## Scenario

You're investigating a compromised system. The attacker left a hidden flag in the file system.

## Your Mission

Find the command that lists ALL files in the current directory, including hidden ones.

**Hint**: Hidden files in Linux start with a dot (.)

Once you find the correct command, submit it as your answer below.`,
      type: "challenge",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop",
      order: 3,
    });

    console.log("✅ Pages created for Linux Fundamentals");

    console.log("Creating questions...");
    const hashedAnswer1 = await bcrypt.hash("ls -la", 10);
    await storage.createQuestion({
      pageId: page3.id,
      text: "What command lists all files including hidden ones?",
      answerHash: hashedAnswer1,
      cubeReward: 10,
      order: 1,
    });

    const hashedAnswer2 = await bcrypt.hash("ls -a", 10);
    await storage.createQuestion({
      pageId: page3.id,
      text: "Alternative shorter command (bonus)?",
      answerHash: hashedAnswer2,
      cubeReward: 5,
      order: 2,
    });

    console.log("✅ Questions created");

    console.log("Creating gift codes...");
    await storage.createGiftCode({
      code: "WELCOME100",
      value: 100,
      active: true,
    });

    await storage.createGiftCode({
      code: "HACKER2024",
      value: 500,
      active: true,
    });

    await storage.createGiftCode({
      code: "BEGINNERS50",
      value: 50,
      active: true,
    });

    console.log("✅ Gift codes created");

    console.log("🎉 Database seeding completed successfully!");
    console.log("\n📝 Login credentials:");
    console.log("Admin: admin / admin123");
    console.log("User: neo / test123");
    console.log("\n🎁 Gift codes: WELCOME100, HACKER2024, BEGINNERS50");
    
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log("✅ Seed script finished");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seed script failed:", error);
    process.exit(1);
  });
