import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  Stethoscope, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Heart, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Calendar, 
  Bell, 
  Shield, 
  Database, 
  Server, 
  Wifi, 
  Zap, 
  Target, 
  Award, 
  Star, 
  MapPin, 
  Globe, 
  Smartphone, 
  Monitor, 
  RefreshCw, 
  Download, 
  Filter, 
  Search, 
  MoreVertical, 
  Eye, 
  Edit3, 
  MessageCircle, 
  Phone, 
  Mail, 
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Plus,
  Info,
  Settings,
  ChevronRight,
  ChevronDown,
  X,
  FileText,
  UserPlus,
  AlertCircle,
  Trash2,
  Ban,
  CheckSquare,
  XCircle,
  PlayCircle,
  PauseCircle,
  StopCircle,
  RotateCcw,
  Power,
  HardDrive,
  Cpu,
  MemoryStick,
  WifiOff,
  CloudOff,
  BatteryLow,
  Thermometer,
  Volume2,
  VolumeX
} from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalPatients: number;
  activePatients: number;
  totalDoctors: number;
  activeDoctors: number;
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
  serverUptime: number;
  averageResponseTime: number;
  dailyActiveUsers: number;
  weeklyGrowth: number;
  monthlyGrowth: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
}

interface RecentActivity {
  id: string;
  type: 'user_registration' | 'doctor_verification' | 'patient_alert' | 'system_update' | 'security_event';
  title: string;
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  userName?: string;
  actionable: boolean;
  resolved: boolean;
}

interface QuickStat {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: any;
  color: string;
  description: string;
  clickable: boolean;
  target?: string;
}

interface SystemAlert {
  id: string;
  type: 'performance' | 'security' | 'maintenance' | 'user_action';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionRequired: boolean;
  estimatedResolution?: string;
  autoResolve: boolean;
  resolutionSteps?: string[];
}

interface QuickAction {
  id: string;
  label: string;
  icon: any;
  color: string;
  action: () => void;
  description: string;
  enabled: boolean;
  badge?: string;
}

