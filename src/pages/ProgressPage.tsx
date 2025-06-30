import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Activity, 
  Heart, 
  Pill, 
  UtensilsCrossed, 
  Moon, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Target, 
  Award, 
  BarChart3, 
  LineChart, 
  PieChart, 
  Download, 
  Filter, 
  Search, 
  Eye, 
  Edit3, 
  Trash2, 
  MessageCircle, 
  Send, 
  X, 
  Plus, 
  Lightbulb, 
  Zap, 
  Users, 
  Star, 
  ChevronRight, 
  Info, 
  AlertCircle, 
  Sparkles,
  Save,
  RotateCcw,
  Timer,
  Flag,
  Calendar as CalendarIcon,
  Repeat,
  Bell,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useApp } from '../contexts/AppContext';

interface ProgressData {
  date: string;
  checkIn: number;
  medication: number;
  exercise: number;
  mood: number;
  sleep: number;
  pain: number;
  energy: number;
  overall: number;
}

interface ActivityLog {
  id: string;
  date: string;
  activity: string;
  status: 'Completed' | 'Partial' | 'Missed' | 'Skipped';
  details: string;
  category: 'check-in' | 'medication' | 'exercise' | 'meal' | 'sleep';
  duration?: number;
  notes?: string;
  metadata?: {
    mood?: number;
    pain?: number;
    dosage?: string;
    exerciseType?: string;
    sleepHours?: number;
    mealType?: string;
    sideEffects?: string[];
    completionRate?: number;
  };
}

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'exercise' | 'medication' | 'sleep' | 'nutrition' | 'mood' | 'weight' | 'custom';
  targetValue: number;
  currentValue: number;
  unit: string;
  targetDate: string;
  priority: 'low' | 'medium' | 'high';
  frequency: 'daily' | 'weekly' | 'monthly' | 'one-time';
  reminderEnabled: boolean;
  reminderTime?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  status: 'active' | 'completed' | 'paused' | 'overdue';
  milestones: GoalMilestone[];
  notes?: string;
}

interface GoalMilestone {
  id: string;
  title: string;
  targetValue: number;
  completedAt?: string;
  reward?: string;
}

interface Insight {
  id: string;
  type: 'trend' | 'achievement' | 'recommendation' | 'alert';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  actions?: string[];
  priority: 'low' | 'medium' | 'high';
  icon: string;
}

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'milestone' | 'setback' | 'improvement' | 'medication-change' | 'appointment';
  severity?: 'low' | 'medium' | 'high';
  category: string;
  icon: string;
  color: string;
}

