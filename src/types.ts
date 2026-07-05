export interface WaitlistEntry {
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

export interface WaitlistStats {
  totalCount: number;
  platforms: Record<string, number>;
  roles: Record<string, number>;
  recentSignups: { emailMasked: string; role: string; timeAgo: string }[];
}
