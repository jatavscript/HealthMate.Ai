import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Clock, 
  Bell, 
  AlertCircle, 
  CheckCircle, 
  Pill, 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  Calendar,
  TrendingUp,
  BarChart3,
  X,
  Save,
  AlertTriangle,
  Info,
  Timer,
  Target,
  Activity
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useApp } from '../contexts/AppContext';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: number;
  times: string[];
  duration: number;
  durationType: 'days' | 'weeks' | 'months' | 'ongoing';
  reminderEnabled: boolean;
  instructions?: string;
  sideEffects?: string[];
  category: 'pain-relief' | 'antibiotic' | 'vitamin' | 'supplement' | 'chronic' | 'other';
  prescribedBy?: string;
  startDate: string;
  endDate?: string;
  taken: boolean[];
  missedDoses: number;
  totalDoses: number;
  adherenceRate: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface MedicationForm {
  name: string;
  dosage: string;
  frequency: number;
  times: string[];
  duration: number;
  durationType: 'days' | 'weeks' | 'months' | 'ongoing';
  reminderEnabled: boolean;
  instructions: string;
  sideEffects: string;
  category: 'pain-relief' | 'antibiotic' | 'vitamin' | 'supplement' | 'chronic' | 'other';
  prescribedBy: string;
  startDate: string;
  notes: string;
}

