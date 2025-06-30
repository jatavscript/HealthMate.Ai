import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Send, User, Bot, Thermometer, Brain, Pill, UtensilsCrossed, Activity, Moon, FileText, CheckCircle, Clock, Calendar, TrendingUp, Smile, Frown, Meh, Coffee, Droplets, AlertCircle, ThumbsUp, RotateCcw, Save, Share2, Download, Star, Award, Zap, Target, ChevronRight, Play, Pause, Volume2, VolumeX, Lightbulb, ArrowRight, Plus, Minus, X, Info, AlertTriangle, Timer, BarChart3, LineChart, Eye, EyeOff, Smartphone, Monitor, Tablet, MapPin, Wind, Sun, CloudRain, Sunrise, Sunset, Home, Building, Car, Utensils, ShoppingCart, Users, Phone, Mail, MessageSquare, Camera, Mic, Image, Video, FileImage, Upload, Paperclip, Flag, Bookmark, Edit3, Trash2, Filter, Search, SortAsc, SortDesc, Grid, List, Settings, HelpCircle, ExternalLink, RefreshCw, Database, Cloud, Wifi, WifiOff, Battery, BatteryLow, Signal, Bluetooth, Volume, VolumeX as VolumeOff, Headphones, Speaker, Mic as MicIcon, MicOff, Camera as CameraIcon, Video as VideoIcon, Monitor as MonitorIcon, Smartphone as SmartphoneIcon, Tablet as TabletIcon, Laptop, LampDesk as Desktop, Watch, Gamepad2, Keyboard, Mouse, Printer, Scan as Scanner, Webcam, Router, Server, HardDrive, Cpu, MemoryStick, Car as SdCard, Usb, Cable, Plug, Power, PowerOff, Zap as Lightning, Sun as Sunny, Moon as Moonlight, CloudRain as Rainy, Wind as Windy, Snowflake, Umbrella, Rainbow, Sunrise as Dawn, Sunset as Dusk } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useApp } from '../contexts/AppContext';

interface CheckInData {
  id: string;
  date: string;
  userId: string;
  
  // Physical Health
  physicalSymptoms: string[];
  physicalDescription: string;
  painLevel: number; // 1-10
  painLocation: string[];
  energyLevel: number; // 1-10
  fatigueLevel: number; // 1-10
  nauseaLevel: number; // 1-10
  dizzinessLevel: number; // 1-10
  appetiteLevel: number; // 1-10
  mobilityLevel: number; // 1-10
  
  // Mental & Emotional Health
  mood: number; // 1-10
  moodDescription: string;
  stressLevel: number; // 1-10
  anxietyLevel: number; // 1-10
  depressionLevel: number; // 1-10
  motivationLevel: number; // 1-10
  concentrationLevel: number; // 1-10
  emotionalState: string[];
  
  // Medication Adherence
  medicationsTaken: 'all' | 'some' | 'none';
  medicationDetails: MedicationEntry[];
  missedMedicationReason?: string;
  sideEffects: string[];
  sideEffectSeverity: number; // 1-10
  
  // Nutrition & Hydration
  mealsStatus: 'all-planned' | 'some-planned' | 'none-planned' | 'off-plan';
  mealsConsumed: MealEntry[];
  waterIntake: number; // glasses
  hydrationLevel: number; // 1-10
  dietaryRestrictions: string[];
  cravings: string[];
  
  // Physical Activity
  exerciseCompleted: boolean;
  exerciseDetails: ExerciseEntry[];
  stepCount?: number;
  activeMinutes?: number;
  restingHeartRate?: number;
  
  // Sleep Quality
  sleepQuality: number; // 1-10
  sleepHours: number;
  bedTime: string;
  wakeTime: string;
  sleepInterruptions: number;
  sleepAids: string[];
  dreamQuality: 'none' | 'pleasant' | 'neutral' | 'nightmares';
  
  // Environmental Factors
  weather: string;
  location: string;
  socialInteractions: number; // 1-10
  workStress: number; // 1-10
  homeEnvironment: number; // 1-10
  
  // Care Team Communication
  careTeamNotes: string;
  urgentConcerns: string[];
  questionsForTeam: string[];
  appointmentRequests: string[];
  
  // Vitals & Measurements
  bloodPressure?: { systolic: number; diastolic: number };
  heartRate?: number;
  temperature?: number;
  weight?: number;
  bloodSugar?: number;
  oxygenSaturation?: number;
  
  // Recovery Specific
  woundHealing: number; // 1-10
  swelling: number; // 1-10
  mobility: number; // 1-10
  independence: number; // 1-10
  recoveryGoalProgress: GoalProgress[];
  
  // Multimedia Attachments
  photos: string[];
  voiceNotes: string[];
  documents: string[];
  
  // Metadata
  completedAt: string;
  completionTime: number; // seconds
  deviceType: 'mobile' | 'tablet' | 'desktop';
  location_coordinates?: { lat: number; lng: number };
  version: string;
  
  // Calculated Scores
  overallWellness: number; // 1-10
  physicalScore: number; // 1-10
  mentalScore: number; // 1-10
  adherenceScore: number; // 1-10
  recoveryScore: number; // 1-10
  
  // Flags & Alerts
  redFlags: string[];
  yellowFlags: string[];
  achievements: string[];
  milestones: string[];
  needsFollowUp: boolean;
  emergencyAlert: boolean;
}

interface MedicationEntry {
  medicationId: string;
  name: string;
  dosage: string;
  taken: boolean;
  timeScheduled: string;
  timeTaken?: string;
  sideEffects?: string[];
  effectiveness?: number; // 1-10
  notes?: string;
}

interface MealEntry {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  planned: boolean;
  consumed: boolean;
  foods: string[];
  calories?: number;
  satisfaction: number; // 1-10
  notes?: string;
}

interface ExerciseEntry {
  exerciseId: string;
  name: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'balance' | 'walking' | 'therapy';
  duration: number; // minutes
  intensity: number; // 1-10
  completed: boolean;
  difficulty: 'easy' | 'moderate' | 'hard';
  painDuring: number; // 1-10
  notes?: string;
}

interface GoalProgress {
  goalId: string;
  goalName: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  progress: number; // percentage
}

interface CheckInSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  completed: boolean;
  required: boolean;
  estimatedTime: number; // minutes
}

interface QuickResponse {
  id: string;
  text: string;
  category: string;
  icon: string;
  value?: any;
}

