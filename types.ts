export enum UserRole {
  Admin = 'admin',
  Staff = 'staff',
  Customer = 'customer'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  currentRoom?: string;
}

export enum RoomStatus {
  Available = 'Available',
  InUse = 'In Use',
  Cleaning = 'Cleaning'
}

export enum SessionType {
  Hourly = 'hourly',
  FlatRate = 'flat-rate'
}

export interface Session {
  id: string;
  startTime: number | null;
  elapsedTime: number; // in seconds
  isActive: boolean;
  type: SessionType;
  rate: number; // price per hour or flat rate
}

export interface KTVRoom {
  id: string;
  name: string;
  status: RoomStatus;
  capacity: number;
  session: Session;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
}

export interface ActivityLog {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
}

export interface LoyaltyInfo {
  visits: number;
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold';
  history: { date: string; spent: number; points_earned: number }[];
}