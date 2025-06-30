export interface DailyCheckIn {
  id: string;
  userId: string;
  date: string;
  completedAt: string;
  
  // Physical Symptoms
  physicalSymptoms: string[];
  physicalDescription: string;
  painLevel?: number; // 1-10 scale
  
  // Mental & Emotional
  mood: number; // 1-10 scale
  moodDescription: string;
  stressLevel?: number; // 1-10 scale
  anxietyLevel?: number; // 1-10 scale
  
  // Medication Adherence
  medicationsTaken: 'yes' | 'no' | 'some';
  missedMedicationReason?: 'forgot' | 'side-effects' | 'not-needed' | 'ran-out' | 'other';
  missedMedicationDetails?: string;
  
  // Meals & Hydration
  mealsStatus: 'followed-plan' | 'ate-outside' | 'skipped' | 'other';
  mealsDescription?: string;
  waterIntake: number; // glasses per day
  appetiteLevel?: number; // 1-10 scale
  
  // Exercise & Activity
  exerciseCompleted: boolean;
  exerciseType?: string;
  exerciseDuration?: number; // minutes
  exerciseIntensity?: 'light' | 'moderate' | 'vigorous';
  mobilityLevel?: number; // 1-10 scale
  
  // Sleep Quality
  sleepQuality: 'very-good' | 'okay' | 'poor' | 'insomnia';
  sleepHours: number;
  sleepInterruptions?: number;
  sleepMedication?: boolean;
  
  // Care Team Notes
  careTeamNotes: string;
  urgentConcerns?: string;
  questionsForTeam?: string;
  
  // Calculated Metrics
  overallWellness: number; // 1-10 calculated score
  recoveryProgress?: number; // 1-10 scale
  
  // Flags and Alerts
  needsFollowUp: boolean;
  redFlags: string[];
  achievements: string[];
  
  // Metadata
  completionTime: number; // seconds taken to complete
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  version: string; // check-in form version
}

export interface CheckInTemplate {
  id: string;
  name: string;
  description: string;
  sections: CheckInSection[];
  conditionSpecific?: string[];
  recoveryStage?: string[];
  estimatedTime: number; // minutes
  version: string;
}

export interface CheckInSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: CheckInQuestion[];
  order: number;
  required: boolean;
  conditionalLogic?: ConditionalLogic[];
}

export interface CheckInQuestion {
  id: string;
  text: string;
  type: 'text' | 'scale' | 'multiple-choice' | 'checklist' | 'number' | 'time' | 'date';
  required: boolean;
  options?: QuestionOption[];
  validation?: ValidationRule[];
  helpText?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  unit?: string;
}

export interface QuestionOption {
  id: string;
  label: string;
  value: any;
  icon?: string;
  color?: string;
  description?: string;
  triggersFollowUp?: boolean;
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

export interface ConditionalLogic {
  condition: string; // e.g., "mood < 5"
  action: 'show' | 'hide' | 'require' | 'suggest';
  target: string; // question or section ID
  value?: any;
}

export interface CheckInAnalytics {
  userId: string;
  period: 'week' | 'month' | 'quarter' | 'year';
  startDate: string;
  endDate: string;
  
  // Completion Stats
  totalCheckIns: number;
  completionRate: number; // percentage
  averageCompletionTime: number; // minutes
  
  // Health Trends
  averageWellness: number;
  wellnessTrend: 'improving' | 'stable' | 'declining';
  moodTrend: 'improving' | 'stable' | 'declining';
  painTrend: 'improving' | 'stable' | 'declining';
  
  // Adherence Metrics
  medicationAdherence: number; // percentage
  exerciseAdherence: number; // percentage
  sleepQualityAverage: number;
  hydrationAverage: number;
  
  // Alerts and Concerns
  redFlagCount: number;
  followUpNeeded: number;
  missedCheckIns: number;
  
  // Achievements
  streakDays: number;
  totalAchievements: number;
  recentAchievements: string[];
}

export interface CheckInReminder {
  id: string;
  userId: string;
  time: string; // HH:MM format
  days: string[]; // ['monday', 'tuesday', etc.]
  enabled: boolean;
  message: string;
  type: 'push' | 'email' | 'sms';
  advanceTime?: number; // minutes before scheduled time
}

export interface CheckInInsight {
  id: string;
  type: 'trend' | 'correlation' | 'recommendation' | 'alert';
  title: string;
  description: string;
  data: any;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionable: boolean;
  suggestedActions?: string[];
  basedOn: string[]; // data points used for insight
  confidence: number; // 0-100 percentage
  generatedAt: string;
}