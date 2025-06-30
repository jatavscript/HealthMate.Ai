import React, { useState, useEffect } from 'react';
import { Plus, Play, Pause, CheckCircle, Clock, Calendar, Activity, Heart, Target, TrendingUp, Edit3, Trash2, Search, Filter, BarChart3, User, Shield, AlertCircle, Info, Star, Timer, Repeat, Volume2, VolumeX, Bell, BellOff, Award, Zap, FileMusic as Dumbbell, Wind, Footprints, StretchVertical as Yoga, X, Save, Upload, ExternalLink, MessageSquare, ThumbsUp, ThumbsDown, AlertTriangle, CheckSquare, Square, MoreVertical, Copy, Share2, Download, Eye, EyeOff, RefreshCw, Settings, BookOpen, Video, Image, FileText, Loader2 } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useApp } from '../contexts/AppContext';
import { Exercise, ExerciseCompletion, ExerciseNote, ExerciseTemplate, WeeklySchedule } from '../types/exercise';

const ExercisesPage: React.FC = () => {
  const { user } = useApp();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseTemplates, setExerciseTemplates] = useState<ExerciseTemplate[]>([]);
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'all' | 'templates' | 'analytics'>('today');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showExerciseDetail, setShowExerciseDetail] = useState<Exercise | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState<Exercise | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);

  const [exerciseForm, setExerciseForm] = useState({
    name: '',
    category: 'stretching' as Exercise['category'],
    daysAssigned: [] as string[],
    duration: 10,
    instructions: '',
    mediaUrl: '',
    mediaType: 'youtube' as 'youtube' | 'gif' | 'image' | 'video',
    difficulty: 'easy' as Exercise['difficulty'],
    targetMuscleGroups: [] as string[],
    equipment: [] as string[],
    precautions: [] as string[],
    benefits: [] as string[],
    repetitions: 10,
    sets: 1,
    restBetweenSets: 30,
    prescribedBy: '',
    notes: '',
    reminderEnabled: true,
    reminderTimes: ['08:00'] as string[]
  });

  const [completionForm, setCompletionForm] = useState({
    completed: true,
    duration: 0,
    difficulty: 'just-right' as 'too-easy' | 'just-right' | 'too-hard',
    painLevel: 0,
    notes: '',
    mood: 'good' as 'great' | 'good' | 'okay' | 'tired' | 'painful'
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const categories = ['stretching', 'breathing', 'strength', 'cardio', 'yoga', 'walking', 'mobility', 'flexibility'];
  const difficulties = ['easy', 'moderate', 'hard'];
  const muscleGroups = ['Arms', 'Legs', 'Core', 'Back', 'Chest', 'Shoulders', 'Neck', 'Full Body'];
  const equipmentOptions = ['None', 'Resistance Band', 'Light Weights', 'Chair', 'Wall', 'Pillow', 'Towel', 'Yoga Mat'];

  // Initialize with sample data
  useEffect(() => {
    const sampleExercises: Exercise[] = [
      {
        id: '1',
        userId: user?.id || '1',
        name: 'Gentle Neck Stretches',
        category: 'stretching',
        daysAssigned: ['Monday', 'Wednesday', 'Friday'],
        duration: 5,
        instructions: 'Slowly turn your head left and right, then up and down. Hold each position for 10 seconds. Repeat 3 times in each direction.',
        mediaUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        mediaType: 'youtube',
        status: 'active',
        approvedByPhysician: true,
        prescribedBy: 'Dr. Sarah Smith',
        difficulty: 'easy',
        targetMuscleGroups: ['Neck', 'Shoulders'],
        equipment: ['None'],
        precautions: ['Stop if you feel dizzy', 'Move slowly and gently'],
        benefits: ['Reduces neck tension', 'Improves flexibility', 'Relieves headaches'],
        repetitions: 3,
        sets: 1,
        restBetweenSets: 0,
        isMandatory: true,
        createdAt: '2025-01-15T08:00:00Z',
        updatedAt: '2025-01-19T08:00:00Z',
        completionLog: [
          {
            id: '1',
            exerciseId: '1',
            date: '2025-01-19',
            completed: true,
            duration: 5,
            difficulty: 'just-right',
            painLevel: 2,
            notes: 'Felt good, less tension',
            timestamp: '2025-01-19T08:30:00Z'
          }
        ],
        adherenceRate: 85.7,
        totalSessions: 21,
        completedSessions: 18,
        notes: 'Essential for post-surgery neck mobility',
        patientNotes: [
          {
            id: '1',
            exerciseId: '1',
            date: '2025-01-19',
            note: 'Feeling much better after doing this regularly',
            mood: 'good',
            timestamp: '2025-01-19T08:35:00Z'
          }
        ],
        reminderEnabled: true,
        reminderTimes: ['08:00', '14:00', '20:00']
      },
      {
        id: '2',
        userId: user?.id || '1',
        name: 'Deep Breathing Exercise',
        category: 'breathing',
        daysAssigned: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        duration: 10,
        instructions: 'Sit comfortably with your back straight. Breathe in slowly through your nose for 4 counts, hold for 4 counts, then exhale through your mouth for 6 counts. Repeat for 10 minutes.',
        status: 'active',
        approvedByPhysician: true,
        prescribedBy: 'Dr. Michael Johnson',
        difficulty: 'easy',
        targetMuscleGroups: ['Core'],
        equipment: ['None'],
        precautions: ['Stop if you feel lightheaded'],
        benefits: ['Reduces stress', 'Improves oxygen flow', 'Promotes relaxation'],
        repetitions: 20,
        sets: 1,
        restBetweenSets: 0,
        isMandatory: false,
        createdAt: '2025-01-10T09:00:00Z',
        updatedAt: '2025-01-19T09:00:00Z',
        completionLog: [
          {
            id: '2',
            exerciseId: '2',
            date: '2025-01-19',
            completed: true,
            duration: 10,
            difficulty: 'just-right',
            painLevel: 0,
            notes: 'Very relaxing',
            timestamp: '2025-01-19T09:15:00Z'
          }
        ],
        adherenceRate: 92.3,
        totalSessions: 35,
        completedSessions: 32,
        notes: 'Helps with anxiety and recovery',
        patientNotes: [],
        reminderEnabled: true,
        reminderTimes: ['09:00', '15:00', '21:00']
      },
      {
        id: '3',
        userId: user?.id || '1',
        name: 'Seated Leg Raises',
        category: 'strength',
        daysAssigned: ['Tuesday', 'Thursday', 'Saturday'],
        duration: 15,
        instructions: 'Sit in a sturdy chair with your back straight. Slowly lift one leg until it\'s straight out in front of you. Hold for 5 seconds, then lower slowly. Repeat with the other leg.',
        status: 'active',
        approvedByPhysician: true,
        prescribedBy: 'Dr. Sarah Smith',
        difficulty: 'moderate',
        targetMuscleGroups: ['Legs', 'Core'],
        equipment: ['Chair'],
        precautions: ['Use chair with armrests for support', 'Stop if knee pain occurs'],
        benefits: ['Strengthens quadriceps', 'Improves leg circulation', 'Builds core stability'],
        repetitions: 10,
        sets: 2,
        restBetweenSets: 60,
        isMandatory: true,
        createdAt: '2025-01-12T10:00:00Z',
        updatedAt: '2025-01-19T10:00:00Z',
        completionLog: [],
        adherenceRate: 76.9,
        totalSessions: 13,
        completedSessions: 10,
        notes: 'Important for leg strength recovery',
        patientNotes: [],
        reminderEnabled: false,
        reminderTimes: []
      }
    ];

    const sampleTemplates: ExerciseTemplate[] = [
      {
        id: 't1',
        name: 'Ankle Circles',
        category: 'mobility',
        difficulty: 'easy',
        duration: 5,
        instructions: 'Sit or lie down comfortably. Lift one foot and slowly rotate your ankle in circles. Do 10 circles clockwise, then 10 counterclockwise. Repeat with the other foot.',
        targetMuscleGroups: ['Legs'],
        equipment: ['None'],
        benefits: ['Improves ankle mobility', 'Reduces swelling', 'Prevents blood clots'],
        precautions: ['Move slowly and gently'],
        isPopular: true,
        conditionSpecific: ['post-surgery', 'orthopedic']
      },
      {
        id: 't2',
        name: 'Wall Push-ups',
        category: 'strength',
        difficulty: 'moderate',
        duration: 8,
        instructions: 'Stand arm\'s length from a wall. Place palms flat against the wall at shoulder height. Slowly push your body toward the wall, then push back to starting position.',
        targetMuscleGroups: ['Arms', 'Chest', 'Shoulders'],
        equipment: ['Wall'],
        benefits: ['Builds upper body strength', 'Improves posture', 'Low impact exercise'],
        precautions: ['Keep core engaged', 'Don\'t lock elbows'],
        isPopular: true,
        conditionSpecific: ['cardiac', 'general']
      },
      {
        id: 't3',
        name: 'Gentle Yoga Flow',
        category: 'yoga',
        difficulty: 'easy',
        duration: 20,
        instructions: 'A series of gentle yoga poses including cat-cow stretch, child\'s pose, and gentle twists. Move slowly and breathe deeply throughout.',
        mediaUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        targetMuscleGroups: ['Full Body'],
        equipment: ['Yoga Mat'],
        benefits: ['Improves flexibility', 'Reduces stress', 'Enhances balance'],
        precautions: ['Listen to your body', 'Don\'t force any positions'],
        isPopular: true,
        conditionSpecific: ['general', 'stress-relief']
      }
    ];

    setExercises(sampleExercises);
    setExerciseTemplates(sampleTemplates);
  }, [user]);

  // Get today's exercises
  const getTodaysExercises = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return exercises.filter(exercise => 
      exercise.daysAssigned.includes(today) && exercise.status === 'active'
    );
  };

  // Get exercises for selected date
  const getExercisesForDate = (date: string) => {
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    return exercises.filter(exercise => 
      exercise.daysAssigned.includes(dayName) && exercise.status === 'active'
    );
  };

  // Filter exercises
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.instructions.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || exercise.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || exercise.status === filterStatus;
    const matchesDifficulty = filterDifficulty === 'all' || exercise.difficulty === filterDifficulty;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesDifficulty;
  });

  // Handle form changes
  const handleFormChange = (field: string, value: any) => {
    setExerciseForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayFieldChange = (field: string, value: string, checked: boolean) => {
    setExerciseForm(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  // Create new exercise
  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      const newExercise: Exercise = {
        id: Date.now().toString(),
        userId: user?.id || '1',
        ...exerciseForm,
        status: 'active',
        approvedByPhysician: false,
        isMandatory: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completionLog: [],
        adherenceRate: 100,
        totalSessions: 0,
        completedSessions: 0,
        patientNotes: []
      };

      setExercises(prev => [...prev, newExercise]);
      resetForm();
      setShowAddForm(false);
      setIsLoading(false);
    }, 1000);
  };

  // Update existing exercise
  const handleUpdateExercise = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      if (!editingExercise) return;

      const updatedExercise: Exercise = {
        ...editingExercise,
        ...exerciseForm,
        updatedAt: new Date().toISOString()
      };

      setExercises(prev => prev.map(ex => 
        ex.id === editingExercise.id ? updatedExercise : ex
      ));
      
      resetForm();
      setShowEditForm(false);
      setEditingExercise(null);
      setIsLoading(false);
    }, 1000);
  };

  // Delete exercise
  const handleDeleteExercise = (id: string) => {
    setExercises(prev => prev.filter(ex => ex.id !== id));
    setShowDeleteConfirm(null);
  };

  // Edit exercise
  const handleEditExercise = (exercise: Exercise) => {
    setExerciseForm({
      name: exercise.name,
      category: exercise.category,
      daysAssigned: exercise.daysAssigned,
      duration: exercise.duration,
      instructions: exercise.instructions,
      mediaUrl: exercise.mediaUrl || '',
      mediaType: exercise.mediaType || 'youtube',
      difficulty: exercise.difficulty,
      targetMuscleGroups: exercise.targetMuscleGroups || [],
      equipment: exercise.equipment || [],
      precautions: exercise.precautions || [],
      benefits: exercise.benefits || [],
      repetitions: exercise.repetitions || 10,
      sets: exercise.sets || 1,
      restBetweenSets: exercise.restBetweenSets || 30,
      prescribedBy: exercise.prescribedBy || '',
      notes: exercise.notes || '',
      reminderEnabled: exercise.reminderEnabled,
      reminderTimes: exercise.reminderTimes
    });
    setEditingExercise(exercise);
    setShowEditForm(true);
  };

  // Add exercise from template
  const addFromTemplate = (template: ExerciseTemplate) => {
    setExerciseForm({
      name: template.name,
      category: template.category,
      daysAssigned: ['Monday', 'Wednesday', 'Friday'],
      duration: template.duration,
      instructions: template.instructions,
      mediaUrl: template.mediaUrl || '',
      mediaType: 'youtube',
      difficulty: template.difficulty,
      targetMuscleGroups: template.targetMuscleGroups,
      equipment: template.equipment,
      precautions: template.precautions,
      benefits: template.benefits,
      repetitions: 10,
      sets: 1,
      restBetweenSets: 30,
      prescribedBy: '',
      notes: '',
      reminderEnabled: true,
      reminderTimes: ['08:00']
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setExerciseForm({
      name: '',
      category: 'stretching',
      daysAssigned: [],
      duration: 10,
      instructions: '',
      mediaUrl: '',
      mediaType: 'youtube',
      difficulty: 'easy',
      targetMuscleGroups: [],
      equipment: [],
      precautions: [],
      benefits: [],
      repetitions: 10,
      sets: 1,
      restBetweenSets: 30,
      prescribedBy: '',
      notes: '',
      reminderEnabled: true,
      reminderTimes: ['08:00']
    });
  };

  // Complete exercise
  const handleCompleteExercise = (exercise: Exercise) => {
    setCompletionForm({
      completed: true,
      duration: exercise.duration,
      difficulty: 'just-right',
      painLevel: 0,
      notes: '',
      mood: 'good'
    });
    setShowCompletionModal(exercise);
  };

  const submitCompletion = () => {
    if (!showCompletionModal) return;
    
    const completion: ExerciseCompletion = {
      id: Date.now().toString(),
      exerciseId: showCompletionModal.id,
      date: new Date().toISOString().split('T')[0],
      completed: completionForm.completed,
      duration: completionForm.duration,
      difficulty: completionForm.difficulty,
      painLevel: completionForm.painLevel,
      notes: completionForm.notes,
      timestamp: new Date().toISOString()
    };

    setExercises(prev => prev.map(ex => {
      if (ex.id === showCompletionModal.id) {
        const newCompletionLog = [...ex.completionLog, completion];
        const completedSessions = newCompletionLog.filter(c => c.completed).length;
        const totalSessions = ex.totalSessions + 1;
        const adherenceRate = (completedSessions / totalSessions) * 100;

        return {
          ...ex,
          completionLog: newCompletionLog,
          completedSessions,
          totalSessions,
          adherenceRate: Math.round(adherenceRate * 10) / 10
        };
      }
      return ex;
    }));

    setShowCompletionModal(null);
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'stretching': return Yoga;
      case 'breathing': return Wind;
      case 'strength': return Dumbbell;
      case 'cardio': return Heart;
      case 'yoga': return Yoga;
      case 'walking': return Footprints;
      case 'mobility': return Activity;
      case 'flexibility': return Yoga;
      default: return Activity;
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50 border-green-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'hard': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Calculate analytics
  const totalExercises = exercises.length;
  const activeExercises = exercises.filter(ex => ex.status === 'active').length;
  const averageAdherence = exercises.reduce((sum, ex) => sum + ex.adherenceRate, 0) / exercises.length || 0;
  const todaysExercises = getTodaysExercises();
  const completedToday = todaysExercises.filter(ex => 
    ex.completionLog.some(log => log.date === new Date().toISOString().split('T')[0] && log.completed)
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Personalized Exercise Plan</h1>
          <p className="text-gray-600 mt-1">Get back on your feet with safe, doctor-approved movements tailored to your recovery phase</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-64"
            />
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            icon={Plus}
            variant="primary"
          >
            Add Exercise
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-600">Total Exercises</p>
              <p className="text-2xl font-bold text-emerald-900">{totalExercises}</p>
            </div>
            <div className="bg-emerald-500 p-3 rounded-xl">
              <Activity className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Active Plans</p>
              <p className="text-2xl font-bold text-blue-900">{activeExercises}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-xl">
              <Play className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Adherence Rate</p>
              <p className="text-2xl font-bold text-purple-900">{Math.round(averageAdherence)}%</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-xl">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Today's Progress</p>
              <p className="text-2xl font-bold text-orange-900">{completedToday}/{todaysExercises.length}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-xl">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'today', label: 'Today\'s Plan', icon: Calendar },
            { id: 'week', label: 'Weekly View', icon: Clock },
            { id: 'all', label: 'All Exercises', icon: Activity },
            { id: 'templates', label: 'Exercise Library', icon: BookOpen },
            { id: 'analytics', label: 'Progress Analytics', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Today's Plan Tab */}
      {activeTab === 'today' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Today's Exercise Plan</h2>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>

          {todaysExercises.length === 0 ? (
            <Card className="text-center py-12">
              <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No exercises scheduled for today</h3>
              <p className="text-gray-600 mb-6">Take a well-deserved rest day or add some exercises to your plan.</p>
              <Button variant="primary" onClick={() => setShowAddForm(true)} icon={Plus}>
                Add Exercise
              </Button>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {todaysExercises.map(exercise => {
                const isCompleted = exercise.completionLog.some(log => 
                  log.date === new Date().toISOString().split('T')[0] && log.completed
                );
                const CategoryIcon = getCategoryIcon(exercise.category);

                return (
                  <Card key={exercise.id} className={`hover:shadow-lg transition-shadow ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl ${isCompleted ? 'bg-green-500' : 'bg-gradient-to-br from-emerald-500 to-emerald-600'}`}>
                          <CategoryIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{exercise.name}</h3>
                          <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                            <span className="capitalize">{exercise.category}</span>
                            <span>•</span>
                            <span>{exercise.duration} min</span>
                            <span>•</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(exercise.difficulty)}`}>
                              {exercise.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {exercise.approvedByPhysician && (
                          <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">
                            <Shield className="h-3 w-3" />
                            <span>Approved</span>
                          </div>
                        )}
                        {exercise.isMandatory && (
                          <div className="flex items-center space-x-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs">
                            <AlertCircle className="h-3 w-3" />
                            <span>Required</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-3">{exercise.instructions}</p>

                    {exercise.targetMuscleGroups && exercise.targetMuscleGroups.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Target Areas:</p>
                        <div className="flex flex-wrap gap-2">
                          {exercise.targetMuscleGroups.map(group => (
                            <span key={group} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                              {group}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {exercise.equipment && exercise.equipment.length > 0 && exercise.equipment[0] !== 'None' && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Equipment:</p>
                        <div className="flex flex-wrap gap-2">
                          {exercise.equipment.map(item => (
                            <span key={item} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {exercise.mediaUrl && (
                      <div className="mb-4">
                        <button 
                          onClick={() => window.open(exercise.mediaUrl, '_blank')}
                          className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                        >
                          <Video className="h-4 w-4" />
                          <span>Watch Tutorial</span>
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        {exercise.sets > 1 ? (
                          <span>{exercise.repetitions} reps × {exercise.sets} sets</span>
                        ) : (
                          <span>{exercise.repetitions} repetitions</span>
                        )}
                        {exercise.prescribedBy && (
                          <span className="ml-3">• Prescribed by {exercise.prescribedBy}</span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {!isCompleted ? (
                          <Button
                            variant="primary"
                            size="sm"
                            icon={CheckCircle}
                            onClick={() => handleCompleteExercise(exercise)}
                          >
                            Mark Complete
                          </Button>
                        ) : (
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Completed</span>
                          </div>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Eye}
                          onClick={() => setShowExerciseDetail(exercise)}
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Weekly View Tab */}
      {activeTab === 'week' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Weekly Exercise Schedule</h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {daysOfWeek.map(day => {
              const dayExercises = exercises.filter(ex => 
                ex.daysAssigned.includes(day) && ex.status === 'active'
              );

              return (
                <Card key={day} className="min-h-[200px]">
                  <h3 className="font-semibold text-gray-900 mb-3 text-center">{day}</h3>
                  <div className="space-y-2">
                    {dayExercises.map(exercise => {
                      const CategoryIcon = getCategoryIcon(exercise.category);
                      return (
                        <div 
                          key={exercise.id}
                          className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          onClick={() => setShowExerciseDetail(exercise)}
                        >
                          <div className="flex items-center space-x-2">
                            <CategoryIcon className="h-4 w-4 text-emerald-600" />
                            <span className="text-sm font-medium text-gray-900 truncate">{exercise.name}</span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {exercise.duration} min • {exercise.difficulty}
                          </div>
                        </div>
                      );
                    })}
                    {dayExercises.length === 0 && (
                      <div className="text-center text-gray-400 text-sm py-8">
                        Rest day
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* All Exercises Tab */}
      {activeTab === 'all' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Difficulties</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {filteredExercises.map(exercise => {
              const CategoryIcon = getCategoryIcon(exercise.category);
              
              return (
                <Card key={exercise.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl">
                        <CategoryIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{exercise.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                          <span className="capitalize">{exercise.category}</span>
                          <span>•</span>
                          <span>{exercise.duration} min</span>
                          <span>•</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(exercise.difficulty)}`}>
                            {exercise.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {exercise.approvedByPhysician && (
                        <Shield className="h-4 w-4 text-green-600" />
                      )}
                      {exercise.status === 'active' ? (
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      ) : exercise.status === 'paused' ? (
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      ) : (
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Scheduled Days:</span>
                      <span className="font-medium">{exercise.daysAssigned.join(', ')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Adherence Rate:</span>
                      <span className={`font-medium ${exercise.adherenceRate >= 90 ? 'text-green-600' : 
                        exercise.adherenceRate >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {exercise.adherenceRate}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sessions:</span>
                      <span className="font-medium">{exercise.completedSessions}/{exercise.totalSessions}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      icon={Eye}
                      onClick={() => setShowExerciseDetail(exercise)}
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Edit3}
                      onClick={() => handleEditExercise(exercise)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setShowDeleteConfirm(exercise.id)}
                      disabled={exercise.isMandatory}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Exercise Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Exercise Library</h2>
            <div className="text-sm text-gray-600">
              Choose from our curated collection of recovery exercises
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {exerciseTemplates.map(template => {
              const CategoryIcon = getCategoryIcon(template.category);
              
              return (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
                        <CategoryIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                          <span className="capitalize">{template.category}</span>
                          <span>•</span>
                          <span>{template.duration} min</span>
                        </div>
                      </div>
                    </div>
                    {template.isPopular && (
                      <div className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                        Popular
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{template.instructions}</p>

                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Benefits:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.benefits.slice(0, 2).map(benefit => (
                          <span key={benefit} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                            {benefit}
                          </span>
                        ))}
                        {template.benefits.length > 2 && (
                          <span className="text-xs text-gray-500">+{template.benefits.length - 2} more</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Target Areas:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.targetMuscleGroups.map(group => (
                          <span key={group} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                            {group}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      icon={Plus}
                      onClick={() => addFromTemplate(template)}
                    >
                      Add to Plan
                    </Button>
                    {template.mediaUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Video}
                        onClick={() => window.open(template.mediaUrl, '_blank')}
                      >
                        Preview
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Adherence Trends
            </h3>
            <div className="text-center py-8">
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Detailed analytics charts will be displayed here.</p>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Exercise Summary</h3>
            <div className="space-y-4">
              {categories.map(category => {
                const count = exercises.filter(ex => ex.category === category).length;
                const percentage = (count / totalExercises) * 100 || 0;
                const CategoryIcon = getCategoryIcon(category);
                
                return (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CategoryIcon className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Add/Edit Exercise Modal */}
      {(showAddForm || showEditForm) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {showEditForm ? 'Edit Exercise' : 'Add New Exercise'}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setShowEditForm(false);
                  setEditingExercise(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={showEditForm ? handleUpdateExercise : handleAddExercise} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exercise Name *
                  </label>
                  <input
                    type="text"
                    value={exerciseForm.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter exercise name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={exerciseForm.category}
                    onChange={(e) => handleFormChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    value={exerciseForm.duration}
                    onChange={(e) => handleFormChange('duration', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty *
                  </label>
                  <select
                    value={exerciseForm.difficulty}
                    onChange={(e) => handleFormChange('difficulty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prescribed By
                  </label>
                  <input
                    type="text"
                    value={exerciseForm.prescribedBy}
                    onChange={(e) => handleFormChange('prescribedBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Doctor's name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scheduled Days *
                </label>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                  {daysOfWeek.map(day => (
                    <label key={day} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exerciseForm.daysAssigned.includes(day)}
                        onChange={(e) => handleArrayFieldChange('daysAssigned', day, e.target.checked)}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{day.slice(0, 3)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructions *
                </label>
                <textarea
                  value={exerciseForm.instructions}
                  onChange={(e) => handleFormChange('instructions', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows={4}
                  placeholder="Detailed instructions for performing the exercise..."
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Media URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={exerciseForm.mediaUrl}
                    onChange={(e) => handleFormChange('mediaUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="YouTube video or image URL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Media Type
                  </label>
                  <select
                    value={exerciseForm.mediaType}
                    onChange={(e) => handleFormChange('mediaType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="youtube">YouTube Video</option>
                    <option value="gif">GIF Animation</option>
                    <option value="image">Image</option>
                    <option value="video">Video File</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Repetitions
                  </label>
                  <input
                    type="number"
                    value={exerciseForm.repetitions}
                    onChange={(e) => handleFormChange('repetitions', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sets
                  </label>
                  <input
                    type="number"
                    value={exerciseForm.sets}
                    onChange={(e) => handleFormChange('sets', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rest Between Sets (seconds)
                  </label>
                  <input
                    type="number"
                    value={exerciseForm.restBetweenSets}
                    onChange={(e) => handleFormChange('restBetweenSets', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Muscle Groups
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {muscleGroups.map(group => (
                    <label key={group} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exerciseForm.targetMuscleGroups.includes(group)}
                        onChange={(e) => handleArrayFieldChange('targetMuscleGroups', group, e.target.checked)}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{group}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment Needed
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {equipmentOptions.map(equipment => (
                    <label key={equipment} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exerciseForm.equipment.includes(equipment)}
                        onChange={(e) => handleArrayFieldChange('equipment', equipment, e.target.checked)}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{equipment}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={exerciseForm.notes}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows={2}
                  placeholder="Additional notes about this exercise..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="reminders"
                  checked={exerciseForm.reminderEnabled}
                  onChange={(e) => handleFormChange('reminderEnabled', e.target.checked)}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="reminders" className="ml-2 text-sm text-gray-700">
                  Enable exercise reminders
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowAddForm(false);
                    setShowEditForm(false);
                    setEditingExercise(null);
                    resetForm();
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  icon={isLoading ? Loader2 : Save}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : (showEditForm ? 'Update Exercise' : 'Add Exercise')}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Exercise Detail Modal */}
      {showExerciseDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl">
                  {React.createElement(getCategoryIcon(showExerciseDetail.category), { className: "h-6 w-6 text-white" })}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{showExerciseDetail.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="capitalize">{showExerciseDetail.category}</span>
                    <span>•</span>
                    <span>{showExerciseDetail.duration} minutes</span>
                    <span>•</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(showExerciseDetail.difficulty)}`}>
                      {showExerciseDetail.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowExerciseDetail(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Instructions */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Instructions</h4>
                <p className="text-gray-700 leading-relaxed">{showExerciseDetail.instructions}</p>
              </div>

              {/* Media */}
              {showExerciseDetail.mediaUrl && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Tutorial</h4>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <button 
                      onClick={() => window.open(showExerciseDetail.mediaUrl, '_blank')}
                      className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      <Video className="h-5 w-5" />
                      <span>Watch Tutorial Video</span>
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Exercise Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Exercise Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Repetitions:</span>
                      <span className="font-medium">{showExerciseDetail.repetitions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sets:</span>
                      <span className="font-medium">{showExerciseDetail.sets}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rest Between Sets:</span>
                      <span className="font-medium">{showExerciseDetail.restBetweenSets}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Scheduled Days:</span>
                      <span className="font-medium">{showExerciseDetail.daysAssigned.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Progress</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Adherence Rate:</span>
                      <span className={`font-medium ${showExerciseDetail.adherenceRate >= 90 ? 'text-green-600' : 
                        showExerciseDetail.adherenceRate >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {showExerciseDetail.adherenceRate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed Sessions:</span>
                      <span className="font-medium">{showExerciseDetail.completedSessions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Sessions:</span>
                      <span className="font-medium">{showExerciseDetail.totalSessions}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Target Areas & Equipment */}
              {showExerciseDetail.targetMuscleGroups && showExerciseDetail.targetMuscleGroups.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Target Muscle Groups</h4>
                  <div className="flex flex-wrap gap-2">
                    {showExerciseDetail.targetMuscleGroups.map(group => (
                      <span key={group} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {group}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {showExerciseDetail.equipment && showExerciseDetail.equipment.length > 0 && showExerciseDetail.equipment[0] !== 'None' && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Equipment Needed</h4>
                  <div className="flex flex-wrap gap-2">
                    {showExerciseDetail.equipment.map(item => (
                      <span key={item} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {showExerciseDetail.benefits && showExerciseDetail.benefits.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Benefits</h4>
                  <div className="flex flex-wrap gap-2">
                    {showExerciseDetail.benefits.map(benefit => (
                      <span key={benefit} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Precautions */}
              {showExerciseDetail.precautions && showExerciseDetail.precautions.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Precautions</h4>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <ul className="space-y-1">
                      {showExerciseDetail.precautions.map((precaution, index) => (
                        <li key={index} className="text-sm text-yellow-800 flex items-start">
                          <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                          {precaution}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Prescription Info */}
              {showExerciseDetail.prescribedBy && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <h4 className="font-medium text-blue-900">Prescribed by {showExerciseDetail.prescribedBy}</h4>
                  </div>
                  {showExerciseDetail.approvedByPhysician && (
                    <div className="flex items-center space-x-2 text-sm text-blue-700">
                      <Shield className="h-4 w-4" />
                      <span>Physician approved</span>
                    </div>
                  )}
                  {showExerciseDetail.isMandatory && (
                    <div className="flex items-center space-x-2 text-sm text-red-700 mt-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>This exercise is mandatory for your recovery</span>
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              {showExerciseDetail.notes && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-sm text-gray-700">{showExerciseDetail.notes}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3 pt-6 border-t border-gray-200 mt-6">
              <Button
                variant="primary"
                className="flex-1"
                icon={CheckCircle}
                onClick={() => {
                  handleCompleteExercise(showExerciseDetail);
                  setShowExerciseDetail(null);
                }}
              >
                Mark as Complete
              </Button>
              <Button
                variant="outline"
                icon={Edit3}
                onClick={() => {
                  handleEditExercise(showExerciseDetail);
                  setShowExerciseDetail(null);
                }}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                icon={Copy}
                onClick={() => {
                  // Copy exercise functionality
                  navigator.clipboard.writeText(`${showExerciseDetail.name}: ${showExerciseDetail.instructions}`);
                }}
              >
                Copy
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Exercise Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Complete Exercise</h3>
              <button
                onClick={() => setShowCompletionModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <h4 className="font-medium text-gray-900 mb-2">{showCompletionModal.name}</h4>
                <p className="text-sm text-gray-600">How did your exercise session go?</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actual Duration (minutes)
                </label>
                <input
                  type="number"
                  value={completionForm.duration}
                  onChange={(e) => setCompletionForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How did it feel?
                </label>
                <select
                  value={completionForm.difficulty}
                  onChange={(e) => setCompletionForm(prev => ({ ...prev, difficulty: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="too-easy">Too Easy</option>
                  <option value="just-right">Just Right</option>
                  <option value="too-hard">Too Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pain Level (0-10)
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={completionForm.painLevel}
                  onChange={(e) => setCompletionForm(prev => ({ ...prev, painLevel: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>No Pain</span>
                  <span className="font-medium">{completionForm.painLevel}</span>
                  <span>Severe Pain</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Mood
                </label>
                <select
                  value={completionForm.mood}
                  onChange={(e) => setCompletionForm(prev => ({ ...prev, mood: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="great">Great</option>
                  <option value="good">Good</option>
                  <option value="okay">Okay</option>
                  <option value="tired">Tired</option>
                  <option value="painful">Painful</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={completionForm.notes}
                  onChange={(e) => setCompletionForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows={3}
                  placeholder="How did you feel? Any observations?"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowCompletionModal(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                icon={CheckCircle}
                onClick={submitCompletion}
              >
                Complete Exercise
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="text-center">
              <div className="bg-red-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Exercise</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this exercise? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={() => handleDeleteExercise(showDeleteConfirm)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ExercisesPage;