import { WaitlistEntry, WaitlistStats } from "../types";

// Lazy-load Firebase modules only when standard network API routes fail and we fallback to clientDb.
let cachedDb: any = null;
let cachedFirebaseModule: any = null;

async function getFirebaseClient() {
  if (cachedDb && cachedFirebaseModule) {
    return { db: cachedDb, fs: cachedFirebaseModule };
  }
  try {
    const { initializeApp, getApps, getApp } = await import("firebase/app");
    const fs = await import("firebase/firestore");
    const firebaseConfig = await import("../../firebase-applet-config.json").then((m) => m.default || m);

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    cachedDb = fs.getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");
    cachedFirebaseModule = fs;
    return { db: cachedDb, fs: cachedFirebaseModule };
  } catch (error) {
    console.error("Firebase Client SDK Lazy Initialization failed:", error);
    throw error;
  }
}

// Helper to format timeAgo
function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Mask email helper
function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const maskedLocal = local.length > 2 
    ? `${local[0]}${"*".repeat(local.length - 2)}${local[local.length - 1]}`
    : local;
  const maskedDomain = domain.length > 4
    ? `${domain[0]}${"*".repeat(domain.length - 4)}${domain.substring(domain.length - 3)}`
    : domain;
  return `${maskedLocal}@${maskedDomain}`;
}

// Firestore custom error wrappers for proper telemetry and diagnosis as instructed in the guidelines
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Direct client-side Firestore implementation (lazy loaded)
const clientDb = {
  async getEntries(): Promise<WaitlistEntry[]> {
    try {
      const { db, fs } = await getFirebaseClient();
      const snapshot = await fs.getDocs(fs.collection(db, "waitlist"));
      const list: WaitlistEntry[] = [];
      snapshot.forEach((doc: any) => {
        list.push(doc.data() as WaitlistEntry);
      });
      // Sort by position or date to maintain order
      return list.sort((a, b) => a.position - b.position);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, "waitlist");
    }
  },

  async signup(email: string, role: string, platforms: string[], referredBy?: string) {
    const entries = await this.getEntries();
    const normalizedEmail = email.trim().toLowerCase();
    
    // Check duplicate
    const existing = entries.find(e => e.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return { isDuplicate: true, entry: existing };
    }

    const position = entries.length + 1;
    const emailPrefix = normalizedEmail.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const referralCode = `${emailPrefix}${randomSuffix}`;

    const newId = "wt_" + Math.random().toString(36).substring(2, 11);
    
    const { db, fs } = await getFirebaseClient();

    // If referredBy code is specified, find the referee and update them
    if (referredBy) {
      const referee = entries.find(e => e.referralCode.toUpperCase() === referredBy.trim().toUpperCase());
      if (referee) {
        const refereeRef = fs.doc(db, "waitlist", referee.id);
        try {
          await fs.updateDoc(refereeRef, {
            referralCount: referee.referralCount + 1
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `waitlist/${referee.id}`);
        }
      }
    }

    const newEntry: WaitlistEntry = {
      id: newId,
      email: normalizedEmail,
      role: role || "Content Creator",
      platforms: platforms && platforms.length > 0 ? platforms : ["Twitter/X"],
      createdAt: new Date().toISOString(),
      position,
      referralCode,
      referredBy: referredBy || "",
      referralCount: 0
    };

    try {
      await fs.setDoc(fs.doc(db, "waitlist", newId), newEntry);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `waitlist/${newId}`);
    }
    return { isDuplicate: false, entry: newEntry };
  },

  async getStats(): Promise<WaitlistStats> {
    const entries = await this.getEntries();
    
    const platforms: Record<string, number> = {};
    const roles: Record<string, number> = {};
    
    entries.forEach((e) => {
      roles[e.role] = (roles[e.role] || 0) + 1;
      if (e.platforms && Array.isArray(e.platforms)) {
        e.platforms.forEach((p) => {
          platforms[p] = (platforms[p] || 0) + 1;
        });
      }
    });

    // Recent signups (sorted by creation date desc, masked)
    const sorted = [...entries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const recentSignups = sorted.slice(0, 5).map((e) => ({
      emailMasked: maskEmail(e.email),
      role: e.role,
      timeAgo: formatTimeAgo(e.createdAt)
    }));

    return {
      totalCount: entries.length,
      platforms,
      roles,
      recentSignups
    };
  },

  async clearData() {
    const { db, fs } = await getFirebaseClient();
    const entries = await this.getEntries();
    const batch = fs.writeBatch(db);
    entries.forEach((e) => {
      batch.delete(fs.doc(db, "waitlist", e.id));
    });
    try {
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, "waitlist");
    }
    return { entries: [] };
  }
};

