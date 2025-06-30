import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Upload, 
  RefreshCw, 
  Trash2, 
  HardDrive, 
  Cloud, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  X, 
  FileText, 
  Database, 
  Calendar, 
  Clock, 
  AlertCircle,
  Loader2,
  Archive,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { useApp } from '../../contexts/AppContext';

interface StorageData {
  healthData: number;
  medicationRecords: number;
  imagesFiles: number;
  appCache: number;
  total: number;
}

interface BackupData {
  id: string;
  timestamp: Date;
  size: string;
  type: 'automatic' | 'manual';
  status: 'completed' | 'failed' | 'in-progress';
  description: string;
}

interface DataExportOptions {
  includePersonalInfo: boolean;
  includeMedications: boolean;
  includeMeals: boolean;
  includeProgress: boolean;
  includeSettings: boolean;
  dateRange: 'all' | 'last30' | 'last90' | 'custom';
  customStartDate?: string;
  customEndDate?: string;
  format: 'pdf' | 'json' | 'csv';
}

const DataStorageManager: React.FC = () => {
  const { user } = useApp();
  const [storageData, setStorageData] = useState<StorageData>({
    healthData: 2.4,
    medicationRecords: 1.2,
    imagesFiles: 0.8,
    appCache: 0.4,
    total: 4.8
  });

  const [backupHistory, setBackupHistory] = useState<BackupData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showBackupDetails, setShowBackupDetails] = useState(false);
  const [lastBackup, setLastBackup] = useState<Date>(new Date(Date.now() - 2 * 60 * 60 * 1000));
  const [cloudSyncEnabled, setCloudSyncEnabled] = useState(true);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);

  const [exportOptions, setExportOptions] = useState<DataExportOptions>({
    includePersonalInfo: true,
    includeMedications: true,
    includeMeals: true,
    includeProgress: true,
    includeSettings: false,
    dateRange: 'all',
    format: 'json'
  });

  // Initialize backup history
  useEffect(() => {
    const sampleBackups: BackupData[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        size: '4.8 MB',
        type: 'automatic',
        status: 'completed',
        description: 'Scheduled backup - All data included'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        size: '4.6 MB',
        type: 'automatic',
        status: 'completed',
        description: 'Daily backup - Health data and medications'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        size: '4.2 MB',
        type: 'manual',
        status: 'completed',
        description: 'Manual backup before medication update'
      }
    ];
    setBackupHistory(sampleBackups);
  }, []);

  // Calculate storage usage
  const calculateStorageUsage = () => {
    const userData = localStorage.getItem('healthmate_user');
    const medicationData = localStorage.getItem('healthmate_medications');
    const mealData = localStorage.getItem('healthmate_meals');
    const settingsData = localStorage.getItem('healthmate_settings');
    
    const sizes = {
      healthData: userData ? new Blob([userData]).size / (1024 * 1024) : 0,
      medicationRecords: medicationData ? new Blob([medicationData]).size / (1024 * 1024) : 0,
      imagesFiles: 0.8, // Simulated
      appCache: 0.4 // Simulated
    };

    const total = Object.values(sizes).reduce((sum, size) => sum + size, 0);
    
    setStorageData({
      ...sizes,
      total: Math.round(total * 100) / 100
    });
  };

  useEffect(() => {
    calculateStorageUsage();
  }, []);

  // Clear cache function
  const clearCache = async () => {
    setIsLoading(true);
    try {
      // Simulate cache clearing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear actual cache data
      const cacheKeys = Object.keys(localStorage).filter(key => 
        key.includes('cache') || key.includes('temp')
      );
      cacheKeys.forEach(key => localStorage.removeItem(key));
      
      setStorageData(prev => ({ ...prev, appCache: 0 }));
      alert('Cache cleared successfully!');
    } catch (error) {
      alert('Failed to clear cache. Please try again.');
    } finally {
      setIsLoading(false);
      setShowClearConfirm(null);
    }
  };

  // Clear all data function
  const clearAllData = async () => {
    setIsLoading(true);
    try {
      // Simulate data clearing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create backup before clearing
      const backupData = {
        user: localStorage.getItem('healthmate_user'),
        medications: localStorage.getItem('healthmate_medications'),
        meals: localStorage.getItem('healthmate_meals'),
        settings: localStorage.getItem('healthmate_settings'),
        timestamp: new Date().toISOString()
      };
      
      // Store backup
      localStorage.setItem('healthmate_emergency_backup', JSON.stringify(backupData));
      
      // Clear all app data except backup
      const allKeys = Object.keys(localStorage);
      allKeys.forEach(key => {
        if (key.startsWith('healthmate_') && key !== 'healthmate_emergency_backup') {
          localStorage.removeItem(key);
        }
      });
      
      setStorageData({
        healthData: 0,
        medicationRecords: 0,
        imagesFiles: 0,
        appCache: 0,
        total: 0
      });
      
      alert('All data cleared successfully! Emergency backup created.');
    } catch (error) {
      alert('Failed to clear data. Please try again.');
    } finally {
      setIsLoading(false);
      setShowClearConfirm(null);
    }
  };

  // Backup now function
  const backupNow = async () => {
    setIsLoading(true);
    try {
      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const backupData = {
        user: JSON.parse(localStorage.getItem('healthmate_user') || '{}'),
        medications: JSON.parse(localStorage.getItem('healthmate_medications') || '[]'),
        meals: JSON.parse(localStorage.getItem('healthmate_meals') || '[]'),
        settings: JSON.parse(localStorage.getItem('healthmate_settings') || '{}'),
        timestamp: new Date().toISOString(),
        version: '2.1.0'
      };
      
      // Create backup file
      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `healthmate-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      // Add to backup history
      const newBackup: BackupData = {
        id: Date.now().toString(),
        timestamp: new Date(),
        size: `${(dataBlob.size / (1024 * 1024)).toFixed(1)} MB`,
        type: 'manual',
        status: 'completed',
        description: 'Manual backup - All data included'
      };
      
      setBackupHistory(prev => [newBackup, ...prev]);
      setLastBackup(new Date());
      
      alert('Backup completed successfully!');
    } catch (error) {
      alert('Backup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Restore data function
  const restoreData = async (file: File) => {
    setIsLoading(true);
    try {
      const text = await file.text();
      const backupData = JSON.parse(text);
      
      // Validate backup data
      if (!backupData.timestamp || !backupData.user) {
        throw new Error('Invalid backup file format');
      }
      
      // Restore data
      if (backupData.user) {
        localStorage.setItem('healthmate_user', JSON.stringify(backupData.user));
      }
      if (backupData.medications) {
        localStorage.setItem('healthmate_medications', JSON.stringify(backupData.medications));
      }
      if (backupData.meals) {
        localStorage.setItem('healthmate_meals', JSON.stringify(backupData.meals));
      }
      if (backupData.settings) {
        localStorage.setItem('healthmate_settings', JSON.stringify(backupData.settings));
      }
      
      calculateStorageUsage();
      alert('Data restored successfully! Please refresh the page to see changes.');
    } catch (error) {
      alert('Failed to restore data. Please check the file format.');
    } finally {
      setIsLoading(false);
      setShowRestoreModal(false);
    }
  };

  // Force sync function
  const forceSync = async () => {
    setIsLoading(true);
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update last sync time
      localStorage.setItem('healthmate_last_sync', new Date().toISOString());
      
      alert('Sync completed successfully!');
    } catch (error) {
      alert('Sync failed. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Export data function
  const exportData = async () => {
    setIsLoading(true);
    try {
      const exportData: any = {
        exportInfo: {
          timestamp: new Date().toISOString(),
          version: '2.1.0',
          user: user?.name || 'Unknown',
          options: exportOptions
        }
      };

      if (exportOptions.includePersonalInfo) {
        exportData.personalInfo = JSON.parse(localStorage.getItem('healthmate_user') || '{}');
      }
      
      if (exportOptions.includeMedications) {
        exportData.medications = JSON.parse(localStorage.getItem('healthmate_medications') || '[]');
      }
      
      if (exportOptions.includeMeals) {
        exportData.meals = JSON.parse(localStorage.getItem('healthmate_meals') || '[]');
      }
      
      if (exportOptions.includeProgress) {
        exportData.progress = JSON.parse(localStorage.getItem('healthmate_progress') || '[]');
      }
      
      if (exportOptions.includeSettings) {
        exportData.settings = JSON.parse(localStorage.getItem('healthmate_settings') || '{}');
      }

      let fileContent: string;
      let fileName: string;
      let mimeType: string;

      if (exportOptions.format === 'json') {
        fileContent = JSON.stringify(exportData, null, 2);
        fileName = `healthmate-export-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      } else if (exportOptions.format === 'csv') {
        // Convert to CSV format
        fileContent = convertToCSV(exportData);
        fileName = `healthmate-export-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      } else {
        // PDF format (simplified)
        fileContent = generatePDFContent(exportData);
        fileName = `healthmate-export-${new Date().toISOString().split('T')[0]}.txt`;
        mimeType = 'text/plain';
      }

      const dataBlob = new Blob([fileContent], { type: mimeType });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);

      alert(`Data exported successfully as ${exportOptions.format.toUpperCase()}!`);
    } catch (error) {
      alert('Export failed. Please try again.');
    } finally {
      setIsLoading(false);
      setShowExportModal(false);
    }
  };

  const convertToCSV = (data: any): string => {
    let csv = 'Type,Name,Value,Date\n';
    
    if (data.medications) {
      data.medications.forEach((med: any) => {
        csv += `Medication,"${med.name}","${med.dosage}","${med.startDate}"\n`;
      });
    }
    
    if (data.meals) {
      data.meals.forEach((meal: any) => {
        csv += `Meal,"${meal.name}","${meal.calories || 'N/A'}","${meal.time}"\n`;
      });
    }
    
    return csv;
  };

  const generatePDFContent = (data: any): string => {
    let content = `HealthMate.AI Data Export\n`;
    content += `Generated: ${new Date().toLocaleString()}\n`;
    content += `User: ${data.personalInfo?.name || 'Unknown'}\n\n`;
    
    if (data.medications) {
      content += `MEDICATIONS:\n`;
      data.medications.forEach((med: any) => {
        content += `- ${med.name} (${med.dosage}) - ${med.frequency}x daily\n`;
      });
      content += '\n';
    }
    
    if (data.meals) {
      content += `MEALS:\n`;
      data.meals.forEach((meal: any) => {
        content += `- ${meal.name} - ${meal.calories || 'N/A'} calories\n`;
      });
    }
    
    return content;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getStoragePercentage = (size: number): number => {
    return storageData.total > 0 ? (size / storageData.total) * 100 : 0;
  };

  return (
    <div className="space-y-8">
      {/* Storage Usage */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <HardDrive className="h-5 w-5 mr-2" />
          Storage Usage
        </h3>
        <div className="space-y-4">
          {[
            { label: 'Health Data', size: storageData.healthData, color: 'bg-emerald-500' },
            { label: 'Medication Records', size: storageData.medicationRecords, color: 'bg-blue-500' },
            { label: 'Images & Files', size: storageData.imagesFiles, color: 'bg-orange-500' },
            { label: 'App Cache', size: storageData.appCache, color: 'bg-gray-500' }
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{item.label}</span>
                  <span className="text-gray-600">{item.size.toFixed(1)} MB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${getStoragePercentage(item.size)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-900">Total Storage Used</span>
            <span className="text-lg font-bold text-gray-900">{storageData.total.toFixed(1)} MB</span>
          </div>
          <div className="text-sm text-gray-600">
            Last calculated: {new Date().toLocaleString()}
          </div>
        </div>

        <div className="mt-6 flex space-x-3">
          <Button 
            variant="outline" 
            icon={RefreshCw} 
            onClick={() => setShowClearConfirm('cache')}
            disabled={isLoading}
          >
            Clear Cache
          </Button>
          <Button 
            variant="outline" 
            icon={Trash2} 
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => setShowClearConfirm('all')}
            disabled={isLoading}
          >
            Clear All Data
          </Button>
          <Button 
            variant="outline" 
            icon={RefreshCw} 
            onClick={calculateStorageUsage}
            disabled={isLoading}
          >
            Recalculate
          </Button>
        </div>
      </Card>

      {/* Backup & Sync */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Cloud className="h-5 w-5 mr-2" />
          Backup & Sync
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Automatic Backup</h4>
              <p className="text-sm text-gray-600">
                Last backup: {lastBackup.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-600">Active</span>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input 
                  type="checkbox" 
                  checked={autoBackupEnabled}
                  onChange={(e) => setAutoBackupEnabled(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Cloud Sync</h4>
              <p className="text-sm text-gray-600">Sync across all your devices</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={cloudSyncEnabled}
                onChange={(e) => setCloudSyncEnabled(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-3">
          <Button 
            variant="outline" 
            icon={isLoading ? Loader2 : Download}
            onClick={backupNow}
            disabled={isLoading}
            className={isLoading ? 'animate-pulse' : ''}
          >
            {isLoading ? 'Backing up...' : 'Backup Now'}
          </Button>
          <Button 
            variant="outline" 
            icon={Upload}
            onClick={() => setShowRestoreModal(true)}
            disabled={isLoading}
          >
            Restore Data
          </Button>
          <Button 
            variant="outline" 
            icon={isLoading ? Loader2 : RefreshCw}
            onClick={forceSync}
            disabled={isLoading || !cloudSyncEnabled}
            className={isLoading ? 'animate-spin' : ''}
          >
            {isLoading ? 'Syncing...' : 'Force Sync'}
          </Button>
        </div>

        <div className="mt-4">
          <Button 
            variant="ghost" 
            icon={Archive}
            onClick={() => setShowBackupDetails(true)}
            className="text-sm"
          >
            View Backup History
          </Button>
        </div>
      </Card>

      {/* Data Export */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Download className="h-5 w-5 mr-2" />
          Data Export
        </h3>
        <div className="space-y-4">
          <p className="text-gray-600">
            Export your health data in various formats for backup or sharing with healthcare providers.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-16 flex-col space-y-2"
              onClick={() => {
                setExportOptions(prev => ({ ...prev, format: 'pdf' }));
                setShowExportModal(true);
              }}
              disabled={isLoading}
            >
              <Download className="h-5 w-5" />
              <span className="text-sm">Export as PDF</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col space-y-2"
              onClick={() => {
                setExportOptions(prev => ({ ...prev, format: 'json' }));
                setShowExportModal(true);
              }}
              disabled={isLoading}
            >
              <Download className="h-5 w-5" />
              <span className="text-sm">Export as JSON</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="text-center">
              <div className="bg-red-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {showClearConfirm === 'cache' ? 'Clear Cache' : 'Clear All Data'}
              </h3>
              <p className="text-gray-600 mb-6">
                {showClearConfirm === 'cache' 
                  ? 'This will clear temporary files and cached data. Your personal data will remain safe.'
                  : 'This will permanently delete ALL your data. This action cannot be undone. An emergency backup will be created.'
                }
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowClearConfirm(null)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={showClearConfirm === 'cache' ? clearCache : clearAllData}
                  disabled={isLoading}
                  icon={isLoading ? Loader2 : Trash2}
                >
                  {isLoading ? 'Processing...' : 'Confirm'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Export Data</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Export Format</label>
                <div className="grid grid-cols-3 gap-3">
                  {['json', 'csv', 'pdf'].map((format) => (
                    <button
                      key={format}
                      onClick={() => setExportOptions(prev => ({ ...prev, format: format as any }))}
                      className={`p-3 border-2 rounded-lg transition-colors ${
                        exportOptions.format === format
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-medium uppercase">{format}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Include Data</label>
                <div className="space-y-3">
                  {[
                    { key: 'includePersonalInfo', label: 'Personal Information' },
                    { key: 'includeMedications', label: 'Medications' },
                    { key: 'includeMeals', label: 'Meal Plans' },
                    { key: 'includeProgress', label: 'Progress Data' },
                    { key: 'includeSettings', label: 'App Settings' }
                  ].map((option) => (
                    <div key={option.key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={exportOptions[option.key as keyof DataExportOptions] as boolean}
                        onChange={(e) => setExportOptions(prev => ({
                          ...prev,
                          [option.key]: e.target.checked
                        }))}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700">{option.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Date Range</label>
                <select
                  value={exportOptions.dateRange}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, dateRange: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">All Time</option>
                  <option value="last30">Last 30 Days</option>
                  <option value="last90">Last 90 Days</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowExportModal(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={exportData}
                  disabled={isLoading}
                  icon={isLoading ? Loader2 : Download}
                >
                  {isLoading ? 'Exporting...' : 'Export Data'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Restore Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Restore Data</h3>
              <button
                onClick={() => setShowRestoreModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Select a backup file to restore
                </p>
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      restoreData(file);
                    }
                  }}
                  className="hidden"
                  id="restore-file"
                />
                <label
                  htmlFor="restore-file"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  Choose File
                </label>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 mr-2" />
                  <div className="text-sm text-yellow-700">
                    <strong>Warning:</strong> Restoring data will overwrite your current information. 
                    Make sure to backup your current data first.
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Backup History Modal */}
      {showBackupDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Backup History</h3>
              <button
                onClick={() => setShowBackupDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              {backupHistory.map((backup) => (
                <div key={backup.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        backup.status === 'completed' ? 'bg-green-500' :
                        backup.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="font-medium text-gray-900">
                        {backup.type === 'automatic' ? 'Automatic' : 'Manual'} Backup
                      </span>
                      <span className="text-sm text-gray-500">({backup.size})</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {backup.timestamp.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{backup.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DataStorageManager;