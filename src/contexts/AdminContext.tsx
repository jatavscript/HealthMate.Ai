import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser, PatientOverview, DoctorOverview, SystemAnalytics, AdminAlert } from '../types/admin';

interface AdminContextType {
  adminUser: AdminUser | null;
  setAdminUser: (user: AdminUser | null) => void;
  patients: PatientOverview[];
  setPatients: (patients: PatientOverview[]) => void;
  doctors: DoctorOverview[];
  setDoctors: (doctors: DoctorOverview[]) => void;
  analytics: SystemAnalytics | null;
  setAnalytics: (analytics: SystemAnalytics | null) => void;
  alerts: AdminAlert[];
  setAlerts: (alerts: AdminAlert[]) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addDoctor: (doctorData: any) => Promise<boolean>;
  updateDoctor: (id: string, doctorData: any) => Promise<boolean>;
  deleteDoctor: (id: string) => Promise<boolean>;
  addUser: (userData: any) => Promise<boolean>;
  updateUser: (id: string, userData: any) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [patients, setPatients] = useState<PatientOverview[]>([]);
  const [doctors, setDoctors] = useState<DoctorOverview[]>([]);
  const [analytics, setAnalytics] = useState<SystemAnalytics | null>(null);
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for saved admin data
    const savedAdmin = localStorage.getItem('healthmate_admin');
    if (savedAdmin) {
      setAdminUser(JSON.parse(savedAdmin));
      setIsAuthenticated(true);
      loadAdminData();
    }
  }, []);

  const loadAdminData = () => {
    // Load sample data
    const samplePatients: PatientOverview[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@email.com',
        age: 45,
        condition: 'Post-surgical recovery',
        recoveryStage: 'early',
        assignedDoctor: 'Dr. Sarah Smith',
        lastActivity: '2 hours ago',
        adherenceRate: 85,
        riskLevel: 'low',
        registrationDate: '2024-01-15',
        isActive: true
      },
      {
        id: '2',
        name: 'Jane Wilson',
        email: 'jane.wilson@email.com',
        age: 38,
        condition: 'Cardiac rehabilitation',
        recoveryStage: 'intermediate',
        assignedDoctor: 'Dr. Michael Johnson',
        lastActivity: '1 day ago',
        adherenceRate: 92,
        riskLevel: 'medium',
        registrationDate: '2024-01-10',
        isActive: true
      },
      {
        id: '3',
        name: 'Robert Brown',
        email: 'robert.brown@email.com',
        age: 52,
        condition: 'Orthopedic recovery',
        recoveryStage: 'advanced',
        assignedDoctor: 'Dr. Sarah Smith',
        lastActivity: '3 hours ago',
        adherenceRate: 78,
        riskLevel: 'low',
        registrationDate: '2024-01-05',
        isActive: true
      }
    ];

    // Load doctors from localStorage (admin-created) and merge with sample data
    const adminCreatedDoctors = JSON.parse(localStorage.getItem('healthmate_admin_doctors') || '[]');
    
    const sampleDoctors: DoctorOverview[] = [
      {
        id: '1',
        name: 'Dr. Sarah Smith',
        email: 'dr.smith@hospital.com',
        specialty: 'General Surgery',
        license: 'MD123456',
        hospital: 'City General Hospital',
        patientsCount: 45,
        averageRating: 4.8,
        isVerified: true,
        joinDate: '2023-06-15',
        lastLogin: '1 hour ago',
        isActive: true
      },
      {
        id: '2',
        name: 'Dr. Michael Johnson',
        email: 'dr.johnson@hospital.com',
        specialty: 'Cardiology',
        license: 'MD789012',
        hospital: 'Heart Specialty Center',
        patientsCount: 32,
        averageRating: 4.9,
        isVerified: true,
        joinDate: '2023-08-20',
        lastLogin: '3 hours ago',
        isActive: true
      },
      {
        id: '3',
        name: 'Dr. Emily Davis',
        email: 'dr.davis@hospital.com',
        specialty: 'Orthopedic Surgery',
        license: 'MD345678',
        hospital: 'Orthopedic Institute',
        patientsCount: 28,
        averageRating: 4.7,
        isVerified: true,
        joinDate: '2023-09-10',
        lastLogin: '5 hours ago',
        isActive: true
      }
    ];

    // Convert admin-created doctors to DoctorOverview format
    const convertedAdminDoctors: DoctorOverview[] = adminCreatedDoctors.map((doc: any) => ({
      id: doc.id || `doctor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: doc.name,
      email: doc.email,
      specialty: doc.specialty || 'General Practice',
      license: doc.license || 'MD000000',
      hospital: doc.hospital || 'Not Specified',
      patientsCount: doc.patientsCount || 0,
      averageRating: doc.averageRating || 5.0,
      isVerified: true,
      joinDate: doc.createdAt || new Date().toISOString(),
      lastLogin: doc.lastLogin || 'Never',
      isActive: true
    }));

    // Merge sample doctors with admin-created doctors
    const allDoctors = [...sampleDoctors, ...convertedAdminDoctors];

    const sampleAnalytics: SystemAnalytics = {
      totalUsers: 1247,
      activeUsers: 892,
      totalDoctors: allDoctors.length,
      activeDoctors: allDoctors.filter(d => d.isActive).length,
      totalPatients: 1091,
      activePatients: 758,
      averageAdherence: 87.5,
      criticalAlerts: 12,
      systemHealth: 'good',
      serverUptime: 99.8
    };

    const sampleAlerts: AdminAlert[] = [
      {
        id: '1',
        type: 'patient',
        severity: 'high',
        title: 'Patient Medication Non-Adherence',
        message: 'Patient John Doe has missed 3 consecutive medication doses',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        isRead: false,
        actionRequired: true,
        relatedId: '1'
      },
      {
        id: '2',
        type: 'system',
        severity: 'medium',
        title: 'Server Performance Warning',
        message: 'Database response time increased by 15% in the last hour',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        actionRequired: false
      },
      {
        id: '3',
        type: 'doctor',
        severity: 'low',
        title: 'New Doctor Registration',
        message: 'Dr. Emily Davis has completed registration and awaits verification',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        actionRequired: true,
        relatedId: '3'
      }
    ];

    setPatients(samplePatients);
    setDoctors(allDoctors);
    setAnalytics(sampleAnalytics);
    setAlerts(sampleAlerts);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    if (email === 'admin@healthmate.ai' && password === 'admin123') {
      const mockAdmin: AdminUser = {
        id: 'admin-1',
        name: 'System Administrator',
        email,
        role: 'super-admin',
        permissions: [],
        lastLogin: new Date().toISOString(),
        createdAt: '2023-01-01T00:00:00Z',
        isActive: true
      };
      setAdminUser(mockAdmin);
      setIsAuthenticated(true);
      localStorage.setItem('healthmate_admin', JSON.stringify(mockAdmin));
      loadAdminData();
      return true;
    }
    return false;
  };

  const addDoctor = async (doctorData: any): Promise<boolean> => {
    try {
      // Generate a unique ID if not provided
      const newDoctor = {
        id: `doctor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...doctorData,
        createdAt: new Date().toISOString(),
        isActive: true
      };

      // Save to localStorage for persistence
      const existingDoctors = JSON.parse(localStorage.getItem('healthmate_admin_doctors') || '[]');
      existingDoctors.push(newDoctor);
      localStorage.setItem('healthmate_admin_doctors', JSON.stringify(existingDoctors));

      // Update local state
      loadAdminData();
      return true;
    } catch (error) {
      console.error('Error adding doctor:', error);
      return false;
    }
  };

  const updateDoctor = async (id: string, doctorData: any): Promise<boolean> => {
    try {
      const existingDoctors = JSON.parse(localStorage.getItem('healthmate_admin_doctors') || '[]');
      const updatedDoctors = existingDoctors.map((doc: any) => 
        doc.id === id ? { ...doc, ...doctorData, updatedAt: new Date().toISOString() } : doc
      );
      localStorage.setItem('healthmate_admin_doctors', JSON.stringify(updatedDoctors));
      loadAdminData();
      return true;
    } catch (error) {
      console.error('Error updating doctor:', error);
      return false;
    }
  };

  const deleteDoctor = async (id: string): Promise<boolean> => {
    try {
      const existingDoctors = JSON.parse(localStorage.getItem('healthmate_admin_doctors') || '[]');
      const filteredDoctors = existingDoctors.filter((doc: any) => doc.id !== id);
      localStorage.setItem('healthmate_admin_doctors', JSON.stringify(filteredDoctors));
      loadAdminData();
      return true;
    } catch (error) {
      console.error('Error deleting doctor:', error);
      return false;
    }
  };

  const addUser = async (userData: any): Promise<boolean> => {
    try {
      const newUser = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...userData,
        createdAt: new Date().toISOString(),
        isActive: true
      };

      // Save to localStorage for persistence
      const existingUsers = JSON.parse(localStorage.getItem('healthmate_admin_users') || '[]');
      existingUsers.push(newUser);
      localStorage.setItem('healthmate_admin_users', JSON.stringify(existingUsers));

      // Update local state
      loadAdminData();
      return true;
    } catch (error) {
      console.error('Error adding user:', error);
      return false;
    }
  };

  const updateUser = async (id: string, userData: any): Promise<boolean> => {
    try {
      const existingUsers = JSON.parse(localStorage.getItem('healthmate_admin_users') || '[]');
      const updatedUsers = existingUsers.map((user: any) => 
        user.id === id ? { ...user, ...userData, updatedAt: new Date().toISOString() } : user
      );
      localStorage.setItem('healthmate_admin_users', JSON.stringify(updatedUsers));
      loadAdminData();
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      const existingUsers = JSON.parse(localStorage.getItem('healthmate_admin_users') || '[]');
      const filteredUsers = existingUsers.filter((user: any) => user.id !== id);
      localStorage.setItem('healthmate_admin_users', JSON.stringify(filteredUsers));
      loadAdminData();
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  };

  const logout = () => {
    setAdminUser(null);
    setIsAuthenticated(false);
    setPatients([]);
    setDoctors([]);
    setAnalytics(null);
    setAlerts([]);
    localStorage.removeItem('healthmate_admin');
    // Don't remove other localStorage items to preserve doctor and user data
  };

  return (
    <AdminContext.Provider
      value={{
        adminUser,
        setAdminUser,
        patients,
        setPatients,
        doctors,
        setDoctors,
        analytics,
        setAnalytics,
        alerts,
        setAlerts,
        isAuthenticated,
        login,
        logout,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        addUser,
        updateUser,
        deleteUser
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};