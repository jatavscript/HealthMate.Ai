export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number;
  height: number;
  profileImage?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  doctor?: {
    name: string;
    phone: string;
    email: string;
  };
}

export interface HealthCondition {
  id: string;
  type: 'surgery' | 'chronic' | 'acute';
  name: string;
  surgeryDate?: Date;
  severity?: 'mild' | 'moderate' | 'severe';
  stage?: 'acute' | 'recovery' | 'maintenance';
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: number;
  times: string[];
  duration: number;
  durationType: 'days' | 'weeks' | 'months';
  reminderEnabled: boolean;
  instructions?: string;
}

export interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  time: string;
  description: string;
  calories?: number;
  completed: boolean;
  image?: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: 'easy' | 'moderate' | 'hard';
  category: 'mobility' | 'strength' | 'cardio' | 'flexibility';
  completed: boolean;
  image?: string;
}

export interface DailyCheckIn {
  id: string;
  date: Date;
  painLevel: number;
  mood: 'terrible' | 'bad' | 'okay' | 'good' | 'great';
  energyLevel: 'low' | 'moderate' | 'high';
  symptoms: string[];
  medicationTaken: boolean;
  mealsCompleted: number;
  notes?: string;
}

export interface RecoveryPlan {
  id: string;
  medications: Medication[];
  meals: Meal[];
  exercises: Exercise[];
  dos: string[];
  donts: string[];
  recoveryStage: 'acute' | 'early' | 'intermediate' | 'advanced';
  estimatedRecoveryWeeks: number;
}