import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import admin from "firebase-admin";
import { getFirestore, Firestore } from "firebase-admin/firestore";

interface WaitlistEntry {
  id: string;
  email: string;
  role: string;
  platforms: string[];
  createdAt: string;
  position: number;
  referralCode: string;
  referredBy?: string;
  referralCount: number;
}

const PORT = 3000;
const PASSCODE = process.env.ADMIN_PASSCODE || "puboauth2026";
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "waitlist.json");

// Create data directory if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize Firebase Admin securely from config
let db: Firestore | null = null;
const configPath = path.join(process.cwd(), "firebase-applet-config.json");
if (fs.existsSync(configPath)) {
  try {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    admin.initializeApp({
      projectId: config.projectId,
    });
    db = getFirestore(config.firestoreDatabaseId || "(default)");
    console.log(`[Firebase] Connected to Firestore database: ${config.firestoreDatabaseId || "(default)"}`);
  } catch (error) {
    console.error("[Firebase] Initialization failed, falling back to file storage:", error);
  }
}


// Empty INITIAL_ENTRIES to ensure there is no pre-loaded mock data
const INITIAL_ENTRIES: WaitlistEntry[] = [];

// Clean up existing pre-seeded mock records (IDs wt_1 to wt_7) from Firestore and local storage on startup
async function cleanupMockEntries() {
  if (db) {
    try {
      const collectionRef = db.collection("waitlist");
      const snapshot = await collectionRef.get();
      const batch = db.batch();
      let count = 0;
      snapshot.docs.forEach((doc: any) => {
        const id = doc.id;
        if (/^wt_[1-7]$/.test(id)) {
          batch.delete(doc.ref);
          count++;
        }
      });
      if (count > 0) {
        await batch.commit();
        console.log(`[Firebase] One-time cleanup deleted ${count} mock entries from Firestore.`);
      }
    } catch (error) {
      console.error("[Firebase] Error during mock entries cleanup:", error);
    }
  }

  // Also clean local JSON file of mock entries
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      const entries: WaitlistEntry[] = JSON.parse(data);
      const filtered = entries.filter(e => !/^wt_[1-7]$/.test(e.id));
      if (filtered.length !== entries.length) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), "utf-8");
        console.log(`[Local Storage] One-time cleanup deleted mock entries from waitlist.json.`);
      }
    }
  } catch (error) {
    // Ignore error
  }
}

async function getEntries(): Promise<WaitlistEntry[]> {
  if (db) {
    try {
      const collectionRef = db.collection("waitlist");
      const snapshot = await collectionRef.get();
      const entries: WaitlistEntry[] = [];
      snapshot.forEach((doc: any) => {
        entries.push(doc.data() as WaitlistEntry);
      });
      return entries;
    } catch (error) {
      console.error("[Firebase] Error reading from Firestore, falling back to JSON:", error);
    }
  }

  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading waitlist file, fallback to empty array", error);
  }
  
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf-8");
  return [];
}

async function saveEntries(entries: WaitlistEntry[]) {
  if (db) {
    try {
      const batch = db.batch();
      const collectionRef = db.collection("waitlist");
      
      // Clear old entries (ensures total synchronization with UI actions like reset/seed database)
      const snapshot = await collectionRef.get();
      snapshot.docs.forEach((doc: any) => {
        batch.delete(doc.ref);
      });
      
      entries.forEach((entry) => {
        const docRef = collectionRef.doc(entry.id);
        // Deep clone via JSON serialization to completely strip out any undefined properties for Firestore
        const cleanedEntry = JSON.parse(JSON.stringify(entry));
        batch.set(docRef, cleanedEntry);
      });
      await batch.commit();
      return;
    } catch (error) {
      console.error("[Firebase] Error saving entries to Firestore:", error);
    }
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2), "utf-8");
}

// In-memory rate limiting map for security mitigation (DDoS, Brute force, Spam submissions)
interface RateLimitInfo {
  count: number;
  resetTime: number;
}
const ipLimits = new Map<string, RateLimitInfo>();

function rateLimit(limit: number, windowMs: number) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const rawIp = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
    const ip = Array.isArray(rawIp) ? rawIp[0] : (typeof rawIp === "string" ? rawIp.split(",")[0].trim() : "unknown");
    const now = Date.now();
    const userLimit = ipLimits.get(ip);

    if (!userLimit || now > userLimit.resetTime) {
      ipLimits.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (userLimit.count >= limit) {
      res.setHeader("Retry-After", Math.ceil((userLimit.resetTime - now) / 1000).toString());
      return res.status(429).json({ error: "Too many requests from this IP. Please try again later." });
    }

    userLimit.count++;
    next();
  };
}

