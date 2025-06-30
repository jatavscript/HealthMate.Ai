import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DoctorUser, PatientAssignment, DoctorAlert, TreatmentPlan, PatientProgress } from '../types/doctor';

interface DoctorContextType {
  doctorUser: DoctorUser | null;
  setDoctorUser: (user: DoctorUser | null) => void;
  patients: PatientAssignment[];
  setPatients: (patients: PatientAssignment[]) => void;
  alerts: DoctorAlert[];
  setAlerts: (alerts: DoctorAlert[]) => void;
  treatmentPlans: TreatmentPlan[];
  setTreatmentPlans: (plans: TreatmentPlan[]) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

export const useDoctor = () => {
  const context = useContext(DoctorContext);
  if (context === undefined) {
    throw new Error('useDoctor must be used within a DoctorProvider');
  }
  return context;
};

interface DoctorProviderProps {
  children: ReactNode;
}

export const DoctorProvider: React.FC<DoctorProviderProps> = ({ children }) => {
  const [doctorUser, setDoctorUser] = useState<DoctorUser | null>(null);
  const [patients, setPatients] = useState<PatientAssignment[]>([]);
  const [alerts, setAlerts] = useState<DoctorAlert[]>([]);
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for saved doctor data
    const savedDoctor = localStorage.getItem('healthmate_doctor');
    if (savedDoctor) {
      setDoctorUser(JSON.parse(savedDoctor));
      setIsAuthenticated(true);
      loadDoctorData();
    }
  }, []);

  const loadDoctorData = () => {
    // Load sample data
    const samplePatients: PatientAssignment[] = [
      {
        id: '1',
        patientId: 'patient-1',
        patientName: 'John Doe',
        patientEmail: 'john.doe@email.com',
        condition: 'Post-appendectomy recovery',
        surgeryDate: '2024-01-15',
        recoveryStage: 'early',
        assignedDate: '2024-01-15',
        lastCheckIn: '2 hours ago',
        adherenceRate: 85,
        riskLevel: 'low',
        urgentAlerts: 1,
        nextAppointment: '2024-01-25',
        notes: 'Patient recovering well, minor pain management needed',
        isActive: true
      },
      {
        id: '2',
        patientId: 'patient-2',
        patientName: 'Jane Wilson',
        patientEmail: 'jane.wilson@email.com',
        condition: 'Cardiac rehabilitation',
        recoveryStage: 'intermediate',
        assignedDate: '2024-01-10',
        lastCheckIn: '1 day ago',
        adherenceRate: 92,
        riskLevel: 'medium',
        urgentAlerts: 0,
        nextAppointment: '2024-01-30',
        notes: 'Excellent progress, continue current treatment plan',
        isActive: true
      },
      {
        id: '3',
        patientId: 'patient-3',
        patientName: 'Robert Brown',
        patientEmail: 'robert.brown@email.com',
        condition: 'Orthopedic recovery',
        surgeryDate: '2024-01-05',
        recoveryStage: 'advanced',
        assignedDate: '2024-01-05',
        lastCheckIn: '3 hours ago',
        adherenceRate: 78,
        riskLevel: 'low',
        urgentAlerts: 0,
        nextAppointment: '2024-02-01',
        notes: 'Good progress, ready for advanced exercises',
        isActive: true
      }
    ];

    const sampleAlerts: DoctorAlert[] = [
      {
        id: '1',
        type: 'patient-critical',
        severity: 'urgent',
        patientId: 'patient-1',
        patientName: 'John Doe',
        title: 'Missed Medication Alert',
        message: 'Patient has missed 2 consecutive medication doses',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        isRead: false,
        actionRequired: true,
        dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        type: 'appointment',
        severity: 'medium',
        patientId: 'patient-2',
        patientName: 'Jane Wilson',
        title: 'Upcoming Appointment',
        message: 'Follow-up appointment scheduled for tomorrow at 2:00 PM',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        isRead: false,
        actionRequired: false
      },
      {
        id: '3',
        type: 'lab-result',
        severity: 'high',
        patientId: 'patient-3',
        patientName: 'Robert Brown',
        title: 'Lab Results Available',
        message: 'New blood work results require review',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        actionRequired: true
      }
    ];

    setPatients(samplePatients);
    setAlerts(sampleAlerts);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Check for admin-created doctor accounts first
      const adminCreatedDoctors = JSON.parse(localStorage.getItem('healthmate_admin_doctors') || '[]');
      const adminCreatedDoctor = adminCreatedDoctors.find((doc: any) => 
        doc.email === email && doc.password === password
      );

      if (adminCreatedDoctor) {
        // Create doctor user from admin-created account
        const mockDoctor: DoctorUser = {
          id: adminCreatedDoctor.id,
          name: adminCreatedDoctor.name,
          email: adminCreatedDoctor.email,
          specialty: adminCreatedDoctor.specialty,
          license: adminCreatedDoctor.license,
          hospital: adminCreatedDoctor.hospital,
          phone: adminCreatedDoctor.phone || '+1-555-0123',
          bio: adminCreatedDoctor.bio || 'Experienced healthcare professional',
          experience: adminCreatedDoctor.experience || 5,
          education: adminCreatedDoctor.education || ['Medical Degree'],
          certifications: adminCreatedDoctor.certifications || ['Board Certified'],
          languages: adminCreatedDoctor.languages || ['English'],
          rating: 4.8,
          reviewsCount: 50,
          isVerified: true,
          joinDate: adminCreatedDoctor.createdAt || new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };

        setDoctorUser(mockDoctor);
        setIsAuthenticated(true);
        localStorage.setItem('healthmate_doctor', JSON.stringify(mockDoctor));
        loadDoctorData();
        return true;
      }

      // Fallback to demo account
      if (email === 'doctor@healthmate.ai' && password === 'doctor123') {
        const mockDoctor: DoctorUser = {
          id: 'doctor-1',
          name: 'Dr. Sarah Smith',
          email,
          specialty: 'General Surgery',
          license: 'MD123456',
          hospital: 'City General Hospital',
          phone: '+1-555-0123',
          bio: 'Experienced surgeon specializing in minimally invasive procedures',
          experience: 15,
          education: ['MD - Harvard Medical School', 'Residency - Johns Hopkins'],
          certifications: ['Board Certified Surgeon', 'Laparoscopic Surgery Certification'],
          languages: ['English', 'Spanish'],
          rating: 4.8,
          reviewsCount: 127,
          isVerified: true,
          joinDate: '2023-06-15',
          lastLogin: new Date().toISOString()
        };
        setDoctorUser(mockDoctor);
        setIsAuthenticated(true);
        localStorage.setItem('healthmate_doctor', JSON.stringify(mockDoctor));
        loadDoctorData();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Doctor login error:', error);
      return false;
    }
  };

  const logout = () => {
    setDoctorUser(null);
    setIsAuthenticated(false);
    setPatients([]);
    setAlerts([]);
    setTreatmentPlans([]);
    localStorage.removeItem('healthmate_doctor');
  };

  return (
    <DoctorContext.Provider
      value={{
        doctorUser,
        setDoctorUser,
        patients,
        setPatients,
        alerts,
        setAlerts,
        treatmentPlans,
        setTreatmentPlans,
        isAuthenticated,
        login,
        logout
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
};