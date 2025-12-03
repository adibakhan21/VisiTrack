export interface VisitorProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  photoUrl: string;
  lastSeen?: string;
}

export interface VisitorLog {
  id: string;
  visitorId?: string; // If recognized
  name: string; // "Unknown" if not recognized
  timestamp: string;
  confidence: number;
  entryType: 'Check-In' | 'Check-Out' | 'Denied';
  imageUrl: string; // The capture
  attributes?: {
    ageRange: string;
    gender: string;
    emotion: string;
    glasses: boolean;
  };
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  SCANNER = 'SCANNER',
  LOGS = 'LOGS',
  DATABASE = 'DATABASE'
}

export interface AnalysisResult {
  isMatch: boolean;
  matchedName?: string;
  confidence: number;
  description: string;
  demographics: {
    age: string;
    gender: string;
    emotion: string;
    glasses: boolean;
  }
}