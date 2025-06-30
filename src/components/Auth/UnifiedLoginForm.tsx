import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Heart, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../UI/Button';

interface UnifiedLoginFormProps {
  onLogin: (email: string, password: string, userType: 'patient' | 'doctor' | 'admin') => Promise<boolean>;
  onToggleForm: () => void;
}

const UnifiedLoginForm: React.FC<UnifiedLoginFormProps> = ({ onLogin, onToggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');

  const demoAccounts = [
    {
      type: 'patient',
      email: 'demo@healthmate.ai',
      password: 'demo123',
      name: 'Patient'
    },
    {
      type: 'doctor',
      email: 'doctor@healthmate.ai',
      password: 'doctor123',
      name: 'Doctor'
    },
    {
      type: 'admin',
      email: 'admin@healthmate.ai',
      password: 'admin123',
      name: 'Admin'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    setLoginSuccess('');
    
    try {
      // Check admin-created doctor accounts first
      const adminCreatedDoctors = JSON.parse(localStorage.getItem('healthmate_admin_doctors') || '[]');
      const adminCreatedDoctor = adminCreatedDoctors.find((doc: any) => 
        doc.email === email && doc.password === password
      );

      if (adminCreatedDoctor) {
        setLoginSuccess(`Welcome Dr. ${adminCreatedDoctor.name.replace('Dr. ', '')}! Signing you into Doctor Portal...`);
        
        setTimeout(async () => {
          const success = await onLogin(email, password, 'doctor');
          if (!success) {
            setLoginError('Login failed. Please try again.');
            setLoginSuccess('');
          }
        }, 1000);
        return;
      }

      // Check admin-created user accounts
      const adminCreatedUsers = JSON.parse(localStorage.getItem('healthmate_admin_users') || '[]');
      const adminCreatedUser = adminCreatedUsers.find((user: any) => 
        user.email === email && user.password === password
      );

      if (adminCreatedUser) {
        setLoginSuccess(`Welcome ${adminCreatedUser.name}! Signing you into Patient Portal...`);
        
        setTimeout(async () => {
          const success = await onLogin(email, password, 'patient');
          if (!success) {
            setLoginError('Login failed. Please try again.');
            setLoginSuccess('');
          }
        }, 1000);
        return;
      }

      // Check demo accounts
      const matchingAccount = demoAccounts.find(
        account => account.email === email && account.password === password
      );

      if (matchingAccount) {
        setLoginSuccess(`Welcome! Signing you into ${matchingAccount.name} Portal...`);
        
        // Small delay to show success message
        setTimeout(async () => {
          const success = await onLogin(email, password, matchingAccount.type as any);
          if (!success) {
            setLoginError('Login failed. Please try again.');
            setLoginSuccess('');
          }
        }, 1000);
      } else {
        setLoginError('Invalid email or password. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (account: typeof demoAccounts[0]) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-br from-emerald-500 to-blue-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Heart className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to HealthMate.AI</h2>
        <p className="text-gray-600">Sign in to access your personalized dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {loginError && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-700">{loginError}</span>
          </div>
        )}

        {/* Success Message */}
        {loginSuccess && (
          <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700">{loginSuccess}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <button
            type="button"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={onToggleForm}
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Sign up
          </button>
        </p>
      </div>

      {/* Demo Credentials Section - Exact Design Match */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Demo Credentials</h4>
        <div className="space-y-2 text-sm">
          {demoAccounts.map((account) => (
            <div key={account.type} className="flex items-center justify-between">
              <span className="font-medium text-gray-700">{account.name}:</span>
              <button
                onClick={() => handleDemoLogin(account)}
                className="text-blue-600 hover:text-blue-800 font-mono text-xs"
              >
                {account.email} / {account.password}
              </button>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Click any demo account above to auto-fill credentials.
        </p>
      </div>
    </div>
  );
};

export default UnifiedLoginForm;