const ProgressPage: React.FC = () => {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'timeline' | 'logs' | 'goals'>('overview');
  const [showAssistant, setShowAssistant] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState('');
  const [assistantResponse, setAssistantResponse] = useState('');
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [selectedLogEntry, setSelectedLogEntry] = useState<ActivityLog | null>(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  
  // Goal management states
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [showGoalDetailsModal, setShowGoalDetailsModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  // Goal form state
  const [goalForm, setGoalForm] = useState({
    title: '',
    description: '',
    category: 'exercise' as Goal['category'],
    targetValue: 0,
    unit: '',
    targetDate: '',
    priority: 'medium' as Goal['priority'],
    frequency: 'daily' as Goal['frequency'],
    reminderEnabled: true,
    reminderTime: '09:00',
    notes: ''
  });

  // Sample data
  const progressData: ProgressData[] = [
    { date: '2024-01-01', checkIn: 100, medication: 95, exercise: 80, mood: 7, sleep: 8, pain: 3, energy: 7, overall: 85 },
    { date: '2024-01-02', checkIn: 100, medication: 100, exercise: 85, mood: 8, sleep: 7, pain: 2, energy: 8, overall: 88 },
    { date: '2024-01-03', checkIn: 100, medication: 90, exercise: 90, mood: 8, sleep: 8, pain: 2, energy: 8, overall: 90 },
    { date: '2024-01-04', checkIn: 0, medication: 85, exercise: 75, mood: 6, sleep: 6, pain: 4, energy: 6, overall: 75 },
    { date: '2024-01-05', checkIn: 100, medication: 100, exercise: 95, mood: 9, sleep: 8, pain: 1, energy: 9, overall: 95 },
    { date: '2024-01-06', checkIn: 100, medication: 95, exercise: 80, mood: 8, sleep: 7, pain: 2, energy: 8, overall: 87 },
    { date: '2024-01-07', checkIn: 100, medication: 100, exercise: 85, mood: 9, sleep: 8, pain: 1, energy: 9, overall: 92 }
  ];

  const activityLogs: ActivityLog[] = [
    {
      id: '1',
      date: '2024-01-07',
      activity: 'Daily Check-in',
      status: 'Completed',
      details: 'Mood: 8/10, Pain: 2/10',
      category: 'check-in',
      duration: 5,
      notes: 'Feeling much better today, pain is manageable',
      metadata: {
        mood: 8,
        pain: 2,
        completionRate: 100
      }
    },
    {
      id: '2',
      date: '2024-01-07',
      activity: 'Morning Medication',
      status: 'Completed',
      details: 'Ibuprofen 400mg',
      category: 'medication',
      notes: 'Taken with breakfast, no side effects',
      metadata: {
        dosage: '400mg',
        completionRate: 100
      }
    },
    {
      id: '3',
      date: '2024-01-07',
      activity: 'Light Exercise',
      status: 'Completed',
      details: '15 min walk',
      category: 'exercise',
      duration: 15,
      notes: 'Gentle walk around the neighborhood',
      metadata: {
        exerciseType: 'Walking',
        completionRate: 100
      }
    },
    {
      id: '4',
      date: '2024-01-06',
      activity: 'Evening Check-in',
      status: 'Missed',
      details: 'No data recorded',
      category: 'check-in',
      notes: 'Forgot to complete evening check-in',
      metadata: {
        completionRate: 0
      }
    },
    {
      id: '5',
      date: '2024-01-06',
      activity: 'Meal Plan',
      status: 'Partial',
      details: 'Breakfast and lunch only',
      category: 'meal',
      notes: 'Skipped dinner due to lack of appetite',
      metadata: {
        mealType: 'Breakfast, Lunch',
        completionRate: 67
      }
    }
  ];

  const insights: Insight[] = [
    {
      id: '1',
      type: 'trend',
      title: 'Mood Improvement Trend',
      description: 'Your mood has consistently improved over the past week, showing great progress in your recovery.',
      confidence: 92,
      actionable: false,
      priority: 'medium',
      icon: '📈'
    },
    {
      id: '2',
      type: 'recommendation',
      title: 'Exercise Consistency',
      description: 'You\'ve been doing great with exercise! Consider adding 5 more minutes to reach your daily goal.',
      confidence: 85,
      actionable: true,
      actions: ['Extend workout time', 'Add stretching routine'],
      priority: 'medium',
      icon: '💪'
    },
    {
      id: '3',
      type: 'alert',
      title: 'Missed Check-ins',
      description: 'You missed yesterday\'s evening check-in. Consistent tracking helps us provide better insights.',
      confidence: 100,
      actionable: true,
      actions: ['Complete check-in now', 'Set reminder'],
      priority: 'high',
      icon: '⚠️'
    }
  ];

  const timelineEvents: TimelineEvent[] = [
    {
      id: '1',
      date: '2024-01-07',
      title: 'Excellent Recovery Day',
      description: 'Achieved 92% overall wellness score with perfect medication adherence',
      type: 'milestone',
      category: 'Recovery',
      icon: '🎉',
      color: 'text-green-600 bg-green-50 border-green-200'
    },
    {
      id: '2',
      date: '2024-01-05',
      title: 'Peak Performance',
      description: 'Reached highest wellness score of 95% - excellent progress!',
      type: 'milestone',
      category: 'Achievement',
      icon: '🏆',
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200'
    },
    {
      id: '3',
      date: '2024-01-04',
      title: 'Missed Check-in',
      description: 'Wellness score dropped to 75% due to missed daily check-in',
      type: 'setback',
      severity: 'medium',
      category: 'Tracking',
      icon: '⚠️',
      color: 'text-orange-600 bg-orange-50 border-orange-200'
    },
    {
      id: '4',
      date: '2024-01-03',
      title: 'Exercise Goal Achieved',
      description: 'Completed 90% of exercise plan - great improvement in mobility',
      type: 'improvement',
      category: 'Exercise',
      icon: '💪',
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      id: '5',
      date: '2024-01-01',
      title: 'Recovery Plan Started',
      description: 'Began comprehensive recovery tracking with HealthMate.AI',
      type: 'milestone',
      category: 'Recovery',
      icon: '🚀',
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    }
  ];

  // Initialize goals
  useEffect(() => {
    const sampleGoals: Goal[] = [
      {
        id: '1',
        title: 'Daily Exercise',
        description: 'Complete 30 minutes of light exercise daily to improve mobility and strength',
        category: 'exercise',
        targetValue: 30,
        currentValue: 25,
        unit: 'minutes',
        targetDate: '2024-01-31',
        priority: 'high',
        frequency: 'daily',
        reminderEnabled: true,
        reminderTime: '09:00',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-07',
        status: 'active',
        milestones: [
          { id: '1', title: '15 minutes daily', targetValue: 15, completedAt: '2024-01-03' },
          { id: '2', title: '20 minutes daily', targetValue: 20, completedAt: '2024-01-05' },
          { id: '3', title: '30 minutes daily', targetValue: 30 }
        ],
        notes: 'Focus on low-impact activities like walking and stretching'
      },
      {
        id: '2',
        title: 'Medication Adherence',
        description: 'Maintain 95% medication adherence rate',
        category: 'medication',
        targetValue: 95,
        currentValue: 92,
        unit: '%',
        targetDate: '2024-02-15',
        priority: 'high',
        frequency: 'daily',
        reminderEnabled: true,
        reminderTime: '08:00',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-07',
        status: 'active',
        milestones: [
          { id: '1', title: '80% adherence', targetValue: 80, completedAt: '2024-01-02' },
          { id: '2', title: '90% adherence', targetValue: 90, completedAt: '2024-01-05' },
          { id: '3', title: '95% adherence', targetValue: 95 }
        ]
      },
      {
        id: '3',
        title: 'Sleep Quality',
        description: 'Get 7-8 hours of quality sleep each night',
        category: 'sleep',
        targetValue: 8,
        currentValue: 7.5,
        unit: 'hours',
        targetDate: '2024-01-31',
        priority: 'medium',
        frequency: 'daily',
        reminderEnabled: true,
        reminderTime: '22:00',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-07',
        status: 'active',
        milestones: [
          { id: '1', title: '6 hours sleep', targetValue: 6, completedAt: '2024-01-01' },
          { id: '2', title: '7 hours sleep', targetValue: 7, completedAt: '2024-01-04' },
          { id: '3', title: '8 hours sleep', targetValue: 8 }
        ]
      }
    ];
    setGoals(sampleGoals);
  }, []);

  const handleAssistantMessage = async () => {
    if (!assistantMessage.trim()) return;

    setIsAssistantTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      let response = '';
      const message = assistantMessage.toLowerCase();
      
      if (message.includes('score') || message.includes('low')) {
        response = 'Your score dipped slightly due to missed check-ins and lower sleep quality. Focus on maintaining your daily routine and getting 7-8 hours of sleep. Your medication adherence is excellent though!';
      } else if (message.includes('mood')) {
        response = 'Your mood has been trending upward! This is a great sign of recovery progress. Keep up with your exercise routine and consider adding meditation to maintain this positive trend.';
      } else if (message.includes('exercise') || message.includes('activity')) {
        response = 'Your exercise consistency is impressive! You\'re averaging 25 minutes daily. To reach your 30-minute goal, try adding 5 minutes of stretching or light walking.';
      } else if (message.includes('medication') || message.includes('pills')) {
        response = 'Your medication adherence is at 92% - very good! The missed doses were likely due to schedule changes. Consider setting multiple reminders to reach your 95% target.';
      } else if (message.includes('sleep')) {
        response = 'Your sleep pattern shows room for improvement. You\'re averaging 7.5 hours, which is good, but consistency matters. Try establishing a bedtime routine and avoiding screens before sleep.';
      } else {
        response = 'I\'m here to help you understand your recovery progress! You can ask me about your scores, trends, medications, exercise, sleep, or any specific concerns about your health data.';
      }
      
      setAssistantResponse(response);
      setIsAssistantTyping(false);
    }, 1500);

    setAssistantMessage('');
  };

  const handleViewLog = (log: ActivityLog) => {
    setSelectedLogEntry(log);
    setShowLogModal(true);
  };

  const handleEditLog = (log: ActivityLog) => {
    // Navigate to appropriate page based on category
    const routes = {
      'check-in': '/checkin',
      'medication': '/medications',
      'exercise': '/exercises',
      'meal': '/meals',
      'sleep': '/checkin'
    };
    
    window.location.href = routes[log.category] || '/dashboard';
  };

  const handleDeleteLog = (logId: string) => {
    if (confirm('Are you sure you want to delete this activity log?')) {
      // In a real app, this would make an API call
      console.log('Deleting log:', logId);
      alert('Activity log deleted successfully!');
    }
  };

  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = log.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-700 bg-green-100';
      case 'Partial': return 'text-yellow-700 bg-yellow-100';
      case 'Missed': return 'text-red-700 bg-red-100';
      case 'Skipped': return 'text-gray-700 bg-gray-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'check-in': return <CheckCircle className="h-4 w-4" />;
      case 'medication': return <Pill className="h-4 w-4" />;
      case 'exercise': return <Activity className="h-4 w-4" />;
      case 'meal': return <UtensilsCrossed className="h-4 w-4" />;
      case 'sleep': return <Moon className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Goal management functions
  const handleAddGoal = () => {
    setEditingGoal(null);
    setGoalForm({
      title: '',
      description: '',
      category: 'exercise',
      targetValue: 0,
      unit: '',
      targetDate: '',
      priority: 'medium',
      frequency: 'daily',
      reminderEnabled: true,
      reminderTime: '09:00',
      notes: ''
    });
    setShowAddGoalModal(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setGoalForm({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      targetValue: goal.targetValue,
      unit: goal.unit,
      targetDate: goal.targetDate,
      priority: goal.priority,
      frequency: goal.frequency,
      reminderEnabled: goal.reminderEnabled,
      reminderTime: goal.reminderTime || '09:00',
      notes: goal.notes || ''
    });
    setShowAddGoalModal(true);
  };

  const handleSaveGoal = () => {
    if (!goalForm.title.trim() || !goalForm.targetValue || !goalForm.targetDate) {
      alert('Please fill in all required fields');
      return;
    }

    const goalData: Goal = {
      id: editingGoal?.id || Date.now().toString(),
      title: goalForm.title,
      description: goalForm.description,
      category: goalForm.category,
      targetValue: goalForm.targetValue,
      currentValue: editingGoal?.currentValue || 0,
      unit: goalForm.unit,
      targetDate: goalForm.targetDate,
      priority: goalForm.priority,
      frequency: goalForm.frequency,
      reminderEnabled: goalForm.reminderEnabled,
      reminderTime: goalForm.reminderTime,
      createdAt: editingGoal?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: editingGoal?.status || 'active',
      milestones: editingGoal?.milestones || [],
      notes: goalForm.notes
    };

    if (editingGoal) {
      setGoals(prev => prev.map(g => g.id === editingGoal.id ? goalData : g));
    } else {
      setGoals(prev => [...prev, goalData]);
    }

    setShowAddGoalModal(false);
    setEditingGoal(null);
  };

  const handleDeleteGoal = (goalId: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      setGoals(prev => prev.filter(g => g.id !== goalId));
    }
  };

  const handleViewGoalDetails = (goal: Goal) => {
    setSelectedGoal(goal);
    setShowGoalDetailsModal(true);
  };

  const updateGoalProgress = (goalId: string, newValue: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const updatedGoal = { ...goal, currentValue: newValue, updatedAt: new Date().toISOString() };
        
        // Check if goal is completed
        if (newValue >= goal.targetValue && goal.status !== 'completed') {
          updatedGoal.status = 'completed';
          updatedGoal.completedAt = new Date().toISOString();
        }
        
        return updatedGoal;
      }
      return goal;
    }));
  };

  const getGoalProgress = (goal: Goal) => {
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  };

  const getGoalStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'completed': return 'text-green-700 bg-green-100';
      case 'active': return 'text-blue-700 bg-blue-100';
      case 'paused': return 'text-yellow-700 bg-yellow-100';
      case 'overdue': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryColor = (category: Goal['category']) => {
    switch (category) {
      case 'exercise': return 'text-blue-600';
      case 'medication': return 'text-purple-600';
      case 'sleep': return 'text-indigo-600';
      case 'nutrition': return 'text-orange-600';
      case 'mood': return 'text-pink-600';
      case 'weight': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getGoalCategoryIcon = (category: Goal['category']) => {
    switch (category) {
      case 'exercise': return <Activity className="h-5 w-5" />;
      case 'medication': return <Pill className="h-5 w-5" />;
      case 'sleep': return <Moon className="h-5 w-5" />;
      case 'nutrition': return <UtensilsCrossed className="h-5 w-5" />;
      case 'mood': return <Heart className="h-5 w-5" />;
      case 'weight': return <Target className="h-5 w-5" />;
      default: return <Flag className="h-5 w-5" />;
    }
  };

  // Calculate overall recovery score
  const calculateRecoveryScore = () => {
    const recentData = progressData.slice(-7);
    const avgCheckIn = recentData.reduce((sum, d) => sum + d.checkIn, 0) / recentData.length;
    const avgMedication = recentData.reduce((sum, d) => sum + d.medication, 0) / recentData.length;
    const avgExercise = recentData.reduce((sum, d) => sum + d.exercise, 0) / recentData.length;
    const avgMood = recentData.reduce((sum, d) => sum + d.mood, 0) / recentData.length;
    const avgSleep = recentData.reduce((sum, d) => sum + d.sleep, 0) / recentData.length;
    
    // Weighted average (medication and check-ins are more important)
    const score = (avgCheckIn * 0.25 + avgMedication * 0.3 + avgExercise * 0.2 + (avgMood * 10) * 0.15 + (avgSleep * 12.5) * 0.1);
    return Math.round(score);
  };

  const recoveryScore = calculateRecoveryScore();

  const pieData = [
    { name: 'Completed', value: 85, color: '#10b981' },
    { name: 'Partial', value: 10, color: '#f59e0b' },
    { name: 'Missed', value: 5, color: '#ef4444' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Progress Tracking</h1>
          <p className="text-gray-600 mt-1">Monitor your recovery journey and health improvements</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setShowAssistant(true)} icon={MessageCircle}>
            Ask AI
          </Button>
          <Button variant="outline" icon={Download}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'charts', label: 'Charts & Trends', icon: BarChart3 },
            { id: 'timeline', label: 'Recovery Timeline', icon: Calendar },
            { id: 'logs', label: 'Activity Logs', icon: Clock },
            { id: 'goals', label: 'Goals & Milestones', icon: Target }
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Recovery Score Card */}
          <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Recovery Score</h2>
                <p className="text-emerald-100">Your overall wellness indicator</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold mb-2">{recoveryScore}%</div>
                <div className="flex items-center text-emerald-100">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>+5% from last week</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Check-in Streak', value: '7 days', icon: CheckCircle, color: 'emerald', trend: '+2' },
              { label: 'Medication Adherence', value: '95%', icon: Pill, color: 'blue', trend: '+3%' },
              { label: 'Exercise Completion', value: '85%', icon: Activity, color: 'orange', trend: '+10%' },
              { label: 'Sleep Quality', value: '7.5h avg', icon: Moon, color: 'purple', trend: '+0.5h' }
            ].map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      <div className="flex items-center text-green-600 text-sm mt-1">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        <span>{metric.trend}</span>
                      </div>
                    </div>
                    <div className={`bg-${metric.color}-100 p-3 rounded-xl`}>
                      <Icon className={`h-6 w-6 text-${metric.color}-600`} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Recent Progress Chart */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">7-Day Progress Overview</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line type="monotone" dataKey="overall" stroke="#10b981" strokeWidth={3} name="Overall Score" />
                  <Line type="monotone" dataKey="medication" stroke="#3b82f6" strokeWidth={2} name="Medication" />
                  <Line type="monotone" dataKey="exercise" stroke="#f59e0b" strokeWidth={2} name="Exercise" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* AI Insights */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              AI Insights
            </h3>
            <div className="space-y-4">
              {insights.map((insight) => (
                <div key={insight.id} className={`p-4 rounded-lg border-l-4 ${
                  insight.priority === 'high' ? 'border-red-500 bg-red-50' :
                  insight.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                  'border-green-500 bg-green-50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{insight.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">{insight.title}</h4>
                        <p className="text-gray-700 mt-1">{insight.description}</p>
                        {insight.actionable && insight.actions && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {insight.actions.map((action, index) => (
                              <button
                                key={index}
                                className="text-xs bg-white border border-gray-300 px-3 py-1 rounded-full hover:bg-gray-50 transition-colors"
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{insight.confidence}% confidence</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Charts & Trends Tab */}
      {activeTab === 'charts' && (
        <div className="space-y-8">
          {/* Date Range Selector */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Charts & Trends</h2>
            <div className="flex space-x-2">
              {['7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    dateRange === range
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Line Chart - Overall Trends */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Overall Wellness Trend</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip />
                    <Area type="monotone" dataKey="overall" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Pie Chart - Activity Completion */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Activity Completion Rate</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Bar Chart - Daily Metrics */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Daily Metrics Comparison</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="medication" fill="#3b82f6" name="Medication" />
                    <Bar dataKey="exercise" fill="#f59e0b" name="Exercise" />
                    <Bar dataKey="checkIn" fill="#10b981" name="Check-in" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Line Chart - Mood & Pain */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Mood & Pain Levels</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="mood" stroke="#8b5cf6" strokeWidth={2} name="Mood (1-10)" />
                    <Line type="monotone" dataKey="pain" stroke="#ef4444" strokeWidth={2} name="Pain (1-10)" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Recovery Timeline Tab */}
      {activeTab === 'timeline' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recovery Timeline</h2>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                <option value="all">All Events</option>
                <option value="milestone">Milestones</option>
                <option value="setback">Setbacks</option>
                <option value="improvement">Improvements</option>
              </select>
            </div>
          </div>

          <Card>
            <div className="space-y-6">
              {timelineEvents.map((event, index) => (
                <div key={event.id} className="relative">
                  {index !== timelineEvents.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                  )}
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${event.color}`}>
                      <span className="text-lg">{event.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-medium text-gray-900">{event.title}</h4>
                        <span className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-600 mt-1">{event.description}</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${event.color}`}>
                          {event.category}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">{event.type}</span>
                        {event.severity && (
                          <span className={`text-xs font-medium ${
                            event.severity === 'high' ? 'text-red-600' :
                            event.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {event.severity} severity
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Activity Logs Tab */}
      {activeTab === 'logs' && (
        <div className="space-y-8">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Partial">Partial</option>
              <option value="Missed">Missed</option>
              <option value="Skipped">Skipped</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Categories</option>
              <option value="check-in">Check-in</option>
              <option value="medication">Medication</option>
              <option value="exercise">Exercise</option>
              <option value="meal">Meal</option>
              <option value="sleep">Sleep</option>
            </select>
          </div>

          {/* Activity Logs */}
          <Card>
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div key={log.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {getCategoryIcon(log.category)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{log.activity}</h4>
                        <p className="text-sm text-gray-600">{log.details}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          <span>{log.date}</span>
                          {log.duration && <span>{log.duration} min</span>}
                          {log.metadata?.completionRate && (
                            <span>{log.metadata.completionRate}% complete</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleViewLog(log)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditLog(log)}
                          className="p-1 text-gray-400 hover:text-emerald-600 transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLog(log.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {log.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{log.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredLogs.length === 0 && (
              <div className="text-center py-8">
                <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No activity logs found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Goals & Milestones Tab */}
      {activeTab === 'goals' && (
        <div className="space-y-8">
          {/* Goals Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Current Goals</h2>
            <Button 
              variant="primary" 
              onClick={handleAddGoal}
              icon={Plus}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Add Goal
            </Button>
          </div>

          {/* Goals Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <Card key={goal.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getCategoryColor(goal.category)} bg-opacity-10`}>
                      {getGoalCategoryIcon(goal.category)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                      <p className="text-sm text-gray-600">Target: {goal.targetValue} {goal.unit} by {new Date(goal.targetDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(goal.priority)}`}>
                      {goal.priority} priority
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditGoal(goal)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">Progress</span>
                    <span className="text-gray-600">{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-emerald-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${getGoalProgress(goal)}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {Math.round(getGoalProgress(goal))}% complete
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{goal.description}</p>

                {goal.milestones.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Milestones</h4>
                    <div className="space-y-1">
                      {goal.milestones.map((milestone) => (
                        <div key={milestone.id} className="flex items-center space-x-2 text-sm">
                          {milestone.completedAt ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <div className="h-4 w-4 border-2 border-gray-300 rounded-full"></div>
                          )}
                          <span className={milestone.completedAt ? 'text-green-700 line-through' : 'text-gray-600'}>
                            {milestone.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGoalStatusColor(goal.status)}`}>
                    {goal.status}
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewGoalDetails(goal)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newValue = prompt(`Update progress for "${goal.title}" (current: ${goal.currentValue} ${goal.unit}):`);
                        if (newValue && !isNaN(Number(newValue))) {
                          updateGoalProgress(goal.id, Number(newValue));
                        }
                      }}
                    >
                      Update Progress
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {goals.length === 0 && (
            <Card className="text-center py-12">
              <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No goals set yet</h3>
              <p className="text-gray-600 mb-6">Set your first recovery goal to start tracking your progress</p>
              <Button variant="primary" onClick={handleAddGoal} icon={Plus}>
                Add Your First Goal
              </Button>
            </Card>
          )}
        </div>
      )}

      {/* Add/Edit Goal Modal */}
      {showAddGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingGoal ? 'Edit Goal' : 'Add New Goal'}
              </h3>
              <button
                onClick={() => setShowAddGoalModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title *</label>
                  <input
                    type="text"
                    value={goalForm.title}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., Daily Exercise"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={goalForm.category}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, category: e.target.value as Goal['category'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="exercise">Exercise</option>
                    <option value="medication">Medication</option>
                    <option value="sleep">Sleep</option>
                    <option value="nutrition">Nutrition</option>
                    <option value="mood">Mood</option>
                    <option value="weight">Weight</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={goalForm.description}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Describe your goal and why it's important for your recovery..."
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Value *</label>
                  <input
                    type="number"
                    value={goalForm.targetValue}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, targetValue: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                  <input
                    type="text"
                    value={goalForm.unit}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="minutes, %, hours, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Date *</label>
                  <input
                    type="date"
                    value={goalForm.targetDate}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, targetDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={goalForm.priority}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, priority: e.target.value as Goal['priority'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                  <select
                    value={goalForm.frequency}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, frequency: e.target.value as Goal['frequency'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="one-time">One-time</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={goalForm.reminderEnabled}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, reminderEnabled: e.target.checked }))}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Enable reminders</label>
                </div>

                {goalForm.reminderEnabled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Time</label>
                    <input
                      type="time"
                      value={goalForm.reminderTime}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, reminderTime: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={goalForm.notes}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Additional notes or strategies for achieving this goal..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddGoalModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleSaveGoal}
                icon={Save}
              >
                {editingGoal ? 'Update Goal' : 'Create Goal'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Goal Details Modal */}
      {showGoalDetailsModal && selectedGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Goal Details</h3>
              <button
                onClick={() => setShowGoalDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${getCategoryColor(selectedGoal.category)} bg-opacity-10`}>
                  {getGoalCategoryIcon(selectedGoal.category)}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{selectedGoal.title}</h4>
                  <p className="text-gray-600">{selectedGoal.description}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Goal Information</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium capitalize">{selectedGoal.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target:</span>
                      <span className="font-medium">{selectedGoal.targetValue} {selectedGoal.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current:</span>
                      <span className="font-medium">{selectedGoal.currentValue} {selectedGoal.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target Date:</span>
                      <span className="font-medium">{new Date(selectedGoal.targetDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Priority:</span>
                      <span className={`font-medium capitalize ${
                        selectedGoal.priority === 'high' ? 'text-red-600' :
                        selectedGoal.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {selectedGoal.priority}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frequency:</span>
                      <span className="font-medium capitalize">{selectedGoal.frequency}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Progress</h5>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Completion</span>
                      <span>{Math.round(getGoalProgress(selectedGoal))}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-emerald-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${getGoalProgress(selectedGoal)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Created: {new Date(selectedGoal.createdAt).toLocaleDateString()}</p>
                    <p>Last Updated: {new Date(selectedGoal.updatedAt).toLocaleDateString()}</p>
                    {selectedGoal.completedAt && (
                      <p>Completed: {new Date(selectedGoal.completedAt).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </div>

              {selectedGoal.milestones.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Milestones</h5>
                  <div className="space-y-3">
                    {selectedGoal.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        {milestone.completedAt ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <div className="h-5 w-5 border-2 border-gray-300 rounded-full"></div>
                        )}
                        <div className="flex-1">
                          <span className={`font-medium ${milestone.completedAt ? 'text-green-700 line-through' : 'text-gray-900'}`}>
                            {milestone.title}
                          </span>
                          {milestone.completedAt && (
                            <p className="text-xs text-green-600">
                              Completed on {new Date(milestone.completedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedGoal.notes && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Notes</h5>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedGoal.notes}</p>
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleEditGoal(selectedGoal)}
                icon={Edit3}
              >
                Edit Goal
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  const newValue = prompt(`Update progress for "${selectedGoal.title}" (current: ${selectedGoal.currentValue} ${selectedGoal.unit}):`);
                  if (newValue && !isNaN(Number(newValue))) {
                    updateGoalProgress(selectedGoal.id, Number(newValue));
                    setSelectedGoal(prev => prev ? { ...prev, currentValue: Number(newValue) } : null);
                  }
                }}
              >
                Update Progress
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Activity Log Details Modal */}
      {showLogModal && selectedLogEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Activity Details</h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {getCategoryIcon(selectedLogEntry.category)}
                <div>
                  <h4 className="font-medium text-gray-900">{selectedLogEntry.activity}</h4>
                  <p className="text-sm text-gray-600">{selectedLogEntry.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedLogEntry.status)}`}>
                    {selectedLogEntry.status}
                  </span>
                </div>
                {selectedLogEntry.duration && (
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <span className="ml-2 font-medium">{selectedLogEntry.duration} min</span>
                  </div>
                )}
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-2">Details</h5>
                <p className="text-gray-700">{selectedLogEntry.details}</p>
              </div>

              {selectedLogEntry.notes && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Notes</h5>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedLogEntry.notes}</p>
                </div>
              )}

              {selectedLogEntry.metadata && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Additional Information</h5>
                  <div className="space-y-1 text-sm">
                    {selectedLogEntry.metadata.mood && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mood:</span>
                        <span className="font-medium">{selectedLogEntry.metadata.mood}/10</span>
                      </div>
                    )}
                    {selectedLogEntry.metadata.pain && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pain Level:</span>
                        <span className="font-medium">{selectedLogEntry.metadata.pain}/10</span>
                      </div>
                    )}
                    {selectedLogEntry.metadata.dosage && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dosage:</span>
                        <span className="font-medium">{selectedLogEntry.metadata.dosage}</span>
                      </div>
                    )}
                    {selectedLogEntry.metadata.exerciseType && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Exercise Type:</span>
                        <span className="font-medium">{selectedLogEntry.metadata.exerciseType}</span>
                      </div>
                    )}
                    {selectedLogEntry.metadata.completionRate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completion Rate:</span>
                        <span className="font-medium">{selectedLogEntry.metadata.completionRate}%</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleEditLog(selectedLogEntry)}
                icon={Edit3}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowLogModal(false)}
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Progress Assistant Modal */}
      {showAssistant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Progress Assistant</h3>
              <button
                onClick={() => setShowAssistant(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-600 text-sm mb-4">
                Hi! I'm your progress assistant. Ask me anything about your recovery data!
              </p>

              {assistantResponse && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-blue-800 text-sm">{assistantResponse}</p>
                </div>
              )}

              {isAssistantTyping && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600 text-sm">Analyzing your data...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {[
                  'Why is my score lower this week?',
                  'How can I improve my sleep?',
                  'What affects my mood?',
                  'Show my exercise progress'
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setAssistantMessage(suggestion);
                      handleAssistantMessage();
                    }}
                    className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full hover:bg-emerald-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={assistantMessage}
                  onChange={(e) => setAssistantMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAssistantMessage()}
                  placeholder="Ask about your progress..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <Button
                  onClick={handleAssistantMessage}
                  disabled={!assistantMessage.trim() || isAssistantTyping}
                  variant="primary"
                  icon={Send}
                >
                  Send
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProgressPage;