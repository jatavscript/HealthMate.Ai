import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Filter, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Pill, 
  UtensilsCrossed, 
  Activity, 
  CheckCircle, 
  Edit3, 
  Trash2, 
  Bell, 
  BellOff, 
  X, 
  Save, 
  MoreVertical, 
  Copy, 
  Share2, 
  Download, 
  RefreshCw, 
  AlertCircle, 
  Target, 
  Zap, 
  Heart, 
  Sun, 
  Sunset, 
  Moon, 
  Coffee, 
  Timer, 
  MapPin, 
  User, 
  Stethoscope,
  FileText,
  Star,
  TrendingUp,
  BarChart3,
  Settings,
  Info,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useApp } from '../contexts/AppContext';

interface ScheduleItem {
  id: string;
  title: string;
  category: 'medication' | 'meal' | 'exercise' | 'appointment' | 'custom';
  time: string;
  date: string;
  completed: boolean;
  reminderEnabled: boolean;
  reminderTime?: number; // minutes before
  notes?: string;
  priority: 'low' | 'medium' | 'high';
  recurring?: {
    type: 'daily' | 'weekly' | 'monthly';
    days?: string[]; // for weekly
    endDate?: string;
  };
  linkedId?: string; // ID from medications, meals, or exercises
  duration?: number; // in minutes
  location?: string;
  createdAt: string;
  updatedAt: string;
}

interface ScheduleForm {
  title: string;
  category: 'medication' | 'meal' | 'exercise' | 'appointment' | 'custom';
  time: string;
  date: string;
  reminderEnabled: boolean;
  reminderTime: number;
  notes: string;
  priority: 'low' | 'medium' | 'high';
  duration: number;
  location: string;
  recurring: {
    enabled: boolean;
    type: 'daily' | 'weekly' | 'monthly';
    days: string[];
    endDate: string;
  };
}

