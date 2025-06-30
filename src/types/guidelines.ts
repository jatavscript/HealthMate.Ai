export interface Guideline {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'mobility' | 'nutrition' | 'mental-wellness' | 'hygiene' | 'red-flags';
  priority: 'low' | 'medium' | 'high' | 'critical';
  conditionSpecific?: string[];
  medicationRelated?: string[];
  recoveryStage?: string[];
  tags: string[];
  icon?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'infographic';
  estimatedReadTime: number; // in minutes
  lastUpdated: string;
  source: string;
  evidenceLevel: 'expert-opinion' | 'clinical-study' | 'peer-reviewed' | 'fda-approved';
  isPersonalized: boolean;
  relevanceScore?: number; // 0-100 based on user profile
}

export interface GuidelineInteraction {
  id: string;
  guidelineId: string;
  userId: string;
  action: 'read' | 'helpful' | 'not-helpful' | 'bookmarked' | 'reminder-set' | 'note-added' | 'question-asked';
  timestamp: string;
  note?: string;
  reminderTime?: string;
  question?: string;
}

export interface GuidelineCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  guidelines: Guideline[];
  completionRate?: number;
}

export interface PersonalizedRecommendation {
  guideline: Guideline;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
  basedOn: string[]; // e.g., ['recent-medication', 'pain-level', 'recovery-stage']
}

export interface GuidelineProgress {
  totalGuidelines: number;
  readGuidelines: number;
  bookmarkedGuidelines: number;
  helpfulVotes: number;
  notesAdded: number;
  remindersSet: number;
  questionsAsked: number;
  completionPercentage: number;
}

export interface UserProfile {
  surgeryType?: string;
  condition?: string;
  medications?: string[];
  recoveryStage?: 'acute' | 'early' | 'intermediate' | 'advanced' | 'maintenance';
  painLevel?: number;
  mobilityLevel?: 'bed-rest' | 'limited' | 'moderate' | 'full';
  dietaryRestrictions?: string[];
  allergies?: string[];
  age?: number;
  comorbidities?: string[];
}