const MedicationsPage: React.FC = () => {
  const { user } = useApp();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterTime, setFilterTime] = useState<string>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'today' | 'all' | 'analytics'>('today');

  const [medicationForm, setMedicationForm] = useState<MedicationForm>({
    name: '',
    dosage: '',
    frequency: 1,
    times: ['08:00'],
    duration: 7,
    durationType: 'days',
    reminderEnabled: true,
    instructions: '',
    sideEffects: '',
    category: 'other',
    prescribedBy: '',
    startDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Initialize with sample data
  useEffect(() => {
    const sampleMedications: Medication[] = [
      {
        id: '1',
        name: 'Ibuprofen',
        dosage: '400mg',
        frequency: 2,
        times: ['08:00', '20:00'],
        duration: 7,
        durationType: 'days',
        reminderEnabled: true,
        instructions: 'Take with food to avoid stomach irritation',
        sideEffects: ['Stomach upset', 'Dizziness'],
        category: 'pain-relief',
        prescribedBy: 'Dr. Smith',
        startDate: '2025-01-15',
        endDate: '2025-01-22',
        taken: [true, false],
        missedDoses: 2,
        totalDoses: 14,
        adherenceRate: 85.7,
        notes: 'For post-surgery pain management',
        createdAt: '2025-01-15T08:00:00Z',
        updatedAt: '2025-01-19T08:00:00Z'
      },
      {
        id: '2',
        name: 'Vitamin D3',
        dosage: '1000 IU',
        frequency: 1,
        times: ['09:00'],
        duration: 30,
        durationType: 'days',
        reminderEnabled: true,
        instructions: 'Take with breakfast for better absorption',
        sideEffects: [],
        category: 'vitamin',
        prescribedBy: 'Dr. Johnson',
        startDate: '2025-01-10',
        endDate: '2025-02-09',
        taken: [true],
        missedDoses: 1,
        totalDoses: 30,
        adherenceRate: 96.7,
        notes: 'To support bone health during recovery',
        createdAt: '2025-01-10T09:00:00Z',
        updatedAt: '2025-01-19T09:00:00Z'
      },
      {
        id: '3',
        name: 'Omeprazole',
        dosage: '20mg',
        frequency: 1,
        times: ['07:30'],
        duration: 14,
        durationType: 'days',
        reminderEnabled: false,
        instructions: 'Take 30 minutes before breakfast on empty stomach',
        sideEffects: ['Headache', 'Nausea'],
        category: 'other',
        prescribedBy: 'Dr. Smith',
        startDate: '2025-01-12',
        endDate: '2025-01-26',
        taken: [true],
        missedDoses: 0,
        totalDoses: 14,
        adherenceRate: 100,
        notes: 'To protect stomach while taking pain medication',
        createdAt: '2025-01-12T07:30:00Z',
        updatedAt: '2025-01-19T07:30:00Z'
      }
    ];
    setMedications(sampleMedications);
  }, []);

  // Handle form changes
  const handleFormChange = (field: keyof MedicationForm, value: any) => {
    setMedicationForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Update times array when frequency changes
    if (field === 'frequency') {
      const newTimes = Array.from({ length: value }, (_, i) => {
        if (i === 0) return '08:00';
        if (i === 1) return '14:00';
        if (i === 2) return '20:00';
        return `${8 + i * 4}:00`;
      });
      setMedicationForm(prev => ({
        ...prev,
        times: newTimes
      }));
    }
  };

  const handleTimeChange = (index: number, time: string) => {
    const newTimes = [...medicationForm.times];
    newTimes[index] = time;
    setMedicationForm(prev => ({
      ...prev,
      times: newTimes
    }));
  };

  // Create new medication
  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newMedication: Medication = {
      id: Date.now().toString(),
      ...medicationForm,
      sideEffects: medicationForm.sideEffects.split(',').map(s => s.trim()).filter(s => s),
      taken: Array(medicationForm.frequency).fill(false),
      missedDoses: 0,
      totalDoses: medicationForm.frequency * medicationForm.duration,
      adherenceRate: 100,
      endDate: medicationForm.durationType !== 'ongoing' ? 
        new Date(new Date(medicationForm.startDate).getTime() + 
        medicationForm.duration * (medicationForm.durationType === 'days' ? 86400000 : 
        medicationForm.durationType === 'weeks' ? 604800000 : 2592000000)).toISOString().split('T')[0] : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setMedications(prev => [...prev, newMedication]);
    resetForm();
    setShowAddForm(false);
  };

  // Update existing medication
  const handleUpdateMedication = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingMedication) return;

    const updatedMedication: Medication = {
      ...editingMedication,
      ...medicationForm,
      sideEffects: medicationForm.sideEffects.split(',').map(s => s.trim()).filter(s => s),
      taken: Array(medicationForm.frequency).fill(false),
      endDate: medicationForm.durationType !== 'ongoing' ? 
        new Date(new Date(medicationForm.startDate).getTime() + 
        medicationForm.duration * (medicationForm.durationType === 'days' ? 86400000 : 
        medicationForm.durationType === 'weeks' ? 604800000 : 2592000000)).toISOString().split('T')[0] : undefined,
      updatedAt: new Date().toISOString()
    };

    setMedications(prev => prev.map(med => 
      med.id === editingMedication.id ? updatedMedication : med
    ));
    
    resetForm();
    setShowEditForm(false);
    setEditingMedication(null);
  };

  // Delete medication
  const handleDeleteMedication = (id: string) => {
    setMedications(prev => prev.filter(med => med.id !== id));
    setShowDeleteConfirm(null);
  };

  // Edit medication
  const handleEditMedication = (medication: Medication) => {
    setMedicationForm({
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      times: medication.times,
      duration: medication.duration,
      durationType: medication.durationType,
      reminderEnabled: medication.reminderEnabled,
      instructions: medication.instructions || '',
      sideEffects: medication.sideEffects?.join(', ') || '',
      category: medication.category,
      prescribedBy: medication.prescribedBy || '',
      startDate: medication.startDate,
      notes: medication.notes || ''
    });
    setEditingMedication(medication);
    setShowEditForm(true);
  };

  const resetForm = () => {
    setMedicationForm({
      name: '',
      dosage: '',
      frequency: 1,
      times: ['08:00'],
      duration: 7,
      durationType: 'days',
      reminderEnabled: true,
      instructions: '',
      sideEffects: '',
      category: 'other',
      prescribedBy: '',
      startDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  // Toggle medication taken status
  const toggleTaken = (medId: string, timeIndex: number) => {
    setMedications(prev => prev.map(med => {
      if (med.id === medId) {
        const newTaken = [...med.taken];
        newTaken[timeIndex] = !newTaken[timeIndex];
        
        // Recalculate adherence rate
        const totalTaken = newTaken.filter(Boolean).length;
        const adherenceRate = (totalTaken / newTaken.length) * 100;
        
        return { 
          ...med, 
          taken: newTaken,
          adherenceRate: Math.round(adherenceRate * 10) / 10,
          updatedAt: new Date().toISOString()
        };
      }
      return med;
    }));
  };

  // Get medication status
  const getTimeStatus = (time: string, taken: boolean) => {
    const now = new Date();
    const medTime = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    medTime.setHours(hours, minutes, 0, 0);
    
    if (taken) return 'taken';
    if (now > medTime) return 'missed';
    if (now.getTime() + 30 * 60 * 1000 > medTime.getTime()) return 'due-soon';
    return 'upcoming';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'taken': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'missed': return 'text-red-600 bg-red-50 border-red-200';
      case 'due-soon': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'taken': return CheckCircle;
      case 'missed': return AlertCircle;
      case 'due-soon': return Timer;
      default: return Clock;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pain-relief': return '💊';
      case 'antibiotic': return '🦠';
      case 'vitamin': return '🌟';
      case 'supplement': return '🌿';
      case 'chronic': return '⚕️';
      default: return '💉';
    }
  };

  // Filter medications
  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         med.dosage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || med.category === filterCategory;
    const matchesTime = filterTime === 'all' || 
                       (filterTime === 'morning' && med.times.some(time => parseInt(time.split(':')[0]) < 12)) ||
                       (filterTime === 'evening' && med.times.some(time => parseInt(time.split(':')[0]) >= 18));
    
    return matchesSearch && matchesCategory && matchesTime;
  });

  // Calculate analytics
  const totalMedications = medications.length;
  const activeMedications = medications.filter(med => 
    med.durationType === 'ongoing' || new Date(med.endDate || '') > new Date()
  ).length;
  const averageAdherence = medications.reduce((sum, med) => sum + med.adherenceRate, 0) / medications.length || 0;
  const todaysDoses = medications.reduce((sum, med) => sum + med.frequency, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medications</h1>
          <p className="text-gray-600 mt-1">Manage your medication schedule and track adherence</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search medications..."
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
            Add Medication
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-600">Total Medications</p>
              <p className="text-2xl font-bold text-emerald-900">{totalMedications}</p>
            </div>
            <div className="bg-emerald-500 p-3 rounded-xl">
              <Pill className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Active</p>
              <p className="text-2xl font-bold text-blue-900">{activeMedications}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-xl">
              <Activity className="h-6 w-6 text-white" />
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
              <p className="text-sm font-medium text-orange-600">Today's Doses</p>
              <p className="text-2xl font-bold text-orange-900">{todaysDoses}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-xl">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'today', label: 'Today\'s Schedule', icon: Calendar },
            { id: 'all', label: 'All Medications', icon: Pill },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
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

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="all">All Categories</option>
          <option value="pain-relief">Pain Relief</option>
          <option value="antibiotic">Antibiotics</option>
          <option value="vitamin">Vitamins</option>
          <option value="supplement">Supplements</option>
          <option value="chronic">Chronic Care</option>
          <option value="other">Other</option>
        </select>

        <select
          value={filterTime}
          onChange={(e) => setFilterTime(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="all">All Times</option>
          <option value="morning">Morning</option>
          <option value="evening">Evening</option>
        </select>
      </div>

      {/* Today's Schedule Tab */}
      {activeTab === 'today' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Today's Schedule</h2>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>

          <div className="space-y-4">
            {filteredMedications.map(medication => (
              <div key={medication.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
                      <span className="text-white text-lg">{getCategoryIcon(medication.category)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{medication.name}</h3>
                      <p className="text-gray-600">{medication.dosage}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>Prescribed by: {medication.prescribedBy}</span>
                        <span>•</span>
                        <span className="capitalize">{medication.category.replace('-', ' ')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {medication.reminderEnabled && (
                      <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
                        <Bell className="h-4 w-4" />
                        <span>Reminders On</span>
                      </div>
                    )}
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{medication.adherenceRate}%</div>
                      <div className="text-xs text-gray-500">Adherence</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-4">
                  {medication.times.map((time, index) => {
                    const status = getTimeStatus(time, medication.taken[index]);
                    const StatusIcon = getStatusIcon(status);
                    
                    return (
                      <button
                        key={index}
                        onClick={() => toggleTaken(medication.id, index)}
                        className={`flex items-center space-x-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all hover:scale-105 ${getStatusColor(status)}`}
                      >
                        <StatusIcon className="h-4 w-4" />
                        <span>{time}</span>
                        <span className="capitalize">{status.replace('-', ' ')}</span>
                      </button>
                    );
                  })}
                </div>

                {medication.instructions && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start space-x-2">
                      <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-900">Instructions</h4>
                        <p className="text-sm text-blue-800">{medication.instructions}</p>
                      </div>
                    </div>
                  </div>
                )}

                {medication.sideEffects && medication.sideEffects.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-yellow-900">Possible Side Effects</h4>
                        <p className="text-sm text-yellow-800">{medication.sideEffects.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Duration: {medication.duration} {medication.durationType}
                    {medication.endDate && (
                      <span> • Ends: {new Date(medication.endDate).toLocaleDateString()}</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Edit3}
                      onClick={() => handleEditMedication(medication)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setShowDeleteConfirm(medication.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* All Medications Tab */}
      {activeTab === 'all' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredMedications.map(medication => (
            <Card key={medication.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
                    <span className="text-white text-lg">{getCategoryIcon(medication.category)}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{medication.name}</h3>
                    <p className="text-gray-600">{medication.dosage}</p>
                    <div className="text-sm text-gray-500 mt-1">
                      Added: {new Date(medication.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {medication.reminderEnabled ? (
                    <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">
                      <Bell className="h-3 w-3" />
                      <span>On</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-gray-500 bg-gray-100 px-2 py-1 rounded-full text-xs">
                      <Bell className="h-3 w-3" />
                      <span>Off</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frequency:</span>
                  <span className="font-medium">{medication.frequency}x daily</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{medication.duration} {medication.durationType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Times:</span>
                  <span className="font-medium">{medication.times.join(', ')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Adherence:</span>
                  <span className={`font-medium ${medication.adherenceRate >= 90 ? 'text-green-600' : 
                    medication.adherenceRate >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {medication.adherenceRate}%
                  </span>
                </div>
              </div>

              {medication.notes && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-700">{medication.notes}</p>
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  icon={Edit3}
                  onClick={() => handleEditMedication(medication)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setShowDeleteConfirm(medication.id)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
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
              <p className="text-gray-600">Adherence charts and trends will be displayed here.</p>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Medication Summary</h3>
            <div className="space-y-4">
              {['pain-relief', 'antibiotic', 'vitamin', 'supplement', 'chronic', 'other'].map(category => {
                const count = medications.filter(med => med.category === category).length;
                const percentage = (count / totalMedications) * 100 || 0;
                
                return (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getCategoryIcon(category)}</span>
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {category.replace('-', ' ')}
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

      {/* Add/Edit Medication Modal */}
      {(showAddForm || showEditForm) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {showEditForm ? 'Edit Medication' : 'Add New Medication'}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setShowEditForm(false);
                  setEditingMedication(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={showEditForm ? handleUpdateMedication : handleAddMedication} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medication Name *
                  </label>
                  <input
                    type="text"
                    value={medicationForm.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter medication name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dosage *
                  </label>
                  <input
                    type="text"
                    value={medicationForm.dosage}
                    onChange={(e) => handleFormChange('dosage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., 400mg, 1 tablet"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={medicationForm.category}
                    onChange={(e) => handleFormChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="pain-relief">Pain Relief</option>
                    <option value="antibiotic">Antibiotic</option>
                    <option value="vitamin">Vitamin</option>
                    <option value="supplement">Supplement</option>
                    <option value="chronic">Chronic Care</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prescribed By
                  </label>
                  <input
                    type="text"
                    value={medicationForm.prescribedBy}
                    onChange={(e) => handleFormChange('prescribedBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Doctor's name"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency (per day) *
                  </label>
                  <select
                    value={medicationForm.frequency}
                    onChange={(e) => handleFormChange('frequency', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="1">1x daily</option>
                    <option value="2">2x daily</option>
                    <option value="3">3x daily</option>
                    <option value="4">4x daily</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration *
                  </label>
                  <input
                    type="number"
                    value={medicationForm.duration}
                    onChange={(e) => handleFormChange('duration', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="7"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration Type
                  </label>
                  <select
                    value={medicationForm.durationType}
                    onChange={(e) => handleFormChange('durationType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="ongoing">Ongoing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={medicationForm.startDate}
                  onChange={(e) => handleFormChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Times *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {medicationForm.times.map((time, index) => (
                    <input
                      key={index}
                      type="time"
                      value={time}
                      onChange={(e) => handleTimeChange(index, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructions
                </label>
                <textarea
                  value={medicationForm.instructions}
                  onChange={(e) => handleFormChange('instructions', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows={3}
                  placeholder="e.g., Take with food, before meals..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Side Effects (comma separated)
                </label>
                <input
                  type="text"
                  value={medicationForm.sideEffects}
                  onChange={(e) => handleFormChange('sideEffects', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., Nausea, Dizziness, Headache"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={medicationForm.notes}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows={2}
                  placeholder="Additional notes about this medication..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="reminders"
                  checked={medicationForm.reminderEnabled}
                  onChange={(e) => handleFormChange('reminderEnabled', e.target.checked)}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="reminders" className="ml-2 text-sm text-gray-700">
                  Enable reminders
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
                    setEditingMedication(null);
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
                  {showEditForm ? 'Update Medication' : 'Add Medication'}
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
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Medication</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this medication? This action cannot be undone.
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
                  onClick={() => handleDeleteMedication(showDeleteConfirm)}
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

export default MedicationsPage;