import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Bell, 
  Moon, 
  Sun, 
  Globe, 
  Smartphone, 
  Volume2, 
  VolumeX, 
  Vibrate, 
  Clock, 
  Calendar, 
  Heart, 
  Activity, 
  Pill, 
  UtensilsCrossed, 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  Database, 
  Cloud, 
  HardDrive, 
  Zap, 
  Battery, 
  Monitor, 
  Palette, 
  Type, 
  Accessibility, 
  Languages, 
  MapPin, 
  Timer, 
  Target, 
  TrendingUp,
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Info,
  HelpCircle,
  ExternalLink,
  Mail,
  Phone,
  MessageSquare,
  Bug,
  Star,
  Gift,
  CreditCard,
  Crown,
  Sparkles
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import DataStorageManager from '../components/DataManagement/DataStorageManager';
import ResourcesManager from '../components/Support/ResourcesManager';

interface NotificationSettings {
  medications: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
    advanceTime: number; // minutes before
  };
  meals: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
    advanceTime: number;
  };
  appointments: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
    advanceTime: number;
  };
  achievements: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
  };
  reminders: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
  };
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'auto';
  colorScheme: 'emerald' | 'blue' | 'purple' | 'orange';
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
  animations: boolean;
  highContrast: boolean;
}

interface PrivacySettings {
  dataSharing: boolean;
  analytics: boolean;
  crashReports: boolean;
  locationServices: boolean;
  biometricAuth: boolean;
  autoLock: boolean;
  autoLockTime: number; // minutes
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'appearance' | 'privacy' | 'data' | 'support' | 'about'>('notifications');
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    medications: { enabled: true, sound: true, vibration: true, advanceTime: 15 },
    meals: { enabled: true, sound: false, vibration: true, advanceTime: 30 },
    appointments: { enabled: true, sound: true, vibration: true, advanceTime: 60 },
    achievements: { enabled: true, sound: true, vibration: false },
    reminders: { enabled: true, sound: false, vibration: true },
    quietHours: { enabled: true, startTime: '22:00', endTime: '07:00' }
  });

  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>({
    theme: 'light',
    colorScheme: 'emerald',
    fontSize: 'medium',
    compactMode: false,
    animations: true,
    highContrast: false
  });

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    dataSharing: true,
    analytics: true,
    crashReports: true,
    locationServices: false,
    biometricAuth: true,
    autoLock: true,
    autoLockTime: 5
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('healthmate_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.notifications) setNotificationSettings(parsed.notifications);
        if (parsed.appearance) setAppearanceSettings(parsed.appearance);
        if (parsed.privacy) setPrivacySettings(parsed.privacy);
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  // Apply appearance settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme
    if (appearanceSettings.theme === 'dark') {
      root.classList.add('dark');
    } else if (appearanceSettings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // Auto theme based on system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }

    // Apply color scheme
    root.setAttribute('data-color-scheme', appearanceSettings.colorScheme);

    // Apply font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    root.style.fontSize = fontSizeMap[appearanceSettings.fontSize];

    // Apply compact mode
    if (appearanceSettings.compactMode) {
      document.body.classList.add('compact-mode');
    } else {
      document.body.classList.remove('compact-mode');
    }

    // Apply high contrast
    if (appearanceSettings.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    // Apply animations
    if (!appearanceSettings.animations) {
      document.body.classList.add('no-animations');
    } else {
      document.body.classList.remove('no-animations');
    }
  }, [appearanceSettings]);

  const updateNotificationSetting = (category: keyof NotificationSettings, setting: string, value: any) => {
    setNotificationSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
    setHasChanges(true);
  };

  const updateAppearanceSetting = (setting: keyof AppearanceSettings, value: any) => {
    setAppearanceSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    setHasChanges(true);
  };

  const updatePrivacySetting = (setting: keyof PrivacySettings, value: any) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    const allSettings = {
      notifications: notificationSettings,
      appearance: appearanceSettings,
      privacy: privacySettings,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('healthmate_settings', JSON.stringify(allSettings));
    setHasChanges(false);
    setShowSaveSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const resetSettings = () => {
    // Reset to defaults
    setNotificationSettings({
      medications: { enabled: true, sound: true, vibration: true, advanceTime: 15 },
      meals: { enabled: true, sound: false, vibration: true, advanceTime: 30 },
      appointments: { enabled: true, sound: true, vibration: true, advanceTime: 60 },
      achievements: { enabled: true, sound: true, vibration: false },
      reminders: { enabled: true, sound: false, vibration: true },
      quietHours: { enabled: true, startTime: '22:00', endTime: '07:00' }
    });
    
    setAppearanceSettings({
      theme: 'light',
      colorScheme: 'emerald',
      fontSize: 'medium',
      compactMode: false,
      animations: true,
      highContrast: false
    });
    
    setPrivacySettings({
      dataSharing: true,
      analytics: true,
      crashReports: true,
      locationServices: false,
      biometricAuth: true,
      autoLock: true,
      autoLockTime: 5
    });
    
    setHasChanges(false);
  };

  const exportSettings = () => {
    const settings = {
      notifications: notificationSettings,
      appearance: appearanceSettings,
      privacy: privacySettings,
      exportDate: new Date().toISOString(),
      version: '2.1.0'
    };
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `healthmate-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Customize your HealthMate.AI experience</p>
        </div>
        <div className="flex items-center space-x-3">
          {showSaveSuccess && (
            <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">Settings saved successfully!</span>
            </div>
          )}
          {hasChanges && (
            <>
              <Button variant="outline" onClick={resetSettings} icon={RotateCcw}>
                Reset
              </Button>
              <Button variant="primary" onClick={saveSettings} icon={Save}>
                Save Changes
              </Button>
            </>
          )}
          <Button variant="outline" onClick={exportSettings} icon={Download}>
            Export Settings
          </Button>
        </div>
      </div>

      {/* Settings Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'appearance', label: 'Appearance', icon: Palette },
            { id: 'privacy', label: 'Privacy & Security', icon: Shield },
            { id: 'data', label: 'Data & Storage', icon: Database },
            { id: 'support', label: 'Help & Support', icon: HelpCircle },
            { id: 'about', label: 'About', icon: Info }
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

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-8">
          {/* Notification Categories */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notification Categories
            </h3>
            <div className="space-y-6">
              {Object.entries(notificationSettings).filter(([key]) => key !== 'quietHours').map(([category, settings]) => (
                <div key={category} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {category === 'medications' && <Pill className="h-5 w-5 text-blue-600" />}
                      {category === 'meals' && <UtensilsCrossed className="h-5 w-5 text-orange-600" />}
                      {category === 'appointments' && <Calendar className="h-5 w-5 text-purple-600" />}
                      {category === 'achievements' && <Star className="h-5 w-5 text-yellow-600" />}
                      {category === 'reminders' && <Clock className="h-5 w-5 text-green-600" />}
                      <h4 className="font-medium text-gray-900 capitalize">{category}</h4>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.enabled}
                        onChange={(e) => updateNotificationSetting(category as keyof NotificationSettings, 'enabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  {settings.enabled && (
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 flex items-center">
                          <Volume2 className="h-4 w-4 mr-2" />
                          Sound
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.sound}
                            onChange={(e) => updateNotificationSetting(category as keyof NotificationSettings, 'sound', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 flex items-center">
                          <Vibrate className="h-4 w-4 mr-2" />
                          Vibration
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.vibration}
                            onChange={(e) => updateNotificationSetting(category as keyof NotificationSettings, 'vibration', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>

                      {('advanceTime' in settings) && (
                        <div>
                          <label className="text-sm text-gray-700 flex items-center mb-1">
                            <Timer className="h-4 w-4 mr-2" />
                            Advance Time
                          </label>
                          <select
                            value={settings.advanceTime}
                            onChange={(e) => updateNotificationSetting(category as keyof NotificationSettings, 'advanceTime', parseInt(e.target.value))}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          >
                            <option value={0}>On time</option>
                            <option value={5}>5 minutes before</option>
                            <option value={15}>15 minutes before</option>
                            <option value={30}>30 minutes before</option>
                            <option value={60}>1 hour before</option>
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Quiet Hours */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Moon className="h-5 w-5 mr-2" />
              Quiet Hours
            </h3>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900">Enable Quiet Hours</h4>
                <p className="text-sm text-gray-600">Silence non-urgent notifications during specified hours</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.quietHours.enabled}
                  onChange={(e) => updateNotificationSetting('quietHours', 'enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {notificationSettings.quietHours.enabled && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={notificationSettings.quietHours.startTime}
                    onChange={(e) => updateNotificationSetting('quietHours', 'startTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    value={notificationSettings.quietHours.endTime}
                    onChange={(e) => updateNotificationSetting('quietHours', 'endTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Appearance Tab */}
      {activeTab === 'appearance' && (
        <div className="space-y-8">
          {/* Theme Settings */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Theme & Colors
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', label: 'Light', icon: Sun },
                    { value: 'dark', label: 'Dark', icon: Moon },
                    { value: 'auto', label: 'Auto', icon: Monitor }
                  ].map((theme) => {
                    const Icon = theme.icon;
                    return (
                      <button
                        key={theme.value}
                        onClick={() => updateAppearanceSetting('theme', theme.value)}
                        className={`flex flex-col items-center p-4 border-2 rounded-lg transition-colors ${
                          appearanceSettings.theme === theme.value
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="h-6 w-6 mb-2" />
                        <span className="text-sm font-medium">{theme.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Color Scheme</label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { value: 'emerald', label: 'Emerald', color: 'bg-emerald-500' },
                    { value: 'blue', label: 'Blue', color: 'bg-blue-500' },
                    { value: 'purple', label: 'Purple', color: 'bg-purple-500' },
                    { value: 'orange', label: 'Orange', color: 'bg-orange-500' }
                  ].map((scheme) => (
                    <button
                      key={scheme.value}
                      onClick={() => updateAppearanceSetting('colorScheme', scheme.value)}
                      className={`flex flex-col items-center p-3 border-2 rounded-lg transition-colors ${
                        appearanceSettings.colorScheme === scheme.value
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full ${scheme.color} mb-2`}></div>
                      <span className="text-sm font-medium">{scheme.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Display Settings */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Type className="h-5 w-5 mr-2" />
              Display Settings
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Font Size</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'small', label: 'Small' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'large', label: 'Large' }
                  ].map((size) => (
                    <button
                      key={size.value}
                      onClick={() => updateAppearanceSetting('fontSize', size.value)}
                      className={`p-3 border-2 rounded-lg transition-colors ${
                        appearanceSettings.fontSize === size.value
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className={`font-medium ${
                        size.value === 'small' ? 'text-sm' :
                        size.value === 'large' ? 'text-lg' : 'text-base'
                      }`}>
                        {size.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Compact Mode</h4>
                    <p className="text-sm text-gray-600">Reduce spacing and padding for more content</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={appearanceSettings.compactMode}
                      onChange={(e) => updateAppearanceSetting('compactMode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Animations</h4>
                    <p className="text-sm text-gray-600">Enable smooth transitions and animations</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={appearanceSettings.animations}
                      onChange={(e) => updateAppearanceSetting('animations', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">High Contrast</h4>
                    <p className="text-sm text-gray-600">Improve visibility with higher contrast colors</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={appearanceSettings.highContrast}
                      onChange={(e) => updateAppearanceSetting('highContrast', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Privacy & Security Tab */}
      {activeTab === 'privacy' && (
        <div className="space-y-8">
          {/* Security Settings */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              Security Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Biometric Authentication</h4>
                  <p className="text-sm text-gray-600">Use fingerprint or face recognition to unlock</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacySettings.biometricAuth}
                    onChange={(e) => updatePrivacySetting('biometricAuth', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Auto Lock</h4>
                  <p className="text-sm text-gray-600">Automatically lock the app when inactive</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacySettings.autoLock}
                    onChange={(e) => updatePrivacySetting('autoLock', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {privacySettings.autoLock && (
                <div className="ml-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Auto Lock Time</label>
                  <select
                    value={privacySettings.autoLockTime}
                    onChange={(e) => updatePrivacySetting('autoLockTime', parseInt(e.target.value))}
                    className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value={1}>1 minute</option>
                    <option value={5}>5 minutes</option>
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                  </select>
                </div>
              )}
            </div>
          </Card>

          {/* Privacy Controls */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Privacy Controls
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Data Sharing</h4>
                  <p className="text-sm text-gray-600">Share anonymized data to improve healthcare research</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacySettings.dataSharing}
                    onChange={(e) => updatePrivacySetting('dataSharing', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Analytics</h4>
                  <p className="text-sm text-gray-600">Help improve the app with usage analytics</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacySettings.analytics}
                    onChange={(e) => updatePrivacySetting('analytics', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Crash Reports</h4>
                  <p className="text-sm text-gray-600">Automatically send crash reports to help fix issues</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacySettings.crashReports}
                    onChange={(e) => updatePrivacySetting('crashReports', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Location Services</h4>
                  <p className="text-sm text-gray-600">Allow location access for nearby healthcare providers</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacySettings.locationServices}
                    onChange={(e) => updatePrivacySetting('locationServices', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Data & Storage Tab */}
      {activeTab === 'data' && <DataStorageManager />}

      {/* Help & Support Tab */}
      {activeTab === 'support' && (
        <div className="space-y-8">
          {/* Contact Support */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              Contact Support
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => window.location.href = 'mailto:support@healthmate.ai?subject=HealthMate.AI Support Request'}
              >
                <Mail className="h-6 w-6" />
                <span className="text-sm">Email Support</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => window.location.href = 'tel:+1-800-HEALTH'}
              >
                <Phone className="h-6 w-6" />
                <span className="text-sm">Call Support</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => window.open('https://chat.healthmate.ai', '_blank')}
              >
                <MessageSquare className="h-6 w-6" />
                <span className="text-sm">Live Chat</span>
              </Button>
            </div>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Support Hours</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>Monday - Friday: 8:00 AM - 8:00 PM EST</p>
                <p>Saturday - Sunday: 10:00 AM - 6:00 PM EST</p>
                <p>Emergency support available 24/7</p>
              </div>
            </div>
          </Card>

          {/* Resources */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Resources
            </h3>
            <ResourcesManager />
          </Card>

          {/* Feedback */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Feedback
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-16 flex-col space-y-2"
                onClick={() => window.open('https://apps.apple.com/app/healthmate-ai/id123456789', '_blank')}
              >
                <Star className="h-5 w-5" />
                <span className="text-sm">Rate the App</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex-col space-y-2"
                onClick={() => window.location.href = 'mailto:bugs@healthmate.ai?subject=Bug Report'}
              >
                <Bug className="h-5 w-5" />
                <span className="text-sm">Report a Bug</span>
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* About Tab */}
      {activeTab === 'about' && (
        <div className="space-y-8">
          {/* App Information */}
          <Card>
            <div className="text-center">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">HealthMate.AI</h2>
              <p className="text-gray-600 mb-4">Your AI-Powered Recovery Partner</p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <span>Version 2.1.0</span>
                <span>•</span>
                <span>Build 2024.01.19</span>
              </div>
            </div>
          </Card>

          {/* Features */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">What's New</h3>
            <div className="space-y-4">
              {[
                {
                  version: '2.1.0',
                  date: 'January 19, 2024',
                  features: [
                    'Enhanced medication tracking with smart reminders',
                    'Improved nutrition planning with AI recommendations',
                    'New achievement system for recovery milestones',
                    'Better accessibility support'
                  ]
                },
                {
                  version: '2.0.5',
                  date: 'December 15, 2023',
                  features: [
                    'Bug fixes and performance improvements',
                    'Updated privacy controls',
                    'New export options for health data'
                  ]
                }
              ].map((update) => (
                <div key={update.version} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Version {update.version}</h4>
                    <span className="text-sm text-gray-500">{update.date}</span>
                  </div>
                  <ul className="space-y-1">
                    {update.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>

          {/* Legal & Credits */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Legal & Credits</h3>
            <div className="space-y-4 text-sm text-gray-600">
              <p>
                HealthMate.AI is designed to support your recovery journey and should not replace professional medical advice. 
                Always consult with your healthcare provider for medical decisions.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Developed by</h4>
                  <p>HealthTech Solutions Inc.</p>
                  <p>San Francisco, CA</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Certifications</h4>
                  <p>HIPAA Compliant</p>
                  <p>FDA Guidelines Compliant</p>
                  <p>SOC 2 Type II Certified</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs">
                  © 2024 HealthTech Solutions Inc. All rights reserved. 
                  HealthMate.AI and the HealthMate.AI logo are trademarks of HealthTech Solutions Inc.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;