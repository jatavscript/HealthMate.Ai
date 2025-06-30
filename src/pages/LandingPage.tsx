import React, { useState } from 'react';
import { Heart, Shield, Zap, Users } from 'lucide-react';
import UnifiedLoginForm from '../components/Auth/UnifiedLoginForm';
import RegisterForm from '../components/Auth/RegisterForm';
import BoltBadge from '../components/UI/BoltBadge';
import { useApp } from '../contexts/AppContext';
import { useAdmin } from '../contexts/AdminContext';
import { useDoctor } from '../contexts/DoctorContext';

const LandingPage: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);
  const { login: patientLogin } = useApp();
  const { login: adminLogin } = useAdmin();
  const { login: doctorLogin } = useDoctor();

  const features = [
    {
      icon: Heart,
      title: 'Personalized Recovery Plans',
      description: 'AI-powered recovery plans tailored to your specific condition and health profile.'
    },
    {
      icon: Shield,
      title: 'Secure Health Data',
      description: 'Your health information is encrypted and protected with enterprise-grade security.'
    },
    {
      icon: Zap,
      title: 'Smart Reminders',
      description: 'Never miss a medication or health check-in with intelligent notifications.'
    },
    {
      icon: Users,
      title: 'Healthcare Integration',
      description: 'Share progress with your healthcare team for better coordinated care.'
    }
  ];

  const handleUnifiedLogin = async (email: string, password: string, userType: 'patient' | 'doctor' | 'admin'): Promise<boolean> => {
    try {
      switch (userType) {
        case 'patient':
          return await patientLogin(email, password);
        case 'doctor':
          return await doctorLogin(email, password);
        case 'admin':
          return await adminLogin(email, password);
        default:
          return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 relative">
      {/* Bolt Badge */}
      <div className="absolute top-4 right-4 z-50">
        <BoltBadge size="md" variant="black" />
      </div>

      <div className="flex min-h-screen">
        {/* Left side - Hero content */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-2xl">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">HealthMate.AI</h1>
                <p className="text-lg text-emerald-600 font-medium">Your AI-Powered Recovery Partner</p>
              </div>
            </div>

            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Recover Smarter,
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                {' '}Not Harder
              </span>
            </h2>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Transform your recovery journey with personalized AI-driven health plans, 
              smart medication reminders, and comprehensive progress tracking.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-white/50 rounded-xl border border-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-200">
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 rounded-lg flex-shrink-0">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>FDA Guidelines</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth forms */}
        <div className="flex-1 bg-white/80 backdrop-blur-sm border-l border-gray-200/50 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {showLogin ? (
              <UnifiedLoginForm 
                onLogin={handleUnifiedLogin}
                onToggleForm={() => setShowLogin(false)} 
              />
            ) : (
              <RegisterForm onToggleForm={() => setShowLogin(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;