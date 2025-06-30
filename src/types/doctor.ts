export interface DoctorUser {
  id: string;
  name: string;
  email: string;
  specialty: string;
  license: string;
  hospital: string;
  phone: string;
  avatar?: string;
  bio: string;
  experience: number;
  education: string[];
  certifications: string[];
  languages: string[];
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  joinDate: string;
  lastLogin: string;
}

export interface PatientAssignment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  condition: string;
  surgeryDate?: string;
  recoveryStage: 'acute' | 'early' | 'intermediate' | 'advanced';
  assignedDate: string;
  lastCheckIn: string;
  adherenceRate: number;
  riskLevel: 'low' | 'medium' | 'high';
  urgentAlerts: number;
  nextAppointment?: string;
  notes: string;
  isActive: boolean;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  type: 'diagnosis' | 'prescription' | 'note' | 'lab-result' | 'imaging';
  title: string;
  content: string;
  date: string;
  doctorId: string;
  attachments?: string[];
  isConfidential: boolean;
  tags: string[];
}

export interface DoctorAlert {
  id: string;
  type: 'patient-critical' | 'missed-medication' | 'appointment' | 'lab-result' | 'system';
  severity: 'low' | 'medium' | 'high' | 'urgent';
  patientId?: string;
  patientName?: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionRequired: boolean;
  dueDate?: string;
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  doctorId: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  medications: TreatmentMedication[];
  exercises: TreatmentExercise[];
  dietPlan: TreatmentDiet[];
  goals: TreatmentGoal[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface TreatmentMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: number;
  instructions: string;
  sideEffects: string[];
  isActive: boolean;
}

export interface TreatmentExercise {
  id: string;
  name: string;
  description: string;
  duration: number;
  frequency: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  instructions: string;
  isActive: boolean;
}

export interface TreatmentDiet {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  description: string;
  calories: number;
  nutrients: string[];
  restrictions: string[];
  isActive: boolean;
}

export interface TreatmentGoal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  isCompleted: boolean;
}

export interface PatientProgress {
  patientId: string;
  date: string;
  painLevel: number;
  mood: number;
  energy: number;
  medicationAdherence: number;
  exerciseCompletion: number;
  sleepQuality: number;
  notes: string;
  vitals?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    weight?: number;
  };
}