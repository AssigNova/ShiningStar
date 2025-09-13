import { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Zap,
  HelpCircle,
  Search,
  Upload,
  BarChart3,
  BookOpen,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Message {
  id: number;
  content: string;
  sender: "user" | "bot";
  timestamp: string;
  type?: "text" | "interactive" | "quick-actions";
  actions?: Array<{
    label: string;
    action: string;
    icon?: any;
  }>;
}

interface AIChatBotProps {
  user: any;
  isFirstLogin?: boolean;
  activeView?: "feed" | "dashboard" | "leaderboard" | "manual";
  onViewChange?: (view: "feed" | "dashboard" | "leaderboard" | "manual") => void;
  onOpenUpload?: () => void;
}

export function AIChatBot({ user, isFirstLogin = false, activeView = "feed", onViewChange, onOpenUpload }: AIChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [hasUnreadSuggestion, setHasUnreadSuggestion] = useState(true);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Welcome popup timer
  useEffect(() => {
    if (isFirstLogin) {
      const timer = setTimeout(() => {
        setShowWelcomePopup(true);
      }, 1000);

      const hideTimer = setTimeout(() => {
        setShowWelcomePopup(false);
      }, 5000);

      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [isFirstLogin]);

  // Auto scroll to bottom of messages and check if scroll indicator is needed
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // Check if content overflows to show scroll indicator
    const checkScrollable = () => {
      if (scrollAreaRef.current) {
        const { scrollHeight, clientHeight, scrollTop } = scrollAreaRef.current;
        const isScrollable = scrollHeight > clientHeight;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
        setShowScrollIndicator(isScrollable && !isAtBottom);
      }
    };

    setTimeout(checkScrollable, 100); // Small delay to ensure DOM is updated
  }, [messages]);

  // Initialize chat with contextual welcome message when first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const contextualWelcome = getContextualWelcome();
      setMessages([contextualWelcome]);
      setShowQuickActions(true);

      // Add some demo messages to show scrolling capability
      setTimeout(() => {
        const demoTip: Message = {
          id: Date.now() + 100,
          content: `💡 **Quick Tip**: You can scroll up and down to view our entire conversation! I'll remember everything we discuss during this session.\n\nFeel free to ask me anything about:\n• Platform navigation\n• Creating submissions\n• Best practices\n• Competition rules\n• Technical support`,
          sender: "bot",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "text",
        };
        setMessages((prev) => [...prev, demoTip]);
      }, 2000);
    }
  }, [isOpen, messages.length, user.name, activeView]);

  const getContextualWelcome = (): Message => {
    let content = `Hello ${user.name}! 👋 I'm your AI assistant for the Shining Stars platform.`;

    switch (activeView) {
      case "feed":
        content += `\n\nI see you're exploring the main feed! I can help you:\n• Find interesting submissions\n• Learn about engagement features\n• Understand different categories\n• Navigate to other sections`;
        break;
      case "dashboard":
        content += `\n\nYou're on your Dashboard! I can help you:\n• Manage your submissions\n• Publish drafts\n• Track your performance\n• Optimize your content`;
        break;
      case "leaderboard":
        content += `\n\nChecking out the competition? I can help you:\n• Understand ranking factors\n• Find ways to improve your score\n• Learn about top performers\n• Boost your engagement`;
        break;
      case "manual":
        content += `\n\nGood choice checking the manual! I can help you:\n• Find specific features\n• Answer quick questions\n• Guide you to relevant sections\n• Explain platform functions`;
        break;
    }

    content += `\n\nWhat would you like help with today? 🚀`;

    return {
      id: Date.now(),
      content,
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "interactive",
      actions: getQuickActions(),
    };
  };

  const getQuickActions = () => {
    const baseActions = [
      { label: "How to Upload", action: "upload-help", icon: Upload },
      { label: "Platform Tour", action: "platform-tour", icon: Search },
      { label: "Best Practices", action: "best-practices", icon: Sparkles },
      { label: "View Manual", action: "open-manual", icon: BookOpen },
    ];

    // Add contextual actions based on current view
    if (activeView === "feed") {
      baseActions.unshift({ label: "Explore Features", action: "explore-features", icon: Zap });
    } else if (activeView === "dashboard") {
      baseActions.unshift({ label: "Improve Performance", action: "performance-tips", icon: BarChart3 });
    }

    return baseActions.slice(0, 4); // Keep only 4 actions
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      content: inputValue,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    setShowQuickActions(false);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateAIResponse(inputValue);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    setShowQuickActions(false);
    setIsTyping(true);

    setTimeout(() => {
      const response = generateQuickActionResponse(action);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1000);
  };

  const generateQuickActionResponse = (action: string): Message => {
    const responses = {
      "upload-help": {
        content: `Here's how to create a submission:\n\n🎯 **Quick Start Guide:**\n\n1️⃣ Click on 'Upload Entry' button on the header\n2️⃣ Choose your content type (image/video)\n3️⃣ Drag & drop or select your file\n4️⃣ Add a compelling title\n5️⃣ Write an engaging description\n6️⃣ Select the right category\n7️⃣ Save as draft or publish immediately\n\n💡 **Pro Tips:**\n• Use descriptive, engaging titles\n• Tell a story in your description\n• Choose the most relevant category\n• High-quality images get more engagement`,
        actions: [
          { label: "Open Upload Modal", action: "open-upload", icon: Upload },
          { label: "Category Guide", action: "categories", icon: HelpCircle },
          { label: "Best Practices", action: "best-practices", icon: Sparkles },
        ],
      },
      "platform-tour": {
        content: `🗺️ **Platform Navigation Guide:**\n\n📱 **Main Sections:**\n• **Explore** - Main feed with all submissions\n• **Dashboard** - Your personal content management\n• **Leaderboard** - Competition rankings\n• **Manual** - Complete documentation\n\n🎯 **Key Features:**\n• Like & comment on submissions\n• Share content with colleagues\n• Track your performance\n• Manage drafts and published posts\n\n✨ **Quick Navigation Tips:**\n• Use the header menu to switch sections\n• Check notifications for engagement updates\n• Use search to find specific content`,
        actions: [
          { label: "Go to Dashboard", action: "open-dashboard", icon: BarChart3 },
          { label: "View Leaderboard", action: "open-leaderboard", icon: ExternalLink },
          { label: "Platform Features", action: "features", icon: Zap },
        ],
      },
      "best-practices": {
        content: `🏆 **Shining Stars Best Practices:**\n\n📸 **Content Creation:**\n• Use high-quality images (minimum 800px width)\n• Keep videos under 2 minutes for best engagement\n• Write compelling titles (50-80 characters work best)\n• Include storytelling in descriptions\n\n💬 **Engagement Tips:**\n• Respond to comments on your posts\n• Like and comment on others' content\n• Share submissions that inspire you\n• Post consistently but focus on quality\n\n🎯 **Category Selection:**\n• Choose the most relevant category\n• Don't force fit - authenticity matters\n• Review category descriptions if unsure`,
        actions: [
          { label: "Content Guidelines", action: "content-guide", icon: BookOpen },
          { label: "Engagement Tips", action: "engagement", icon: Sparkles },
          { label: "Category Help", action: "categories", icon: HelpCircle },
        ],
      },
      "explore-features": {
        content: `✨ **Main Feed Features:**\n\n🔍 **Discovery Options:**\n• **Most Loved** - Top-rated submissions\n• **New** - Latest posts from colleagues\n• **By Category** - Filter by interest area\n• **Last Season Highlights** - Previous winners\n\n🎯 **Interaction Features:**\n• ❤️ Like posts to show appreciation\n• 💬 Comment to start conversations\n• 🔗 Share great content\n• 👁️ View detailed post information\n\n📊 **What to Look For:**\n• Trending submissions in your department\n• Creative ideas you can learn from\n• Opportunities to collaborate`,
        actions: [
          { label: "Filter by Category", action: "filters", icon: Search },
          { label: "View Highlights", action: "highlights", icon: Sparkles },
          { label: "Engagement Guide", action: "engagement", icon: HelpCircle },
        ],
      },
      "performance-tips": {
        content: `📈 **Boost Your Performance:**\n\n🎯 **Content Strategy:**\n• Post regularly but prioritize quality\n• Share authentic stories and experiences\n• Use relevant hashtags in descriptions\n• Engage with your audience promptly\n\n📊 **Analytics to Watch:**\n• Like-to-view ratio (aim for 10%+)\n• Comment engagement (responses matter)\n• Share count (viral potential indicator)\n• Cross-department appeal\n\n🚀 **Growth Tactics:**\n• Collaborate with other departments\n• Share behind-the-scenes content\n• Celebrate team achievements\n• Ask engaging questions in descriptions`,
        actions: [
          { label: "View My Stats", action: "stats", icon: BarChart3 },
          { label: "Content Ideas", action: "content-ideas", icon: Sparkles },
          { label: "Engagement Strategy", action: "engagement", icon: Zap },
        ],
      },
      "open-manual": {
        content: `📖 **User Manual Access:**\n\nI can guide you to specific sections or you can browse the complete manual.\n\n🔍 **Popular Manual Sections:**\n• Getting Started Guide\n• Submission Guidelines\n• Engagement Features\n• Troubleshooting\n• Competition Rules\n• Category Descriptions\n\n💡 The manual is always accessible from the main navigation!`,
        actions: [
          { label: "Open Manual", action: "view-manual", icon: BookOpen },
          { label: "Quick Start", action: "quick-start", icon: Zap },
          { label: "FAQ Section", action: "faq", icon: HelpCircle },
        ],
      },
    };

    const response = responses[action as keyof typeof responses] || {
      content: "I can help you with that! What specific information are you looking for?",
      actions: [],
    };

    return {
      id: Date.now() + 1,
      content: response.content,
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "interactive",
      actions: response.actions,
    };
  };

  const generateAIResponse = (input: string): Message => {
    const lowercaseInput = input.toLowerCase();

    // Enhanced responses with interactive elements
    const responses: { [key: string]: any } = {
      dashboard: {
        content:
          "Your Dashboard is your command center! Here's what you can do:\n\n📊 **Main Features:**\n• View all submissions (published & drafts)\n• Edit or delete your posts\n• Publish drafts when ready\n• Track engagement metrics\n• Monitor your ranking\n\n🎯 **Pro Tips:**\n• Use drafts to perfect your content\n• Check analytics to see what works\n• Publish during peak hours for better reach",
        actions: [
          { label: "Go to Dashboard", action: "open-dashboard", icon: BarChart3 },
          { label: "Draft Tips", action: "draft-help", icon: BookOpen },
        ],
      },
      upload: {
        content:
          "Ready to create something amazing? Here's your upload guide:\n\n🚀 **Step-by-Step:**\n1. Click on 'Upload Entry' button on the header\n2. Choose image or video\n3. Upload your file (max 30MB)\n4. Craft an engaging title\n5. Write a compelling description\n6. Select the perfect category\n7. Save as draft or publish\n\n✨ **Success Tips:**\n• Tell a story, don't just describe\n• Use high-quality visuals\n• Choose the most relevant category",
        actions: [
          { label: "Start Upload", action: "open-upload", icon: Upload },
          { label: "Category Guide", action: "categories", icon: HelpCircle },
        ],
      },
      leaderboard: {
        content:
          "🏆 **Leaderboard Insights:**\n\n📈 **How Rankings Work:**\n• Likes & comments boost your score\n• Consistency matters as much as viral posts\n• Cross-department engagement is valuable\n• Quality content gets lasting engagement\n\n🎯 **Climb the Rankings:**\n• Engage with others' content\n• Post high-quality submissions regularly\n• Respond to comments on your posts\n• Share content that resonates",
        actions: [
          { label: "View Rankings", action: "open-leaderboard", icon: ExternalLink },
          { label: "Ranking Tips", action: "ranking-tips", icon: Sparkles },
        ],
      },
    };

    // Check for specific topics
    for (const [key, response] of Object.entries(responses)) {
      if (lowercaseInput.includes(key)) {
        return {
          id: Date.now() + 1,
          content: response.content,
          sender: "bot",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "interactive",
          actions: response.actions,
        };
      }
    }

    // Default enhanced response
    return {
      id: Date.now() + 1,
      content:
        "I'd love to help you with that! Here are some popular topics I can assist with:\n\n🎯 **Popular Help Topics:**\n• Creating and uploading submissions\n• Understanding the competition\n• Improving your rankings\n• Platform navigation and features\n\nWhat specific area would you like to explore?",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "interactive",
      actions: [
        { label: "Upload Help", action: "upload-help", icon: Upload },
        { label: "Platform Tour", action: "platform-tour", icon: Search },
        { label: "Best Practices", action: "best-practices", icon: Sparkles },
        { label: "Performance Tips", action: "performance-tips", icon: BarChart3 },
      ],
    };
  };

  const handleActionClick = (action: string) => {
    switch (action) {
      case "open-upload":
        onOpenUpload?.();
        toast.success("Opening upload modal!");
        break;
      case "open-dashboard":
        onViewChange?.("dashboard");
        toast.success("Navigating to Dashboard!");
        break;
      case "open-leaderboard":
        onViewChange?.("leaderboard");
        toast.success("Opening Leaderboard!");
        break;
      case "view-manual":
        onViewChange?.("manual");
        toast.success("Opening User Manual!");
        break;
      default:
        // Handle other actions as quick responses
        handleQuickAction(action);
        break;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    setHasUnreadSuggestion(false);
  };

  return (
    <>
      {/* Welcome Popup */}
      <AnimatePresence>
        {showWelcomePopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 sm:bottom-24 sm:right-0">
            <Card className="w-56 sm:w-64 shadow-xl border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="bg-purple-100 rounded-full p-1.5 sm:p-2 flex-shrink-0">
                    <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 mb-1">AI Assistant</p>
                    <p className="text-xs sm:text-sm text-gray-600">I am here to help you!</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 sm:h-6 sm:w-6 p-0 text-gray-400 hover:text-gray-600 flex-shrink-0"
                    onClick={() => setShowWelcomePopup(false)}>
                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Button */}
      <motion.div className="relative" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={toggleOpen}
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
          size="icon">
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </Button>

        {/* Enhanced notification dot with pulse animation */}
        <AnimatePresence>
          {hasUnreadSuggestion && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-3 w-3 sm:h-4 sm:w-4 bg-red-500 rounded-full flex items-center justify-center">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <Sparkles className="h-1.5 w-1.5 sm:h-2 sm:w-2 text-white" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Enhanced Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 sm:bottom-20 right-0 w-80 sm:w-96 h-[85vh] max-h-[500px] min-h-[400px]">
            <Card className="h-full flex flex-col shadow-2xl border-purple-200 overflow-hidden">
              <CardHeader className="pb-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg flex-shrink-0">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                      <Bot className="h-5 w-5" />
                    </motion.div>
                    <span>AI Assistant</span>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30 animate-pulse">
                      Online
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white hover:bg-white/20" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                {/* Messages Area */}
                <div className="flex-1 overflow-hidden relative">
                  {/* Top fade indicator */}
                  <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />

                  <ScrollArea
                    className="h-full w-full"
                    ref={scrollAreaRef}
                    onScrollCapture={() => {
                      // Update scroll indicator when scrolling
                      if (scrollAreaRef.current) {
                        const { scrollHeight, clientHeight, scrollTop } = scrollAreaRef.current;
                        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
                        setShowScrollIndicator(!isAtBottom && scrollHeight > clientHeight);
                      }
                    }}>
                    <div className="px-4 py-2">
                      <div className="space-y-4 pb-4">
                        {messages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex items-start space-x-2 ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                            <div
                              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                message.sender === "user" ? "bg-purple-100" : "bg-blue-100"
                              }`}>
                              {message.sender === "user" ? (
                                <User className="h-4 w-4 text-purple-600" />
                              ) : (
                                <Bot className="h-4 w-4 text-blue-600" />
                              )}
                            </div>
                            <div className={`flex-1 max-w-[280px] ${message.sender === "user" ? "text-right" : ""}`}>
                              <motion.div
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                className={`rounded-lg p-3 ${
                                  message.sender === "user" ? "bg-purple-600 text-white ml-8" : "bg-gray-100 text-gray-900 mr-8"
                                }`}>
                                <p className="whitespace-pre-line text-sm">{message.content}</p>
                              </motion.div>

                              {/* Interactive Action Buttons */}
                              {message.actions && message.actions.length > 0 && (
                                <motion.div
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.2 }}
                                  className="mt-3 mr-8">
                                  <Separator className="mb-3" />
                                  <div className="flex flex-wrap gap-2">
                                    {message.actions.map((action, index) => (
                                      <motion.div
                                        key={action.action}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.1 * index }}>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleActionClick(action.action)}
                                          className="h-7 px-2 text-xs bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-purple-600 transition-colors">
                                          {action.icon && <action.icon className="h-3 w-3 mr-1" />}
                                          {action.label}
                                          <ArrowRight className="h-3 w-3 ml-1" />
                                        </Button>
                                      </motion.div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}

                              <p className="text-xs text-gray-500 mt-1 px-1">{message.timestamp}</p>
                            </div>
                          </motion.div>
                        ))}

                        {/* Enhanced Typing Indicator */}
                        {isTyping && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start space-x-2">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <Bot className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="bg-gray-100 rounded-lg p-3 mr-8">
                              <div className="flex items-center space-x-1">
                                <motion.div
                                  className="w-2 h-2 bg-blue-400 rounded-full"
                                  animate={{ y: [0, -4, 0] }}
                                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                />
                                <motion.div
                                  className="w-2 h-2 bg-blue-400 rounded-full"
                                  animate={{ y: [0, -4, 0] }}
                                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                />
                                <motion.div
                                  className="w-2 h-2 bg-blue-400 rounded-full"
                                  animate={{ y: [0, -4, 0] }}
                                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                />
                                <span className="text-xs text-gray-500 ml-2">AI is thinking...</span>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Quick Action Suggestions */}
                        {showQuickActions && messages.length === 1 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="border-t pt-4">
                            <p className="text-xs text-gray-500 mb-3 flex items-center">
                              <Zap className="h-3 w-3 mr-1" />
                              Quick Actions
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {getQuickActions().map((action) => (
                                <Button
                                  key={action.action}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleQuickAction(action.action)}
                                  className="h-8 text-xs justify-start bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100">
                                  <action.icon className="h-3 w-3 mr-1" />
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                      </div>
                    </div>
                  </ScrollArea>

                  {/* Bottom fade indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />

                  {/* Scroll Indicator */}
                  <AnimatePresence>
                    {showScrollIndicator && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-6 right-2 bg-purple-600 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-purple-700 transition-colors z-20"
                        onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}
                        title="Scroll to bottom">
                        <motion.div animate={{ y: [0, 3, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                          <ChevronDown className="h-4 w-4" />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Enhanced Input Area */}
                <div className="border-t p-4 bg-gray-50/50 flex-shrink-0">
                  <div className="flex space-x-2">
                    <Textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about the platform..."
                      rows={2}
                      className="flex-1 resize-none bg-white border-gray-200 focus:border-purple-300 focus:ring-purple-200 min-h-[60px] max-h-[100px]"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      className="self-end bg-purple-600 hover:bg-purple-700 disabled:opacity-50">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">Press Enter to send • Shift+Enter for new line</p>
                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                      <Sparkles className="h-3 w-3" />
                      <span>Powered by AI</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
