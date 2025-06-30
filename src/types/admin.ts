export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super-admin' | 'admin' | 'moderator';
  permissions: AdminPermission[];
  avatar?: string;
  lastLogin: string;
  createdAt: string;
  isActive: boolean;
}

export interface AdminPermission {
  id: string;
  name: string;
  description: string;
  module: 'users' | 'doctors' | 'patients' | 'analytics' | 'settings' | 'content';
  actions: ('create' | 'read' | 'update' | 'delete' | 'manage')[];
}

export interface PatientOverview {
  id: string;
  name: string;
  email: string;
  age: number;
  condition: string;
  recoveryStage: 'acute' | 'early' | 'intermediate' | 'advanced';
  assignedDoctor: string;
  lastActivity: string;
  adherenceRate: number;
  riskLevel: 'low' | 'medium' | 'high';
  registrationDate: string;
  isActive: boolean;
}

export interface DoctorOverview {
  id: string;
  name: string;
  email: string;
  specialty: string;
  license: string;
  hospital: string;
  patientsCount: number;
  averageRating: number;
  isVerified: boolean;
  joinDate: string;
  lastLogin: string;
  isActive: boolean;
}

export interface SystemAnalytics {
  totalUsers: number;
  activeUsers: number;
  totalDoctors: number;
  activeDoctors: number;
  totalPatients: number;
  activePatients: number;
  averageAdherence: number;
  criticalAlerts: number;
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
  serverUptime: number;
}

export interface AdminAlert {
  id: string;
  type: 'system' | 'patient' | 'doctor' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionRequired: boolean;
  relatedId?: string;
}