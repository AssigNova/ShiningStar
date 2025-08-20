import { useState } from "react";
import { Header } from "./components/Header";
import { MainFeed } from "./components/MainFeed";
import { UploadModal } from "./components/UploadModal";
import { ChatModal } from "./components/ChatModal";
import { NotificationModal } from "./components/NotificationModal";
import { HighlightsModal } from "./components/HighlightsModal";
import { Dashboard } from "./components/Dashboard";
import { Leaderboard } from "./components/Leaderboard";
import { UserManual } from "./components/UserManual";
import { AIChatBot } from "./components/AIChatBot";
import { Toaster } from "./components/ui/sonner";
import newLogo from "./assets/shiningStar.png";
// import backgroundImage from "figma:asset/c8fe8aa003d8613000580c8d8851b32ef93680a1.png";

import "./styles/globals.css";

// Initial mock submissions
const initialSubmissions = [
  {
    id: 1,
    title: "Team Building Innovation",
    description: "Our department's creative approach to remote team building during challenging times.",
    category: "Team Collaboration",
    author: {
      name: "Sarah Johnson",
      department: "HR",
    },
    department: "HR",
    participantType: "Employee",
    likes: 45,
    comments: 12,
    timestamp: "2 hours ago",
    status: "published",
    type: "image",
    content: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Sustainable Office Practices",
    description: "Implementing eco-friendly solutions in our workspace.",
    category: "Innovation",
    author: {
      name: "Michael Chen",
      department: "Operations",
    },
    department: "Operations",
    participantType: "Employee",
    likes: 38,
    comments: 8,
    timestamp: "4 hours ago",
    status: "published",
    type: "video",
    content: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Family Day Celebration",
    description: "Bringing families together for a memorable day at the office.",
    category: "Family & Community",
    author: {
      name: "Lisa Brown",
      department: "Marketing",
    },
    department: "Marketing",
    participantType: "Spouse",
    likes: 67,
    comments: 23,
    timestamp: "6 hours ago",
    status: "published",
    type: "image",
    content: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&h=400&fit=crop",
  },
];

export default function App() {
  const [activeView, setActiveView] = useState<"feed" | "dashboard" | "leaderboard" | "manual">("feed");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isHighlightsModalOpen, setIsHighlightsModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  // Mock user login
  const handleLogin = (credentials: { email: string; password: string }) => {
    if (credentials.email.includes("@itc") || credentials.email.includes("@")) {
      setUser({
        id: 1,
        name: "John Doe",
        email: credentials.email,
        department: "Marketing",
        employeeId: "ITC001",
      });
      setIsFirstLogin(true); // Mark as first login to trigger AI welcome popup

      // Reset first login flag after a delay
      setTimeout(() => {
        setIsFirstLogin(false);
      }, 6000);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveView("feed");
    setIsFirstLogin(false);
  };

  const handleNewSubmission = (submissionData: any) => {
    const newSubmission = {
      id: Date.now(), // Simple ID generation
      ...submissionData,
      author: {
        name: user.name,
        department: user.department,
      },
      department: user.department,
      likes: 0,
      comments: 0,
      timestamp: "Just now",
      // Keep the original status from the submission (draft or published)
      status: submissionData.status,
    };

    setSubmissions((prev) => [newSubmission, ...prev]);
    setIsUploadModalOpen(false);
  };

  const handleDeleteSubmission = (submissionId: number) => {
    setSubmissions((prev) => prev.filter((submission) => submission.id !== submissionId));
  };

  const handleUpdateSubmission = (submissionId: number, updatedData: any) => {
    setSubmissions((prev) =>
      prev.map((submission) =>
        submission.id === submissionId
          ? {
              ...submission,
              ...updatedData,
              timestamp: updatedData.lastModified ? "Just now" : submission.timestamp,
            }
          : submission
      )
    );
  };

  const handlePublishDraft = (submissionId: number) => {
    setSubmissions((prev) =>
      prev.map((submission) =>
        submission.id === submissionId
          ? {
              ...submission,
              status: "published",
              timestamp: "Just now",
            }
          : submission
      )
    );
  };

  const handleLikeSubmission = (submissionId: number, newLikeCount: number) => {
    setSubmissions((prev) =>
      prev.map((submission) => (submission.id === submissionId ? { ...submission, likes: newLikeCount } : submission))
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen w-full overflow-hidden">
        <div
          className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative"
          style={{
            // backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}>
          {/* Blur overlay */}
          <div className="absolute inset-0 backdrop-blur-sm bg-black/20" />

          {/* Login Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md relative z-10 border border-white/20">
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex justify-center mb-6 sm:mb-8">
                <img src={newLogo} alt="Shining Stars Logo" className="h-16 sm:h-20 w-auto object-contain" />
              </div>
              <div className="space-y-2">
                <h1 className="text-xl sm:text-2xl font-medium text-gray-900">Welcome Back</h1>
                <p className="text-sm text-gray-600">Sign in to your Shining Stars account</p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleLogin({
                  email: formData.get("email") as string,
                  password: formData.get("password") as string,
                });
              }}
              className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  ITC Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all"
                  placeholder="your.name@itc.in"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 sm:py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-transform">
                Secure Login
              </button>
            </form>

            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs text-gray-500">Secure access to Shining Stars Season 3 Platform</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50/50 flex flex-col">
      {/* Header - Fixed positioning for consistent layout */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/50">
        <Header
          user={user}
          activeView={activeView}
          setActiveView={setActiveView}
          onUpload={() => setIsUploadModalOpen(true)}
          onOpenChat={() => setIsChatModalOpen(true)}
          onOpenNotifications={() => setIsNotificationModalOpen(true)}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content Area - Flexible layout with proper spacing */}
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="w-full">
            {/* Content Views with consistent spacing and responsive behavior */}
            {activeView === "feed" && (
              <div className="w-full">
                <MainFeed
                  onOpenHighlights={() => setIsHighlightsModalOpen(true)}
                  user={user}
                  submissions={submissions}
                  onLikeSubmission={handleLikeSubmission}
                />
              </div>
            )}

            {activeView === "dashboard" && (
              <div className="w-full">
                <Dashboard
                  user={user}
                  submissions={submissions}
                  onDeleteSubmission={handleDeleteSubmission}
                  onUpdateSubmission={handleUpdateSubmission}
                  onPublishDraft={handlePublishDraft}
                  onLikeSubmission={handleLikeSubmission}
                />
              </div>
            )}

            {activeView === "leaderboard" && (
              <div className="w-full">
                <Leaderboard />
              </div>
            )}

            {activeView === "manual" && (
              <div className="w-full">
                <UserManual />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* AI ChatBot - Positioned with proper spacing from bottom and right */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40">
        <AIChatBot
          user={user}
          isFirstLogin={isFirstLogin}
          activeView={activeView}
          onViewChange={setActiveView}
          onOpenUpload={() => setIsUploadModalOpen(true)}
        />
      </div>

      {/* Modals - Proper z-indexing */}
      <div className="relative z-50">
        <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} user={user} onSubmit={handleNewSubmission} />

        <ChatModal isOpen={isChatModalOpen} onClose={() => setIsChatModalOpen(false)} user={user} />

        <NotificationModal isOpen={isNotificationModalOpen} onClose={() => setIsNotificationModalOpen(false)} />

        <HighlightsModal isOpen={isHighlightsModalOpen} onClose={() => setIsHighlightsModalOpen(false)} />
      </div>

      {/* Toast Notifications - Highest z-index */}
      <div className="relative z-[60]">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              color: "#374151",
            },
          }}
        />
      </div>
    </div>
  );
}
