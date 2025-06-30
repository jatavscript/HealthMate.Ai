export interface Exercise {
  id: string;
  userId: string;
  name: string;
  category: 'stretching' | 'breathing' | 'strength' | 'cardio' | 'yoga' | 'walking' | 'mobility' | 'flexibility';
  daysAssigned: string[];
  duration: number; // in minutes
  instructions: string;
  mediaUrl?: string;
  mediaType?: 'youtube' | 'gif' | 'image' | 'video';
  status: 'active' | 'paused' | 'completed';
  approvedByPhysician: boolean;
  prescribedBy?: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  targetMuscleGroups?: string[];
  equipment?: string[];
  precautions?: string[];
  benefits?: string[];
  repetitions?: number;
  sets?: number;
  restBetweenSets?: number; // in seconds
  isMandatory: boolean;
  createdAt: string;
  updatedAt: string;
  completionLog: ExerciseCompletion[];
  adherenceRate: number;
  totalSessions: number;
  completedSessions: number;
  notes?: string;
  patientNotes?: ExerciseNote[];
  reminderEnabled: boolean;
  reminderTimes: string[];
}

export interface ExerciseCompletion {
  id: string;
  exerciseId: string;
  date: string;
  completed: boolean;
  duration?: number; // actual duration performed
  difficulty?: 'too-easy' | 'just-right' | 'too-hard';
  painLevel?: number; // 1-10 scale
  notes?: string;
  timestamp: string;
}

export interface ExerciseNote {
  id: string;
  exerciseId: string;
  date: string;
  note: string;
  mood?: 'great' | 'good' | 'okay' | 'tired' | 'painful';
  timestamp: string;
}

export interface ExerciseTemplate {
  id: string;
  name: string;
  category: Exercise['category'];
  difficulty: Exercise['difficulty'];
  duration: number;
  instructions: string;
  mediaUrl?: string;
  targetMuscleGroups: string[];
  equipment: string[];
  benefits: string[];
  precautions: string[];
  isPopular: boolean;
  conditionSpecific?: string[]; // e.g., ['post-surgery', 'cardiac', 'orthopedic']
}

export interface WeeklySchedule {
  monday: Exercise[];
  tuesday: Exercise[];
  wednesday: Exercise[];
  thursday: Exercise[];
  friday: Exercise[];
  saturday: Exercise[];
  sunday: Exercise[];
}