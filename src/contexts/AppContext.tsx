import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, HealthCondition, RecoveryPlan, DailyCheckIn, Medication, Meal, Exercise } from '../types';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  healthConditions: HealthCondition[];
  setHealthConditions: (conditions: HealthCondition[]) => void;
  recoveryPlan: RecoveryPlan | null;
  setRecoveryPlan: (plan: RecoveryPlan | null) => void;
  dailyCheckIns: DailyCheckIn[];
  setDailyCheckIns: (checkIns: DailyCheckIn[]) => void;
  meals: Meal[];
  setMeals: (meals: Meal[]) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User> & { email: string; password: string; name: string }) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [healthConditions, setHealthConditions] = useState<HealthCondition[]>([]);
  const [recoveryPlan, setRecoveryPlan] = useState<RecoveryPlan | null>(null);
  const [dailyCheckIns, setDailyCheckIns] = useState<DailyCheckIn[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for saved user data
    const savedUser = localStorage.getItem('healthmate_user');
    const savedConditions = localStorage.getItem('healthmate_conditions');
    const savedPlan = localStorage.getItem('healthmate_plan');
    const savedCheckIns = localStorage.getItem('healthmate_checkins');
    const savedMeals = localStorage.getItem('healthmate_meals');

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
    if (savedConditions) {
      setHealthConditions(JSON.parse(savedConditions));
    }
    if (savedPlan) {
      setRecoveryPlan(JSON.parse(savedPlan));
    }
    if (savedCheckIns) {
      setDailyCheckIns(JSON.parse(savedCheckIns));
    }
    if (savedMeals) {
      setMeals(JSON.parse(savedMeals));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    if (email && password) {
      // Check if this is a demo account with specific name
      let userName = 'Demo User';
      
      if (email === 'demo@healthmate.ai') {
        userName = 'Ajay'; // Default demo user name
      } else if (email === 'doctor@healthmate.ai') {
        userName = 'Dr. Sarah Smith';
      } else if (email === 'admin@healthmate.ai') {
        userName = 'Admin User';
      } else {
        // For other emails, try to extract name from email or use saved data
        const savedUserData = localStorage.getItem('healthmate_registration_data');
        if (savedUserData) {
          const registrationData = JSON.parse(savedUserData);
          if (registrationData.email === email && registrationData.name) {
            userName = registrationData.name;
          }
        }
      }

      const mockUser: User = {
        id: '1',
        name: userName,
        email,
        age: 45,
        gender: 'male',
        weight: 75,
        height: 175,
        emergencyContact: {
          name: 'Jane Doe',
          phone: '+1234567890',
          relationship: 'Spouse'
        }
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('healthmate_user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const register = async (userData: Partial<User> & { email: string; password: string; name: string }): Promise<boolean> => {
    // Simulate API call
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      age: userData.age || 0,
      gender: userData.gender || 'other',
      weight: userData.weight || 0,
      height: userData.height || 0,
      emergencyContact: userData.emergencyContact || {
        name: '',
        phone: '',
        relationship: ''
      }
    };
    
    // Save registration data for future logins
    localStorage.setItem('healthmate_registration_data', JSON.stringify({
      email: userData.email,
      name: userData.name
    }));
    
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('healthmate_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setHealthConditions([]);
    setRecoveryPlan(null);
    setDailyCheckIns([]);
    setMeals([]);
    localStorage.removeItem('healthmate_user');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        healthConditions,
        setHealthConditions,
        recoveryPlan,
        setRecoveryPlan,
        dailyCheckIns,
        setDailyCheckIns,
        meals,
        setMeals,
        isAuthenticated,
        login,
        logout,
        register
      }}
    >
      {children}
    </AppContext.Provider>
  );
};