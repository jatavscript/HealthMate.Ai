import React, { useState } from 'react';
import { 
  ExternalLink, 
  X, 
  BookOpen, 
  Play, 
  HelpCircle, 
  Users, 
  Shield, 
  FileText, 
  Download, 
  Search, 
  ChevronRight, 
  Star, 
  Clock, 
  User, 
  MessageCircle, 
  ThumbsUp, 
  Eye, 
  Calendar, 
  Tag, 
  Filter,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'video' | 'faq' | 'forum' | 'policy' | 'terms';
  content?: string;
  url?: string;
  duration?: string;
  lastUpdated: string;
  views?: number;
  rating?: number;
  tags?: string[];
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  views: number;
}

interface ForumPost {
  id: string;
  title: string;
  author: string;
  replies: number;
  views: number;
  lastActivity: string;
  category: string;
  solved: boolean;
}

const ResourcesManager: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFAQCategory, setSelectedFAQCategory] = useState('all');

  const resources: Resource[] = [
    {
      id: 'user-guide',
      title: 'User Guide',
      description: 'Complete guide to using HealthMate.AI effectively for your recovery journey',
      type: 'guide',
      content: `# HealthMate.AI User Guide

## Getting Started
Welcome to HealthMate.AI! This comprehensive guide will help you make the most of your recovery journey.

### Setting Up Your Profile
1. Complete your personal information
2. Add emergency contacts
3. Set up your healthcare providers
4. Configure notification preferences

### Managing Medications
- Add medications with dosage and timing
- Set up smart reminders
- Track adherence rates
- Monitor side effects

### Meal Planning
- Follow AI-generated meal plans
- Track nutritional goals
- Log meal completion
- Monitor dietary restrictions

### Progress Tracking
- Daily check-ins
- Pain level monitoring
- Mood tracking
- Recovery milestones

### Getting Help
- Contact support through multiple channels
- Access community forums
- Browse video tutorials
- Check frequently asked questions

For detailed instructions on each feature, explore the specific sections in your dashboard.`,
      lastUpdated: '2024-01-15',
      views: 1247,
      rating: 4.8,
      tags: ['getting-started', 'basics', 'setup']
    },
    {
      id: 'video-tutorials',
      title: 'Video Tutorials',
      description: 'Step-by-step video guides for all HealthMate.AI features',
      type: 'video',
      url: 'https://www.youtube.com/playlist?list=PLHealthMateAI',
      duration: '2-5 min each',
      lastUpdated: '2024-01-10',
      views: 892,
      rating: 4.9,
      tags: ['video', 'tutorial', 'visual-learning']
    },
    {
      id: 'faq',
      title: 'FAQ',
      description: 'Frequently asked questions and answers about HealthMate.AI',
      type: 'faq',
      lastUpdated: '2024-01-18',
      views: 2156,
      tags: ['questions', 'answers', 'help']
    },
    {
      id: 'community-forum',
      title: 'Community Forum',
      description: 'Connect with other users, share experiences, and get peer support',
      type: 'forum',
      url: 'https://community.healthmate.ai',
      lastUpdated: '2024-01-19',
      views: 3421,
      tags: ['community', 'support', 'discussion']
    },
    {
      id: 'privacy-policy',
      title: 'Privacy Policy',
      description: 'How we protect and handle your personal health information',
      type: 'policy',
      content: `# Privacy Policy

## Data Protection
Your privacy is our top priority. We implement industry-leading security measures to protect your health information.

## Information We Collect
- Personal health data you provide
- Usage analytics (anonymized)
- Device and browser information
- Communication preferences

## How We Use Your Data
- Provide personalized health recommendations
- Improve our services
- Send important notifications
- Ensure platform security

## Data Sharing
We never sell your personal data. Limited sharing occurs only:
- With your explicit consent
- For anonymized research (opt-in)
- When required by law
- With healthcare providers you authorize

## Your Rights
- Access your data
- Correct inaccuracies
- Delete your account
- Export your information
- Opt out of data sharing

## Security Measures
- End-to-end encryption
- HIPAA compliance
- Regular security audits
- Secure data centers
- Multi-factor authentication

Last updated: January 15, 2024`,
      lastUpdated: '2024-01-15',
      views: 567,
      tags: ['privacy', 'legal', 'data-protection']
    },
    {
      id: 'terms-of-service',
      title: 'Terms of Service',
      description: 'Legal terms and conditions for using HealthMate.AI',
      type: 'terms',
      content: `# Terms of Service

## Acceptance of Terms
By using HealthMate.AI, you agree to these terms and conditions.

## Medical Disclaimer
HealthMate.AI is a health management tool and does not replace professional medical advice. Always consult healthcare providers for medical decisions.

## User Responsibilities
- Provide accurate information
- Use the service responsibly
- Respect other users
- Protect your account credentials

## Service Availability
- We strive for 99.9% uptime
- Scheduled maintenance will be announced
- Emergency maintenance may occur without notice

## Intellectual Property
- HealthMate.AI content is proprietary
- Users retain rights to their personal data
- Respect third-party copyrights

## Limitation of Liability
HealthMate.AI is provided "as is" without warranties. We are not liable for medical decisions based on our recommendations.

## Account Termination
We may terminate accounts for:
- Terms of service violations
- Fraudulent activity
- Extended inactivity
- Legal requirements

## Changes to Terms
We may update these terms with notice to users.

Last updated: January 15, 2024`,
      lastUpdated: '2024-01-15',
      views: 234,
      tags: ['legal', 'terms', 'conditions']
    }
  ];

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'How do I set up medication reminders?',
      answer: 'Go to the Medications page, click "Add Medication", fill in the details including dosage and timing, then enable reminders. You can customize notification sounds and advance timing in Settings.',
      category: 'medications',
      helpful: 45,
      views: 234
    },
    {
      id: '2',
      question: 'Is my health data secure?',
      answer: 'Yes, we use end-to-end encryption, HIPAA-compliant storage, and never sell your personal data. All data is stored in secure, certified data centers with regular security audits.',
      category: 'privacy',
      helpful: 67,
      views: 189
    },
    {
      id: '3',
      question: 'Can I export my health data?',
      answer: 'Absolutely! Go to Settings > Data & Storage > Data Export. You can export in multiple formats (JSON, CSV, PDF) and choose which data to include.',
      category: 'data',
      helpful: 32,
      views: 156
    },
    {
      id: '4',
      question: 'How do I contact my healthcare provider through the app?',
      answer: 'Add your healthcare providers in Profile > Contacts. You can then share progress reports and communicate through the integrated messaging system.',
      category: 'healthcare',
      helpful: 28,
      views: 98
    },
    {
      id: '5',
      question: 'What should I do if I miss a medication dose?',
      answer: 'Take it as soon as you remember, unless it\'s close to your next dose. Never double dose. The app will track missed doses and provide adherence insights.',
      category: 'medications',
      helpful: 41,
      views: 167
    },
    {
      id: '6',
      question: 'How do I customize my meal plan?',
      answer: 'Go to Meals page, click on any meal to modify it. You can set dietary restrictions, allergies, and preferences in your profile to get personalized recommendations.',
      category: 'nutrition',
      helpful: 35,
      views: 143
    },
    {
      id: '7',
      question: 'Can I use the app offline?',
      answer: 'Basic features work offline, but syncing requires internet connection. Your data is cached locally and will sync when you\'re back online.',
      category: 'technical',
      helpful: 22,
      views: 87
    },
    {
      id: '8',
      question: 'How do I track my recovery progress?',
      answer: 'Use the daily check-in feature to log pain levels, mood, and symptoms. View your progress charts in the Dashboard and Progress sections.',
      category: 'tracking',
      helpful: 38,
      views: 201
    }
  ];

  const forumPosts: ForumPost[] = [
    {
      id: '1',
      title: 'Tips for staying motivated during recovery',
      author: 'RecoveryWarrior',
      replies: 23,
      views: 456,
      lastActivity: '2 hours ago',
      category: 'motivation',
      solved: false
    },
    {
      id: '2',
      title: 'How to manage pain during physical therapy?',
      author: 'HealthSeeker',
      replies: 15,
      views: 234,
      lastActivity: '5 hours ago',
      category: 'pain-management',
      solved: true
    },
    {
      id: '3',
      title: 'Best meal prep strategies for recovery',
      author: 'NutritionFocus',
      replies: 31,
      views: 567,
      lastActivity: '1 day ago',
      category: 'nutrition',
      solved: false
    },
    {
      id: '4',
      title: 'Medication reminder not working on iOS',
      author: 'TechUser123',
      replies: 8,
      views: 123,
      lastActivity: '3 days ago',
      category: 'technical',
      solved: true
    }
  ];

  const videoTutorials = [
    {
      id: '1',
      title: 'Getting Started with HealthMate.AI',
      duration: '3:45',
      description: 'Complete walkthrough of setting up your account and profile',
      thumbnail: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      views: 1234
    },
    {
      id: '2',
      title: 'Setting Up Medication Reminders',
      duration: '2:30',
      description: 'Step-by-step guide to creating and managing medication schedules',
      thumbnail: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      views: 892
    },
    {
      id: '3',
      title: 'Understanding Your Progress Charts',
      duration: '4:15',
      description: 'How to read and interpret your recovery progress data',
      thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      views: 567
    },
    {
      id: '4',
      title: 'Customizing Your Meal Plans',
      duration: '3:20',
      description: 'Personalizing nutrition recommendations for your recovery',
      thumbnail: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      views: 743
    }
  ];

  const handleResourceClick = (resource: Resource) => {
    if (resource.url) {
      window.open(resource.url, '_blank');
    } else {
      setActiveModal(resource.id);
    }
  };

  const filteredFAQs = faqItems.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedFAQCategory === 'all' || faq.category === selectedFAQCategory;
    return matchesSearch && matchesCategory;
  });

  const faqCategories = ['all', ...Array.from(new Set(faqItems.map(faq => faq.category)))];

  return (
    <div className="space-y-6">
      {/* Resources Grid */}
      <div className="space-y-3">
        {resources.map((resource) => {
          const Icon = resource.type === 'guide' ? BookOpen :
                      resource.type === 'video' ? Play :
                      resource.type === 'faq' ? HelpCircle :
                      resource.type === 'forum' ? Users :
                      resource.type === 'policy' ? Shield : FileText;

          return (
            <button
              key={resource.id}
              onClick={() => handleResourceClick(resource)}
              className="w-full flex items-center justify-between p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-100 p-2 rounded-lg group-hover:bg-emerald-200 transition-colors">
                  <Icon className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                    {resource.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>Updated: {new Date(resource.lastUpdated).toLocaleDateString()}</span>
                    {resource.views && <span>{resource.views} views</span>}
                    {resource.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{resource.rating}</span>
                      </div>
                    )}
                    {resource.duration && <span>{resource.duration}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {resource.url && (
                  <div className="bg-blue-100 px-2 py-1 rounded text-xs text-blue-700">
                    External
                  </div>
                )}
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
              </div>
            </button>
          );
        })}
      </div>

      {/* User Guide Modal */}
      {activeModal === 'user-guide' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-6 w-6 text-emerald-600" />
                <h3 className="text-xl font-semibold text-gray-900">User Guide</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {resources.find(r => r.id === 'user-guide')?.content}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Last updated: January 15, 2024 • 1,247 views
                </div>
                <Button variant="outline" icon={Download}>
                  Download PDF
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Video Tutorials Modal */}
      {activeModal === 'video-tutorials' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Play className="h-6 w-6 text-emerald-600" />
                <h3 className="text-xl font-semibold text-gray-900">Video Tutorials</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {videoTutorials.map((video) => (
                  <div key={video.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <button className="bg-white bg-opacity-90 rounded-full p-3 hover:bg-opacity-100 transition-all">
                          <Play className="h-6 w-6 text-emerald-600" />
                        </button>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{video.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{video.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{video.views} views</span>
                        </div>
                        <button 
                          onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
                          className="text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                          Watch Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button 
                  variant="outline" 
                  icon={ExternalLink}
                  onClick={() => window.open('https://www.youtube.com/playlist?list=PLHealthMateAI', '_blank')}
                >
                  View All Tutorials on YouTube
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* FAQ Modal */}
      {activeModal === 'faq' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <HelpCircle className="h-6 w-6 text-emerald-600" />
                <h3 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Search and Filter */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <select
                  value={selectedFAQCategory}
                  onChange={(e) => setSelectedFAQCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {faqCategories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <details key={faq.id} className="border border-gray-200 rounded-lg">
                    <summary className="p-4 cursor-pointer hover:bg-gray-50 font-medium text-gray-900 flex items-center justify-between">
                      <span>{faq.question}</span>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs">
                          {faq.category}
                        </span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </summary>
                    <div className="p-4 pt-0 border-t border-gray-100">
                      <p className="text-gray-700 mb-4">{faq.answer}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{faq.helpful} helpful</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{faq.views} views</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-emerald-600 hover:text-emerald-700">
                            Helpful
                          </button>
                          <button className="text-gray-600 hover:text-gray-700">
                            Not Helpful
                          </button>
                        </div>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
              
              {filteredFAQs.length === 0 && (
                <div className="text-center py-8">
                  <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h4>
                  <p className="text-gray-600">Try adjusting your search or category filter.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Community Forum Modal */}
      {activeModal === 'community-forum' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-emerald-600" />
                <h3 className="text-xl font-semibold text-gray-900">Community Forum</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6 text-center">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Join Our Community</h4>
                <p className="text-gray-600 mb-4">
                  Connect with other HealthMate.AI users, share experiences, and get support from peers on similar recovery journeys.
                </p>
                <Button 
                  variant="primary" 
                  icon={ExternalLink}
                  onClick={() => window.open('https://community.healthmate.ai', '_blank')}
                >
                  Visit Community Forum
                </Button>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h5 className="font-medium text-gray-900 mb-4">Recent Discussions</h5>
                <div className="space-y-4">
                  {forumPosts.map((post) => (
                    <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h6 className="font-medium text-gray-900">{post.title}</h6>
                            {post.solved && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>by {post.author}</span>
                            <span>{post.replies} replies</span>
                            <span>{post.views} views</span>
                            <span>{post.lastActivity}</span>
                          </div>
                        </div>
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {post.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {activeModal === 'privacy-policy' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-emerald-600" />
                <h3 className="text-xl font-semibold text-gray-900">Privacy Policy</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {resources.find(r => r.id === 'privacy-policy')?.content}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Last updated: January 15, 2024
                </div>
                <Button variant="outline" icon={Download}>
                  Download PDF
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Terms of Service Modal */}
      {activeModal === 'terms-of-service' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-emerald-600" />
                <h3 className="text-xl font-semibold text-gray-900">Terms of Service</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {resources.find(r => r.id === 'terms-of-service')?.content}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Last updated: January 15, 2024
                </div>
                <Button variant="outline" icon={Download}>
                  Download PDF
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ResourcesManager;