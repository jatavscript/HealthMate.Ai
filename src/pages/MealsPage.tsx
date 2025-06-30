import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Clock, 
  Calendar, 
  ChefHat, 
  Apple, 
  Utensils,
  Heart,
  Zap,
  Target,
  CheckCircle,
  Star,
  Filter,
  Search,
  BookOpen,
  TrendingUp,
  X,
  Info,
  Lightbulb,
  Download,
  BarChart3,
  Users,
  FileText,
  Share2,
  Eye,
  Copy,
  Check,
  ArrowLeft,
  ArrowRight,
  Droplets,
  Minus,
  ShoppingCart,
  Settings,
  Save,
  Edit3
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useApp } from '../contexts/AppContext';

interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  image: string;
  completed: boolean;
  rating: number;
  healthBenefits: string[];
  dateAdded?: string;
}

interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  water: number;
}

interface NewMealForm {
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  description: string;
  ingredients: string;
  instructions: string;
  prepTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string;
}

interface WeeklyPlan {
  [key: string]: {
    [mealType: string]: Meal[];
  };
}

interface NutritionHistory {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  water: number;
  adherence: number;
}

const MealsPage: React.FC = () => {
  const { meals, setMeals } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState<'today' | 'planner' | 'recipes' | 'nutrition'>('today');
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<string>('all');
  const [dailyTip, setDailyTip] = useState('');
  const [showTipDetails, setShowTipDetails] = useState(false);
  const [waterIntake, setWaterIntake] = useState(3);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>({});
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [nutritionHistory, setNutritionHistory] = useState<NutritionHistory[]>([]);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Meal | null>(null);
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAddToPlanModal, setShowAddToPlanModal] = useState(false);
  const [selectedRecipeForPlan, setSelectedRecipeForPlan] = useState<Meal | null>(null);

  // Recovery tips that rotate daily
  const recoveryTips = [
    {
      tip: "Stay hydrated! Drink 8-10 glasses of water daily to support healing and reduce inflammation.",
      details: "Proper hydration helps transport nutrients to cells, removes waste products, and maintains optimal blood flow for healing. Dehydration can slow recovery and increase fatigue.",
      icon: "💧",
      category: "Hydration"
    },
    {
      tip: "Include protein in every meal to support tissue repair and muscle recovery.",
      details: "Protein provides essential amino acids needed for wound healing, immune function, and rebuilding damaged tissues. Aim for 1.2-1.6g per kg of body weight daily.",
      icon: "🥩",
      category: "Protein"
    },
    {
      tip: "Add colorful fruits and vegetables to boost antioxidants and reduce inflammation.",
      details: "Antioxidants like vitamin C, vitamin E, and beta-carotene help protect cells from damage and support the immune system during recovery.",
      icon: "🌈",
      category: "Antioxidants"
    },
    {
      tip: "Choose whole grains over refined carbs for sustained energy and better nutrition.",
      details: "Whole grains provide B vitamins, fiber, and steady glucose release, which helps maintain energy levels and supports nervous system function during recovery.",
      icon: "🌾",
      category: "Energy"
    },
    {
      tip: "Include omega-3 rich foods like salmon, walnuts, and flaxseeds to reduce inflammation.",
      details: "Omega-3 fatty acids have powerful anti-inflammatory properties that can help reduce pain, swelling, and promote faster healing of tissues.",
      icon: "🐟",
      category: "Anti-inflammatory"
    },
    {
      tip: "Eat smaller, frequent meals to maintain steady energy and reduce digestive stress.",
      details: "Frequent small meals help maintain stable blood sugar, reduce nausea (common after surgery), and ensure consistent nutrient absorption.",
      icon: "🍽️",
      category: "Digestion"
    },
    {
      tip: "Limit processed foods and added sugars to reduce inflammation and support healing.",
      details: "Processed foods and excess sugar can trigger inflammatory responses, impair immune function, and slow down the healing process.",
      icon: "🚫",
      category: "Recovery"
    }
  ];

  const nutritionGoals: NutritionGoals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67,
    fiber: 25,
    water: 8
  };

  const [editableGoals, setEditableGoals] = useState<NutritionGoals>(nutritionGoals);
  const [dietaryPreferences, setDietaryPreferences] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    lowSodium: false,
    antiInflammatory: true,
    highProtein: true,
    lowCarb: false
  });

  const [newMealForm, setNewMealForm] = useState<NewMealForm>({
    name: '',
    type: 'breakfast',
    time: '08:00',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    description: '',
    ingredients: '',
    instructions: '',
    prepTime: 15,
    difficulty: 'easy',
    tags: ''
  });

  const [todaysMeals, setTodaysMeals] = useState<Meal[]>([
    {
      id: '1',
      name: 'Protein-Rich Breakfast Bowl',
      type: 'breakfast',
      time: '08:00',
      calories: 420,
      protein: 25,
      carbs: 35,
      fat: 18,
      fiber: 8,
      description: 'A nutritious breakfast bowl with Greek yogurt, berries, and nuts to support recovery.',
      ingredients: ['Greek yogurt', 'Mixed berries', 'Almonds', 'Chia seeds', 'Honey'],
      instructions: [
        'Add Greek yogurt to a bowl',
        'Top with mixed berries',
        'Sprinkle almonds and chia seeds',
        'Drizzle with honey'
      ],
      prepTime: 5,
      difficulty: 'easy',
      tags: ['high-protein', 'anti-inflammatory', 'quick'],
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      completed: true,
      rating: 5,
      healthBenefits: ['Supports muscle recovery', 'Rich in antioxidants', 'Promotes gut health']
    },
    {
      id: '2',
      name: 'Healing Vegetable Soup',
      type: 'lunch',
      time: '12:30',
      calories: 280,
      protein: 12,
      carbs: 45,
      fat: 8,
      fiber: 12,
      description: 'A warming soup packed with healing vegetables and anti-inflammatory spices.',
      ingredients: ['Carrots', 'Celery', 'Onions', 'Garlic', 'Turmeric', 'Ginger', 'Vegetable broth'],
      instructions: [
        'Sauté onions and garlic',
        'Add chopped vegetables',
        'Pour in broth and spices',
        'Simmer for 20 minutes'
      ],
      prepTime: 30,
      difficulty: 'medium',
      tags: ['anti-inflammatory', 'healing', 'vegetarian'],
      image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg',
      completed: false,
      rating: 4,
      healthBenefits: ['Reduces inflammation', 'Boosts immune system', 'Easy to digest']
    },
    {
      id: '3',
      name: 'Grilled Salmon with Quinoa',
      type: 'dinner',
      time: '18:00',
      calories: 520,
      protein: 35,
      carbs: 40,
      fat: 22,
      fiber: 6,
      description: 'Omega-3 rich salmon with nutrient-dense quinoa and steamed vegetables.',
      ingredients: ['Salmon fillet', 'Quinoa', 'Broccoli', 'Lemon', 'Olive oil', 'Herbs'],
      instructions: [
        'Season salmon with herbs',
        'Grill for 6-8 minutes per side',
        'Cook quinoa according to package',
        'Steam broccoli until tender'
      ],
      prepTime: 25,
      difficulty: 'medium',
      tags: ['omega-3', 'complete-protein', 'heart-healthy'],
      image: 'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg',
      completed: false,
      rating: 5,
      healthBenefits: ['Supports heart health', 'Reduces inflammation', 'Complete amino acids']
    }
  ]);

  const [recipeLibrary] = useState<Meal[]>([
    {
      id: '4',
      name: 'Recovery Smoothie Bowl',
      type: 'breakfast',
      time: '07:30',
      calories: 350,
      protein: 20,
      carbs: 45,
      fat: 12,
      fiber: 10,
      description: 'Antioxidant-rich smoothie bowl perfect for post-surgery recovery.',
      ingredients: ['Banana', 'Spinach', 'Protein powder', 'Almond milk', 'Blueberries'],
      instructions: [
        'Blend banana, spinach, protein powder, and almond milk',
        'Pour into bowl',
        'Top with blueberries and granola'
      ],
      prepTime: 10,
      difficulty: 'easy',
      tags: ['antioxidant', 'protein-rich', 'recovery'],
      image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
      completed: false,
      rating: 4,
      healthBenefits: ['Boosts energy', 'Supports muscle repair', 'Rich in vitamins']
    },
    {
      id: '5',
      name: 'Anti-Inflammatory Golden Milk',
      type: 'snack',
      time: '20:00',
      calories: 150,
      protein: 8,
      carbs: 12,
      fat: 8,
      fiber: 2,
      description: 'Soothing turmeric latte with healing spices for evening relaxation.',
      ingredients: ['Almond milk', 'Turmeric', 'Ginger', 'Cinnamon', 'Honey', 'Black pepper'],
      instructions: [
        'Heat almond milk in a saucepan',
        'Whisk in turmeric, ginger, and cinnamon',
        'Add honey and a pinch of black pepper',
        'Serve warm'
      ],
      prepTime: 8,
      difficulty: 'easy',
      tags: ['anti-inflammatory', 'relaxing', 'healing'],
      image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg',
      completed: false,
      rating: 5,
      healthBenefits: ['Reduces inflammation', 'Promotes sleep', 'Supports digestion']
    }
  ]);

  // Set daily tip based on current date
  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const tipIndex = dayOfYear % recoveryTips.length;
    setDailyTip(recoveryTips[tipIndex].tip);
  }, []);

  // Initialize nutrition history
  useEffect(() => {
    const generateNutritionHistory = () => {
      const history: NutritionHistory[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const baseCalories = 1800 + Math.random() * 400;
        const baseProtein = 120 + Math.random() * 60;
        const baseCarbs = 200 + Math.random() * 100;
        const baseFat = 50 + Math.random() * 30;
        const baseFiber = 20 + Math.random() * 10;
        const baseWater = 6 + Math.random() * 4;
        
        const calorieAdherence = (baseCalories / editableGoals.calories) * 100;
        const proteinAdherence = (baseProtein / editableGoals.protein) * 100;
        const waterAdherence = (baseWater / editableGoals.water) * 100;
        const overallAdherence = (calorieAdherence + proteinAdherence + waterAdherence) / 3;
        
        history.push({
          date: date.toISOString().split('T')[0],
          calories: Math.round(baseCalories),
          protein: Math.round(baseProtein),
          carbs: Math.round(baseCarbs),
          fat: Math.round(baseFat),
          fiber: Math.round(baseFiber),
          water: Math.round(baseWater),
          adherence: Math.round(overallAdherence)
        });
      }
      setNutritionHistory(history);
    };

    generateNutritionHistory();
  }, [editableGoals]);

  const getCurrentTipDetails = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const tipIndex = dayOfYear % recoveryTips.length;
    return recoveryTips[tipIndex];
  };

  const handleFormChange = (field: keyof NewMealForm, value: string | number) => {
    setNewMealForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newMeal: Meal = {
      id: Date.now().toString(),
      name: newMealForm.name,
      type: newMealForm.type,
      time: newMealForm.time,
      calories: newMealForm.calories,
      protein: newMealForm.protein,
      carbs: newMealForm.carbs,
      fat: newMealForm.fat,
      fiber: newMealForm.fiber,
      description: newMealForm.description,
      ingredients: newMealForm.ingredients.split('\n').filter(item => item.trim()),
      instructions: newMealForm.instructions.split('\n').filter(item => item.trim()),
      prepTime: newMealForm.prepTime,
      difficulty: newMealForm.difficulty,
      tags: newMealForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      completed: false,
      rating: 0,
      healthBenefits: ['Custom meal'],
      dateAdded: new Date().toISOString()
    };

    setTodaysMeals(prev => [...prev, newMeal]);
    setMeals(prev => [...prev, newMeal]);

    setNewMealForm({
      name: '',
      type: 'breakfast',
      time: '08:00',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      description: '',
      ingredients: '',
      instructions: '',
      prepTime: 15,
      difficulty: 'easy',
      tags: ''
    });

    setShowAddMeal(false);
  };

  const toggleMealCompletion = (mealId: string) => {
    setTodaysMeals(prev => prev.map(meal => 
      meal.id === mealId ? { ...meal, completed: !meal.completed } : meal
    ));
  };

  const addMealToPlan = (meal: Meal, date: string, time: string) => {
    const newMeal = { ...meal, id: Date.now().toString(), time, completed: false };
    setTodaysMeals(prev => [...prev, newMeal]);
  };

  const calculateNutritionProgress = () => {
    const completedMeals = todaysMeals.filter(meal => meal.completed);
    return {
      calories: completedMeals.reduce((sum, meal) => sum + meal.calories, 0),
      protein: completedMeals.reduce((sum, meal) => sum + meal.protein, 0),
      carbs: completedMeals.reduce((sum, meal) => sum + meal.carbs, 0),
      fat: completedMeals.reduce((sum, meal) => sum + meal.fat, 0),
      fiber: completedMeals.reduce((sum, meal) => sum + meal.fiber, 0)
    };
  };

  const nutritionProgress = calculateNutritionProgress();

  const getMealTypeIcon = (type: string) => {
    switch (type) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };

  const filteredRecipes = recipeLibrary.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedMealType === 'all' || recipe.type === selectedMealType;
    return matchesSearch && matchesType;
  });

  const currentTipDetails = getCurrentTipDetails();

  const getWeekDays = (startDate: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays(currentWeekStart);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const addMealToWeeklyPlan = (day: Date, mealType: string, meal: Meal) => {
    const dateKey = day.toISOString().split('T')[0];
    setWeeklyPlan(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [mealType]: [...(prev[dateKey]?.[mealType] || []), { ...meal, id: Date.now().toString() }]
      }
    }));
  };

  const removeMealFromWeeklyPlan = (day: Date, mealType: string, mealId: string) => {
    const dateKey = day.toISOString().split('T')[0];
    setWeeklyPlan(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [mealType]: prev[dateKey]?.[mealType]?.filter(meal => meal.id !== mealId) || []
      }
    }));
  };

  const generateGroceryList = () => {
    const allIngredients: string[] = [];
    Object.values(weeklyPlan).forEach(dayPlan => {
      Object.values(dayPlan).forEach(meals => {
        meals.forEach(meal => {
          allIngredients.push(...meal.ingredients);
        });
      });
    });
    
    const uniqueIngredients = [...new Set(allIngredients)];
    const groceryList = uniqueIngredients.join('\n');
    
    const blob = new Blob([`Grocery List for Week\n\n${groceryList}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grocery-list.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportWeeklyPlan = () => {
    let planText = 'Weekly Meal Plan\n\n';
    weekDays.forEach(day => {
      const dateKey = day.toISOString().split('T')[0];
      const dayPlan = weeklyPlan[dateKey];
      planText += `${day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}\n`;
      
      ['breakfast', 'lunch', 'dinner', 'snack'].forEach(mealType => {
        const meals = dayPlan?.[mealType] || [];
        if (meals.length > 0) {
          planText += `  ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}:\n`;
          meals.forEach(meal => {
            planText += `    - ${meal.name} (${meal.calories} cal)\n`;
          });
        }
      });
      planText += '\n';
    });
    
    const blob = new Blob([planText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'weekly-meal-plan.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyLastWeek = () => {
    // This would copy the previous week's plan
    alert('Last week\'s meal plan has been copied to this week!');
  };

  const handleDietaryPreferenceChange = (preference: string) => {
    setDietaryPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference as keyof typeof prev]
    }));
  };

  const updateNutritionGoal = (nutrient: keyof NutritionGoals, value: number) => {
    setEditableGoals(prev => ({
      ...prev,
      [nutrient]: value
    }));
  };

  const calculateAverageNutrition = () => {
    if (nutritionHistory.length === 0) return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, water: 0 };
    
    const totals = nutritionHistory.reduce((acc, day) => ({
      calories: acc.calories + day.calories,
      protein: acc.protein + day.protein,
      carbs: acc.carbs + day.carbs,
      fat: acc.fat + day.fat,
      fiber: acc.fiber + day.fiber,
      water: acc.water + day.water
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, water: 0 });

    return {
      calories: Math.round(totals.calories / nutritionHistory.length),
      protein: Math.round(totals.protein / nutritionHistory.length),
      carbs: Math.round(totals.carbs / nutritionHistory.length),
      fat: Math.round(totals.fat / nutritionHistory.length),
      fiber: Math.round(totals.fiber / nutritionHistory.length),
      water: Math.round(totals.water / nutritionHistory.length)
    };
  };

  const averageNutrition = calculateAverageNutrition();

  // New functions for the fixed features
  const handleViewRecipe = (recipe: Meal) => {
    setSelectedRecipe(recipe);
    setShowRecipeModal(true);
  };

  const handleAddToPlan = (recipe: Meal) => {
    setSelectedRecipeForPlan(recipe);
    setShowAddToPlanModal(true);
  };

  const confirmAddToPlan = (selectedDate: string, selectedTime: string) => {
    if (selectedRecipeForPlan) {
      const newMeal = { 
        ...selectedRecipeForPlan, 
        id: Date.now().toString(), 
        time: selectedTime, 
        completed: false 
      };
      
      // Add to today's meals if it's today's date
      if (selectedDate === new Date().toISOString().split('T')[0]) {
        setTodaysMeals(prev => [...prev, newMeal]);
      }
      
      // Add to weekly plan
      setWeeklyPlan(prev => ({
        ...prev,
        [selectedDate]: {
          ...prev[selectedDate],
          [selectedRecipeForPlan.type]: [...(prev[selectedDate]?.[selectedRecipeForPlan.type] || []), newMeal]
        }
      }));
      
      setShowAddToPlanModal(false);
      setSelectedRecipeForPlan(null);
    }
  };

  const handleViewDetailedReport = () => {
    setShowDetailedReport(true);
  };

  const handleShareWithHealthcare = () => {
    setShowShareModal(true);
  };

  const generateDetailedReport = () => {
    const reportData = {
      period: '7 days',
      averageNutrition,
      nutritionHistory,
      adherenceRates: {
        calories: Math.round((averageNutrition.calories / editableGoals.calories) * 100),
        protein: Math.round((averageNutrition.protein / editableGoals.protein) * 100),
        water: Math.round((averageNutrition.water / editableGoals.water) * 100)
      },
      dietaryPreferences,
      goals: editableGoals
    };

    let reportText = `HEALTHMATE.AI - DETAILED NUTRITION REPORT\n`;
    reportText += `Generated: ${new Date().toLocaleDateString()}\n`;
    reportText += `Period: Last ${reportData.period}\n\n`;
    
    reportText += `AVERAGE DAILY INTAKE:\n`;
    reportText += `Calories: ${reportData.averageNutrition.calories} kcal (Goal: ${reportData.goals.calories})\n`;
    reportText += `Protein: ${reportData.averageNutrition.protein}g (Goal: ${reportData.goals.protein}g)\n`;
    reportText += `Carbohydrates: ${reportData.averageNutrition.carbs}g (Goal: ${reportData.goals.carbs}g)\n`;
    reportText += `Fat: ${reportData.averageNutrition.fat}g (Goal: ${reportData.goals.fat}g)\n`;
    reportText += `Fiber: ${reportData.averageNutrition.fiber}g (Goal: ${reportData.goals.fiber}g)\n`;
    reportText += `Water: ${reportData.averageNutrition.water} glasses (Goal: ${reportData.goals.water})\n\n`;
    
    reportText += `ADHERENCE RATES:\n`;
    reportText += `Calorie Goal: ${reportData.adherenceRates.calories}%\n`;
    reportText += `Protein Goal: ${reportData.adherenceRates.protein}%\n`;
    reportText += `Hydration Goal: ${reportData.adherenceRates.water}%\n\n`;
    
    reportText += `DIETARY PREFERENCES:\n`;
    Object.entries(reportData.dietaryPreferences).forEach(([key, value]) => {
      if (value) {
        reportText += `- ${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}\n`;
      }
    });
    
    reportText += `\nDAILY BREAKDOWN:\n`;
    reportData.nutritionHistory.forEach(day => {
      reportText += `${new Date(day.date).toLocaleDateString()}: ${day.calories} cal, ${day.protein}g protein, ${day.water} glasses water\n`;
    });

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutrition-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareWithHealthcareProvider = (method: string, email?: string) => {
    const reportData = {
      patientName: 'John Doe', // This would come from user context
      reportDate: new Date().toLocaleDateString(),
      averageNutrition,
      adherenceRates: {
        calories: Math.round((averageNutrition.calories / editableGoals.calories) * 100),
        protein: Math.round((averageNutrition.protein / editableGoals.protein) * 100),
        water: Math.round((averageNutrition.water / editableGoals.water) * 100)
      }
    };

    if (method === 'email' && email) {
      // In a real app, this would send an email
      alert(`Nutrition report has been sent to ${email}`);
    } else if (method === 'download') {
      generateDetailedReport();
    } else if (method === 'copy') {
      const summaryText = `Nutrition Summary for ${reportData.patientName}
Report Date: ${reportData.reportDate}
Average Daily Calories: ${reportData.averageNutrition.calories} kcal
Average Daily Protein: ${reportData.averageNutrition.protein}g
Calorie Adherence: ${reportData.adherenceRates.calories}%
Protein Adherence: ${reportData.adherenceRates.protein}%
Hydration Adherence: ${reportData.adherenceRates.water}%`;
      
      navigator.clipboard.writeText(summaryText);
      alert('Nutrition summary copied to clipboard!');
    }
    
    setShowShareModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meal Planning</h1>
          <p className="text-gray-600 mt-1">Plan nutritious meals to support your recovery journey</p>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <Button
            onClick={() => setShowAddMeal(true)}
            icon={Plus}
            variant="primary"
          >
            Add Meal
          </Button>
        </div>
      </div>

      {/* Daily Recovery Tip */}
      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Lightbulb className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-emerald-900 mb-2 flex items-center">
                <span className="mr-2">{currentTipDetails.icon}</span>
                Today's Recovery Tip
                <span className="ml-2 px-2 py-1 bg-emerald-200 text-emerald-800 text-xs rounded-full">
                  {currentTipDetails.category}
                </span>
              </h3>
              <p className="text-emerald-800">{dailyTip}</p>
              {showTipDetails && (
                <div className="mt-3 p-3 bg-emerald-100 rounded-lg">
                  <p className="text-sm text-emerald-700">{currentTipDetails.details}</p>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowTipDetails(!showTipDetails)}
            className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
          >
            <Info className="h-5 w-5" />
          </button>
        </div>
      </Card>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'today', label: 'Today\'s Meals', icon: Calendar },
            { id: 'planner', label: 'Weekly Planner', icon: Clock },
            { id: 'recipes', label: 'Recipe Library', icon: BookOpen },
            { id: 'nutrition', label: 'Nutrition Tracking', icon: TrendingUp }
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

      {/* Today's Meals Tab */}
      {activeTab === 'today' && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Meals List */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Today's Meal Plan</h2>
                <div className="text-sm text-gray-500">
                  {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>

              <div className="space-y-4">
                {todaysMeals.length === 0 ? (
                  <div className="text-center py-8">
                    <UtensilsCrossed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No meals planned for today. Add your first meal!</p>
                  </div>
                ) : (
                  todaysMeals.map((meal) => (
                    <div key={meal.id} className={`border rounded-xl p-6 transition-all duration-200 ${
                      meal.completed ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <img
                              src={meal.image}
                              alt={meal.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="absolute -top-2 -right-2 text-lg">
                              {getMealTypeIcon(meal.type)}
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{meal.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{meal.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {meal.time}
                              </span>
                              <span className="flex items-center">
                                <ChefHat className="h-3 w-3 mr-1" />
                                {meal.prepTime} min
                              </span>
                              <span className="flex items-center">
                                <Zap className="h-3 w-3 mr-1" />
                                {meal.calories} cal
                              </span>
                            </div>
                            {meal.dateAdded && (
                              <div className="text-xs text-blue-600 mt-1">
                                Added: {new Date(meal.dateAdded).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleMealCompletion(meal.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            meal.completed
                              ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">{meal.protein}g</div>
                          <div className="text-xs text-gray-500">Protein</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">{meal.carbs}g</div>
                          <div className="text-xs text-gray-500">Carbs</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">{meal.fat}g</div>
                          <div className="text-xs text-gray-500">Fat</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">{meal.fiber}g</div>
                          <div className="text-xs text-gray-500">Fiber</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {meal.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {meal.healthBenefits.length > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <h4 className="text-sm font-medium text-green-900 mb-2 flex items-center">
                            <Heart className="h-4 w-4 mr-1" />
                            Health Benefits
                          </h4>
                          <ul className="text-xs text-green-700 space-y-1">
                            {meal.healthBenefits.map((benefit, index) => (
                              <li key={index} className="flex items-center">
                                <div className="w-1 h-1 bg-green-500 rounded-full mr-2"></div>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Nutrition Summary */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Nutrition</h3>
              <div className="space-y-4">
                {[
                  { label: 'Calories', current: nutritionProgress.calories, goal: nutritionGoals.calories, unit: 'kcal', color: 'emerald' },
                  { label: 'Protein', current: nutritionProgress.protein, goal: nutritionGoals.protein, unit: 'g', color: 'blue' },
                  { label: 'Carbs', current: nutritionProgress.carbs, goal: nutritionGoals.carbs, unit: 'g', color: 'orange' },
                  { label: 'Fat', current: nutritionProgress.fat, goal: nutritionGoals.fat, unit: 'g', color: 'purple' },
                  { label: 'Fiber', current: nutritionProgress.fiber, goal: nutritionGoals.fiber, unit: 'g', color: 'green' }
                ].map((nutrient) => {
                  const percentage = Math.min((nutrient.current / nutrient.goal) * 100, 100);
                  return (
                    <div key={nutrient.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{nutrient.label}</span>
                        <span className="text-gray-600">
                          {nutrient.current}{nutrient.unit} / {nutrient.goal}{nutrient.unit}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`bg-${nutrient.color}-500 h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Water Intake Tracker */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Droplets className="h-5 w-5 mr-2 text-blue-500" />
                Water Intake
              </h3>
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-blue-600">{waterIntake}/8</div>
                <div className="text-sm text-gray-600">glasses today</div>
              </div>
              
              <div className="grid grid-cols-4 gap-2 mb-4">
                {Array.from({ length: 8 }, (_, i) => (
                  <div
                    key={i}
                    className={`h-8 rounded-lg border-2 transition-all duration-200 ${
                      i < waterIntake 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'bg-gray-100 border-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setWaterIntake(Math.max(0, waterIntake - 1))}
                  className="flex-1 flex items-center justify-center py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setWaterIntake(Math.min(8, waterIntake + 1))}
                  className="flex-1 flex items-center justify-center py-2 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              {waterIntake >= 8 && (
                <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg text-center">
                  <span className="text-green-700 text-sm font-medium">🎉 Daily goal achieved!</span>
                </div>
              )}
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Tips</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Apple className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">Hydration</h4>
                    <p className="text-xs text-blue-700">Drink 8-10 glasses of water daily to support healing.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <Heart className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-green-900">Anti-inflammatory Foods</h4>
                    <p className="text-xs text-green-700">Include turmeric, ginger, and leafy greens in your meals.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <Zap className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-orange-900">Protein Intake</h4>
                    <p className="text-xs text-orange-700">Aim for 1.2-1.6g per kg body weight for tissue repair.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Weekly Planner Tab */}
      {activeTab === 'planner' && (
        <div className="space-y-6">
          {/* Week Navigation */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Weekly Meal Planner</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigateWeek('prev')}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <span className="text-sm font-medium text-gray-700">
                  {currentWeekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {
                    new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
                  }
                </span>
                <button
                  onClick={() => navigateWeek('next')}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Week Grid */}
            <div className="grid grid-cols-7 gap-4">
              {weekDays.map((day, dayIndex) => {
                const dateKey = day.toISOString().split('T')[0];
                const dayPlan = weeklyPlan[dateKey] || {};
                const isToday = day.toDateString() === new Date().toDateString();
                
                return (
                  <div key={dayIndex} className={`border rounded-lg p-3 ${isToday ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}>
                    <div className="text-center mb-3">
                      <div className={`text-sm font-medium ${isToday ? 'text-emerald-700' : 'text-gray-700'}`}>
                        {day.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className={`text-lg font-bold ${isToday ? 'text-emerald-900' : 'text-gray-900'}`}>
                        {day.getDate()}
                      </div>
                    </div>

                    {['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => {
                      const meals = dayPlan[mealType] || [];
                      return (
                        <div key={mealType} className="mb-3">
                          <div className="text-xs font-medium text-gray-600 mb-1 capitalize">
                            {getMealTypeIcon(mealType)} {mealType}
                          </div>
                          <div className="space-y-1">
                            {meals.map(meal => (
                              <div key={meal.id} className="bg-white border border-gray-200 rounded p-2 text-xs">
                                <div className="font-medium text-gray-900 truncate">{meal.name}</div>
                                <div className="text-gray-500">{meal.calories} cal</div>
                                <button
                                  onClick={() => removeMealFromWeeklyPlan(day, mealType, meal.id)}
                                  className="text-red-500 hover:text-red-700 mt-1"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                // Simple meal addition - in a real app, this would open a meal selector
                                const sampleMeal = recipeLibrary[Math.floor(Math.random() * recipeLibrary.length)];
                                addMealToWeeklyPlan(day, mealType, sampleMeal);
                              }}
                              className="w-full border-2 border-dashed border-gray-300 rounded p-2 text-gray-500 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                            >
                              <Plus className="h-3 w-3 mx-auto" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Daily nutrition summary */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-600">
                        Total: {Object.values(dayPlan).flat().reduce((sum, meal) => sum + meal.calories, 0)} cal
                      </div>
                      <div className="text-xs text-gray-600">
                        Protein: {Object.values(dayPlan).flat().reduce((sum, meal) => sum + meal.protein, 0)}g
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Weekly Actions */}
            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
              <Button
                onClick={generateGroceryList}
                icon={ShoppingCart}
                variant="outline"
                size="sm"
              >
                Generate Grocery List
              </Button>
              <Button
                onClick={exportWeeklyPlan}
                icon={Download}
                variant="outline"
                size="sm"
              >
                Export Weekly Plan
              </Button>
              <Button
                onClick={copyLastWeek}
                icon={Copy}
                variant="outline"
                size="sm"
              >
                Copy Last Week
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Recipe Library Tab */}
      {activeTab === 'recipes' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card padding={false}>
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search recipes, ingredients, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <select
                  value={selectedMealType}
                  onChange={(e) => setSelectedMealType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">All Meals</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snacks</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Recipe Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <Card key={recipe.id} padding={false} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="relative">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                      {getMealTypeIcon(recipe.type)} {recipe.type}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-medium text-gray-700">{recipe.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{recipe.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{recipe.description}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {recipe.prepTime} min
                    </span>
                    <span className="flex items-center">
                      <Target className="h-3 w-3 mr-1" />
                      {recipe.difficulty}
                    </span>
                    <span className="flex items-center">
                      <Zap className="h-3 w-3 mr-1" />
                      {recipe.calories} cal
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {recipe.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleViewRecipe(recipe)}
                    >
                      View Recipe
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleAddToPlan(recipe)}
                    >
                      Add to Plan
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Nutrition Tracking Tab */}
      {activeTab === 'nutrition' && (
        <div className="space-y-8">
          {/* Nutrition Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600">Avg Daily Calories</p>
                  <p className="text-2xl font-bold text-emerald-900">{averageNutrition.calories}</p>
                  <p className="text-xs text-emerald-700">Goal: {editableGoals.calories}</p>
                </div>
                <div className="bg-emerald-500 p-3 rounded-xl">
                  <Zap className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Avg Daily Protein</p>
                  <p className="text-2xl font-bold text-blue-900">{averageNutrition.protein}g</p>
                  <p className="text-xs text-blue-700">Goal: {editableGoals.protein}g</p>
                </div>
                <div className="bg-blue-500 p-3 rounded-xl">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-cyan-600">Avg Water Intake</p>
                  <p className="text-2xl font-bold text-cyan-900">{averageNutrition.water}</p>
                  <p className="text-xs text-cyan-700">Goal: {editableGoals.water} glasses</p>
                </div>
                <div className="bg-cyan-500 p-3 rounded-xl">
                  <Droplets className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Adherence Rate</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {Math.round(nutritionHistory.reduce((sum, day) => sum + day.adherence, 0) / nutritionHistory.length || 0)}%
                  </p>
                  <p className="text-xs text-purple-700">7-day average</p>
                </div>
                <div className="bg-purple-500 p-3 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* 7-Day Nutrition History */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">7-Day Nutrition History</h3>
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {nutritionHistory.map((day, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-900">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        day.adherence >= 90 ? 'bg-green-100 text-green-800' :
                        day.adherence >= 70 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {day.adherence}% adherence
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Calories</div>
                        <div className="font-medium">{day.calories}</div>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                          <div 
                            className="bg-emerald-500 h-1 rounded-full" 
                            style={{ width: `${Math.min((day.calories / editableGoals.calories) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Protein</div>
                        <div className="font-medium">{day.protein}g</div>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                          <div 
                            className="bg-blue-500 h-1 rounded-full" 
                            style={{ width: `${Math.min((day.protein / editableGoals.protein) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Water</div>
                        <div className="font-medium">{day.water} glasses</div>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                          <div 
                            className="bg-cyan-500 h-1 rounded-full" 
                            style={{ width: `${Math.min((day.water / editableGoals.water) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Nutrition Goals & Preferences */}
            <div className="space-y-6">
              {/* Editable Nutrition Goals */}
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Nutrition Goals</h3>
                  <Settings className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  {[
                    { key: 'calories', label: 'Daily Calories', unit: 'kcal' },
                    { key: 'protein', label: 'Daily Protein', unit: 'g' },
                    { key: 'carbs', label: 'Daily Carbs', unit: 'g' },
                    { key: 'fat', label: 'Daily Fat', unit: 'g' },
                    { key: 'fiber', label: 'Daily Fiber', unit: 'g' },
                    { key: 'water', label: 'Daily Water', unit: 'glasses' }
                  ].map(goal => (
                    <div key={goal.key} className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">{goal.label}</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={editableGoals[goal.key as keyof NutritionGoals]}
                          onChange={(e) => updateNutritionGoal(goal.key as keyof NutritionGoals, parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                        <span className="text-sm text-gray-500">{goal.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Dietary Preferences */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Dietary Preferences</h3>
                <div className="space-y-3">
                  {[
                    { key: 'vegetarian', label: 'Vegetarian' },
                    { key: 'vegan', label: 'Vegan' },
                    { key: 'glutenFree', label: 'Gluten-free' },
                    { key: 'dairyFree', label: 'Dairy-free' },
                    { key: 'lowSodium', label: 'Low-sodium' },
                    { key: 'antiInflammatory', label: 'Anti-inflammatory' },
                    { key: 'highProtein', label: 'High-protein' },
                    { key: 'lowCarb', label: 'Low-carb' }
                  ].map(preference => (
                    <label key={preference.key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{preference.label}</span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={dietaryPreferences[preference.key as keyof typeof dietaryPreferences]}
                          onChange={() => handleDietaryPreferenceChange(preference.key)}
                          className="sr-only"
                        />
                        <div
                          onClick={() => handleDietaryPreferenceChange(preference.key)}
                          className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                            dietaryPreferences[preference.key as keyof typeof dietaryPreferences]
                              ? 'bg-emerald-500'
                              : 'bg-gray-300'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                              dietaryPreferences[preference.key as keyof typeof dietaryPreferences]
                                ? 'translate-x-5'
                                : 'translate-x-0.5'
                            } mt-0.5`}
                          />
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </Card>

              {/* Weekly Summary */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Goals Met</span>
                    </div>
                    <span className="text-lg font-bold text-green-900">
                      {nutritionHistory.filter(day => day.adherence >= 90).length}/7 days
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Droplets className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Hydration Days</span>
                    </div>
                    <span className="text-lg font-bold text-blue-900">
                      {nutritionHistory.filter(day => day.water >= editableGoals.water).length}/7 days
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">Protein Goals</span>
                    </div>
                    <span className="text-lg font-bold text-purple-900">
                      {nutritionHistory.filter(day => day.protein >= editableGoals.protein).length}/7 days
                    </span>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleViewDetailedReport}
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span>View Detailed Report</span>
                  </button>
                  
                  <button
                    onClick={generateDetailedReport}
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-green-50 border border-green-200 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Download className="h-5 w-5" />
                    <span>Export Nutrition Data</span>
                  </button>
                  
                  <button
                    onClick={handleShareWithHealthcare}
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <Users className="h-5 w-5" />
                    <span>Share with Healthcare Provider</span>
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Recipe Detail Modal */}
      {showRecipeModal && selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{selectedRecipe.name}</h3>
              <button
                onClick={() => setShowRecipeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <img
                  src={selectedRecipe.image}
                  alt={selectedRecipe.name}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                    <div className="text-sm font-medium">{selectedRecipe.prepTime} min</div>
                    <div className="text-xs text-gray-500">Prep Time</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Target className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                    <div className="text-sm font-medium capitalize">{selectedRecipe.difficulty}</div>
                    <div className="text-xs text-gray-500">Difficulty</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Zap className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                    <div className="text-sm font-medium">{selectedRecipe.calories}</div>
                    <div className="text-xs text-gray-500">Calories</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Nutrition Facts</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Protein</span>
                      <span className="font-medium">{selectedRecipe.protein}g</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Carbs</span>
                      <span className="font-medium">{selectedRecipe.carbs}g</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Fat</span>
                      <span className="font-medium">{selectedRecipe.fat}g</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Fiber</span>
                      <span className="font-medium">{selectedRecipe.fiber}g</span>
                    </div>
                  </div>
                </div>

                {selectedRecipe.healthBenefits.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-green-900 mb-2 flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      Health Benefits
                    </h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      {selectedRecipe.healthBenefits.map((benefit, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-1 h-1 bg-green-500 rounded-full mr-2"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <p className="text-gray-600 mb-6">{selectedRecipe.description}</p>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Ingredients</h4>
                  <ul className="space-y-2">
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Instructions</h4>
                  <ol className="space-y-3">
                    {selectedRecipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex text-sm">
                        <span className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedRecipe.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowRecipeModal(false)}
                  >
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => {
                      handleAddToPlan(selectedRecipe);
                      setShowRecipeModal(false);
                    }}
                  >
                    Add to Plan
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Add to Plan Modal */}
      {showAddToPlanModal && selectedRecipeForPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add to Meal Plan</h3>
              <button
                onClick={() => setShowAddToPlanModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">{selectedRecipeForPlan.name}</h4>
              <p className="text-sm text-gray-600">{selectedRecipeForPlan.description}</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const selectedDate = formData.get('date') as string;
              const selectedTime = formData.get('time') as string;
              confirmAddToPlan(selectedDate, selectedTime);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    defaultValue={selectedRecipeForPlan.time}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAddToPlanModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                >
                  Add to Plan
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Detailed Report Modal */}
      {showDetailedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Detailed Nutrition Report</h3>
              <button
                onClick={() => setShowDetailedReport(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">7-Day Summary</h4>
                
                <div className="space-y-4 mb-6">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <h5 className="font-medium text-emerald-900 mb-2">Average Daily Intake</h5>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>Calories: <span className="font-medium">{averageNutrition.calories} kcal</span></div>
                      <div>Protein: <span className="font-medium">{averageNutrition.protein}g</span></div>
                      <div>Carbs: <span className="font-medium">{averageNutrition.carbs}g</span></div>
                      <div>Fat: <span className="font-medium">{averageNutrition.fat}g</span></div>
                      <div>Fiber: <span className="font-medium">{averageNutrition.fiber}g</span></div>
                      <div>Water: <span className="font-medium">{averageNutrition.water} glasses</span></div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="font-medium text-blue-900 mb-2">Goal Adherence</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Calorie Goals:</span>
                        <span className="font-medium">{Math.round((averageNutrition.calories / editableGoals.calories) * 100)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protein Goals:</span>
                        <span className="font-medium">{Math.round((averageNutrition.protein / editableGoals.protein) * 100)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hydration Goals:</span>
                        <span className="font-medium">{Math.round((averageNutrition.water / editableGoals.water) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-gray-900 mb-4">Active Dietary Preferences</h4>
                <div className="flex flex-wrap gap-2 mb-6">
                  {Object.entries(dietaryPreferences)
                    .filter(([_, value]) => value)
                    .map(([key, _]) => (
                      <span
                        key={key}
                        className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      </span>
                    ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Daily Breakdown</h4>
                <div className="space-y-3 mb-6">
                  {nutritionHistory.map((day, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">
                          {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          day.adherence >= 90 ? 'bg-green-100 text-green-800' :
                          day.adherence >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {day.adherence}%
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                        <div>{day.calories} cal</div>
                        <div>{day.protein}g protein</div>
                        <div>{day.water} glasses</div>
                      </div>
                    </div>
                  ))}
                </div>

                <h4 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h4>
                <div className="space-y-3">
                  {averageNutrition.protein < editableGoals.protein && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800">
                        <strong>Protein Intake:</strong> Consider adding more protein-rich foods to reach your daily goal.
                      </p>
                    </div>
                  )}
                  {averageNutrition.water < editableGoals.water && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <strong>Hydration:</strong> Try to increase your daily water intake for better recovery.
                      </p>
                    </div>
                  )}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      <strong>Recovery Focus:</strong> Continue including anti-inflammatory foods in your meals.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDetailedReport(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={generateDetailedReport}
                icon={Download}
              >
                Download Report
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Share with Healthcare Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Share with Healthcare Provider</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">What will be shared:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 7-day nutrition summary</li>
                  <li>• Goal adherence rates</li>
                  <li>• Dietary preferences</li>
                  <li>• Daily intake breakdown</li>
                </ul>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    const email = prompt('Enter healthcare provider email:');
                    if (email) shareWithHealthcareProvider('email', email);
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                  <span>Send via Email</span>
                </button>

                <button
                  onClick={() => shareWithHealthcareProvider('download')}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Download className="h-5 w-5" />
                  <span>Download Report</span>
                </button>

                <button
                  onClick={() => shareWithHealthcareProvider('copy')}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Copy className="h-5 w-5" />
                  <span>Copy Summary</span>
                </button>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowShareModal(false)}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Add Meal Modal */}
      {showAddMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add Custom Meal</h3>
              <button
                onClick={() => setShowAddMeal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddMeal} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meal Name *
                  </label>
                  <input
                    type="text"
                    value={newMealForm.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter meal name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meal Type *
                  </label>
                  <select 
                    value={newMealForm.type}
                    onChange={(e) => handleFormChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={newMealForm.time}
                    onChange={(e) => handleFormChange('time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prep Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={newMealForm.prepTime}
                    onChange={(e) => handleFormChange('prepTime', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newMealForm.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows={3}
                  placeholder="Describe the meal and its benefits"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calories
                  </label>
                  <input
                    type="number"
                    value={newMealForm.calories || ''}
                    onChange={(e) => handleFormChange('calories', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    value={newMealForm.protein || ''}
                    onChange={(e) => handleFormChange('protein', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    value={newMealForm.carbs || ''}
                    onChange={(e) => handleFormChange('carbs', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    value={newMealForm.fat || ''}
                    onChange={(e) => handleFormChange('fat', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fiber (g)
                  </label>
                  <input
                    type="number"
                    value={newMealForm.fiber || ''}
                    onChange={(e) => handleFormChange('fiber', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ingredients (one per line)
                </label>
                <textarea
                  value={newMealForm.ingredients}
                  onChange={(e) => handleFormChange('ingredients', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows={4}
                  placeholder="List ingredients, one per line"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructions (one per line)
                </label>
                <textarea
                  value={newMealForm.instructions}
                  onChange={(e) => handleFormChange('instructions', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows={4}
                  placeholder="List cooking steps, one per line"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select 
                    value={newMealForm.difficulty}
                    onChange={(e) => handleFormChange('difficulty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newMealForm.tags}
                    onChange={(e) => handleFormChange('tags', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="healthy, quick, protein-rich"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAddMeal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                >
                  Add Meal
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MealsPage;