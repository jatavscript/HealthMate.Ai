import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Pill, 
  UtensilsCrossed, 
  Activity, 
  Stethoscope, 
  CheckCircle, 
  ArrowRight, 
  Bell, 
  BellOff,
  Plus,
  MoreVertical,
  Edit3,
  Trash2,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../UI/Card';
import Button from '../UI/Button';

interface ScheduleItem {
  id: string;
  title: string;
  category: 'medication' | 'meal' | 'exercise' | 'appointment' | 'custom';
  time: string;
  completed: boolean;
  reminderEnabled: boolean;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

const TodaysScheduleWidget: React.FC = () => {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);

  // Initialize with sample data for today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const sampleItems: ScheduleItem[] = [
      {
        id: '1',
        title: 'Take morning medication',
        category: 'medication',
        time: '08:00',
        completed: true,
        reminderEnabled: true,
        priority: 'high',
        notes: 'Ibuprofen 400mg with food'
      },
      {
        id: '2',
        title: 'Breakfast - High protein meal',
        category: 'meal',
        time: '08:30',
        completed: true,
        reminderEnabled: true,
        priority: 'medium'
      },
      {
        id: '3',
        title: 'Physical therapy exercises',
        category: 'exercise',
        time: '10:00',
        completed: false,
        reminderEnabled: true,
        priority: 'high',
        notes: 'Gentle stretching and mobility work'
      },
      {
        id: '4',
        title: 'Lunch - Healing soup',
        category: 'meal',
        time: '12:30',
        completed: false,
        reminderEnabled: true,
        priority: 'medium'
      },
      {
        id: '5',
        title: 'Follow-up appointment',
        category: 'appointment',
        time: '14:00',
        completed: false,
        reminderEnabled: true,
        priority: 'high',
        notes: 'Check-up with Dr. Smith'
      },
      {
        id: '6',
        title: 'Evening medication',
        category: 'medication',
        time: '20:00',
        completed: false,
        reminderEnabled: true,
        priority: 'high'
      }
    ];
    setScheduleItems(sampleItems);
  }, []);

  // Filter items based on completion status
  const filteredItems = showCompleted 
    ? scheduleItems 
    : scheduleItems.filter(item => !item.completed);

  // Get next upcoming item
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const upcomingItems = scheduleItems.filter(item => !item.completed && item.time > currentTime);
  const nextItem = upcomingItems.length > 0 ? upcomingItems[0] : null;

  // Toggle completion
  const toggleCompletion = (id: string) => {
    setScheduleItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medication': return Pill;
      case 'meal': return UtensilsCrossed;
      case 'exercise': return Activity;
      case 'appointment': return Stethoscope;
      default: return Star;
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'medication': return 'text-blue-600 bg-blue-50';
      case 'meal': return 'text-orange-600 bg-orange-50';
      case 'exercise': return 'text-green-600 bg-green-50';
      case 'appointment': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Calculate completion stats
  const totalItems = scheduleItems.length;
  const completedItems = scheduleItems.filter(item => item.completed).length;
  const completionRate = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
            <p className="text-sm text-gray-600">
              {completedItems} of {totalItems} completed ({completionRate}%)
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              showCompleted 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {showCompleted ? 'Hide completed' : 'Show all'}
          </button>
        </div>
      </div>

      {/* Next Upcoming Item */}
      {nextItem && !showCompleted && (
        <div className="mb-4 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-900">Next up</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${getCategoryColor(nextItem.category)}`}>
                {React.createElement(getCategoryIcon(nextItem.category), { className: 'h-4 w-4' })}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{nextItem.title}</h4>
                <p className="text-sm text-gray-600">{nextItem.time}</p>
              </div>
            </div>
            <button
              onClick={() => toggleCompletion(nextItem.id)}
              className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              <CheckCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Schedule Items List */}
      <div className="space-y-3 mb-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              {showCompleted ? 'No tasks for today' : 'All tasks completed! 🎉'}
            </p>
          </div>
        ) : (
          filteredItems.slice(0, 6).map((item) => {
            const CategoryIcon = getCategoryIcon(item.category);
            
            return (
              <div
                key={item.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${
                  item.completed 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-white border-gray-200 hover:border-emerald-200'
                }`}
              >
                <button
                  onClick={() => toggleCompletion(item.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    item.completed 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  <CheckCircle className="h-4 w-4" />
                </button>

                <div className={`p-2 rounded-lg ${getCategoryColor(item.category)}`}>
                  <CategoryIcon className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium text-sm ${
                    item.completed ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}>
                    {item.title}
                  </h4>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{item.time}</span>
                    </span>
                    {item.reminderEnabled && (
                      <span className="flex items-center space-x-1 text-emerald-600">
                        <Bell className="h-3 w-3" />
                        <span>Reminder on</span>
                      </span>
                    )}
                    {item.priority === 'high' && (
                      <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                        High
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs text-gray-400 capitalize">
                  {item.category}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-gray-700">Daily Progress</span>
          <span className="text-emerald-600">{completionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Link to="/schedule" className="flex-1">
          <Button variant="outline" className="w-full" icon={ArrowRight}>
            View Full Schedule
          </Button>
        </Link>
        <Button variant="ghost" size="sm" icon={Plus} className="px-3">
          Add
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-emerald-600">{completedItems}</div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-600">{totalItems - completedItems}</div>
            <div className="text-xs text-gray-600">Remaining</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">{upcomingItems.length}</div>
            <div className="text-xs text-gray-600">Upcoming</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TodaysScheduleWidget;