const DailyCheckInPage: React.FC = () => {
  const { user } = useApp();
  
  // Main state
  const [currentSection, setCurrentSection] = useState(0);
  const [checkInData, setCheckInData] = useState<Partial<CheckInData>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState(new Date());
  const [showSummary, setShowSummary] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  // UI state
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  
  // Progress tracking
  const [sectionProgress, setSectionProgress] = useState<{ [key: string]: number }>({});
  const [overallProgress, setOverallProgress] = useState(0);
  
  // Check-in history
  const [checkInHistory, setCheckInHistory] = useState<CheckInData[]>([]);
  const [selectedHistoryEntry, setSelectedHistoryEntry] = useState<CheckInData | null>(null);
  
  // Real-time data
  const [currentWeather, setCurrentWeather] = useState('sunny');
  const [deviceInfo, setDeviceInfo] = useState({
    type: 'desktop' as const,
    battery: 85,
    connectivity: 'wifi'
  });
  
  // Form data for each section
  const [physicalData, setPhysicalData] = useState({
    symptoms: [] as string[],
    description: '',
    painLevel: 5,
    painLocation: [] as string[],
    energyLevel: 5,
    fatigueLevel: 5,
    nauseaLevel: 1,
    dizzinessLevel: 1,
    appetiteLevel: 5,
    mobilityLevel: 5
  });
  
  const [mentalData, setMentalData] = useState({
    mood: 5,
    description: '',
    stressLevel: 5,
    anxietyLevel: 5,
    depressionLevel: 1,
    motivationLevel: 5,
    concentrationLevel: 5,
    emotionalState: [] as string[]
  });
  
  const [medicationData, setMedicationData] = useState({
    adherence: 'all' as 'all' | 'some' | 'none',
    medications: [] as MedicationEntry[],
    sideEffects: [] as string[],
    sideEffectSeverity: 1,
    missedReason: ''
  });
  
  const [nutritionData, setNutritionData] = useState({
    mealsStatus: 'all-planned' as const,
    meals: [] as MealEntry[],
    waterIntake: 8,
    hydrationLevel: 5,
    cravings: [] as string[]
  });
  
  const [activityData, setActivityData] = useState({
    exerciseCompleted: false,
    exercises: [] as ExerciseEntry[],
    stepCount: 0,
    activeMinutes: 0
  });
  
  const [sleepData, setSleepData] = useState({
    quality: 5,
    hours: 8,
    bedTime: '22:00',
    wakeTime: '07:00',
    interruptions: 0,
    aids: [] as string[],
    dreamQuality: 'neutral' as const
  });
  
  const [vitalsData, setVitalsData] = useState({
    bloodPressure: { systolic: 120, diastolic: 80 },
    heartRate: 70,
    temperature: 98.6,
    weight: 0,
    bloodSugar: 0,
    oxygenSaturation: 98
  });
  
  const [careTeamData, setCareTeamData] = useState({
    notes: '',
    urgentConcerns: [] as string[],
    questions: [] as string[],
    appointmentRequests: [] as string[]
  });

  // Check-in sections configuration
  const sections: CheckInSection[] = [
    {
      id: 'physical',
      title: 'Physical Well-being',
      icon: Thermometer,
      description: 'How are you feeling physically today?',
      completed: false,
      required: true,
      estimatedTime: 3
    },
    {
      id: 'mental',
      title: 'Mental & Emotional Health',
      icon: Brain,
      description: 'Your mood and emotional state',
      completed: false,
      required: true,
      estimatedTime: 2
    },
    {
      id: 'medications',
      title: 'Medication Adherence',
      icon: Pill,
      description: 'Track your medication intake',
      completed: false,
      required: true,
      estimatedTime: 2
    },
    {
      id: 'nutrition',
      title: 'Nutrition & Hydration',
      icon: UtensilsCrossed,
      description: 'Your eating and drinking habits',
      completed: false,
      required: true,
      estimatedTime: 2
    },
    {
      id: 'activity',
      title: 'Physical Activity',
      icon: Activity,
      description: 'Exercise and movement tracking',
      completed: false,
      required: false,
      estimatedTime: 2
    },
    {
      id: 'sleep',
      title: 'Sleep Quality',
      icon: Moon,
      description: 'How well did you sleep?',
      completed: false,
      required: true,
      estimatedTime: 2
    },
    {
      id: 'vitals',
      title: 'Vitals & Measurements',
      icon: Heart,
      description: 'Record vital signs and measurements',
      completed: false,
      required: false,
      estimatedTime: 3
    },
    {
      id: 'care-team',
      title: 'Care Team Notes',
      icon: FileText,
      description: 'Messages for your healthcare team',
      completed: false,
      required: false,
      estimatedTime: 2
    }
  ];

  // Quick response options for different categories
  const physicalSymptoms: QuickResponse[] = [
    { id: 'pain', text: 'Pain', category: 'physical', icon: '😣', value: 'pain' },
    { id: 'fatigue', text: 'Fatigue', category: 'physical', icon: '😴', value: 'fatigue' },
    { id: 'nausea', text: 'Nausea', category: 'physical', icon: '🤢', value: 'nausea' },
    { id: 'dizziness', text: 'Dizziness', category: 'physical', icon: '😵', value: 'dizziness' },
    { id: 'headache', text: 'Headache', category: 'physical', icon: '🤕', value: 'headache' },
    { id: 'stable', text: 'Feeling stable', category: 'physical', icon: '😊', value: 'stable' },
    { id: 'weakness', text: 'Weakness', category: 'physical', icon: '😮‍💨', value: 'weakness' },
    { id: 'stiffness', text: 'Stiffness', category: 'physical', icon: '🦴', value: 'stiffness' }
  ];

  const emotionalStates: QuickResponse[] = [
    { id: 'happy', text: 'Happy', category: 'emotional', icon: '😊', value: 'happy' },
    { id: 'anxious', text: 'Anxious', category: 'emotional', icon: '😰', value: 'anxious' },
    { id: 'sad', text: 'Sad', category: 'emotional', icon: '😢', value: 'sad' },
    { id: 'frustrated', text: 'Frustrated', category: 'emotional', icon: '😤', value: 'frustrated' },
    { id: 'hopeful', text: 'Hopeful', category: 'emotional', icon: '🌟', value: 'hopeful' },
    { id: 'overwhelmed', text: 'Overwhelmed', category: 'emotional', icon: '😵', value: 'overwhelmed' },
    { id: 'peaceful', text: 'Peaceful', category: 'emotional', icon: '😌', value: 'peaceful' },
    { id: 'motivated', text: 'Motivated', category: 'emotional', icon: '💪', value: 'motivated' }
  ];

  const commonSideEffects: QuickResponse[] = [
    { id: 'drowsiness', text: 'Drowsiness', category: 'side-effect', icon: '😴', value: 'drowsiness' },
    { id: 'stomach-upset', text: 'Stomach Upset', category: 'side-effect', icon: '🤢', value: 'stomach-upset' },
    { id: 'dry-mouth', text: 'Dry Mouth', category: 'side-effect', icon: '👄', value: 'dry-mouth' },
    { id: 'constipation', text: 'Constipation', category: 'side-effect', icon: '🚽', value: 'constipation' },
    { id: 'diarrhea', text: 'Diarrhea', category: 'side-effect', icon: '💩', value: 'diarrhea' },
    { id: 'rash', text: 'Skin Rash', category: 'side-effect', icon: '🔴', value: 'rash' },
    { id: 'none', text: 'No Side Effects', category: 'side-effect', icon: '✅', value: 'none' }
  ];

  // Initialize check-in
  useEffect(() => {
    checkTodaysCheckIn();
    loadCheckInHistory();
    detectDeviceInfo();
    getCurrentWeather();
  }, []);

  // Auto-save progress
  useEffect(() => {
    const autoSaveData = {
      physicalData,
      mentalData,
      medicationData,
      nutritionData,
      activityData,
      sleepData,
      vitalsData,
      careTeamData,
      currentSection,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('healthmate_checkin_draft', JSON.stringify(autoSaveData));
  }, [physicalData, mentalData, medicationData, nutritionData, activityData, sleepData, vitalsData, careTeamData, currentSection]);

  // Calculate overall progress
  useEffect(() => {
    const requiredSections = sections.filter(s => s.required).length;
    const completedRequired = Object.values(sectionProgress).filter(p => p >= 80).length;
    const progress = Math.round((completedRequired / requiredSections) * 100);
    setOverallProgress(progress);
  }, [sectionProgress]);

  const checkTodaysCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    const savedCheckIn = localStorage.getItem(`healthmate_checkin_${today}`);
    
    if (savedCheckIn) {
      const checkIn = JSON.parse(savedCheckIn);
      setIsCompleted(true);
      setCheckInData(checkIn);
    } else {
      // Load draft if available
      const draft = localStorage.getItem('healthmate_checkin_draft');
      if (draft) {
        const draftData = JSON.parse(draft);
        setPhysicalData(draftData.physicalData || physicalData);
        setMentalData(draftData.mentalData || mentalData);
        setMedicationData(draftData.medicationData || medicationData);
        setNutritionData(draftData.nutritionData || nutritionData);
        setActivityData(draftData.activityData || activityData);
        setSleepData(draftData.sleepData || sleepData);
        setVitalsData(draftData.vitalsData || vitalsData);
        setCareTeamData(draftData.careTeamData || careTeamData);
        setCurrentSection(draftData.currentSection || 0);
      }
    }
  };

  const loadCheckInHistory = () => {
    const history: CheckInData[] = [];
    for (let i = 1; i <= 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const saved = localStorage.getItem(`healthmate_checkin_${dateStr}`);
      if (saved) {
        history.push(JSON.parse(saved));
      }
    }
    setCheckInHistory(history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const detectDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
    
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      deviceType = /iPad/.test(userAgent) ? 'tablet' : 'mobile';
    }
    
    setDeviceInfo({
      type: deviceType,
      battery: Math.floor(Math.random() * 100),
      connectivity: navigator.onLine ? 'wifi' : 'offline'
    });
  };

  const getCurrentWeather = () => {
    // Simulate weather data
    const weathers = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
    setCurrentWeather(weathers[Math.floor(Math.random() * weathers.length)]);
  };

  const updateSectionProgress = (sectionId: string, progress: number) => {
    setSectionProgress(prev => ({
      ...prev,
      [sectionId]: progress
    }));
  };

  const calculateSectionProgress = (sectionId: string): number => {
    switch (sectionId) {
      case 'physical':
        const physicalFields = [
          physicalData.description,
          physicalData.painLevel,
          physicalData.energyLevel,
          physicalData.symptoms.length > 0
        ];
        return Math.round((physicalFields.filter(Boolean).length / physicalFields.length) * 100);
      
      case 'mental':
        const mentalFields = [
          mentalData.mood,
          mentalData.stressLevel,
          mentalData.anxietyLevel,
          mentalData.motivationLevel
        ];
        return Math.round((mentalFields.filter(f => f !== undefined).length / mentalFields.length) * 100);
      
      case 'medications':
        return medicationData.adherence ? 100 : 0;
      
      case 'nutrition':
        const nutritionFields = [
          nutritionData.mealsStatus,
          nutritionData.waterIntake > 0,
          nutritionData.hydrationLevel
        ];
        return Math.round((nutritionFields.filter(Boolean).length / nutritionFields.length) * 100);
      
      case 'activity':
        return activityData.exerciseCompleted ? 100 : 50;
      
      case 'sleep':
        const sleepFields = [
          sleepData.quality,
          sleepData.hours > 0,
          sleepData.bedTime,
          sleepData.wakeTime
        ];
        return Math.round((sleepFields.filter(Boolean).length / sleepFields.length) * 100);
      
      case 'vitals':
        const vitalsFields = [
          vitalsData.heartRate > 0,
          vitalsData.bloodPressure.systolic > 0,
          vitalsData.temperature > 0
        ];
        return Math.round((vitalsFields.filter(Boolean).length / vitalsFields.length) * 100);
      
      case 'care-team':
        return careTeamData.notes.length > 0 ? 100 : 0;
      
      default:
        return 0;
    }
  };

  // Update progress when data changes
  useEffect(() => {
    sections.forEach(section => {
      const progress = calculateSectionProgress(section.id);
      updateSectionProgress(section.id, progress);
    });
  }, [physicalData, mentalData, medicationData, nutritionData, activityData, sleepData, vitalsData, careTeamData]);

  const handleQuickResponse = (response: QuickResponse, sectionId: string) => {
    switch (sectionId) {
      case 'physical':
        if (response.category === 'physical') {
          setPhysicalData(prev => ({
            ...prev,
            symptoms: prev.symptoms.includes(response.value) 
              ? prev.symptoms.filter(s => s !== response.value)
              : [...prev.symptoms, response.value]
          }));
        }
        break;
      
      case 'mental':
        if (response.category === 'emotional') {
          setMentalData(prev => ({
            ...prev,
            emotionalState: prev.emotionalState.includes(response.value)
              ? prev.emotionalState.filter(s => s !== response.value)
              : [...prev.emotionalState, response.value]
          }));
        }
        break;
      
      case 'medications':
        if (response.category === 'side-effect') {
          setMedicationData(prev => ({
            ...prev,
            sideEffects: response.value === 'none' 
              ? []
              : prev.sideEffects.includes(response.value)
                ? prev.sideEffects.filter(s => s !== response.value)
                : [...prev.sideEffects, response.value]
          }));
        }
        break;
    }
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      completeCheckIn();
    }
  };

  const previousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const completeCheckIn = () => {
    const completionTime = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    
    const finalCheckInData: CheckInData = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      userId: user?.id || 'demo-user',
      
      // Physical Health
      physicalSymptoms: physicalData.symptoms,
      physicalDescription: physicalData.description,
      painLevel: physicalData.painLevel,
      painLocation: physicalData.painLocation,
      energyLevel: physicalData.energyLevel,
      fatigueLevel: physicalData.fatigueLevel,
      nauseaLevel: physicalData.nauseaLevel,
      dizzinessLevel: physicalData.dizzinessLevel,
      appetiteLevel: physicalData.appetiteLevel,
      mobilityLevel: physicalData.mobilityLevel,
      
      // Mental & Emotional Health
      mood: mentalData.mood,
      moodDescription: mentalData.description,
      stressLevel: mentalData.stressLevel,
      anxietyLevel: mentalData.anxietyLevel,
      depressionLevel: mentalData.depressionLevel,
      motivationLevel: mentalData.motivationLevel,
      concentrationLevel: mentalData.concentrationLevel,
      emotionalState: mentalData.emotionalState,
      
      // Medication Adherence
      medicationsTaken: medicationData.adherence,
      medicationDetails: medicationData.medications,
      missedMedicationReason: medicationData.missedReason,
      sideEffects: medicationData.sideEffects,
      sideEffectSeverity: medicationData.sideEffectSeverity,
      
      // Nutrition & Hydration
      mealsStatus: nutritionData.mealsStatus,
      mealsConsumed: nutritionData.meals,
      waterIntake: nutritionData.waterIntake,
      hydrationLevel: nutritionData.hydrationLevel,
      dietaryRestrictions: [],
      cravings: nutritionData.cravings,
      
      // Physical Activity
      exerciseCompleted: activityData.exerciseCompleted,
      exerciseDetails: activityData.exercises,
      stepCount: activityData.stepCount,
      activeMinutes: activityData.activeMinutes,
      
      // Sleep Quality
      sleepQuality: sleepData.quality,
      sleepHours: sleepData.hours,
      bedTime: sleepData.bedTime,
      wakeTime: sleepData.wakeTime,
      sleepInterruptions: sleepData.interruptions,
      sleepAids: sleepData.aids,
      dreamQuality: sleepData.dreamQuality,
      
      // Environmental Factors
      weather: currentWeather,
      location: 'Home',
      socialInteractions: 5,
      workStress: 3,
      homeEnvironment: 8,
      
      // Care Team Communication
      careTeamNotes: careTeamData.notes,
      urgentConcerns: careTeamData.urgentConcerns,
      questionsForTeam: careTeamData.questions,
      appointmentRequests: careTeamData.appointmentRequests,
      
      // Vitals & Measurements
      bloodPressure: vitalsData.bloodPressure,
      heartRate: vitalsData.heartRate,
      temperature: vitalsData.temperature,
      weight: vitalsData.weight,
      bloodSugar: vitalsData.bloodSugar,
      oxygenSaturation: vitalsData.oxygenSaturation,
      
      // Recovery Specific
      woundHealing: 8,
      swelling: 2,
      mobility: physicalData.mobilityLevel,
      independence: 7,
      recoveryGoalProgress: [],
      
      // Multimedia Attachments
      photos: [],
      voiceNotes: [],
      documents: [],
      
      // Metadata
      completedAt: new Date().toISOString(),
      completionTime,
      deviceType: deviceInfo.type,
      version: '2.1.0',
      
      // Calculated Scores
      overallWellness: calculateOverallWellness(),
      physicalScore: calculatePhysicalScore(),
      mentalScore: calculateMentalScore(),
      adherenceScore: calculateAdherenceScore(),
      recoveryScore: calculateRecoveryScore(),
      
      // Flags & Alerts
      redFlags: calculateRedFlags(),
      yellowFlags: calculateYellowFlags(),
      achievements: calculateAchievements(),
      milestones: [],
      needsFollowUp: checkNeedsFollowUp(),
      emergencyAlert: checkEmergencyAlert()
    };

    // Save check-in
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`healthmate_checkin_${today}`, JSON.stringify(finalCheckInData));
    
    // Clear draft
    localStorage.removeItem('healthmate_checkin_draft');
    
    // Update state
    setCheckInData(finalCheckInData);
    setIsCompleted(true);
    
    // Update progress tracking data
    updateProgressTracking(finalCheckInData);
    
    // Show completion message
    showCompletionMessage(finalCheckInData);
  };

  const calculateOverallWellness = (): number => {
    const scores = [
      physicalData.energyLevel,
      mentalData.mood,
      sleepData.quality,
      nutritionData.hydrationLevel,
      physicalData.mobilityLevel
    ];
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  const calculatePhysicalScore = (): number => {
    const painScore = 11 - physicalData.painLevel; // Invert pain (lower is better)
    const energyScore = physicalData.energyLevel;
    const mobilityScore = physicalData.mobilityLevel;
    const fatigueScore = 11 - physicalData.fatigueLevel; // Invert fatigue
    
    return Math.round((painScore + energyScore + mobilityScore + fatigueScore) / 4);
  };

  const calculateMentalScore = (): number => {
    const moodScore = mentalData.mood;
    const stressScore = 11 - mentalData.stressLevel; // Invert stress
    const anxietyScore = 11 - mentalData.anxietyLevel; // Invert anxiety
    const motivationScore = mentalData.motivationLevel;
    
    return Math.round((moodScore + stressScore + anxietyScore + motivationScore) / 4);
  };

  const calculateAdherenceScore = (): number => {
    switch (medicationData.adherence) {
      case 'all': return 10;
      case 'some': return 6;
      case 'none': return 2;
      default: return 5;
    }
  };

  const calculateRecoveryScore = (): number => {
    const physicalScore = calculatePhysicalScore();
    const mentalScore = calculateMentalScore();
    const adherenceScore = calculateAdherenceScore();
    const sleepScore = sleepData.quality;
    
    // Weighted average (medication adherence is most important)
    return Math.round((physicalScore * 0.3 + mentalScore * 0.25 + adherenceScore * 0.3 + sleepScore * 0.15));
  };

  const calculateRedFlags = (): string[] => {
    const flags: string[] = [];
    
    if (physicalData.painLevel >= 8) flags.push('Severe pain reported');
    if (mentalData.mood <= 3) flags.push('Very low mood');
    if (mentalData.anxietyLevel >= 8) flags.push('High anxiety levels');
    if (medicationData.adherence === 'none') flags.push('No medications taken');
    if (sleepData.hours < 4) flags.push('Severe sleep deprivation');
    if (vitalsData.temperature > 101.5) flags.push('High fever');
    if (careTeamData.urgentConcerns.length > 0) flags.push('Urgent concerns reported');
    
    return flags;
  };

  const calculateYellowFlags = (): string[] => {
    const flags: string[] = [];
    
    if (physicalData.painLevel >= 6) flags.push('Moderate to high pain');
    if (mentalData.mood <= 5) flags.push('Below average mood');
    if (medicationData.adherence === 'some') flags.push('Missed some medications');
    if (sleepData.hours < 6) flags.push('Insufficient sleep');
    if (nutritionData.waterIntake < 6) flags.push('Low water intake');
    if (physicalData.energyLevel <= 3) flags.push('Very low energy');
    
    return flags;
  };

  const calculateAchievements = (): string[] => {
    const achievements: string[] = [];
    
    if (medicationData.adherence === 'all') achievements.push('Perfect medication adherence');
    if (sleepData.hours >= 8 && sleepData.quality >= 7) achievements.push('Excellent sleep quality');
    if (nutritionData.waterIntake >= 8) achievements.push('Great hydration');
    if (activityData.exerciseCompleted) achievements.push('Exercise goal completed');
    if (mentalData.mood >= 8) achievements.push('Excellent mood');
    if (physicalData.painLevel <= 3) achievements.push('Low pain levels');
    
    return achievements;
  };

  const checkNeedsFollowUp = (): boolean => {
    return calculateRedFlags().length > 0 || 
           careTeamData.urgentConcerns.length > 0 ||
           careTeamData.appointmentRequests.length > 0;
  };

  const checkEmergencyAlert = (): boolean => {
    return physicalData.painLevel >= 9 ||
           vitalsData.temperature > 102 ||
           careTeamData.urgentConcerns.some(concern => 
             concern.toLowerCase().includes('emergency') || 
             concern.toLowerCase().includes('urgent')
           );
  };

  const updateProgressTracking = (checkIn: CheckInData) => {
    // Update progress data for charts and trends
    const progressEntry = {
      date: checkIn.date,
      checkIn: 100, // Completed
      medication: checkIn.adherenceScore * 10,
      exercise: checkIn.exerciseCompleted ? 100 : 0,
      mood: checkIn.mood * 10,
      sleep: checkIn.sleepQuality * 10,
      overall: checkIn.overallWellness * 10
    };
    
    // Save to progress tracking
    const existingProgress = JSON.parse(localStorage.getItem('healthmate_progress_data') || '[]');
    const updatedProgress = [...existingProgress.filter((p: any) => p.date !== checkIn.date), progressEntry];
    localStorage.setItem('healthmate_progress_data', JSON.stringify(updatedProgress));
  };

  const showCompletionMessage = (checkIn: CheckInData) => {
    const score = checkIn.overallWellness;
    let message = '';
    
    if (score >= 8) {
      message = '🎉 Excellent! You\'re having a great day. Keep up the fantastic work!';
    } else if (score >= 6) {
      message = '👍 Good progress! You\'re doing well on your recovery journey.';
    } else if (score >= 4) {
      message = '💪 Hang in there! Some days are tougher, but you\'re still making progress.';
    } else {
      message = '🤗 We\'re here for you. Consider reaching out to your care team for additional support.';
    }
    
    // Show notification or modal with the message
    setTimeout(() => {
      alert(message);
    }, 1000);
  };

  const exportCheckInData = () => {
    if (!checkInData.id) return;
    
    const exportData = {
      ...checkInData,
      exportedAt: new Date().toISOString(),
      exportedBy: user?.name || 'User'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `daily-checkin-${checkInData.date}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const shareCheckInSummary = () => {
    if (!checkInData.id) return;
    
    const summary = `Daily Check-in Summary - ${checkInData.date}
    
Overall Wellness: ${checkInData.overallWellness}/10
Physical Score: ${checkInData.physicalScore}/10
Mental Score: ${checkInData.mentalScore}/10
Medication Adherence: ${checkInData.adherenceScore}/10

Key Highlights:
${checkInData.achievements?.map(a => `✅ ${a}`).join('\n') || 'No achievements today'}

${checkInData.redFlags?.length ? `⚠️ Concerns: ${checkInData.redFlags.join(', ')}` : ''}

Generated by HealthMate.AI`;

    if (navigator.share) {
      navigator.share({
        title: 'Daily Check-in Summary',
        text: summary
      });
    } else {
      navigator.clipboard.writeText(summary);
      alert('Summary copied to clipboard!');
    }
  };

  const restartCheckIn = () => {
    if (confirm('Are you sure you want to restart your check-in? This will clear all current progress.')) {
      // Clear all data
      setPhysicalData({
        symptoms: [],
        description: '',
        painLevel: 5,
        painLocation: [],
        energyLevel: 5,
        fatigueLevel: 5,
        nauseaLevel: 1,
        dizzinessLevel: 1,
        appetiteLevel: 5,
        mobilityLevel: 5
      });
      
      setMentalData({
        mood: 5,
        description: '',
        stressLevel: 5,
        anxietyLevel: 5,
        depressionLevel: 1,
        motivationLevel: 5,
        concentrationLevel: 5,
        emotionalState: []
      });
      
      setMedicationData({
        adherence: 'all',
        medications: [],
        sideEffects: [],
        sideEffectSeverity: 1,
        missedReason: ''
      });
      
      setNutritionData({
        mealsStatus: 'all-planned',
        meals: [],
        waterIntake: 8,
        hydrationLevel: 5,
        cravings: []
      });
      
      setActivityData({
        exerciseCompleted: false,
        exercises: [],
        stepCount: 0,
        activeMinutes: 0
      });
      
      setSleepData({
        quality: 5,
        hours: 8,
        bedTime: '22:00',
        wakeTime: '07:00',
        interruptions: 0,
        aids: [],
        dreamQuality: 'neutral'
      });
      
      setVitalsData({
        bloodPressure: { systolic: 120, diastolic: 80 },
        heartRate: 70,
        temperature: 98.6,
        weight: 0,
        bloodSugar: 0,
        oxygenSaturation: 98
      });
      
      setCareTeamData({
        notes: '',
        urgentConcerns: [],
        questions: [],
        appointmentRequests: []
      });
      
      setCurrentSection(0);
      setIsCompleted(false);
      setCheckInData({});
      setSectionProgress({});
      setOverallProgress(0);
      
      // Clear saved data
      const today = new Date().toISOString().split('T')[0];
      localStorage.removeItem(`healthmate_checkin_${today}`);
      localStorage.removeItem('healthmate_checkin_draft');
    }
  };

  // Render completed check-in summary
  if (isCompleted && checkInData.id) {
    return (
      <div className="space-y-8">
        {/* Completion Header */}
        <div className="text-center">
          <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Check-in Complete!</h1>
          <p className="text-gray-600">Thank you for taking the time to track your health today.</p>
          <div className="mt-4 text-sm text-gray-500">
            Completed in {Math.floor((checkInData.completionTime || 0) / 60)} minutes • {new Date(checkInData.completedAt || '').toLocaleString()}
          </div>
        </div>

        {/* Overall Wellness Score */}
        <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-emerald-900 mb-4">Today's Wellness Score</h3>
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600">{checkInData.overallWellness}/10</div>
                <div className="text-sm text-emerald-700">Overall</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{checkInData.physicalScore}/10</div>
                <div className="text-sm text-blue-700">Physical</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{checkInData.mentalScore}/10</div>
                <div className="text-sm text-purple-700">Mental</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{checkInData.adherenceScore}/10</div>
                <div className="text-sm text-orange-700">Adherence</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Achievements & Alerts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Achievements */}
          {checkInData.achievements && checkInData.achievements.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-600" />
                Today's Achievements
              </h3>
              <div className="space-y-2">
                {checkInData.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <span className="text-yellow-800">{achievement}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Alerts */}
          {(checkInData.redFlags?.length || checkInData.yellowFlags?.length) && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                Health Alerts
              </h3>
              <div className="space-y-2">
                {checkInData.redFlags?.map((flag, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="text-red-800">{flag}</span>
                  </div>
                ))}
                {checkInData.yellowFlags?.map((flag, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <span className="text-yellow-800">{flag}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Detailed Summary */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Detailed Summary</h3>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowSummary(!showSummary)} icon={Eye}>
                {showSummary ? 'Hide' : 'Show'} Details
              </Button>
              <Button variant="outline" onClick={shareCheckInSummary} icon={Share2}>
                Share
              </Button>
              <Button variant="outline" onClick={exportCheckInData} icon={Download}>
                Export
              </Button>
            </div>
          </div>

          {showSummary && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Physical Health */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Thermometer className="h-4 w-4 mr-2" />
                  Physical Health
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pain Level:</span>
                    <span className="font-medium">{checkInData.painLevel}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Energy Level:</span>
                    <span className="font-medium">{checkInData.energyLevel}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mobility:</span>
                    <span className="font-medium">{checkInData.mobilityLevel}/10</span>
                  </div>
                  {checkInData.physicalSymptoms && checkInData.physicalSymptoms.length > 0 && (
                    <div>
                      <span className="text-gray-600">Symptoms:</span>
                      <div className="mt-1">
                        {checkInData.physicalSymptoms.map((symptom, index) => (
                          <span key={index} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mr-1 mb-1">
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mental Health */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Brain className="h-4 w-4 mr-2" />
                  Mental Health
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mood:</span>
                    <span className="font-medium">{checkInData.mood}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stress Level:</span>
                    <span className="font-medium">{checkInData.stressLevel}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Anxiety Level:</span>
                    <span className="font-medium">{checkInData.anxietyLevel}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Motivation:</span>
                    <span className="font-medium">{checkInData.motivationLevel}/10</span>
                  </div>
                </div>
              </div>

              {/* Medications */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Pill className="h-4 w-4 mr-2" />
                  Medications
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Adherence:</span>
                    <span className={`font-medium ${
                      checkInData.medicationsTaken === 'all' ? 'text-green-600' :
                      checkInData.medicationsTaken === 'some' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {checkInData.medicationsTaken === 'all' ? 'All taken' :
                       checkInData.medicationsTaken === 'some' ? 'Some missed' : 'None taken'}
                    </span>
                  </div>
                  {checkInData.sideEffects && checkInData.sideEffects.length > 0 && (
                    <div>
                      <span className="text-gray-600">Side Effects:</span>
                      <div className="mt-1">
                        {checkInData.sideEffects.map((effect, index) => (
                          <span key={index} className="inline-block bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs mr-1 mb-1">
                            {effect}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sleep */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Moon className="h-4 w-4 mr-2" />
                  Sleep
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quality:</span>
                    <span className="font-medium">{checkInData.sleepQuality}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{checkInData.sleepHours} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bedtime:</span>
                    <span className="font-medium">{checkInData.bedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wake Time:</span>
                    <span className="font-medium">{checkInData.wakeTime}</span>
                  </div>
                </div>
              </div>

              {/* Nutrition */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <UtensilsCrossed className="h-4 w-4 mr-2" />
                  Nutrition
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Meal Plan:</span>
                    <span className="font-medium capitalize">{checkInData.mealsStatus?.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Water Intake:</span>
                    <span className="font-medium">{checkInData.waterIntake} glasses</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hydration Level:</span>
                    <span className="font-medium">{checkInData.hydrationLevel}/10</span>
                  </div>
                </div>
              </div>

              {/* Activity */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Activity className="h-4 w-4 mr-2" />
                  Physical Activity
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Exercise:</span>
                    <span className={`font-medium ${checkInData.exerciseCompleted ? 'text-green-600' : 'text-gray-600'}`}>
                      {checkInData.exerciseCompleted ? 'Completed' : 'Not completed'}
                    </span>
                  </div>
                  {checkInData.stepCount && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Steps:</span>
                      <span className="font-medium">{checkInData.stepCount.toLocaleString()}</span>
                    </div>
                  )}
                  {checkInData.activeMinutes && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Minutes:</span>
                      <span className="font-medium">{checkInData.activeMinutes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Care Team Notes */}
        {checkInData.careTeamNotes && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Notes to Care Team
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">{checkInData.careTeamNotes}</p>
            </div>
            {checkInData.needsFollowUp && (
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Follow-up recommended</span>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" onClick={() => setShowHistory(true)} icon={Calendar} className="flex-1">
            View History
          </Button>
          <Button variant="outline" onClick={restartCheckIn} icon={RotateCcw} className="flex-1">
            Retake Check-in
          </Button>
          <Button variant="primary" onClick={() => window.location.href = '/progress'} icon={TrendingUp} className="flex-1">
            View Progress
          </Button>
        </div>

        {/* Check-in History Modal */}
        {showHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Check-in History</h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {checkInHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No previous check-ins</h4>
                    <p className="text-gray-600">This is your first check-in. Keep it up!</p>
                  </div>
                ) : (
                  checkInHistory.map((entry) => (
                    <div key={entry.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{new Date(entry.date).toLocaleDateString()}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Overall: {entry.overallWellness}/10</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedHistoryEntry(entry)}
                            icon={Eye}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Physical:</span>
                          <span className="ml-1 font-medium">{entry.physicalScore}/10</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Mental:</span>
                          <span className="ml-1 font-medium">{entry.mentalScore}/10</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Adherence:</span>
                          <span className="ml-1 font-medium">{entry.adherenceScore}/10</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Sleep:</span>
                          <span className="ml-1 font-medium">{entry.sleepQuality}/10</span>
                        </div>
                      </div>
                      {entry.achievements && entry.achievements.length > 0 && (
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-1">
                            {entry.achievements.slice(0, 3).map((achievement, index) => (
                              <span key={index} className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                                {achievement}
                              </span>
                            ))}
                            {entry.achievements.length > 3 && (
                              <span className="text-xs text-gray-500">+{entry.achievements.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // Render check-in form
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Check-in</h1>
        <p className="text-gray-600">Your comprehensive health tracking for today</p>
        <div className="mt-4 text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-emerald-900">Check-in Progress</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-emerald-700">{overallProgress}% Complete</span>
            <div className="w-20 bg-emerald-200 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sections.slice(0, 4).map((section, index) => {
            const Icon = section.icon;
            const progress = sectionProgress[section.id] || 0;
            const isActive = index === currentSection;
            const isCompleted = progress >= 80;
            
            return (
              <div key={section.id} className={`p-3 rounded-lg border-2 transition-all ${
                isActive ? 'border-emerald-500 bg-emerald-100' :
                isCompleted ? 'border-green-500 bg-green-50' :
                'border-emerald-200 bg-white'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Icon className={`h-4 w-4 ${
                    isActive ? 'text-emerald-600' :
                    isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <span className={`text-sm font-medium ${
                    isActive ? 'text-emerald-900' :
                    isCompleted ? 'text-green-900' : 'text-gray-600'
                  }`}>
                    {section.title}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full transition-all duration-300 ${
                      isCompleted ? 'bg-green-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Current Section */}
      <Card className="min-h-[500px]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {React.createElement(sections[currentSection].icon, { 
              className: "h-6 w-6 text-emerald-600" 
            })}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {sections[currentSection].title}
              </h2>
              <p className="text-gray-600">{sections[currentSection].description}</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Step {currentSection + 1} of {sections.length}
          </div>
        </div>

        {/* Section Content */}
        <div className="space-y-6">
          {/* Physical Well-being Section */}
          {currentSection === 0 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How are you feeling physically today? Select all that apply:
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {physicalSymptoms.map((symptom) => (
                    <button
                      key={symptom.id}
                      onClick={() => handleQuickResponse(symptom, 'physical')}
                      className={`flex items-center space-x-2 p-3 border-2 rounded-lg transition-all ${
                        physicalData.symptoms.includes(symptom.value)
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-lg">{symptom.icon}</span>
                      <span className="text-sm font-medium">{symptom.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pain Level (1 = No pain, 10 = Severe pain)
                </label>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">1</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={physicalData.painLevel}
                    onChange={(e) => setPhysicalData(prev => ({ ...prev, painLevel: parseInt(e.target.value) }))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">10</span>
                  <div className="bg-emerald-100 px-3 py-1 rounded-lg">
                    <span className="text-emerald-700 font-medium">{physicalData.painLevel}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Energy Level (1 = Very low, 10 = Very high)
                </label>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">1</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={physicalData.energyLevel}
                    onChange={(e) => setPhysicalData(prev => ({ ...prev, energyLevel: parseInt(e.target.value) }))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">10</span>
                  <div className="bg-blue-100 px-3 py-1 rounded-lg">
                    <span className="text-blue-700 font-medium">{physicalData.energyLevel}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional details about your physical condition:
                </label>
                <textarea
                  value={physicalData.description}
                  onChange={(e) => setPhysicalData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Describe any specific symptoms, improvements, or concerns..."
                />
              </div>
            </div>
          )}

          {/* Mental & Emotional Health Section */}
          {currentSection === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Mood (1 = Very low, 10 = Excellent)
                </label>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">1</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={mentalData.mood}
                    onChange={(e) => setMentalData(prev => ({ ...prev, mood: parseInt(e.target.value) }))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">10</span>
                  <div className="bg-purple-100 px-3 py-1 rounded-lg">
                    <span className="text-purple-700 font-medium">{mentalData.mood}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How are you feeling emotionally? Select all that apply:
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {emotionalStates.map((state) => (
                    <button
                      key={state.id}
                      onClick={() => handleQuickResponse(state, 'mental')}
                      className={`flex items-center space-x-2 p-3 border-2 rounded-lg transition-all ${
                        mentalData.emotionalState.includes(state.value)
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-lg">{state.icon}</span>
                      <span className="text-sm font-medium">{state.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stress Level (1 = No stress, 10 = Very stressed)
                  </label>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">1</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={mentalData.stressLevel}
                      onChange={(e) => setMentalData(prev => ({ ...prev, stressLevel: parseInt(e.target.value) }))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm text-gray-600">10</span>
                    <div className="bg-orange-100 px-3 py-1 rounded-lg">
                      <span className="text-orange-700 font-medium">{mentalData.stressLevel}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Anxiety Level (1 = No anxiety, 10 = Very anxious)
                  </label>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">1</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={mentalData.anxietyLevel}
                      onChange={(e) => setMentalData(prev => ({ ...prev, anxietyLevel: parseInt(e.target.value) }))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm text-gray-600">10</span>
                    <div className="bg-red-100 px-3 py-1 rounded-lg">
                      <span className="text-red-700 font-medium">{mentalData.anxietyLevel}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional thoughts or feelings you'd like to share:
                </label>
                <textarea
                  value={mentalData.description}
                  onChange={(e) => setMentalData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Describe your emotional state, any triggers, or positive moments..."
                />
              </div>
            </div>
          )}

          {/* Medication Adherence Section */}
          {currentSection === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Did you take all your prescribed medications today?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'all', label: 'All medications taken', icon: '✅', color: 'green' },
                    { value: 'some', label: 'Some medications missed', icon: '⚠️', color: 'yellow' },
                    { value: 'none', label: 'No medications taken', icon: '❌', color: 'red' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setMedicationData(prev => ({ ...prev, adherence: option.value as any }))}
                      className={`flex items-center space-x-2 p-4 border-2 rounded-lg transition-all ${
                        medicationData.adherence === option.value
                          ? `border-${option.color}-500 bg-${option.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-lg">{option.icon}</span>
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {medicationData.adherence !== 'all' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why did you miss some medications?
                  </label>
                  <select
                    value={medicationData.missedReason}
                    onChange={(e) => setMedicationData(prev => ({ ...prev, missedReason: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select a reason</option>
                    <option value="forgot">Forgot to take them</option>
                    <option value="side-effects">Experiencing side effects</option>
                    <option value="feeling-better">Feeling better, didn't think I needed them</option>
                    <option value="ran-out">Ran out of medication</option>
                    <option value="too-expensive">Too expensive</option>
                    <option value="other">Other reason</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Are you experiencing any side effects? Select all that apply:
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {commonSideEffects.map((effect) => (
                    <button
                      key={effect.id}
                      onClick={() => handleQuickResponse(effect, 'medications')}
                      className={`flex items-center space-x-2 p-3 border-2 rounded-lg transition-all ${
                        medicationData.sideEffects.includes(effect.value) || (effect.value === 'none' && medicationData.sideEffects.length === 0)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-lg">{effect.icon}</span>
                      <span className="text-sm font-medium">{effect.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {medicationData.sideEffects.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How severe are the side effects? (1 = Mild, 10 = Severe)
                  </label>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">1</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={medicationData.sideEffectSeverity}
                      onChange={(e) => setMedicationData(prev => ({ ...prev, sideEffectSeverity: parseInt(e.target.value) }))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm text-gray-600">10</span>
                    <div className="bg-orange-100 px-3 py-1 rounded-lg">
                      <span className="text-orange-700 font-medium">{medicationData.sideEffectSeverity}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Nutrition & Hydration Section */}
          {currentSection === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How well did you follow your meal plan today?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'all-planned', label: 'Followed all planned meals', icon: '✅' },
                    { value: 'some-planned', label: 'Followed some planned meals', icon: '⚠️' },
                    { value: 'none-planned', label: 'Didn\'t follow meal plan', icon: '❌' },
                    { value: 'off-plan', label: 'Ate different foods', icon: '🍔' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setNutritionData(prev => ({ ...prev, mealsStatus: option.value as any }))}
                      className={`flex items-center space-x-2 p-3 border-2 rounded-lg transition-all ${
                        nutritionData.mealsStatus === option.value
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-lg">{option.icon}</span>
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Water intake (glasses consumed today)
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setNutritionData(prev => ({ ...prev, waterIntake: Math.max(0, prev.waterIntake - 1) }))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="flex-1 text-center">
                    <div className="bg-blue-100 px-4 py-2 rounded-lg">
                      <span className="text-2xl font-bold text-blue-700">{nutritionData.waterIntake}</span>
                      <span className="text-sm text-blue-600 ml-2">glasses</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setNutritionData(prev => ({ ...prev, waterIntake: prev.waterIntake + 1 }))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 text-center text-sm text-gray-600">
                  Recommended: 8-10 glasses per day
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How hydrated do you feel? (1 = Very dehydrated, 10 = Well hydrated)
                </label>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">1</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={nutritionData.hydrationLevel}
                    onChange={(e) => setNutritionData(prev => ({ ...prev, hydrationLevel: parseInt(e.target.value) }))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">10</span>
                  <div className="bg-blue-100 px-3 py-1 rounded-lg">
                    <span className="text-blue-700 font-medium">{nutritionData.hydrationLevel}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Physical Activity Section */}
          {currentSection === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Did you complete any physical activity today?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setActivityData(prev => ({ ...prev, exerciseCompleted: true }))}
                    className={`flex items-center space-x-2 p-4 border-2 rounded-lg transition-all ${
                      activityData.exerciseCompleted
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">Yes, I exercised</span>
                  </button>
                  <button
                    onClick={() => setActivityData(prev => ({ ...prev, exerciseCompleted: false }))}
                    className={`flex items-center space-x-2 p-4 border-2 rounded-lg transition-all ${
                      !activityData.exerciseCompleted
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <X className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium">No exercise today</span>
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Step count (if available)
                  </label>
                  <input
                    type="number"
                    value={activityData.stepCount}
                    onChange={(e) => setActivityData(prev => ({ ...prev, stepCount: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Active minutes
                  </label>
                  <input
                    type="number"
                    value={activityData.activeMinutes}
                    onChange={(e) => setActivityData(prev => ({ ...prev, activeMinutes: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0"
                  />
                </div>
              </div>

              {activityData.exerciseCompleted && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What type of activities did you do?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { id: 'walking', label: 'Walking', icon: '🚶' },
                      { id: 'stretching', label: 'Stretching', icon: '🤸' },
                      { id: 'yoga', label: 'Yoga', icon: '🧘' },
                      { id: 'swimming', label: 'Swimming', icon: '🏊' },
                      { id: 'cycling', label: 'Cycling', icon: '🚴' },
                      { id: 'strength', label: 'Strength Training', icon: '💪' }
                    ].map((activity) => (
                      <button
                        key={activity.id}
                        className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                      >
                        <span className="text-lg">{activity.icon}</span>
                        <span className="text-sm font-medium">{activity.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sleep Quality Section */}
          {currentSection === 5 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sleep Quality (1 = Very poor, 10 = Excellent)
                </label>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">1</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={sleepData.quality}
                    onChange={(e) => setSleepData(prev => ({ ...prev, quality: parseInt(e.target.value) }))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">10</span>
                  <div className="bg-indigo-100 px-3 py-1 rounded-lg">
                    <span className="text-indigo-700 font-medium">{sleepData.quality}</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hours of sleep
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={sleepData.hours}
                    onChange={(e) => setSleepData(prev => ({ ...prev, hours: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="8"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedtime
                  </label>
                  <input
                    type="time"
                    value={sleepData.bedTime}
                    onChange={(e) => setSleepData(prev => ({ ...prev, bedTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wake time
                  </label>
                  <input
                    type="time"
                    value={sleepData.wakeTime}
                    onChange={(e) => setSleepData(prev => ({ ...prev, wakeTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of sleep interruptions
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setSleepData(prev => ({ ...prev, interruptions: Math.max(0, prev.interruptions - 1) }))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="flex-1 text-center">
                    <div className="bg-purple-100 px-4 py-2 rounded-lg">
                      <span className="text-2xl font-bold text-purple-700">{sleepData.interruptions}</span>
                      <span className="text-sm text-purple-600 ml-2">times</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSleepData(prev => ({ ...prev, interruptions: prev.interruptions + 1 }))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Dream quality
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { value: 'none', label: 'No dreams', icon: '😶' },
                    { value: 'pleasant', label: 'Pleasant', icon: '😊' },
                    { value: 'neutral', label: 'Neutral', icon: '😐' },
                    { value: 'nightmares', label: 'Nightmares', icon: '😰' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSleepData(prev => ({ ...prev, dreamQuality: option.value as any }))}
                      className={`flex items-center space-x-2 p-3 border-2 rounded-lg transition-all ${
                        sleepData.dreamQuality === option.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-lg">{option.icon}</span>
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Vitals & Measurements Section */}
          {currentSection === 6 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <p className="text-gray-600">Record any vital signs or measurements you've taken today (optional)</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Pressure
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={vitalsData.bloodPressure.systolic}
                      onChange={(e) => setVitalsData(prev => ({ 
                        ...prev, 
                        bloodPressure: { ...prev.bloodPressure, systolic: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="120"
                    />
                    <span className="text-gray-500">/</span>
                    <input
                      type="number"
                      value={vitalsData.bloodPressure.diastolic}
                      onChange={(e) => setVitalsData(prev => ({ 
                        ...prev, 
                        bloodPressure: { ...prev.bloodPressure, diastolic: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="80"
                    />
                    <span className="text-gray-500 text-sm">mmHg</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heart Rate
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={vitalsData.heartRate}
                      onChange={(e) => setVitalsData(prev => ({ ...prev, heartRate: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="70"
                    />
                    <span className="text-gray-500 text-sm">bpm</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperature
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      step="0.1"
                      value={vitalsData.temperature}
                      onChange={(e) => setVitalsData(prev => ({ ...prev, temperature: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="98.6"
                    />
                    <span className="text-gray-500 text-sm">°F</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      step="0.1"
                      value={vitalsData.weight}
                      onChange={(e) => setVitalsData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="150"
                    />
                    <span className="text-gray-500 text-sm">lbs</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Sugar
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={vitalsData.bloodSugar}
                      onChange={(e) => setVitalsData(prev => ({ ...prev, bloodSugar: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="100"
                    />
                    <span className="text-gray-500 text-sm">mg/dL</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Oxygen Saturation
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={vitalsData.oxygenSaturation}
                      onChange={(e) => setVitalsData(prev => ({ ...prev, oxygenSaturation: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="98"
                    />
                    <span className="text-gray-500 text-sm">%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Care Team Notes Section */}
          {currentSection === 7 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes for your care team
                </label>
                <textarea
                  value={careTeamData.notes}
                  onChange={(e) => setCareTeamData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Share any concerns, questions, or updates about your recovery..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Do you have any urgent concerns?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Severe pain increase',
                    'New symptoms',
                    'Medication concerns',
                    'Wound healing issues',
                    'Mental health concerns',
                    'Emergency situation'
                  ].map((concern) => (
                    <button
                      key={concern}
                      onClick={() => {
                        setCareTeamData(prev => ({
                          ...prev,
                          urgentConcerns: prev.urgentConcerns.includes(concern)
                            ? prev.urgentConcerns.filter(c => c !== concern)
                            : [...prev.urgentConcerns, concern]
                        }));
                      }}
                      className={`p-3 border-2 rounded-lg transition-all text-left ${
                        careTeamData.urgentConcerns.includes(concern)
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-sm font-medium">{concern}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Questions for your healthcare team
                </label>
                <textarea
                  value={careTeamData.questions.join('\n')}
                  onChange={(e) => setCareTeamData(prev => ({ 
                    ...prev, 
                    questions: e.target.value.split('\n').filter(q => q.trim()) 
                  }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter each question on a new line..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={previousSection}
            disabled={currentSection === 0}
            className="flex items-center space-x-2"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            <span>Previous</span>
          </Button>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {Math.round(calculateSectionProgress(sections[currentSection].id))}% complete
            </span>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${calculateSectionProgress(sections[currentSection].id)}%` }}
              ></div>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={nextSection}
            className="flex items-center space-x-2"
          >
            <span>{currentSection === sections.length - 1 ? 'Complete Check-in' : 'Next'}</span>
            {currentSection !== sections.length - 1 && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            onClick={() => setShowVoiceInput(true)}
            icon={Mic}
            className="h-16 flex-col space-y-1"
          >
            <span className="text-xs">Voice</span>
            <span className="font-medium">Input</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowPhotoCapture(true)}
            icon={Camera}
            className="h-16 flex-col space-y-1"
          >
            <span className="text-xs">Photo</span>
            <span className="font-medium">Capture</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowHistory(true)}
            icon={Calendar}
            className="h-16 flex-col space-y-1"
          >
            <span className="text-xs">View</span>
            <span className="font-medium">History</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowAdvancedOptions(true)}
            icon={Settings}
            className="h-16 flex-col space-y-1"
          >
            <span className="text-xs">Advanced</span>
            <span className="font-medium">Options</span>
          </Button>
        </div>
      </Card>

      {/* Environmental Context */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Context</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4 text-yellow-600" />
            <span className="text-gray-600">Weather:</span>
            <span className="font-medium capitalize">{currentWeather}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Monitor className="h-4 w-4 text-blue-600" />
            <span className="text-gray-600">Device:</span>
            <span className="font-medium capitalize">{deviceInfo.type}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Battery className="h-4 w-4 text-green-600" />
            <span className="text-gray-600">Battery:</span>
            <span className="font-medium">{deviceInfo.battery}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wifi className="h-4 w-4 text-emerald-600" />
            <span className="text-gray-600">Connection:</span>
            <span className="font-medium capitalize">{deviceInfo.connectivity}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DailyCheckInPage;