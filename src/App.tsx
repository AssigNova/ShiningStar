import { useState, useEffect } from "react";
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

const initialSubmissions = [
  {
    id: 4,
    title: "Green Energy Drive",
    description:
      "Promoting the adoption of renewable energy within the organization to reduce carbon footprint and encourage sustainable growth. This initiative focuses on solar panels, energy-efficient systems, and green workshops for employees.",
    category: "Sustainability",
    author: {
      name: "Ravi Kumar",
      department: "Engineering",
    },
    department: "Engineering",
    participantType: "Employee",
    likes: 42,
    comments: 12,
    timestamp: "2 hours ago",
    status: "published",
    type: "image",
    content: "https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?w=600&h=400&fit=crop",
  },
  {
    id: 5,
    title: "Tech for Tomorrow",
    description:
      "Introducing AI-driven automation to streamline workflows, reduce human error, and increase overall efficiency. The project aims to integrate cutting-edge tools into daily operations.",
    category: "Innovation",
    author: {
      name: "Maria Lopez",
      department: "IT",
    },
    department: "IT",
    participantType: "Employee",
    likes: 55,
    comments: 18,
    timestamp: "4 hours ago",
    status: "published",
    type: "video",
    content: "https://videos.pexels.com/video-files/856872/856872-hd_1920_1080_25fps.mp4",
  },
  {
    id: 6,
    title: "Cultural Fusion Fest",
    description:
      "An annual event that celebrates diversity by showcasing traditional dances, music, food stalls, and cultural activities, bringing employees and their families together.",
    category: "Family & Community",
    author: {
      name: "Ahmed Ali",
      department: "Finance",
    },
    department: "Finance",
    participantType: "Spouse",
    likes: 73,
    comments: 29,
    timestamp: "1 day ago",
    status: "published",
    type: "image",
    content: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop",
  },
];

export default function App() {
  const [activeView, setActiveView] = useState<"feed" | "dashboard" | "leaderboard" | "manual">("feed");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isHighlightsModalOpen, setIsHighlightsModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  // Fetch posts from backend on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        const posts = await res.json();

        setSubmissions(posts);
        console.log("Submissions Set");
      } catch {
        // Optionally show error
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    setSubmissions(initialSubmissions);
  }, []);

  // Real user login with backend
  const handleLogin = async (credentials: { email: string; password: string }) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setIsFirstLogin(true);
      setTimeout(() => setIsFirstLogin(false), 6000);
    } else {
      alert(data.message || "Login failed");
    }
  };

  // Persist user session on reload using localStorage and validate with backend
  useEffect(() => {
    const checkUserSession = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (res.ok && data.user) {
            setUser(data.user);
          } else {
            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
          }
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    checkUserSession();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setActiveView("feed");
    setIsFirstLogin(false);
  };

  const handleNewSubmission = async (submissionData: any) => {
    // try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", submissionData.title);
    formData.append("description", submissionData.description);
    formData.append("category", submissionData.category);
    formData.append(
      "author",
      JSON.stringify({
        name: user?.username || user?.name || "Unknown",
        department: user?.department || submissionData.department || "Unknown",
      })
    );
    formData.append("department", submissionData.department);
    formData.append("participantType", submissionData.participantType);
    formData.append("likes", String(submissionData.likes || 0));
    formData.append("comments", String(submissionData.comments || 0));
    formData.append("timestamp", submissionData.timestamp || submissionData.submittedAt || new Date().toISOString());
    formData.append("status", submissionData.status);
    formData.append("type", submissionData.type);
    formData.append("content", submissionData.content);
    if (submissionData.file) {
      formData.append("media", submissionData.file);
    }
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    const newPost = await res.json();
    if (res.ok) {
      setSubmissions((prev: any) => [newPost, ...prev]);
      setIsUploadModalOpen(false);
    } else {
      alert(newPost.message || "Failed to create post");
    }
    // } catch {
    //   alert("Server error");
    // }
  };

  const handleDeleteSubmission = (submissionId: number) => {
    setSubmissions((prev: any) => prev.filter((submission: any) => submission.id !== submissionId));
  };

  const handleUpdateSubmission = (submissionId: number, updatedData: any) => {
    setSubmissions((prev: any) =>
      prev.map((submission: any) =>
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
    setSubmissions((prev: any) =>
      prev.map((submission: any) =>
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
    setSubmissions((prev: any) =>
      prev.map((submission: any) => (submission.id === submissionId ? { ...submission, likes: newLikeCount } : submission))
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-purple-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className="text-lg text-gray-700">Loading...</span>
        </div>
      </div>
    );
  }

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

        <NotificationModal isOpen={isNotificationModalOpen} onClose={() => setIsNotificationModalOpen(false)} user={user} />

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