// Main API proxy helper that falls back to clientDb if needed
export const api = {
  async getStats(): Promise<WaitlistStats> {
    try {
      const response = await fetch("/api/waitlist/stats");
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (response.ok) return data;
      } catch {
        console.warn("API returned invalid JSON. Falling back to client-side Firestore.", text.slice(0, 100));
      }
    } catch (e) {
      console.warn("Fetch failed. Falling back to client-side Firestore.", e);
    }
    return clientDb.getStats();
  },

  async signup(email: string, role: string, platforms: string[], referredBy?: string) {
    try {
      const response = await fetch("/api/waitlist/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, platforms, referredBy })
      });
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (response.ok) return data;
        throw new Error(data.error || "Signup failed");
      } catch (err: any) {
        if (err.message && !err.message.includes("Unexpected token")) {
          throw err;
        }
        console.warn("API returned invalid JSON. Falling back to client-side Firestore.", text.slice(0, 100));
      }
    } catch (e: any) {
      if (e.message && !e.message.includes("Unexpected token") && !e.message.includes("Failed to fetch")) {
        throw e;
      }
      console.warn("Fetch failed. Falling back to client-side Firestore.", e);
    }
    return clientDb.signup(email, role, platforms, referredBy);
  },

  async login(passcode: string) {
    try {
      const response = await fetch("/api/waitlist/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode })
      });
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (response.ok) return data;
        throw new Error(data.error || "Login failed");
      } catch (err: any) {
        if (err.message && !err.message.includes("Unexpected token")) {
          throw err;
        }
        console.warn("API returned invalid JSON. Falling back to client-side Firestore login validation.", text.slice(0, 100));
      }
    } catch (e: any) {
      if (e.message && !e.message.includes("Unexpected token") && !e.message.includes("Failed to fetch")) {
        throw e;
      }
      console.warn("Fetch failed. Falling back to client-side Firestore login validation.", e);
    }

    // Direct validation
    if (passcode.trim() === "puboauth2026") {
      return { success: true };
    }
    throw new Error("Invalid passcode.");
  },

  async getEntries(passcode: string): Promise<{ entries: WaitlistEntry[] }> {
    try {
      const response = await fetch("/api/waitlist/admin/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode })
      });
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (response.ok) return data;
        throw new Error(data.error || "Failed to load entries");
      } catch (err: any) {
        if (err.message && !err.message.includes("Unexpected token")) {
          throw err;
        }
        console.warn("API returned invalid JSON. Falling back to client-side Firestore fetch.", text.slice(0, 100));
      }
    } catch (e: any) {
      if (e.message && !e.message.includes("Unexpected token") && !e.message.includes("Failed to fetch")) {
        throw e;
      }
      console.warn("Fetch failed. Falling back to client-side Firestore fetch.", e);
    }

    if (passcode !== "puboauth2026") {
      throw new Error("Invalid passcode.");
    }
    const entries = await clientDb.getEntries();
    return { entries };
  },

  async clearData(passcode: string) {
    try {
      const response = await fetch("/api/waitlist/admin/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode })
      });
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (response.ok) return data;
        throw new Error(data.error || "Failed to clear database");
      } catch (err: any) {
        if (err.message && !err.message.includes("Unexpected token")) {
          throw err;
        }
        console.warn("API returned invalid JSON. Falling back to client-side Firestore clear.", text.slice(0, 100));
      }
    } catch (e: any) {
      if (e.message && !e.message.includes("Unexpected token") && !e.message.includes("Failed to fetch")) {
        throw e;
      }
      console.warn("Fetch failed. Falling back to client-side Firestore clear.", e);
    }

    if (passcode !== "puboauth2026") {
      throw new Error("Invalid passcode.");
    }
    return clientDb.clearData();
  }
};
