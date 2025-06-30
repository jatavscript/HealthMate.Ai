import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Activity, 
  UtensilsCrossed, 
  Brain, 
  Shield, 
  AlertTriangle, 
  Search, 
  Filter, 
  BookOpen, 
  Clock, 
  Star, 
  Bookmark, 
  MessageCircle, 
  Bell, 
  StickyNote, 
  ThumbsUp, 
  ThumbsDown, 
  TrendingUp, 
  Award, 
  CheckCircle, 
  Eye, 
  Download, 
  Share2, 
  Plus, 
  X, 
  ChevronRight, 
  Info, 
  Lightbulb, 
  Target, 
  Zap, 
  Users, 
  FileText, 
  Calendar, 
  ArrowRight,
  HelpCircle,
  Phone,
  Mail,
  MessageSquare,
  Send,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useApp } from '../contexts/AppContext';
import { Guideline, GuidelineCategory, GuidelineInteraction, PersonalizedRecommendation, GuidelineProgress, UserProfile } from '../types/guidelines';

const HealthGuidelinesPage: React.FC = () => {
  const { user } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'priority' | 'date' | 'alphabetical'>('relevance');
  const [showClarificationModal, setShowClarificationModal] = useState(false);
  const [selectedGuideline, setSelectedGuideline] = useState<Guideline | null>(null);
  const [clarificationMessage, setClarificationMessage] = useState('');
  const [clarificationMethod, setClarificationMethod] = useState<'message' | 'call' | 'email'>('message');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sample user profile for personalization
  const userProfile: UserProfile = {
    surgeryType: 'appendectomy',
    condition: 'post-surgical recovery',
    medications: ['Ibuprofen', 'Omeprazole'],
    recoveryStage: 'early',
    painLevel: 3,
    mobilityLevel: 'moderate',
    dietaryRestrictions: ['low-sodium'],
    allergies: ['penicillin'],
    age: 45,
    comorbidities: ['hypertension']
  };

  // Sample guidelines data
  const [guidelines] = useState<Guideline[]>([
    {
      id: '1',
      title: 'Stay Hydrated for Optimal Healing',
      content: 'Proper hydration is crucial for recovery. Aim for 8-10 glasses of water daily unless restricted by your doctor. Water helps transport nutrients, remove waste products, and maintain blood pressure. Signs of good hydration include pale yellow urine and moist lips.',
      category: 'general',
      priority: 'high',
      conditionSpecific: ['post-surgical', 'general-recovery'],
      tags: ['hydration', 'healing', 'daily-care'],
      icon: '💧',
      estimatedReadTime: 2,
      lastUpdated: '2024-01-15',
      source: 'Mayo Clinic',
      evidenceLevel: 'peer-reviewed',
      isPersonalized: true,
      relevanceScore: 95
    },
    {
      id: '2',
      title: 'Gentle Movement Promotes Recovery',
      content: 'Light movement and walking, as approved by your healthcare team, can prevent blood clots, improve circulation, and speed healing. Start with short 5-10 minute walks and gradually increase as tolerated. Listen to your body and rest when needed.',
      category: 'mobility',
      priority: 'high',
      conditionSpecific: ['post-surgical', 'orthopedic'],
      tags: ['movement', 'walking', 'circulation', 'blood-clots'],
      icon: '🚶',
      estimatedReadTime: 3,
      lastUpdated: '2024-01-12',
      source: 'American Physical Therapy Association',
      evidenceLevel: 'clinical-study',
      isPersonalized: true,
      relevanceScore: 88
    },
    {
      id: '3',
      title: 'Protein-Rich Foods Support Healing',
      content: 'Your body needs extra protein during recovery to repair tissues and fight infection. Include lean meats, fish, eggs, beans, and dairy in your meals. Aim for 1.2-1.6 grams of protein per kilogram of body weight daily, unless otherwise directed.',
      category: 'nutrition',
      priority: 'medium',
      conditionSpecific: ['post-surgical', 'wound-healing'],
      tags: ['protein', 'nutrition', 'healing', 'tissue-repair'],
      icon: '🥩',
      estimatedReadTime: 3,
      lastUpdated: '2024-01-10',
      source: 'Academy of Nutrition and Dietetics',
      evidenceLevel: 'peer-reviewed',
      isPersonalized: true,
      relevanceScore: 82
    },
    {
      id: '4',
      title: 'Manage Stress for Better Recovery',
      content: 'Chronic stress can slow healing and weaken your immune system. Practice relaxation techniques like deep breathing, meditation, or gentle yoga. Maintain social connections and don\'t hesitate to ask for help when needed.',
      category: 'mental-wellness',
      priority: 'medium',
      conditionSpecific: ['general-recovery'],
      tags: ['stress', 'mental-health', 'relaxation', 'meditation'],
      icon: '🧘',
      estimatedReadTime: 4,
      lastUpdated: '2024-01-08',
      source: 'American Psychological Association',
      evidenceLevel: 'clinical-study',
      isPersonalized: false,
      relevanceScore: 75
    },
    {
      id: '5',
      title: 'Keep Surgical Sites Clean and Dry',
      content: 'Proper wound care prevents infection and promotes healing. Follow your surgeon\'s specific instructions for cleaning and dressing changes. Watch for signs of infection: increased redness, warmth, swelling, or unusual discharge.',
      category: 'hygiene',
      priority: 'critical',
      conditionSpecific: ['post-surgical'],
      tags: ['wound-care', 'infection-prevention', 'hygiene'],
      icon: '🧼',
      estimatedReadTime: 3,
      lastUpdated: '2024-01-14',
      source: 'Centers for Disease Control',
      evidenceLevel: 'fda-approved',
      isPersonalized: true,
      relevanceScore: 98
    },
    {
      id: '6',
      title: 'When to Call Your Doctor Immediately',
      content: 'Seek immediate medical attention for: fever over 101°F (38.3°C), severe or worsening pain, signs of infection, difficulty breathing, chest pain, or any concerning symptoms. Trust your instincts - you know your body best.',
      category: 'red-flags',
      priority: 'critical',
      conditionSpecific: ['post-surgical', 'general-recovery'],
      tags: ['emergency', 'warning-signs', 'fever', 'infection'],
      icon: '🚨',
      estimatedReadTime: 2,
      lastUpdated: '2024-01-16',
      source: 'Emergency Medicine Guidelines',
      evidenceLevel: 'expert-opinion',
      isPersonalized: true,
      relevanceScore: 100
    },
    {
      id: '7',
      title: 'Limit Sodium to Reduce Swelling',
      content: 'High sodium intake can increase swelling and blood pressure. Limit processed foods, canned soups, and restaurant meals. Use herbs and spices instead of salt for flavoring. Aim for less than 2,300mg of sodium daily.',
      category: 'nutrition',
      priority: 'medium',
      conditionSpecific: ['post-surgical', 'cardiac'],
      medicationRelated: ['blood-pressure-medications'],
      tags: ['sodium', 'swelling', 'blood-pressure', 'diet'],
      icon: '🧂',
      estimatedReadTime: 3,
      lastUpdated: '2024-01-11',
      source: 'American Heart Association',
      evidenceLevel: 'peer-reviewed',
      isPersonalized: true,
      relevanceScore: 85
    },
    {
      id: '8',
      title: 'Get Quality Sleep for Healing',
      content: 'Your body does most of its healing during sleep. Aim for 7-9 hours of quality sleep nightly. Create a comfortable sleep environment, maintain a regular schedule, and avoid screens before bedtime.',
      category: 'general',
      priority: 'high',
      tags: ['sleep', 'healing', 'recovery', 'rest'],
      icon: '😴',
      estimatedReadTime: 3,
      lastUpdated: '2024-01-09',
      source: 'Sleep Foundation',
      evidenceLevel: 'clinical-study',
      isPersonalized: false,
      relevanceScore: 78
    }
  ]);

  const [interactions, setInteractions] = useState<GuidelineInteraction[]>([]);

  // Categories configuration
  const categories: GuidelineCategory[] = [
    {
      id: 'all',
      name: 'All Guidelines',
      description: 'View all available health guidelines',
      icon: '📋',
      color: 'gray',
      guidelines: guidelines
    },
    {
      id: 'general',
      name: 'General Recovery',
      description: 'Essential recovery fundamentals',
      icon: '🏥',
      color: 'emerald',
      guidelines: guidelines.filter(g => g.category === 'general')
    },
    {
      id: 'mobility',
      name: 'Mobility & Physical Activity',
      description: 'Safe movement and exercise guidance',
      icon: '🏃',
      color: 'blue',
      guidelines: guidelines.filter(g => g.category === 'mobility')
    },
    {
      id: 'nutrition',
      name: 'Diet & Nutrition',
      description: 'Healing-focused nutritional guidance',
      icon: '🥗',
      color: 'orange',
      guidelines: guidelines.filter(g => g.category === 'nutrition')
    },
    {
      id: 'mental-wellness',
      name: 'Mental Wellness',
      description: 'Stress management and emotional health',
      icon: '🧠',
      color: 'purple',
      guidelines: guidelines.filter(g => g.category === 'mental-wellness')
    },
    {
      id: 'hygiene',
      name: 'Hygiene & Wound Care',
      description: 'Infection prevention and wound management',
      icon: '🧼',
      color: 'teal',
      guidelines: guidelines.filter(g => g.category === 'hygiene')
    },
    {
      id: 'red-flags',
      name: 'Red Flags / When to Seek Help',
      description: 'Critical warning signs and emergency guidance',
      icon: '🚨',
      color: 'red',
      guidelines: guidelines.filter(g => g.category === 'red-flags')
    }
  ];

  // Personalized recommendations
  const personalizedRecommendations: PersonalizedRecommendation[] = [
    {
      guideline: guidelines[4], // Wound care
      reason: 'Based on your recent appendectomy',
      urgency: 'high',
      basedOn: ['surgery-type', 'recovery-stage']
    },
    {
      guideline: guidelines[0], // Hydration
      reason: 'Important for post-surgical healing',
      urgency: 'medium',
      basedOn: ['recovery-stage', 'condition']
    },
    {
      guideline: guidelines[5], // Red flags
      reason: 'Critical safety information for your recovery stage',
      urgency: 'high',
      basedOn: ['recovery-stage', 'surgery-type']
    }
  ];

  // Calculate progress
  const calculateProgress = (): GuidelineProgress => {
    const readInteractions = interactions.filter(i => i.action === 'read');
    const bookmarkedInteractions = interactions.filter(i => i.action === 'bookmarked');
    const helpfulInteractions = interactions.filter(i => i.action === 'helpful');
    const notesInteractions = interactions.filter(i => i.action === 'note-added');
    const remindersInteractions = interactions.filter(i => i.action === 'reminder-set');
    const questionsInteractions = interactions.filter(i => i.action === 'question-asked');

    return {
      totalGuidelines: guidelines.length,
      readGuidelines: readInteractions.length,
      bookmarkedGuidelines: bookmarkedInteractions.length,
      helpfulVotes: helpfulInteractions.length,
      notesAdded: notesInteractions.length,
      remindersSet: remindersInteractions.length,
      questionsAsked: questionsInteractions.length,
      completionPercentage: Math.round((readInteractions.length / guidelines.length) * 100)
    };
  };

  const progress = calculateProgress();

  // Filter and sort guidelines
  const filteredGuidelines = guidelines.filter(guideline => {
    const matchesCategory = activeCategory === 'all' || guideline.category === activeCategory;
    const matchesSearch = guideline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guideline.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guideline.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPriority = filterPriority === 'all' || guideline.priority === filterPriority;
    
    return matchesCategory && matchesSearch && matchesPriority;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'relevance':
        return (b.relevanceScore || 0) - (a.relevanceScore || 0);
      case 'priority':
        const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'date':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  // Handle interactions
  const handleInteraction = (guidelineId: string, action: GuidelineInteraction['action'], data?: any) => {
    const newInteraction: GuidelineInteraction = {
      id: Date.now().toString(),
      guidelineId,
      userId: user?.id || 'demo-user',
      action,
      timestamp: new Date().toISOString(),
      ...data
    };
    
    setInteractions(prev => [...prev, newInteraction]);
  };

  // Handle Get Clarification button click
  const handleGetClarification = (guideline?: Guideline) => {
    if (guideline) {
      setSelectedGuideline(guideline);
      setClarificationMessage(`I have a question about the guideline: "${guideline.title}". `);
    } else {
      setSelectedGuideline(null);
      setClarificationMessage('I need clarification about the health guidelines. ');
    }
    setShowClarificationModal(true);
  };

  // Send clarification request
  const sendClarificationRequest = async () => {
    if (!clarificationMessage.trim()) {
      alert('Please enter your question or concern.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Handle different clarification methods
      switch (clarificationMethod) {
        case 'message':
          // Simulate sending message to care team
          await new Promise(resolve => setTimeout(resolve, 1500));
          alert('✅ Your message has been sent to your care team successfully!\n\nExpected response time: Within 24 hours\nReference ID: MSG-' + Date.now().toString().slice(-6));
          break;
          
        case 'call':
          // Initiate phone call
          const phoneNumber = '+1-800-HEALTH';
          const confirmCall = confirm(`📞 Call HealthMate.AI Support?\n\nPhone: ${phoneNumber}\n\nThis will open your phone app to dial our support line.`);
          if (confirmCall) {
            window.location.href = `tel:${phoneNumber}`;
            alert('📞 Calling HealthMate.AI Support...\n\nSupport Hours:\n• Monday-Friday: 8AM-8PM EST\n• Saturday-Sunday: 10AM-6PM EST\n• Emergency: 24/7 available');
          }
          break;
          
        case 'email':
          // Open email client with pre-filled content
          const subject = selectedGuideline 
            ? `HealthMate.AI - Question about: ${selectedGuideline.title}`
            : 'HealthMate.AI - Health Guidelines Question';
          
          const emailBody = `Hello HealthMate.AI Support Team,

${clarificationMessage}

${selectedGuideline ? `
Related Guideline:
- Title: ${selectedGuideline.title}
- Category: ${selectedGuideline.category}
- Priority: ${selectedGuideline.priority}
- Source: ${selectedGuideline.source}
` : ''}

Patient Information:
- Name: ${user?.name || 'Demo User'}
- Email: ${user?.email || 'demo@healthmate.ai'}
- Recovery Stage: ${userProfile.recoveryStage}
- Condition: ${userProfile.condition}

Thank you for your assistance.

Best regards,
${user?.name || 'Demo User'}

---
This email was generated from HealthMate.AI Health Guidelines
Timestamp: ${new Date().toLocaleString()}`;

          const mailtoLink = `mailto:support@healthmate.ai?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
          
          // Try to open email client
          const emailWindow = window.open(mailtoLink, '_blank');
          
          // Fallback if email client doesn't open
          setTimeout(() => {
            if (!emailWindow || emailWindow.closed) {
              // Copy email details to clipboard as fallback
              navigator.clipboard.writeText(`To: support@healthmate.ai\nSubject: ${subject}\n\n${emailBody}`).then(() => {
                alert('📧 Email details copied to clipboard!\n\nPlease paste into your email client and send to:\nsupport@healthmate.ai\n\nExpected response time: Within 48 hours');
              }).catch(() => {
                alert('📧 Please send an email to:\nsupport@healthmate.ai\n\nSubject: ' + subject + '\n\nExpected response time: Within 48 hours');
              });
            } else {
              alert('📧 Email client opened successfully!\n\nExpected response time: Within 48 hours\nSupport Email: support@healthmate.ai');
            }
          }, 1000);
          break;
      }

      // Track the interaction
      if (selectedGuideline) {
        handleInteraction(selectedGuideline.id, 'question-asked', { 
          question: clarificationMessage,
          method: clarificationMethod 
        });
      }

      // Close modal and reset after successful submission
      setTimeout(() => {
        setShowClarificationModal(false);
        setClarificationMessage('');
        setSelectedGuideline(null);
        setClarificationMethod('message');
      }, clarificationMethod === 'call' ? 2000 : 500);

    } catch (error) {
      console.error('Error sending clarification request:', error);
      alert('❌ There was an error processing your request. Please try again or contact support directly at support@healthmate.ai');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getEvidenceBadge = (evidenceLevel: string) => {
    switch (evidenceLevel) {
      case 'fda-approved': return { text: 'FDA Approved', color: 'bg-green-100 text-green-800' };
      case 'peer-reviewed': return { text: 'Peer Reviewed', color: 'bg-blue-100 text-blue-800' };
      case 'clinical-study': return { text: 'Clinical Study', color: 'bg-purple-100 text-purple-800' };
      case 'expert-opinion': return { text: 'Expert Opinion', color: 'bg-orange-100 text-orange-800' };
      default: return { text: 'Verified', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const isGuidelineRead = (guidelineId: string) => {
    return interactions.some(i => i.guidelineId === guidelineId && i.action === 'read');
  };

  const isGuidelineBookmarked = (guidelineId: string) => {
    return interactions.some(i => i.guidelineId === guidelineId && i.action === 'bookmarked');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Health Guidelines</h1>
        <div className="max-w-2xl mx-auto">
          <p className="text-lg text-gray-600 mb-6">
            Your recovery matters. Here are evidence-based and expert-recommended health tips tailored just for you.
          </p>
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-xl p-6">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Heart className="h-6 w-6 text-emerald-600" />
              <span className="text-lg font-semibold text-emerald-900">Personalized for Your Recovery</span>
            </div>
            <p className="text-emerald-700 text-sm">
              Based on your appendectomy recovery, current medications, and progress stage
            </p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Your Progress</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-emerald-100">Guidelines Read</div>
                <div className="text-2xl font-bold">{progress.readGuidelines}/{progress.totalGuidelines}</div>
              </div>
              <div>
                <div className="text-emerald-100">Bookmarked</div>
                <div className="text-2xl font-bold">{progress.bookmarkedGuidelines}</div>
              </div>
              <div>
                <div className="text-emerald-100">Notes Added</div>
                <div className="text-2xl font-bold">{progress.notesAdded}</div>
              </div>
              <div>
                <div className="text-emerald-100">Completion</div>
                <div className="text-2xl font-bold">{progress.completionPercentage}%</div>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
              <Award className="h-8 w-8 mx-auto mb-2" />
              <div className="text-sm">Recovery Champion</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Smart Assistant Recommendations */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Smart Recommendations</h3>
              <p className="text-sm text-gray-600">Personalized for your current recovery stage</p>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {personalizedRecommendations.map((rec, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="text-2xl">{rec.guideline.icon}</div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  rec.urgency === 'high' ? 'bg-red-100 text-red-700' :
                  rec.urgency === 'medium' ? 'bg-orange-100 text-orange-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {rec.urgency} priority
                </span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">{rec.guideline.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{rec.reason}</p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {rec.basedOn.join(', ')}
                </div>
                <button
                  onClick={() => {
                    setActiveCategory(rec.guideline.category);
                    handleInteraction(rec.guideline.id, 'read');
                  }}
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  Read Now →
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Category Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
              activeCategory === category.id
                ? 'border-emerald-500 bg-emerald-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div className="text-2xl mb-2">{category.icon}</div>
            <div className="text-sm font-medium text-gray-900">{category.name}</div>
            <div className="text-xs text-gray-500 mt-1">
              {category.guidelines.length} guidelines
            </div>
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search guidelines, tags, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="priority">Sort by Priority</option>
              <option value="date">Sort by Date</option>
              <option value="alphabetical">Sort Alphabetically</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Guidelines List */}
      <div className="space-y-6">
        {filteredGuidelines.length === 0 ? (
          <Card className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No guidelines found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters.</p>
          </Card>
        ) : (
          filteredGuidelines.map((guideline) => {
            const evidenceBadge = getEvidenceBadge(guideline.evidenceLevel);
            const isRead = isGuidelineRead(guideline.id);
            const isBookmarked = isGuidelineBookmarked(guideline.id);

            return (
              <Card key={guideline.id} className={`hover:shadow-lg transition-all duration-200 ${
                isRead ? 'bg-gray-50' : 'bg-white'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{guideline.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{guideline.title}</h3>
                        {guideline.isPersonalized && (
                          <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                            Personalized
                          </span>
                        )}
                        {isRead && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <div className="flex items-center space-x-4 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(guideline.priority)}`}>
                          {guideline.priority} priority
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${evidenceBadge.color}`}>
                          {evidenceBadge.text}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {guideline.estimatedReadTime} min read
                        </div>
                        {guideline.relevanceScore && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Target className="h-3 w-3 mr-1" />
                            {guideline.relevanceScore}% relevant
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">{guideline.content}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {guideline.tags.map((tag) => (
                    <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Source: {guideline.source}</span>
                    <span>•</span>
                    <span>Updated: {new Date(guideline.lastUpdated).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleInteraction(guideline.id, 'helpful')}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>Helpful</span>
                    </button>
                    
                    <button
                      onClick={() => handleInteraction(guideline.id, 'not-helpful')}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      <span>Not Helpful</span>
                    </button>
                    
                    <button
                      onClick={() => handleInteraction(guideline.id, isBookmarked ? 'unbookmarked' : 'bookmarked')}
                      className={`flex items-center space-x-1 px-3 py-1 text-sm rounded transition-colors ${
                        isBookmarked 
                          ? 'text-yellow-600 bg-yellow-50' 
                          : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'
                      }`}
                    >
                      <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                      <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                    </button>
                    
                    <button
                      onClick={() => handleGetClarification(guideline)}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Ask about this</span>
                    </button>
                    
                    {!isRead && (
                      <button
                        onClick={() => handleInteraction(guideline.id, 'read')}
                        className="flex items-center space-x-1 px-3 py-1 text-sm bg-emerald-600 text-white hover:bg-emerald-700 rounded transition-colors"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Mark as Read</span>
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Support Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="text-center">
          <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <MessageCircle className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-blue-900 mb-2">Need clarity or want to talk to your care team?</h3>
          <p className="text-blue-700 mb-6">
            Our healthcare professionals are here to help you understand and implement these guidelines.
          </p>
          <Button 
            variant="primary" 
            onClick={() => handleGetClarification()}
            icon={MessageCircle}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Get Clarification
          </Button>
        </div>
      </Card>

      {/* Clarification Modal */}
      {showClarificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Get Clarification</h3>
              <button
                onClick={() => setShowClarificationModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {selectedGuideline && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">{selectedGuideline.icon}</span>
                  <h4 className="font-medium text-gray-900">About: {selectedGuideline.title}</h4>
                </div>
                <p className="text-sm text-gray-600">{selectedGuideline.content.substring(0, 150)}...</p>
                <div className="mt-2 text-xs text-gray-500">
                  Category: {selectedGuideline.category} • Priority: {selectedGuideline.priority}
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">How would you like to get help?</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setClarificationMethod('message')}
                    disabled={isSubmitting}
                    className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                      clarificationMethod === 'message'
                        ? 'border-emerald-500 bg-emerald-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <MessageSquare className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
                    <div className="text-sm font-medium text-gray-900">Message</div>
                    <div className="text-xs text-gray-500">24hr response</div>
                  </button>
                  <button
                    onClick={() => setClarificationMethod('call')}
                    disabled={isSubmitting}
                    className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                      clarificationMethod === 'call'
                        ? 'border-emerald-500 bg-emerald-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <Phone className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
                    <div className="text-sm font-medium text-gray-900">Call</div>
                    <div className="text-xs text-gray-500">Immediate</div>
                  </button>
                  <button
                    onClick={() => setClarificationMethod('email')}
                    disabled={isSubmitting}
                    className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                      clarificationMethod === 'email'
                        ? 'border-emerald-500 bg-emerald-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <Mail className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
                    <div className="text-sm font-medium text-gray-900">Email</div>
                    <div className="text-xs text-gray-500">48hr response</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your question or concern
                </label>
                <textarea
                  value={clarificationMessage}
                  onChange={(e) => setClarificationMessage(e.target.value)}
                  rows={4}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Please describe what you'd like clarification on..."
                />
                <div className="mt-1 text-xs text-gray-500">
                  {clarificationMessage.length}/500 characters
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-700">
                    <div className="font-medium mb-1">Support Hours & Contact Info:</div>
                    <div className="space-y-1">
                      <div>• Monday-Friday: 8AM-8PM EST</div>
                      <div>• Saturday-Sunday: 10AM-6PM EST</div>
                      <div>• Emergency: 24/7 at 1-800-HEALTH</div>
                      <div>• Email: support@healthmate.ai</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowClarificationModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={sendClarificationRequest}
                  disabled={isSubmitting || !clarificationMessage.trim()}
                  icon={isSubmitting ? undefined : 
                        clarificationMethod === 'message' ? Send : 
                        clarificationMethod === 'call' ? Phone : Mail}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <>
                      {clarificationMethod === 'message' ? 'Send Message' :
                       clarificationMethod === 'call' ? 'Call Now' : 'Send Email'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default HealthGuidelinesPage;