const SchedulePage: React.FC = () => {
  const { user } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'all' | 'medication' | 'meal' | 'exercise' | 'appointment' | 'custom'>('all');
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [scheduleForm, setScheduleForm] = useState<ScheduleForm>({
    title: '',
    category: 'custom',
    time: '09:00',
    date: new Date().toISOString().split('T')[0],
    reminderEnabled: true,
    reminderTime: 15,
    notes: '',
    priority: 'medium',
    duration: 30,
    location: '',
    recurring: {
      enabled: false,
      type: 'daily',
      days: [],
      endDate: ''
    }
  });

  // Initialize with sample data
  useEffect(() => {
    const sampleItems: ScheduleItem[] = [
      {
        id: '1',
        title: 'Take Morning Medication',
        category: 'medication',
        time: '08:00',
        date: new Date().toISOString().split('T')[0],
        completed: true,
        reminderEnabled: true,
        reminderTime: 15,
        notes: 'Ibuprofen 400mg with food',
        priority: 'high',
        linkedId: 'med-1',
        duration: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Breakfast - High Protein Meal',
        category: 'meal',
        time: '08:30',
        date: new Date().toISOString().split('T')[0],
        completed: true,
        reminderEnabled: true,
        reminderTime: 10,
        notes: 'Greek yogurt with berries and nuts',
        priority: 'medium',
        linkedId: 'meal-1',
        duration: 30,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Physical Therapy Exercises',
        category: 'exercise',
        time: '10:00',
        date: new Date().toISOString().split('T')[0],
        completed: false,
        reminderEnabled: true,
        reminderTime: 30,
        notes: 'Gentle stretching and mobility work',
        priority: 'high',
        linkedId: 'exercise-1',
        duration: 45,
        location: 'Living room',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        title: 'Lunch - Healing Soup',
        category: 'meal',
        time: '12:30',
        date: new Date().toISOString().split('T')[0],
        completed: false,
        reminderEnabled: true,
        reminderTime: 15,
        notes: 'Vegetable soup with lean protein',
        priority: 'medium',
        linkedId: 'meal-2',
        duration: 30,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '5',
        title: 'Follow-up Appointment',
        category: 'appointment',
        time: '14:00',
        date: new Date().toISOString().split('T')[0],
        completed: false,
        reminderEnabled: true,
        reminderTime: 60,
        notes: 'Check-up with Dr. Smith',
        priority: 'high',
        duration: 60,
        location: 'City General Hospital',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '6',
        title: 'Afternoon Walk',
        category: 'exercise',
        time: '16:00',
        date: new Date().toISOString().split('T')[0],
        completed: false,
        reminderEnabled: true,
        reminderTime: 15,
        notes: 'Light 15-minute walk around the block',
        priority: 'medium',
        linkedId: 'exercise-2',
        duration: 15,
        location: 'Neighborhood',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '7',
        title: 'Evening Medication',
        category: 'medication',
        time: '20:00',
        date: new Date().toISOString().split('T')[0],
        completed: false,
        reminderEnabled: true,
        reminderTime: 15,
        notes: 'Omeprazole 20mg before dinner',
        priority: 'high',
        linkedId: 'med-2',
        duration: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '8',
        title: 'Dinner - Light Meal',
        category: 'meal',
        time: '18:30',
        date: new Date().toISOString().split('T')[0],
        completed: false,
        reminderEnabled: true,
        reminderTime: 20,
        notes: 'Grilled chicken with steamed vegetables',
        priority: 'medium',
        linkedId: 'meal-3',
        duration: 45,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    setScheduleItems(sampleItems);
  }, []);

  // Filter items by selected date and tab
  const filteredItems = scheduleItems.filter(item => {
    const itemDate = new Date(item.date);
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    const matchesDate = item.date === selectedDateStr;
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDate && matchesTab && matchesSearch;
  }).sort((a, b) => a.time.localeCompare(b.time));

  // Handle form changes
  const handleFormChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setScheduleForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof ScheduleForm],
          [child]: value
        }
      }));
    } else {
      setScheduleForm(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Add new schedule item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: ScheduleItem = {
      id: Date.now().toString(),
      title: scheduleForm.title,
      category: scheduleForm.category,
      time: scheduleForm.time,
      date: scheduleForm.date,
      completed: false,
      reminderEnabled: scheduleForm.reminderEnabled,
      reminderTime: scheduleForm.reminderTime,
      notes: scheduleForm.notes,
      priority: scheduleForm.priority,
      duration: scheduleForm.duration,
      location: scheduleForm.location,
      recurring: scheduleForm.recurring.enabled ? {
        type: scheduleForm.recurring.type,
        days: scheduleForm.recurring.days,
        endDate: scheduleForm.recurring.endDate
      } : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setScheduleItems(prev => [...prev, newItem]);
    resetForm();
    setShowAddForm(false);
  };

  // Update existing item
  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingItem) return;

    const updatedItem: ScheduleItem = {
      ...editingItem,
      title: scheduleForm.title,
      category: scheduleForm.category,
      time: scheduleForm.time,
      date: scheduleForm.date,
      reminderEnabled: scheduleForm.reminderEnabled,
      reminderTime: scheduleForm.reminderTime,
      notes: scheduleForm.notes,
      priority: scheduleForm.priority,
      duration: scheduleForm.duration,
      location: scheduleForm.location,
      recurring: scheduleForm.recurring.enabled ? {
        type: scheduleForm.recurring.type,
        days: scheduleForm.recurring.days,
        endDate: scheduleForm.recurring.endDate
      } : undefined,
      updatedAt: new Date().toISOString()
    };

    setScheduleItems(prev => prev.map(item => 
      item.id === editingItem.id ? updatedItem : item
    ));
    
    resetForm();
    setShowEditForm(false);
    setEditingItem(null);
  };

  // Delete item
  const handleDeleteItem = (id: string) => {
    setScheduleItems(prev => prev.filter(item => item.id !== id));
    setShowDeleteConfirm(null);
  };

  // Edit item
  const handleEditItem = (item: ScheduleItem) => {
    setScheduleForm({
      title: item.title,
      category: item.category,
      time: item.time,
      date: item.date,
      reminderEnabled: item.reminderEnabled,
      reminderTime: item.reminderTime || 15,
      notes: item.notes || '',
      priority: item.priority,
      duration: item.duration || 30,
      location: item.location || '',
      recurring: {
        enabled: !!item.recurring,
        type: item.recurring?.type || 'daily',
        days: item.recurring?.days || [],
        endDate: item.recurring?.endDate || ''
      }
    });
    setEditingItem(item);
    setShowEditForm(true);
  };

  // Toggle completion
  const toggleCompletion = (id: string) => {
    setScheduleItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed, updatedAt: new Date().toISOString() } : item
    ));
  };

  // Toggle reminder
  const toggleReminder = (id: string) => {
    setScheduleItems(prev => prev.map(item => 
      item.id === id ? { ...item, reminderEnabled: !item.reminderEnabled, updatedAt: new Date().toISOString() } : item
    ));
  };

  const resetForm = () => {
    setScheduleForm({
      title: '',
      category: 'custom',
      time: '09:00',
      date: new Date().toISOString().split('T')[0],
      reminderEnabled: true,
      reminderTime: 15,
      notes: '',
      priority: 'medium',
      duration: 30,
      location: '',
      recurring: {
        enabled: false,
        type: 'daily',
        days: [],
        endDate: ''
      }
    });
  };

  // Navigate dates
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate);
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medication': return Pill;
      case 'meal': return UtensilsCrossed;
      case 'exercise': return Activity;
      case 'appointment': return Stethoscope;
      default: return Calendar;
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'medication': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'meal': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'exercise': return 'text-green-600 bg-green-50 border-green-200';
      case 'appointment': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  // Get time period
  const getTimePeriod = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  };

  // Group items by time period
  const groupedItems = filteredItems.reduce((groups, item) => {
    const period = getTimePeriod(item.time);
    if (!groups[period]) groups[period] = [];
    groups[period].push(item);
    return groups;
  }, {} as Record<string, ScheduleItem[]>);

  // Calculate completion stats
  const totalItems = filteredItems.length;
  const completedItems = filteredItems.filter(item => item.completed).length;
  const completionRate = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
          <p className="text-gray-600 mt-1">Manage your daily recovery routine</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} icon={Filter}>
            Filters
          </Button>
          <Button variant="primary" onClick={() => setShowAddForm(true)} icon={Plus}>
            Add Task
          </Button>
        </div>
      </div>

      {/* Date Navigation & Stats */}
      <Card>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h2>
              <p className="text-sm text-gray-600">
                {totalItems} tasks scheduled
              </p>
            </div>
            <button
              onClick={() => navigateDate('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{completionRate}%</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{completedItems}</div>
              <div className="text-sm text-gray-600">Done</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{totalItems - completedItems}</div>
              <div className="text-sm text-gray-600">Remaining</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      {/* Category Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'all', label: 'All Tasks', icon: Calendar },
            { id: 'medication', label: 'Medications', icon: Pill },
            { id: 'meal', label: 'Meals', icon: UtensilsCrossed },
            { id: 'exercise', label: 'Exercises', icon: Activity },
            { id: 'appointment', label: 'Appointments', icon: Stethoscope },
            { id: 'custom', label: 'Custom', icon: Star }
          ].map((tab) => {
            const Icon = tab.icon;
            const count = tab.id === 'all' ? filteredItems.length : 
                         filteredItems.filter(item => item.category === tab.id).length;
            
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
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Schedule Items */}
      <div className="space-y-8">
        {Object.keys(groupedItems).length === 0 ? (
          <Card className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks scheduled</h3>
            <p className="text-gray-600 mb-4">Add your first task to get started with your daily routine.</p>
            <Button variant="primary" onClick={() => setShowAddForm(true)} icon={Plus}>
              Add Task
            </Button>
          </Card>
        ) : (
          ['Morning', 'Afternoon', 'Evening'].map(period => {
            const items = groupedItems[period] || [];
            if (items.length === 0) return null;

            const periodIcon = period === 'Morning' ? Sun : period === 'Afternoon' ? Sunset : Moon;
            const PeriodIcon = periodIcon;

            return (
              <Card key={period}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl">
                    <PeriodIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{period}</h3>
                    <p className="text-sm text-gray-600">{items.length} tasks</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {items.map(item => {
                    const CategoryIcon = getCategoryIcon(item.category);
                    
                    return (
                      <div
                        key={item.id}
                        className={`border-l-4 ${getPriorityColor(item.priority)} bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <button
                              onClick={() => toggleCompletion(item.id)}
                              className={`mt-1 p-2 rounded-lg transition-colors ${
                                item.completed 
                                  ? 'bg-emerald-100 text-emerald-600' 
                                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                              }`}
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>

                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className={`font-medium ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                  {item.title}
                                </h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                                  <CategoryIcon className="h-3 w-3 inline mr-1" />
                                  {item.category}
                                </span>
                                {item.priority === 'high' && (
                                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                                    High Priority
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{item.time}</span>
                                </div>
                                {item.duration && (
                                  <div className="flex items-center space-x-1">
                                    <Timer className="h-4 w-4" />
                                    <span>{item.duration} min</span>
                                  </div>
                                )}
                                {item.location && (
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{item.location}</span>
                                  </div>
                                )}
                                {item.reminderEnabled && (
                                  <div className="flex items-center space-x-1 text-emerald-600">
                                    <Bell className="h-4 w-4" />
                                    <span>{item.reminderTime}m before</span>
                                  </div>
                                )}
                              </div>

                              {item.notes && (
                                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                                  {item.notes}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => toggleReminder(item.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                item.reminderEnabled 
                                  ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' 
                                  : 'text-gray-400 bg-gray-50 hover:bg-gray-100'
                              }`}
                              title={item.reminderEnabled ? 'Disable reminder' : 'Enable reminder'}
                            >
                              {item.reminderEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => handleEditItem(item)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit task"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(item.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete task"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Add/Edit Task Modal */}
      {(showAddForm || showEditForm) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {showEditForm ? 'Edit Task' : 'Add New Task'}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setShowEditForm(false);
                  setEditingItem(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={showEditForm ? handleUpdateItem : handleAddItem} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={scheduleForm.title}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter task title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={scheduleForm.category}
                    onChange={(e) => handleFormChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="medication">Medication</option>
                    <option value="meal">Meal</option>
                    <option value="exercise">Exercise</option>
                    <option value="appointment">Appointment</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={scheduleForm.date}
                    onChange={(e) => handleFormChange('date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={scheduleForm.time}
                    onChange={(e) => handleFormChange('time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={scheduleForm.duration}
                    onChange={(e) => handleFormChange('duration', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    min="1"
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={scheduleForm.priority}
                    onChange={(e) => handleFormChange('priority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={scheduleForm.location}
                    onChange={(e) => handleFormChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Optional location"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={scheduleForm.notes}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows={3}
                  placeholder="Additional notes or instructions..."
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="reminderEnabled"
                    checked={scheduleForm.reminderEnabled}
                    onChange={(e) => handleFormChange('reminderEnabled', e.target.checked)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <label htmlFor="reminderEnabled" className="ml-2 text-sm text-gray-700">
                    Enable reminder
                  </label>
                </div>

                {scheduleForm.reminderEnabled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Remind me (minutes before)
                    </label>
                    <select
                      value={scheduleForm.reminderTime}
                      onChange={(e) => handleFormChange('reminderTime', parseInt(e.target.value))}
                      className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value={5}>5 minutes</option>
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowAddForm(false);
                    setShowEditForm(false);
                    setEditingItem(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  icon={Save}
                >
                  {showEditForm ? 'Update Task' : 'Add Task'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="text-center">
              <div className="bg-red-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Task</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this task? This action cannot be undone.
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
                  onClick={() => handleDeleteItem(showDeleteConfirm)}
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

export default SchedulePage;