async function startServer() {
  // Probe Firestore connection to verify permissions before using it
  if (db) {
    try {
      console.log("[Firebase] Probing Firestore connection to verify permissions...");
      await db.collection("waitlist").limit(1).get();
      console.log("[Firebase] Firestore permission verified successfully!");
    } catch (error) {
      console.log("[Firebase] Firestore permission check failed (Missing or insufficient permissions). Falling back to robust local file storage.");
      db = null; // Disable db so we gracefully fallback to local storage
    }
  }

  // Clear any existing mock entries (wt_1 through wt_7) to ensure a clean slate
  await cleanupMockEntries();

  const app = express();
  app.use(express.json());

  // Configure production-grade secure HTTP response headers
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    // Ensure strict transport security when served over HTTPS
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    next();
  });

  // Waitlist Signup Endpoint (rate limited to 10 submissions per 10 minutes)
  app.post("/api/waitlist/signup", rateLimit(10, 10 * 60 * 1000), async (req, res) => {
    try {
      const { email, role, platforms, referredBy } = req.body;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
        return res.status(400).json({ error: "Please enter a valid email address." });
      }

      const entries = await getEntries();

      // Check if duplicate email
      const normalizedEmail = email.trim().toLowerCase();
      const existingEntry = entries.find(e => e.email.toLowerCase() === normalizedEmail);
      if (existingEntry) {
        return res.json({ 
          success: true, 
          isDuplicate: true, 
          entry: existingEntry 
        });
      }

      // Generate a clean position representing the live registration count
      const currentPosition = entries.length + 1;

      // Generate referral code based on email prefix
      const emailPrefix = normalizedEmail.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      const referralCode = `${emailPrefix}${randomSuffix}`;

      // Create waitlist entry
      const newEntry: WaitlistEntry = {
        id: "wt_" + Math.random().toString(36).substr(2, 9),
        email: normalizedEmail,
        role: role || "Content Creator",
        platforms: Array.isArray(platforms) ? platforms : ["Twitter/X"],
        createdAt: new Date().toISOString(),
        position: currentPosition,
        referralCode,
        referredBy: referredBy || "",
        referralCount: 0,
      };

      // If referred by someone, increment their referral count
      if (referredBy) {
        const referrerIndex = entries.findIndex(e => e.referralCode === referredBy);
        if (referrerIndex !== -1) {
          entries[referrerIndex].referralCount += 1;
          // In a real app, a referral might jump the person's queue position
          // Let's mock a queue jump: decrease position of referrer by 5 for every signup
          if (entries[referrerIndex].position > 1) {
            entries[referrerIndex].position = Math.max(1, entries[referrerIndex].position - 12);
          }
        }
      }

      entries.push(newEntry);
      await saveEntries(entries);

      res.status(201).json({
        success: true,
        entry: newEntry
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Something went wrong. Please try again." });
    }
  });

  // Get Waitlist Stats Endpoint
  app.get("/api/waitlist/stats", async (req, res) => {
    try {
      const entries = await getEntries();
      
      const platformsCount: Record<string, number> = {};
      const rolesCount: Record<string, number> = {};

      entries.forEach(entry => {
        // Count platforms
        entry.platforms.forEach(platform => {
          platformsCount[platform] = (platformsCount[platform] || 0) + 1;
        });
        // Count roles
        rolesCount[entry.role] = (rolesCount[entry.role] || 0) + 1;
      });

      // Standard platforms list to ensure they always exist with at least 0 counts
      const standardPlatforms = ["Twitter/X", "LinkedIn", "Instagram", "Threads", "TikTok", "YouTube", "Facebook", "Mastodon"];
      standardPlatforms.forEach(p => {
        if (platformsCount[p] === undefined) {
          platformsCount[p] = 0;
        }
      });

      // Get recent 5 signups (masked emails for privacy)
      const recentSignups = [...entries]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map(entry => {
          const parts = entry.email.split("@");
          const username = parts[0];
          const domain = parts[1];
          const maskedUsername = username.length > 3 
            ? `${username.substring(0, 2)}***${username.substring(username.length - 1)}` 
            : `${username[0]}***`;
          
          const timeDiffMs = Date.now() - new Date(entry.createdAt).getTime();
          let timeAgo = "Just now";
          if (timeDiffMs > 3600000 * 24) {
            timeAgo = `${Math.floor(timeDiffMs / (3600000 * 24))}d ago`;
          } else if (timeDiffMs > 3600000) {
            timeAgo = `${Math.floor(timeDiffMs / 3600000)}h ago`;
          } else if (timeDiffMs > 60000) {
            timeAgo = `${Math.floor(timeDiffMs / 60000)}m ago`;
          }

          return {
            emailMasked: `${maskedUsername}@${domain}`,
            role: entry.role,
            timeAgo,
          };
        });

      res.json({
        totalCount: entries.length, // live count of actual registrants
        platforms: platformsCount,
        roles: rolesCount,
        recentSignups
      });
    } catch (error) {
      console.error("Stats error:", error);
      res.status(500).json({ error: "Failed to load stats." });
    }
  });

  // Admin Verification (Brute-force protection: limited to 5 login attempts per 5 minutes)
  app.post("/api/waitlist/admin/login", rateLimit(5, 5 * 60 * 1000), (req, res) => {
    const { passcode } = req.body;
    if (passcode === PASSCODE) {
      res.json({ success: true, token: "admin_session_pubo" });
    } else {
      res.status(401).json({ error: "Invalid admin passcode." });
    }
  });

  // Admin Entries Retrieval
  app.post("/api/waitlist/admin/entries", async (req, res) => {
    const { passcode } = req.body;
    if (passcode !== PASSCODE) {
      return res.status(401).json({ error: "Unauthorized access." });
    }

    try {
      const entries = await getEntries();
      res.json({
        success: true,
        entries: entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch entries." });
    }
  });

  // Admin Reset / Clear (re-initialize mock data)
  app.post("/api/waitlist/admin/clear", async (req, res) => {
    const { passcode } = req.body;
    if (passcode !== PASSCODE) {
      return res.status(401).json({ error: "Unauthorized access." });
    }

    try {
      await saveEntries(INITIAL_ENTRIES);
      res.json({ success: true, entries: INITIAL_ENTRIES });
    } catch (error) {
      res.status(500).json({ error: "Failed to reset data." });
    }
  });

  // Dev vs Prod Asset Serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