const OverviewModule: React.FC = () => {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [quickStats, setQuickStats] = useState<QuickStat[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('24h');
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
  const [showSystemDetails, setShowSystemDetails] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<SystemAlert | null>(null);
  const [showAlertDetails, setShowAlertDetails] = useState(false);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadOverviewData(false);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, selectedTimeRange]);

  // Initialize data
  useEffect(() => {
    loadOverviewData();
  }, [selectedTimeRange]);

  const loadOverviewData = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, showLoading ? 1000 : 500));
    
    // Generate dynamic metrics with some randomness
    const baseMetrics = {
      totalUsers: 1247,
      activeUsers: 892,
      totalPatients: 1091,
      activePatients: 758,
      totalDoctors: 156,
      activeDoctors: 134
    };

    const metrics: SystemMetrics = {
      ...baseMetrics,
      totalUsers: baseMetrics.totalUsers + Math.floor(Math.random() * 10),
      activeUsers: baseMetrics.activeUsers + Math.floor(Math.random() * 20) - 10,
      systemHealth: Math.random() > 0.8 ? 'warning' : 'good',
      serverUptime: 99.8 + Math.random() * 0.2,
      averageResponseTime: 245 + Math.floor(Math.random() * 100) - 50,
      dailyActiveUsers: 423 + Math.floor(Math.random() * 50) - 25,
      weeklyGrowth: 12.5 + Math.random() * 5 - 2.5,
      monthlyGrowth: 28.3 + Math.random() * 10 - 5,
      cpuUsage: 45 + Math.random() * 30,
      memoryUsage: 62 + Math.random() * 25,
      diskUsage: 78 + Math.random() * 15,
      networkLatency: 12 + Math.random() * 8
    };

    // Generate quick stats with working click handlers
    const stats: QuickStat[] = [
      {
        id: '1',
        title: 'Total Users',
        value: metrics.totalUsers,
        change: 8.2,
        changeType: 'increase',
        icon: Users,
        color: 'blue',
        description: 'All registered users',
        clickable: true,
        target: 'users'
      },
      {
        id: '2',
        title: 'Active Patients',
        value: metrics.activePatients,
        change: 5.7,
        changeType: 'increase',
        icon: Heart,
        color: 'emerald',
        description: 'Currently active patients',
        clickable: true,
        target: 'patients'
      },
      {
        id: '3',
        title: 'Active Doctors',
        value: metrics.activeDoctors,
        change: 2.1,
        changeType: 'increase',
        icon: Stethoscope,
        color: 'purple',
        description: 'Verified active doctors',
        clickable: true,
        target: 'doctors'
      },
      {
        id: '4',
        title: 'System Health',
        value: `${metrics.serverUptime.toFixed(1)}%`,
        change: 0.2,
        changeType: 'increase',
        icon: Shield,
        color: 'green',
        description: 'Overall system uptime',
        clickable: true,
        target: 'system'
      },
      {
        id: '5',
        title: 'Response Time',
        value: `${metrics.averageResponseTime}ms`,
        change: -12.3,
        changeType: 'decrease',
        icon: Zap,
        color: 'orange',
        description: 'Average API response time',
        clickable: true,
        target: 'performance'
      },
      {
        id: '6',
        title: 'Daily Active',
        value: metrics.dailyActiveUsers,
        change: 15.8,
        changeType: 'increase',
        icon: Activity,
        color: 'indigo',
        description: 'Users active today',
        clickable: true,
        target: 'analytics'
      }
    ];

    // Generate recent activity with actionable items
    const activity: RecentActivity[] = [
      {
        id: '1',
        type: 'user_registration',
        title: 'New Patient Registration',
        description: 'Sarah Johnson registered as a new patient',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        severity: 'low',
        userId: 'user-123',
        userName: 'Sarah Johnson',
        actionable: true,
        resolved: false
      },
      {
        id: '2',
        type: 'doctor_verification',
        title: 'Doctor Verification Pending',
        description: 'Dr. Michael Chen awaits verification approval',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        severity: 'medium',
        userId: 'doc-456',
        userName: 'Dr. Michael Chen',
        actionable: true,
        resolved: false
      },
      {
        id: '3',
        type: 'patient_alert',
        title: 'Critical Patient Alert',
        description: 'Patient John Doe missed 3 consecutive medication doses',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        severity: 'high',
        userId: 'patient-789',
        userName: 'John Doe',
        actionable: true,
        resolved: false
      },
      {
        id: '4',
        type: 'system_update',
        title: 'System Maintenance Completed',
        description: 'Database optimization and security patches applied',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        severity: 'medium',
        actionable: false,
        resolved: true
      },
      {
        id: '5',
        type: 'security_event',
        title: 'Security Scan Completed',
        description: 'Weekly security scan completed - no threats detected',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        severity: 'low',
        actionable: false,
        resolved: true
      },
      {
        id: '6',
        type: 'user_registration',
        title: 'Bulk User Import',
        description: '25 new patients imported from City General Hospital',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        severity: 'medium',
        actionable: true,
        resolved: false
      }
    ];

    // Generate system alerts with resolution capabilities
    const alerts: SystemAlert[] = [
      {
        id: '1',
        type: 'performance',
        severity: 'medium',
        title: 'Database Performance Warning',
        message: 'Database response time increased by 15% in the last hour',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        isRead: false,
        actionRequired: false,
        estimatedResolution: '2 hours',
        autoResolve: true,
        resolutionSteps: [
          'Monitor database queries',
          'Check for long-running processes',
          'Optimize slow queries',
          'Consider scaling resources'
        ]
      },
      {
        id: '2',
        type: 'user_action',
        severity: 'high',
        title: 'Multiple Failed Login Attempts',
        message: 'User account "admin@hospital.com" has 5 failed login attempts',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        isRead: false,
        actionRequired: true,
        estimatedResolution: 'Immediate',
        autoResolve: false,
        resolutionSteps: [
          'Review login attempts',
          'Check IP address',
          'Contact user if legitimate',
          'Lock account if suspicious'
        ]
      },
      {
        id: '3',
        type: 'maintenance',
        severity: 'low',
        title: 'Scheduled Maintenance Reminder',
        message: 'System maintenance scheduled for tonight at 2:00 AM EST',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        actionRequired: false,
        estimatedResolution: '4 hours',
        autoResolve: true,
        resolutionSteps: [
          'Notify users of maintenance',
          'Backup critical data',
          'Execute maintenance tasks',
          'Verify system functionality'
        ]
      },
      {
        id: '4',
        type: 'security',
        severity: 'critical',
        title: 'Unusual API Activity Detected',
        message: 'Abnormal API request patterns detected from IP 192.168.1.100',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        actionRequired: true,
        estimatedResolution: 'Immediate',
        autoResolve: false,
        resolutionSteps: [
          'Block suspicious IP',
          'Analyze request patterns',
          'Check for data breaches',
          'Update security rules'
        ]
      }
    ];

    // Generate quick actions with working functionality
    const actions: QuickAction[] = [
      {
        id: '1',
        label: 'Manage Users',
        icon: Users,
        color: 'blue',
        action: () => handleQuickAction('users'),
        description: 'View and manage user accounts',
        enabled: true,
        badge: `${metrics.totalUsers}`
      },
      {
        id: '2',
        label: 'Doctor Verification',
        icon: Stethoscope,
        color: 'green',
        action: () => handleQuickAction('doctor-verification'),
        description: 'Review pending doctor verifications',
        enabled: true,
        badge: '3'
      },
      {
        id: '3',
        label: 'Security Settings',
        icon: Shield,
        color: 'red',
        action: () => handleQuickAction('security'),
        description: 'Configure security policies',
        enabled: true
      },
      {
        id: '4',
        label: 'Database Admin',
        icon: Database,
        color: 'purple',
        action: () => handleQuickAction('database'),
        description: 'Database management tools',
        enabled: true
      },
      {
        id: '5',
        label: 'Analytics',
        icon: BarChart3,
        color: 'orange',
        action: () => handleQuickAction('analytics'),
        description: 'View detailed analytics',
        enabled: true
      },
      {
        id: '6',
        label: 'System Config',
        icon: Settings,
        color: 'gray',
        action: () => handleQuickAction('settings'),
        description: 'System configuration',
        enabled: true
      }
    ];

    setSystemMetrics(metrics);
    setQuickStats(stats);
    setRecentActivity(activity);
    setSystemAlerts(alerts);
    setQuickActions(actions);
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOverviewData(false);
    setRefreshing(false);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'users':
        alert('🔄 Navigating to User Management...\n\nThis would redirect to the Users module where you can:\n• View all users\n• Add new users\n• Edit user details\n• Manage permissions');
        break;
      case 'doctor-verification':
        alert('👨‍⚕️ Opening Doctor Verification Panel...\n\nThis would show:\n• Pending verifications\n• Document review\n• Approval workflow\n• Verification history');
        break;
      case 'security':
        alert('🔒 Opening Security Settings...\n\nThis would provide access to:\n• Security policies\n• Access controls\n• Audit logs\n• Threat monitoring');
        break;
      case 'database':
        alert('🗄️ Opening Database Administration...\n\nThis would include:\n• Database status\n• Query performance\n• Backup management\n• Maintenance tools');
        break;
      case 'analytics':
        alert('📊 Opening Analytics Dashboard...\n\nThis would display:\n• Detailed reports\n• Usage statistics\n• Performance metrics\n• Custom dashboards');
        break;
      case 'settings':
        alert('⚙️ Opening System Configuration...\n\nThis would allow:\n• System settings\n• Feature toggles\n• Integration configs\n• Environment variables');
        break;
      default:
        alert(`Opening ${action} module...`);
    }
  };

  const handleStatClick = (target: string) => {
    switch (target) {
      case 'users':
        alert('👥 User Statistics\n\nDetailed breakdown:\n• Total Users: 1,247\n• Active Today: 423\n• New This Week: 89\n• Growth Rate: +8.2%');
        break;
      case 'patients':
        alert('🏥 Patient Statistics\n\nCurrent status:\n• Active Patients: 758\n• Critical Alerts: 12\n• Avg Adherence: 87%\n• Recovery Rate: 94%');
        break;
      case 'doctors':
        alert('👨‍⚕️ Doctor Statistics\n\nProvider metrics:\n• Active Doctors: 134\n• Pending Verification: 3\n• Avg Rating: 4.8/5\n• Response Time: 2.3h');
        break;
      case 'system':
        setShowSystemDetails(true);
        break;
      case 'performance':
        alert('⚡ Performance Metrics\n\nCurrent status:\n• Response Time: 245ms\n• CPU Usage: 45%\n• Memory: 62%\n• Disk: 78%');
        break;
      case 'analytics':
        alert('📈 Analytics Overview\n\nKey insights:\n• Daily Active: 423\n• Page Views: 12,847\n• API Calls: 89,234\n• Error Rate: 0.02%');
        break;
      default:
        alert(`Viewing detailed ${target} information...`);
    }
  };

  const handleActivityAction = (activity: RecentActivity, action: 'resolve' | 'view' | 'contact') => {
    switch (action) {
      case 'resolve':
        setRecentActivity(prev => prev.map(item => 
          item.id === activity.id ? { ...item, resolved: true } : item
        ));
        alert(`✅ Activity "${activity.title}" has been marked as resolved.`);
        break;
      case 'view':
        alert(`👁️ Viewing Details\n\nActivity: ${activity.title}\nUser: ${activity.userName || 'System'}\nTime: ${formatTimestamp(activity.timestamp)}\nDescription: ${activity.description}`);
        break;
      case 'contact':
        if (activity.userName) {
          alert(`📞 Contact Options for ${activity.userName}\n\n• Send message\n• Schedule call\n• Email notification\n• Emergency contact`);
        }
        break;
    }
  };

  const handleAlertAction = (alert: SystemAlert, action: 'resolve' | 'dismiss' | 'details' | 'escalate') => {
    switch (action) {
      case 'resolve':
        setSystemAlerts(prev => prev.map(item => 
          item.id === alert.id ? { ...item, isRead: true, actionRequired: false } : item
        ));
        alert(`✅ Alert "${alert.title}" has been resolved.`);
        break;
      case 'dismiss':
        setSystemAlerts(prev => prev.filter(item => item.id !== alert.id));
        alert(`🗑️ Alert "${alert.title}" has been dismissed.`);
        break;
      case 'details':
        setSelectedAlert(alert);
        setShowAlertDetails(true);
        break;
      case 'escalate':
        alert(`🚨 Alert Escalated\n\nAlert: ${alert.title}\nSeverity: ${alert.severity.toUpperCase()}\n\nThis alert has been escalated to senior administrators and will be prioritized for immediate resolution.`);
        break;
    }
  };

  const exportReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      timeRange: selectedTimeRange,
      systemMetrics,
      alertsSummary: {
        total: systemAlerts.length,
        unread: systemAlerts.filter(a => !a.isRead).length,
        critical: systemAlerts.filter(a => a.severity === 'critical').length
      },
      activitySummary: {
        total: recentActivity.length,
        unresolved: recentActivity.filter(a => !a.resolved).length,
        actionable: recentActivity.filter(a => a.actionable).length
      }
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-overview-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    alert('📊 Report Exported Successfully!\n\nThe overview report has been downloaded as a JSON file containing:\n• System metrics\n• Alert summary\n• Activity summary\n• Performance data');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration': return Users;
      case 'doctor_verification': return Stethoscope;
      case 'patient_alert': return AlertTriangle;
      case 'system_update': return Settings;
      case 'security_event': return Shield;
      default: return Activity;
    }
  };

  const getActivityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'performance': return BarChart3;
      case 'security': return Shield;
      case 'maintenance': return Settings;
      case 'user_action': return Users;
      default: return AlertTriangle;
    }
  };

  const getStatColor = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 text-blue-600 bg-blue-50 border-blue-200',
      emerald: 'from-emerald-500 to-emerald-600 text-emerald-600 bg-emerald-50 border-emerald-200',
      purple: 'from-purple-500 to-purple-600 text-purple-600 bg-purple-50 border-purple-200',
      green: 'from-green-500 to-green-600 text-green-600 bg-green-50 border-green-200',
      orange: 'from-orange-500 to-orange-600 text-orange-600 bg-orange-50 border-orange-200',
      indigo: 'from-indigo-500 to-indigo-600 text-indigo-600 bg-indigo-50 border-indigo-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Filter activities based on search and severity
  const filteredActivity = recentActivity.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || activity.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const unreadAlerts = systemAlerts.filter(alert => !alert.isRead).length;
  const criticalAlerts = systemAlerts.filter(alert => alert.severity === 'critical').length;
  const actionableActivity = recentActivity.filter(activity => activity.actionable && !activity.resolved).length;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Overview</h1>
          <p className="text-gray-600 mt-1">Real-time insights into your HealthMate.AI platform</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Auto-refresh:</label>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                autoRefresh ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                autoRefresh ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
            icon={refreshing ? undefined : RefreshCw}
          >
            {refreshing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            ) : (
              'Refresh'
            )}
          </Button>
          <Button variant="outline" onClick={exportReport} icon={Download}>
            Export Report
          </Button>
        </div>
      </div>

      {/* System Health Banner */}
      {systemMetrics && (
        <Card className={`border-l-4 ${
          systemMetrics.systemHealth === 'excellent' ? 'border-l-green-500 bg-green-50' :
          systemMetrics.systemHealth === 'good' ? 'border-l-blue-500 bg-blue-50' :
          systemMetrics.systemHealth === 'warning' ? 'border-l-yellow-500 bg-yellow-50' :
          'border-l-red-500 bg-red-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${
                systemMetrics.systemHealth === 'excellent' ? 'bg-green-500' :
                systemMetrics.systemHealth === 'good' ? 'bg-blue-500' :
                systemMetrics.systemHealth === 'warning' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}>
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  System Status: <span className="capitalize">{systemMetrics.systemHealth}</span>
                </h3>
                <p className="text-gray-600">
                  Uptime: {systemMetrics.serverUptime.toFixed(1)}% • Response Time: {systemMetrics.averageResponseTime}ms
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center cursor-pointer hover:bg-white hover:bg-opacity-50 p-2 rounded-lg transition-colors"
                   onClick={() => handleStatClick('users')}>
                <div className="text-2xl font-bold text-gray-900">{systemMetrics.activeUsers}</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="text-center cursor-pointer hover:bg-white hover:bg-opacity-50 p-2 rounded-lg transition-colors"
                   onClick={() => setShowAllAlerts(true)}>
                <div className="text-2xl font-bold text-gray-900">{unreadAlerts}</div>
                <div className="text-sm text-gray-600">Unread Alerts</div>
              </div>
              {criticalAlerts > 0 && (
                <div className="text-center cursor-pointer hover:bg-white hover:bg-opacity-50 p-2 rounded-lg transition-colors"
                     onClick={() => setShowAllAlerts(true)}>
                  <div className="text-2xl font-bold text-red-600">{criticalAlerts}</div>
                  <div className="text-sm text-red-600">Critical</div>
                </div>
              )}
              {actionableActivity > 0 && (
                <div className="text-center cursor-pointer hover:bg-white hover:bg-opacity-50 p-2 rounded-lg transition-colors"
                     onClick={() => setShowAllActivity(true)}>
                  <div className="text-2xl font-bold text-orange-600">{actionableActivity}</div>
                  <div className="text-sm text-orange-600">Action Needed</div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = getStatColor(stat.color);
          const gradientClass = `bg-gradient-to-br ${colorClasses.split(' ')[0]} ${colorClasses.split(' ')[1]}`;
          const textColorClass = colorClasses.split(' ')[2];
          const bgColorClass = colorClasses.split(' ')[3];
          const borderColorClass = colorClasses.split(' ')[4];

          return (
            <Card 
              key={stat.id} 
              className={`border ${borderColorClass} hover:shadow-lg transition-all duration-200 ${
                stat.clickable ? 'cursor-pointer hover:scale-105' : ''
              }`}
              onClick={() => stat.clickable && handleStatClick(stat.target!)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${gradientClass} p-3 rounded-xl`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  {stat.changeType === 'increase' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : stat.changeType === 'decrease' ? (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  ) : (
                    <Minus className="h-4 w-4 text-gray-400" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' :
                    stat.changeType === 'decrease' ? 'text-red-600' :
                    'text-gray-400'
                  }`}>
                    {Math.abs(stat.change)}%
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
                {stat.clickable && (
                  <p className="text-xs text-blue-600 mt-1">Click for details →</p>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Recent Activity
                {actionableActivity > 0 && (
                  <span className="ml-2 bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium">
                    {actionableActivity} need action
                  </span>
                )}
              </h3>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowAllActivity(!showAllActivity)}
                >
                  {showAllActivity ? 'Show Less' : 'Show All'}
                </Button>
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value as any)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Severity</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search activity..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              {(showAllActivity ? filteredActivity : filteredActivity.slice(0, 4)).map((activity) => {
                const ActivityIcon = getActivityIcon(activity.type);
                
                return (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className={`p-2 rounded-lg border ${getActivityColor(activity.severity)}`}>
                      <ActivityIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</span>
                          {activity.resolved && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="capitalize">{activity.type.replace('_', ' ')}</span>
                          <span>•</span>
                          <span className="capitalize">{activity.severity} priority</span>
                          {activity.userName && (
                            <>
                              <span>•</span>
                              <span>{activity.userName}</span>
                            </>
                          )}
                        </div>
                        {activity.actionable && !activity.resolved && (
                          <div className="flex items-center space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleActivityAction(activity, 'view')}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            {activity.userName && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleActivityAction(activity, 'contact')}
                              >
                                <MessageCircle className="h-3 w-3" />
                              </Button>
                            )}
                            <Button 
                              variant="primary" 
                              size="sm"
                              onClick={() => handleActivityAction(activity, 'resolve')}
                            >
                              <CheckSquare className="h-3 w-3 mr-1" />
                              Resolve
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredActivity.length === 0 && (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No activity found</p>
                <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </Card>
        </div>

        {/* System Alerts */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              System Alerts
              {unreadAlerts > 0 && (
                <span className="ml-2 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                  {unreadAlerts}
                </span>
              )}
            </h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowAllAlerts(!showAllAlerts)}
            >
              {showAllAlerts ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          <div className="space-y-3">
            {(showAllAlerts ? systemAlerts : systemAlerts.slice(0, 3)).map((alert) => {
              const AlertIcon = getAlertIcon(alert.type);
              
              return (
                <div key={alert.id} className={`p-4 border rounded-lg ${
                  alert.isRead ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
                } ${
                  alert.severity === 'critical' ? 'border-l-4 border-l-red-500' :
                  alert.severity === 'high' ? 'border-l-4 border-l-orange-500' :
                  alert.severity === 'medium' ? 'border-l-4 border-l-yellow-500' :
                  'border-l-4 border-l-blue-500'
                }`}>
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      alert.severity === 'critical' ? 'bg-red-100 text-red-600' :
                      alert.severity === 'high' ? 'bg-orange-100 text-orange-600' :
                      alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <AlertIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900 text-sm">{alert.title}</h4>
                        <div className="flex items-center space-x-1">
                          {!alert.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <button
                            onClick={() => handleAlertAction(alert, 'details')}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <MoreVertical className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{alert.message}</p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">{formatTimestamp(alert.timestamp)}</span>
                        {alert.estimatedResolution && (
                          <span className="text-xs text-gray-500">
                            Est. resolution: {alert.estimatedResolution}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleAlertAction(alert, 'dismiss')}
                          className="text-xs"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Dismiss
                        </Button>
                        {alert.actionRequired && (
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => handleAlertAction(alert, 'resolve')}
                            className="text-xs"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Resolve
                          </Button>
                        )}
                        {alert.severity === 'critical' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAlertAction(alert, 'escalate')}
                            className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Escalate
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {systemAlerts.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600">No active alerts</p>
              <p className="text-sm text-gray-500">System is running smoothly</p>
            </div>
          )}
        </Card>
      </div>

      {/* Performance Charts Placeholder */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleStatClick('analytics')}>
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <LineChart className="h-5 w-5 mr-2" />
            User Activity Trends
            <span className="ml-auto text-sm text-blue-600">Click to view →</span>
          </h3>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center border border-blue-200">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-3" />
              <p className="text-blue-600 font-medium">Interactive Chart</p>
              <p className="text-sm text-blue-500">User activity over time</p>
              <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="font-bold text-blue-700">423</div>
                  <div className="text-blue-600">Today</div>
                </div>
                <div>
                  <div className="font-bold text-blue-700">2,847</div>
                  <div className="text-blue-600">This Week</div>
                </div>
                <div>
                  <div className="font-bold text-blue-700">12,456</div>
                  <div className="text-blue-600">This Month</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleStatClick('performance')}>
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <PieChart className="h-5 w-5 mr-2" />
            System Resource Usage
            <span className="ml-auto text-sm text-green-600">Click to view →</span>
          </h3>
          <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center border border-green-200">
            <div className="text-center">
              <PieChart className="h-12 w-12 text-green-400 mx-auto mb-3" />
              <p className="text-green-600 font-medium">Resource Monitor</p>
              <p className="text-sm text-green-500">CPU, Memory, Storage usage</p>
              {systemMetrics && (
                <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="font-bold text-green-700">CPU: {systemMetrics.cpuUsage.toFixed(0)}%</div>
                    <div className="font-bold text-green-700">Memory: {systemMetrics.memoryUsage.toFixed(0)}%</div>
                  </div>
                  <div>
                    <div className="font-bold text-green-700">Disk: {systemMetrics.diskUsage.toFixed(0)}%</div>
                    <div className="font-bold text-green-700">Network: {systemMetrics.networkLatency.toFixed(0)}ms</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Zap className="h-5 w-5 mr-2" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant="outline"
                className="h-20 flex-col space-y-2 hover:shadow-md transition-all duration-200 relative"
                onClick={action.action}
                disabled={!action.enabled}
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm">{action.label}</span>
                {action.badge && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {action.badge}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </Card>

      {/* System Details Modal */}
      {showSystemDetails && systemMetrics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">System Details</h3>
              <button
                onClick={() => setShowSystemDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Cpu className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">CPU Usage</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-700">{systemMetrics.cpuUsage.toFixed(1)}%</div>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${systemMetrics.cpuUsage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <MemoryStick className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900">Memory Usage</span>
                  </div>
                  <div className="text-2xl font-bold text-green-700">{systemMetrics.memoryUsage.toFixed(1)}%</div>
                  <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${systemMetrics.memoryUsage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <HardDrive className="h-5 w-5 text-orange-600" />
                    <span className="font-medium text-orange-900">Disk Usage</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-700">{systemMetrics.diskUsage.toFixed(1)}%</div>
                  <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${systemMetrics.diskUsage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Wifi className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-purple-900">Network Latency</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-700">{systemMetrics.networkLatency.toFixed(0)}ms</div>
                  <div className="text-sm text-purple-600 mt-1">
                    {systemMetrics.networkLatency < 20 ? 'Excellent' : 
                     systemMetrics.networkLatency < 50 ? 'Good' : 'Needs attention'}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">System Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Uptime:</span>
                    <span className="ml-2 font-medium">{systemMetrics.serverUptime.toFixed(2)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Response Time:</span>
                    <span className="ml-2 font-medium">{systemMetrics.averageResponseTime}ms</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Active Users:</span>
                    <span className="ml-2 font-medium">{systemMetrics.activeUsers}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Daily Active:</span>
                    <span className="ml-2 font-medium">{systemMetrics.dailyActiveUsers}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" className="flex-1" onClick={() => handleQuickAction('performance')}>
                  View Performance Details
                </Button>
                <Button variant="primary" className="flex-1" onClick={() => setShowSystemDetails(false)}>
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Alert Details Modal */}
      {showAlertDetails && selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Alert Details</h3>
              <button
                onClick={() => setShowAlertDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className={`p-4 rounded-lg border-l-4 ${
                selectedAlert.severity === 'critical' ? 'border-l-red-500 bg-red-50' :
                selectedAlert.severity === 'high' ? 'border-l-orange-500 bg-orange-50' :
                selectedAlert.severity === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
                'border-l-blue-500 bg-blue-50'
              }`}>
                <h4 className="font-medium text-gray-900 mb-2">{selectedAlert.title}</h4>
                <p className="text-gray-700 mb-2">{selectedAlert.message}</p>
                <div className="text-sm text-gray-600">
                  <div>Type: {selectedAlert.type.replace('_', ' ')}</div>
                  <div>Severity: {selectedAlert.severity}</div>
                  <div>Time: {formatTimestamp(selectedAlert.timestamp)}</div>
                  {selectedAlert.estimatedResolution && (
                    <div>Est. Resolution: {selectedAlert.estimatedResolution}</div>
                  )}
                </div>
              </div>

              {selectedAlert.resolutionSteps && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Resolution Steps:</h5>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                    {selectedAlert.resolutionSteps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleAlertAction(selectedAlert, 'dismiss')}
                >
                  Dismiss
                </Button>
                <Button 
                  variant="primary" 
                  className="flex-1"
                  onClick={() => handleAlertAction(selectedAlert, 'resolve')}
                >
                  Resolve
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default OverviewModule;