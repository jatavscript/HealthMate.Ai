import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Pill,
  UtensilsCrossed,
  Activity,
  Heart,
  CheckCircle,
  TrendingUp,
  Calendar,
  Settings,
  HelpCircle,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
  X,
  Send,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  Info
} from 'lucide-react';

interface SupportTicket {
  name: string;
  email: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'medical' | 'billing' | 'general';
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportMethod, setSupportMethod] = useState<'form' | 'phone' | 'chat' | 'email'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const [supportForm, setSupportForm] = useState<SupportTicket>({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium',
    category: 'general'
  });

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Pill, label: 'Medications', path: '/medications' },
    { icon: UtensilsCrossed, label: 'Meal Plan', path: '/meals' },
    { icon: Activity, label: 'Exercises', path: '/exercises' },
    { icon: Heart, label: 'Health Guidelines', path: '/guidelines' },
    { icon: CheckCircle, label: 'Daily Check-in', path: '/checkin' },
    { icon: TrendingUp, label: 'Progress', path: '/progress' },
    { icon: Calendar, label: 'Schedule', path: '/schedule' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleFormChange = (field: keyof SupportTicket, value: string) => {
    setSupportForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate ticket ID
      const ticketId = 'HM-' + Date.now().toString().slice(-6);
      
      // Store in localStorage for demo
      const existingTickets = JSON.parse(localStorage.getItem('healthmate_support_tickets') || '[]');
      const newTicket = {
        ...supportForm,
        id: ticketId,
        status: 'open',
        createdAt: new Date().toISOString(),
        estimatedResponse: '24 hours'
      };
      existingTickets.push(newTicket);
      localStorage.setItem('healthmate_support_tickets', JSON.stringify(existingTickets));
      
      setSubmitSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setSupportForm({
          name: '',
          email: '',
          subject: '',
          message: '',
          priority: 'medium',
          category: 'general'
        });
        setSubmitSuccess(false);
        setShowSupportModal(false);
      }, 3000);
      
    } catch (error) {
      console.error('Support submission failed:', error);
      alert('Failed to submit support request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneSupport = () => {
    const phoneNumber = '+1-800-HEALTH';
    const confirmCall = confirm(`📞 Call HealthMate.AI Support?\n\nPhone: ${phoneNumber}\n\nSupport Hours:\n• Monday-Friday: 8AM-8PM EST\n• Saturday-Sunday: 10AM-6PM EST\n• Emergency: 24/7 available\n\nClick OK to dial now.`);
    
    if (confirmCall) {
      // Try to open phone app
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const handleEmailSupport = () => {
    const subject = 'HealthMate.AI Support Request';
    const body = `Hello HealthMate.AI Support Team,

I need assistance with:

[Please describe your issue here]

Patient Information:
- Name: [Your Name]
- Email: [Your Email]
- Recovery Stage: [Your current recovery stage]

Thank you for your assistance.

Best regards,
[Your Name]

---
This email was generated from HealthMate.AI
Timestamp: ${new Date().toLocaleString()}`;

    const mailtoLink = `mailto:support@healthmate.ai?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Try to open email client
    const emailWindow = window.open(mailtoLink, '_blank');
    
    // Fallback if email client doesn't open
    setTimeout(() => {
      if (!emailWindow || emailWindow.closed) {
        // Copy email details to clipboard as fallback
        navigator.clipboard.writeText(`To: support@healthmate.ai\nSubject: ${subject}\n\n${body}`).then(() => {
          alert('📧 Email details copied to clipboard!\n\nPlease paste into your email client and send to:\nsupport@healthmate.ai');
        }).catch(() => {
          alert('📧 Please send an email to:\nsupport@healthmate.ai\n\nSubject: ' + subject);
        });
      }
    }, 1000);
  };

  const handleLiveChat = () => {
    // Simulate opening live chat
    const chatWindow = window.open('https://chat.healthmate.ai', 'HealthMateChat', 'width=400,height=600,scrollbars=yes,resizable=yes');
    
    if (!chatWindow) {
      alert('💬 Live Chat\n\nChat Hours:\n• Monday-Friday: 8AM-8PM EST\n• Saturday-Sunday: 10AM-6PM EST\n\nPlease enable popups to access live chat, or contact us via phone/email.');
    } else {
      // Simulate chat not available outside hours
      setTimeout(() => {
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay();
        
        const isWeekend = day === 0 || day === 6;
        const isOutsideHours = isWeekend ? (hour < 10 || hour >= 18) : (hour < 8 || hour >= 20);
        
        if (isOutsideHours) {
          chatWindow.close();
          alert('💬 Live Chat Currently Unavailable\n\nOur chat agents are currently offline.\n\nChat Hours:\n• Monday-Friday: 8AM-8PM EST\n• Saturday-Sunday: 10AM-6PM EST\n\nFor immediate assistance, please call our 24/7 emergency line or submit a support ticket.');
        }
      }, 2000);
    }
  };

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:pt-16 bg-white border-r border-gray-200">
        <div className="flex flex-col flex-1 min-h-0 pt-6">
          <div className="flex-1 flex flex-col pb-4 overflow-y-auto">
            <nav className="mt-2 flex-1 px-3 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                        isActive(item.path) ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex-shrink-0 px-3 pb-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <HelpCircle className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-sm font-medium text-blue-900">Need Help?</h3>
              </div>
              <p className="text-xs text-blue-700 mb-3">
                Get personalized support for your recovery journey.
              </p>
              <button 
                onClick={() => setShowSupportModal(true)}
                className="w-full bg-blue-600 text-white text-xs font-medium py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-1"
              >
                <MessageCircle className="h-3 w-3" />
                <span>Contact Support</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <HelpCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">HealthMate.AI Support</h3>
                  <p className="text-sm text-gray-600">We're here to help with your recovery journey</p>
                </div>
              </div>
              <button
                onClick={() => setShowSupportModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              {submitSuccess ? (
                /* Success State */
                <div className="p-8 text-center">
                  <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Support Request Submitted!</h3>
                  <p className="text-gray-600 mb-4">
                    Thank you for contacting us. We've received your request and will respond within 24 hours.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="text-sm text-blue-700">
                      <strong>What happens next?</strong>
                      <ul className="mt-2 space-y-1 text-left">
                        <li>• You'll receive an email confirmation shortly</li>
                        <li>• Our support team will review your request</li>
                        <li>• We'll respond within 24 hours (usually much faster)</li>
                        <li>• For urgent issues, please call our 24/7 hotline</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Contact Method Selection */}
                  <div className="p-6 border-b border-gray-200">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">How would you like to get help?</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <button
                        onClick={() => setSupportMethod('form')}
                        className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                          supportMethod === 'form'
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <MessageCircle className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                        <div className="text-sm font-medium text-gray-900">Support Ticket</div>
                        <div className="text-xs text-gray-500">24hr response</div>
                      </button>
                      
                      <button
                        onClick={() => {
                          setSupportMethod('phone');
                          handlePhoneSupport();
                        }}
                        className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                          supportMethod === 'phone'
                            ? 'border-green-500 bg-green-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <Phone className="h-6 w-6 mx-auto mb-2 text-green-600" />
                        <div className="text-sm font-medium text-gray-900">Call Support</div>
                        <div className="text-xs text-gray-500">Immediate</div>
                      </button>
                      
                      <button
                        onClick={() => {
                          setSupportMethod('chat');
                          handleLiveChat();
                        }}
                        className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                          supportMethod === 'chat'
                            ? 'border-purple-500 bg-purple-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <MessageCircle className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                        <div className="text-sm font-medium text-gray-900">Live Chat</div>
                        <div className="text-xs text-gray-500">8AM-8PM EST</div>
                      </button>
                      
                      <button
                        onClick={() => {
                          setSupportMethod('email');
                          handleEmailSupport();
                        }}
                        className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                          supportMethod === 'email'
                            ? 'border-orange-500 bg-orange-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <Mail className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                        <div className="text-sm font-medium text-gray-900">Email Support</div>
                        <div className="text-xs text-gray-500">48hr response</div>
                      </button>
                    </div>
                  </div>

                  {/* Support Form */}
                  {supportMethod === 'form' && (
                    <div className="p-6">
                      <form onSubmit={handleSupportSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              value={supportForm.name}
                              onChange={(e) => handleFormChange('name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter your full name"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              value={supportForm.email}
                              onChange={(e) => handleFormChange('email', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter your email"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Category
                            </label>
                            <select
                              value={supportForm.category}
                              onChange={(e) => handleFormChange('category', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="general">General Support</option>
                              <option value="technical">Technical Issue</option>
                              <option value="medical">Medical Question</option>
                              <option value="billing">Billing & Account</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Priority
                            </label>
                            <select
                              value={supportForm.priority}
                              onChange={(e) => handleFormChange('priority', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="low">Low - General inquiry</option>
                              <option value="medium">Medium - Need assistance</option>
                              <option value="high">High - Important issue</option>
                              <option value="urgent">Urgent - Critical problem</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subject *
                          </label>
                          <input
                            type="text"
                            value={supportForm.subject}
                            onChange={(e) => handleFormChange('subject', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Brief description of your issue"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message *
                          </label>
                          <textarea
                            value={supportForm.message}
                            onChange={(e) => handleFormChange('message', e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Please provide detailed information about your issue or question..."
                            required
                          />
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-blue-700">
                              <div className="font-medium mb-1">Support Information:</div>
                              <div className="space-y-1">
                                <div>• Response time: Within 24 hours (usually much faster)</div>
                                <div>• Emergency support: Call +1-800-HEALTH (24/7)</div>
                                <div>• All communications are secure and HIPAA compliant</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-3 pt-4">
                          <button
                            type="button"
                            onClick={() => setShowSupportModal(false)}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={isSubmitting}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting || !supportForm.name || !supportForm.email || !supportForm.subject || !supportForm.message}
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                          >
                            {isSubmitting ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Submitting...</span>
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4" />
                                <span>Submit Request</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Other Ways to Reach Us</h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-600" />
                        <div>
                          <div className="font-medium">Phone Support</div>
                          <div className="text-gray-600">+1-800-HEALTH</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-600" />
                        <div>
                          <div className="font-medium">Email Support</div>
                          <div className="text-gray-600">support@healthmate.ai</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-600" />
                        <div>
                          <div className="font-medium">Support Hours</div>
                          <div className="text-gray-600">24/7 Emergency</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;