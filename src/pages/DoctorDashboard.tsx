import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Heart, 
  Pill, 
  FileText, 
  MessageCircle, 
  Phone, 
  Video, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Star, 
  Award, 
  Target, 
  Zap, 
  Bell, 
  Settings, 
  User, 
  Stethoscope, 
  ClipboardList, 
  BarChart3, 
  LineChart as LineChartIcon, 
  Download, 
  Send, 
  Paperclip, 
  Image, 
  Mic, 
  MapPin, 
  Timer, 
  AlertCircle, 
  Info, 
  ChevronRight, 
  ChevronDown, 
  Bookmark, 
  Share2, 
  RefreshCw,
  UserPlus,
  Calendar as CalendarIcon,
  Mail,
  Globe,
  Shield,
  Database,
  LogOut,
  X,
  Save
} from 'lucide-react';
import { useDoctor } from '../contexts/DoctorContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import BoltBadge from '../components/UI/BoltBadge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DoctorDashboard: React.FC = () => {
  const { doctorUser, patients, alerts, logout } = useDoctor();
  const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'appointments' | 'messages' | 'analytics' | 'profile'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [localPatients, setLocalPatients] = useState(patients);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [newPatientForm, setNewPatientForm] = useState({
    name: '',
    email: '',
    condition: '',
    phone: '',
    age: '',
    gender: 'male'
  });
  const [appointmentForm, setAppointmentForm] = useState({
    patientId: '',
    date: '',
    time: '',
    type: 'consultation',
    duration: '30',
    notes: ''
  });
  const [messageForm, setMessageForm] = useState({
    recipientId: '',
    subject: '',
    message: ''
  });
  const [replyForm, setReplyForm] = useState({
    message: ''
  });
  const [profileForm, setProfileForm] = useState({
    name: doctorUser?.name || '',
    email: doctorUser?.email || '',
    phone: doctorUser?.phone || '',
    bio: doctorUser?.bio || '',
    specialty: doctorUser?.specialty || '',
    hospital: doctorUser?.hospital || ''
  });

  React.useEffect(() => {
    setLocalPatients(patients);
  }, [patients]);

  if (!doctorUser) return null;

  // Get doctor's first name for greeting
  const getFirstName = () => {
    if (!doctorUser?.name) return 'Doctor';
    const name = doctorUser.name;
    // Handle "Dr." prefix
    if (name.startsWith('Dr. ')) {
      return name.substring(4).split(' ')[0];
    }
    return name.split(' ')[0];
  };

  // Get time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Sample data for charts
  const progressData = [
    { name: 'Week 1', adherence: 85, recovery: 20 },
    { name: 'Week 2', adherence: 88, recovery: 35 },
    { name: 'Week 3', adherence: 92, recovery: 50 },
    { name: 'Week 4', adherence: 89, recovery: 65 },
    { name: 'Week 5', adherence: 94, recovery: 80 },
    { name: 'Week 6', adherence: 91, recovery: 90 }
  ];

  const recoveryStageData = [
    { name: 'Early', value: 35, color: '#ef4444' },
    { name: 'Intermediate', value: 40, color: '#f59e0b' },
    { name: 'Advanced', value: 20, color: '#10b981' },
    { name: 'Maintenance', value: 5, color: '#3b82f6' }
  ];

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    const newPatient = {
      id: Date.now().toString(),
      patientId: `patient-${Date.now()}`,
      patientName: newPatientForm.name,
      patientEmail: newPatientForm.email,
      condition: newPatientForm.condition,
      recoveryStage: 'early' as const,
      assignedDate: new Date().toISOString().split('T')[0],
      lastCheckIn: 'Just now',
      adherenceRate: 100,
      riskLevel: 'low' as const,
      urgentAlerts: 0,
      notes: 'New patient',
      isActive: true
    };
    
    setLocalPatients(prev => [...prev, newPatient]);
    setNewPatientForm({ name: '', email: '', condition: '', phone: '', age: '', gender: 'male' });
    setShowAddPatientModal(false);
    alert('New patient registered successfully!');
  };

  const handleScheduleAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Appointment scheduled successfully for ${appointmentForm.date} at ${appointmentForm.time}`);
    setAppointmentForm({ patientId: '', date: '', time: '', type: 'consultation', duration: '30', notes: '' });
    setShowScheduleModal(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Message sent successfully to patient!`);
    setMessageForm({ recipientId: '', subject: '', message: '' });
    setShowMessageModal(false);
  };

  const handleReplyMessage = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Reply sent successfully!`);
    setReplyForm({ message: '' });
    setShowReplyModal(false);
    setSelectedMessage(null);
  };

  const handleEditProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profile updated successfully!');
    setShowEditProfileModal(false);
  };

  const handleJoinAppointment = (patientName: string) => {
    alert(`Joining video call with ${patientName}...`);
  };

  const handleReply = (message: any) => {
    setSelectedMessage(message);
    setShowReplyModal(true);
  };

  // Filter patients based on search
  const filteredPatients = localPatients.filter(patient => 
    patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadAlerts = alerts.filter(alert => !alert.isRead).length;
  const urgentAlerts = alerts.filter(alert => alert.severity === 'urgent').length;
  const totalPatients = localPatients.length;
  const activePatients = localPatients.filter(p => p.isActive).length;
  const averageAdherence = localPatients.reduce((sum, p) => sum + p.adherenceRate, 0) / localPatients.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-xl">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Doctor Portal</h1>
                <p className="text-sm text-green-600">HealthMate.AI Professional</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Bolt Badge */}
              <BoltBadge size="sm" variant="black" />
              
              <div className="relative">
                <Bell className="h-6 w-6 text-gray-600" />
                {unreadAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {unreadAlerts}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {doctorUser.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">{doctorUser.name}</span>
                <button
                  onClick={logout}
                  className="ml-2 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'patients', label: 'My Patients', icon: Users },
              { id: 'appointments', label: 'Appointments', icon: Calendar },
              { id: 'messages', label: 'Messages', icon: MessageCircle },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'profile', label: 'Profile', icon: User }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                  {tab.id === 'messages' && unreadAlerts > 0 && (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
                      {unreadAlerts}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {getTimeBasedGreeting()}, {getFirstName()}!
                  </h2>
                  <p className="text-green-100 text-lg">
                    You have {activePatients} active patients under your care
                  </p>
                  <div className="flex items-center mt-4 space-x-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-300 rounded-full"></div>
                      <span className="text-green-100">{urgentAlerts} urgent alerts</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-300 rounded-full"></div>
                      <span className="text-green-100">{Math.round(averageAdherence)}% avg adherence</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-1">{doctorUser.rating}</div>
                      <div className="text-green-100 text-sm">Patient Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Patients</p>
                    <p className="text-2xl font-bold text-blue-900">{totalPatients}</p>
                    <p className="text-xs text-blue-700">{activePatients} active</p>
                  </div>
                  <div className="bg-blue-500 p-3 rounded-xl">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Urgent Alerts</p>
                    <p className="text-2xl font-bold text-orange-900">{urgentAlerts}</p>
                    <p className="text-xs text-orange-700">Require attention</p>
                  </div>
                  <div className="bg-orange-500 p-3 rounded-xl">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Avg. Adherence</p>
                    <p className="text-2xl font-bold text-green-900">{Math.round(averageAdherence)}%</p>
                    <p className="text-xs text-green-700">Patient compliance</p>
                  </div>
                  <div className="bg-green-500 p-3 rounded-xl">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Rating</p>
                    <p className="text-2xl font-bold text-purple-900">{doctorUser.rating}</p>
                    <p className="text-xs text-purple-700">{doctorUser.reviewsCount} reviews</p>
                  </div>
                  <div className="bg-purple-500 p-3 rounded-xl">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Alerts & Quick Actions */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Recent Alerts
                </h3>
                <div className="space-y-3">
                  {alerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`p-1 rounded-full ${
                        alert.severity === 'urgent' ? 'bg-red-100' :
                        alert.severity === 'high' ? 'bg-orange-100' :
                        alert.severity === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        <AlertTriangle className={`h-3 w-3 ${
                          alert.severity === 'urgent' ? 'text-red-600' :
                          alert.severity === 'high' ? 'text-orange-600' :
                          alert.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                        <p className="text-xs text-gray-600">{alert.message}</p>
                        {alert.patientName && (
                          <p className="text-xs text-blue-600 mt-1">Patient: {alert.patientName}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {alert.actionRequired && (
                        <Button variant="primary" size="sm">
                          Action
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-16 flex-col space-y-2"
                    onClick={() => setShowAddPatientModal(true)}
                  >
                    <UserPlus className="h-5 w-5" />
                    <span className="text-sm">Add Patient</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-16 flex-col space-y-2"
                    onClick={() => setShowScheduleModal(true)}
                  >
                    <CalendarIcon className="h-5 w-5" />
                    <span className="text-sm">Schedule</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col space-y-2">
                    <FileText className="h-5 w-5" />
                    <span className="text-sm">New Note</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-16 flex-col space-y-2"
                    onClick={() => setShowMessageModal(true)}
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-sm">Message</span>
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Today's Schedule</h4>
                  <div className="space-y-2 text-sm text-blue-700">
                    <div className="flex justify-between">
                      <span>10:00 AM - Follow-up: Jane Wilson</span>
                      <span>30 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>2:00 PM - Consultation: John Doe</span>
                      <span>45 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>4:30 PM - Review: Robert Brown</span>
                      <span>20 min</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <div className="space-y-6">
            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <Button variant="outline" icon={Filter}>
                Filter
              </Button>
              <Button variant="primary" icon={Plus} onClick={() => setShowAddPatientModal(true)}>
                Add Patient
              </Button>
            </div>

            {/* Patients Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatients.map((patient) => (
                <Card key={patient.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedPatient(patient.id);
                        setShowPatientDetails(true);
                      }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {patient.patientName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{patient.patientName}</h3>
                        <p className="text-sm text-gray-600">{patient.condition}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {patient.urgentAlerts > 0 && (
                        <div className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                          {patient.urgentAlerts} alerts
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Recovery Stage</span>
                      <span className="font-medium capitalize">{patient.recoveryStage}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Adherence</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{patient.adherenceRate}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${patient.adherenceRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Risk Level</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        patient.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                        patient.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {patient.riskLevel}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Last Check-in</span>
                      <span className="text-gray-500">{patient.lastCheckIn}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Video className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Appointments</h2>
              <Button variant="primary" icon={Plus} onClick={() => setShowScheduleModal(true)}>
                Schedule Appointment
              </Button>
            </div>

            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Appointments</h3>
                <div className="space-y-4">
                  {[
                    { time: '10:00 AM', patient: 'Jane Wilson', type: 'Follow-up', duration: '30 min' },
                    { time: '2:00 PM', patient: 'John Doe', type: 'Consultation', duration: '45 min' },
                    { time: '4:30 PM', patient: 'Robert Brown', type: 'Review', duration: '20 min' }
                  ].map((appointment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-900">{appointment.time}</div>
                          <div className="text-xs text-gray-500">{appointment.duration}</div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{appointment.patient}</h4>
                          <p className="text-sm text-gray-600">{appointment.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleJoinAppointment(appointment.patient)}
                        >
                          <Video className="h-4 w-4 mr-1" />
                          Join
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
              <Button variant="primary" icon={Send} onClick={() => setShowMessageModal(true)}>
                New Message
              </Button>
            </div>

            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Messages</h3>
                <div className="space-y-4">
                  {[
                    { id: 1, from: 'Jane Wilson', subject: 'Question about medication', time: '2 hours ago', unread: true },
                    { id: 2, from: 'John Doe', subject: 'Pain level update', time: '5 hours ago', unread: false },
                    { id: 3, from: 'Robert Brown', subject: 'Exercise difficulty', time: '1 day ago', unread: false }
                  ].map((message) => (
                    <div key={message.id} className={`flex items-center justify-between p-4 rounded-lg border ${
                      message.unread ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {message.from.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{message.from}</h4>
                          <p className="text-sm text-gray-600">{message.subject}</p>
                          <p className="text-xs text-gray-500">{message.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {message.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReply(message)}
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <LineChartIcon className="h-5 w-5 mr-2" />
                  Patient Progress Trends
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="adherence" stroke="#10b981" strokeWidth={2} name="Adherence %" />
                      <Line type="monotone" dataKey="recovery" stroke="#3b82f6" strokeWidth={2} name="Recovery %" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Recovery Stage Distribution
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={recoveryStageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {recoveryStageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            <Card>
              <div className="flex items-start space-x-6">
                <div className="h-24 w-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {doctorUser.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{doctorUser.name}</h2>
                  <p className="text-lg text-gray-600">{doctorUser.specialty}</p>
                  <p className="text-gray-600">{doctorUser.hospital}</p>
                  <div className="flex items-center space-x-4 mt-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{doctorUser.rating}</span>
                      <span className="text-gray-500">({doctorUser.reviewsCount} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">Verified</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" icon={Edit3} onClick={() => setShowEditProfileModal(true)}>
                  Edit Profile
                </Button>
              </div>
            </Card>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Professional Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">License Number</label>
                    <p className="text-gray-900">{doctorUser.license}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Experience</label>
                    <p className="text-gray-900">{doctorUser.experience} years</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Education</label>
                    <div className="space-y-1">
                      {doctorUser.education.map((edu, index) => (
                        <p key={index} className="text-gray-900">{edu}</p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Certifications</label>
                    <div className="space-y-1">
                      {doctorUser.certifications.map((cert, index) => (
                        <p key={index} className="text-gray-900">{cert}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{doctorUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">{doctorUser.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Languages</label>
                    <p className="text-gray-900">{doctorUser.languages.join(', ')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Bio</label>
                    <p className="text-gray-900">{doctorUser.bio}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Add Patient Modal */}
      {showAddPatientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add New Patient</h3>
              <button
                onClick={() => setShowAddPatientModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddPatient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={newPatientForm.name}
                  onChange={(e) => setNewPatientForm({...newPatientForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={newPatientForm.email}
                  onChange={(e) => setNewPatientForm({...newPatientForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <input
                  type="text"
                  value={newPatientForm.condition}
                  onChange={(e) => setNewPatientForm({...newPatientForm, condition: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAddPatientModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  Add Patient
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Schedule Appointment Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Schedule Appointment</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleScheduleAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
                <select
                  value={appointmentForm.patientId}
                  onChange={(e) => setAppointmentForm({...appointmentForm, patientId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select Patient</option>
                  {localPatients.map(patient => (
                    <option key={patient.id} value={patient.id}>{patient.patientName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={appointmentForm.date}
                  onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  value={appointmentForm.time}
                  onChange={(e) => setAppointmentForm({...appointmentForm, time: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowScheduleModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  Schedule
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* New Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">New Message</h3>
              <button
                onClick={() => setShowMessageModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <select
                  value={messageForm.recipientId}
                  onChange={(e) => setMessageForm({...messageForm, recipientId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select Patient</option>
                  {localPatients.map(patient => (
                    <option key={patient.id} value={patient.id}>{patient.patientName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={messageForm.subject}
                  onChange={(e) => setMessageForm({...messageForm, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={messageForm.message}
                  onChange={(e) => setMessageForm({...messageForm, message: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowMessageModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  Send Message
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Reply to {selectedMessage?.from}</h3>
              <button
                onClick={() => setShowReplyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleReplyMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Reply</label>
                <textarea
                  value={replyForm.message}
                  onChange={(e) => setReplyForm({...replyForm, message: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Type your reply..."
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowReplyModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  Send Reply
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleEditProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowEditProfileModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;