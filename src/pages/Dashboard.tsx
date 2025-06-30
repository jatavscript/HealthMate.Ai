import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Pill, 
  UtensilsCrossed, 
  Heart, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/Dashboard/StatsCard';
import ProgressChart from '../components/Dashboard/ProgressChart';
import TodaysScheduleWidget from '../components/Dashboard/TodaysScheduleWidget';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useApp } from '../contexts/AppContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [currentTip, setCurrentTip] = useState(0);

  // Get user's first name for greeting
  const getFirstName = () => {
    if (!user?.name) return 'there';
    return user.name.split(' ')[0];
  };

  // Get time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Recovery tips that rotate every hour
  const recoveryTips = [
    {
      title: "Sleep Recovery",
      tip: "Consistent sleep schedule aids recovery. Try to maintain 7-8 hours of quality sleep.",
      category: "sleep"
    },
    {
      title: "Hydration Boost",
      tip: "Stay hydrated! Aim for 8-10 glasses of water daily to support healing and reduce inflammation.",
      category: "hydration"
    },
    {
      title: "Gentle Movement",
      tip: "Light movement promotes blood circulation. Even 5-10 minutes of gentle walking can help.",
      category: "movement"
    },
    {
      title: "Nutrition Focus",
      tip: "Protein-rich foods support tissue repair. Include lean meats, fish, eggs, or beans in your meals.",
      category: "nutrition"
    },
    {
      title: "Stress Management",
      tip: "Practice deep breathing or meditation for 5 minutes to reduce stress and promote healing.",
      category: "mental-health"
    },
    {
      title: "Medication Timing",
      tip: "Take medications at consistent times daily for optimal effectiveness and better recovery outcomes.",
      category: "medication"
    },
    {
      title: "Rest & Recovery",
      tip: "Listen to your body. Rest when needed - recovery isn't a race, it's a journey.",
      category: "rest"
    },
    {
      title: "Wound Care",
      tip: "Keep surgical sites clean and dry. Watch for signs of infection: redness, warmth, or unusual discharge.",
      category: "wound-care"
    },
    {
      title: "Social Support",
      tip: "Stay connected with family and friends. Social support significantly improves recovery outcomes.",
      category: "social"
    },
    {
      title: "Positive Mindset",
      tip: "Celebrate small victories! Each day of recovery is progress worth acknowledging.",
      category: "mindset"
    },
    {
      title: "Temperature Control",
      tip: "Monitor your body temperature. Fever above 101°F (38.3°C) may indicate infection - contact your doctor.",
      category: "monitoring"
    },
    {
      title: "Gentle Exercise",
      tip: "Start with approved exercises only. Gradually increase intensity as your body allows and heals.",
      category: "exercise"
    }
  ];

  // Mock data - in a real app, this would come from the context/API
  const progressData = [
    { date: 'Mon', pain: 7, mood: 4, energy: 3 },
    { date: 'Tue', pain: 6, mood: 5, energy: 4 },
    { date: 'Wed', pain: 5, mood: 6, energy: 5 },
    { date: 'Thu', pain: 4, mood: 7, energy: 6 },
    { date: 'Fri', pain: 3, mood: 8, energy: 7 },
    { date: 'Sat', pain: 3, mood: 8, energy: 7 },
    { date: 'Sun', pain: 2, mood: 9, energy: 8 },
  ];

  const recentActivity = [
    { action: 'Completed morning medication', time: '2 hours ago', status: 'completed' },
    { action: 'Logged pain level (3/10)', time: '3 hours ago', status: 'completed' },
    { action: 'Finished breakfast', time: '4 hours ago', status: 'completed' },
    { action: 'Skipped evening walk', time: '1 day ago', status: 'missed' },
  ];

  // Rotate recovery tips every hour
  useEffect(() => {
    const updateTip = () => {
      const now = new Date();
      const hourOfDay = now.getHours();
      const tipIndex = hourOfDay % recoveryTips.length;
      setCurrentTip(tipIndex);
    };

    // Update tip immediately
    updateTip();

    // Set up interval to update every hour
    const interval = setInterval(updateTip, 60 * 60 * 1000); // 1 hour

    // For demo purposes, also update every 30 seconds to show the change
    const demoInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % recoveryTips.length);
    }, 30000); // 30 seconds

    return () => {
      clearInterval(interval);
      clearInterval(demoInterval);
    };
  }, [recoveryTips.length]);

  // Quick Action handlers
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'checkin':
        navigate('/checkin');
        break;
      case 'medication':
        navigate('/medications');
        break;
      case 'meal':
        navigate('/meals');
        break;
      case 'exercise':
        navigate('/exercises');
        break;
      default:
        console.log(`Quick action: ${action}`);
    }
  };

  // Get tip category color
  const getTipCategoryColor = (category: string) => {
    const colors = {
      sleep: 'from-purple-50 to-indigo-50 border-purple-200',
      hydration: 'from-blue-50 to-cyan-50 border-blue-200',
      movement: 'from-green-50 to-emerald-50 border-green-200',
      nutrition: 'from-orange-50 to-yellow-50 border-orange-200',
      'mental-health': 'from-pink-50 to-rose-50 border-pink-200',
      medication: 'from-blue-50 to-indigo-50 border-blue-200',
      rest: 'from-gray-50 to-slate-50 border-gray-200',
      'wound-care': 'from-red-50 to-pink-50 border-red-200',
      social: 'from-violet-50 to-purple-50 border-violet-200',
      mindset: 'from-emerald-50 to-teal-50 border-emerald-200',
      monitoring: 'from-yellow-50 to-amber-50 border-yellow-200',
      exercise: 'from-green-50 to-lime-50 border-green-200'
    };
    return colors[category as keyof typeof colors] || 'from-blue-50 to-indigo-50 border-blue-200';
  };

  const currentRecoveryTip = recoveryTips[currentTip];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {getTimeBasedGreeting()}, {getFirstName()}!
            </h1>
            <p className="text-emerald-100 text-lg">
              You're making great progress on your recovery journey
            </p>
            <div className="flex items-center mt-4 space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-300 rounded-full"></div>
                <span className="text-emerald-100">Day 14 of recovery</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-300 rounded-full"></div>
                <span className="text-emerald-100">85% medication adherence</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-1">85%</div>
                <div className="text-emerald-100 text-sm">Recovery Progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Pain Level"
          value="2/10"
          subtitle="Much improved!"
          icon={Heart}
          color="emerald"
          trend={{ value: 30, isPositive: true }}
        />
        <StatsCard
          title="Medications"
          value="4/4"
          subtitle="Taken today"
          icon={Pill}
          color="blue"
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Meals Completed"
          value="2/3"
          subtitle="On track"
          icon={UtensilsCrossed}
          color="orange"
        />
        <StatsCard
          title="Energy Level"
          value="8/10"
          subtitle="Feeling great"
          icon={Activity}
          color="purple"
          trend={{ value: 25, isPositive: true }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Progress Chart */}
        <div className="lg:col-span-2">
          <ProgressChart data={progressData} />
        </div>

        {/* Today's Schedule Widget */}
        <TodaysScheduleWidget />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`flex-shrink-0 w-2 h-2 rounded-full ${
                  activity.status === 'completed' ? 'bg-emerald-500' : 'bg-red-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <div className="flex-shrink-0">
                  {activity.status === 'completed' ? (
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-red-500"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              size="md" 
              icon={Heart} 
              className="h-16 flex-col space-y-2 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
              onClick={() => handleQuickAction('checkin')}
            >
              <span className="text-xs">Daily</span>
              <span className="font-medium">Check-in</span>
            </Button>
            <Button 
              variant="outline" 
              size="md" 
              icon={Pill} 
              className="h-16 flex-col space-y-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              onClick={() => handleQuickAction('medication')}
            >
              <span className="text-xs">Log</span>
              <span className="font-medium">Medication</span>
            </Button>
            <Button 
              variant="outline" 
              size="md" 
              icon={UtensilsCrossed} 
              className="h-16 flex-col space-y-2 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
              onClick={() => handleQuickAction('meal')}
            >
              <span className="text-xs">Track</span>
              <span className="font-medium">Meal</span>
            </Button>
            <Button 
              variant="outline" 
              size="md" 
              icon={Activity} 
              className="h-16 flex-col space-y-2 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
              onClick={() => handleQuickAction('exercise')}
            >
              <span className="text-xs">Start</span>
              <span className="font-medium">Exercise</span>
            </Button>
          </div>
          
          {/* Dynamic Recovery Tip */}
          <div className={`mt-6 p-4 bg-gradient-to-r ${getTipCategoryColor(currentRecoveryTip.category)} border rounded-lg transition-all duration-500`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-900">{currentRecoveryTip.title}</h4>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500 capitalize">{currentRecoveryTip.category}</span>
              </div>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">
              {currentRecoveryTip.tip}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              💡 Tip updates every hour • Currently showing tip {currentTip + 1} of {recoveryTips.length}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;