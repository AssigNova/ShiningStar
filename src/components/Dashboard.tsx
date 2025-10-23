import { useState, useEffect } from "react";
import { Eye, Heart, MessageCircle, CheckCircle, Edit, Trash2, Send } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { ViewPostModal } from "./ViewPostModal";
import { EditPostModal } from "./EditPostModal";

interface DashboardProps {
  user: any;
  submissions: any[];
  onDeleteSubmission?: (submissionId: number) => void;
  onUpdateSubmission?: (submissionId: number, updatedData: any) => void;
  onPublishDraft?: (submissionId: number) => void;
  onLikeSubmission?: (submissionId: string, userId: string) => void;
  token?: string; // Add token prop
}

export function Dashboard({ user, submissions, onDeleteSubmission, onUpdateSubmission }: DashboardProps) {
  const [leaderboardRank, setLeaderboardRank] = useState<number | null>(null);
  const token = localStorage.getItem("token");

  // Always derive userSubmissions from the latest submissions prop
  const userSubmissions = submissions
    .filter((submission) => submission.author.name === user.name)
    .map((submission) => ({
      ...submission,
      views: typeof submission.views === "number" ? submission.views : 0,
      submittedAt: submission.timestamp,
    }));

  // Fetch leaderboard rank for current user
  useEffect(() => {
    fetch("/api/leaderboard/individuals")
      .then((res) => res.json())
      .then((data) => {
        const person = data.find((p: any) => p.name === user.name);
        setLeaderboardRank(person ? person.rank : null);
      });
  }, [user.name]);

  // Calculate stats from actual submissions
  const stats = {
    totalSubmissions: userSubmissions.length,
    publishedSubmissions: userSubmissions.filter((s) => s.status === "published").length,
    totalLikes: userSubmissions.reduce((sum, s) => sum + (Array.isArray(s.likes) ? s.likes.length : 0), 0),
    totalComments: userSubmissions.reduce((sum, s) => sum + (Array.isArray(s.comments) ? s.comments.length : 0), 0),
    totalViews: userSubmissions.reduce((sum, s) => sum + (s.views || 0), 0),
    likesThisWeek: userSubmissions
      .filter((s) => {
        const created = new Date(s.createdAt);
        const now = new Date();
        return now.getTime() - created.getTime() < 7 * 24 * 60 * 60 * 1000;
      })
      .reduce((sum, s) => sum + (Array.isArray(s.likes) ? s.likes.length : 0), 0),
    commentsThisWeek: userSubmissions
      .filter((s) => {
        const created = new Date(s.createdAt);
        const now = new Date();
        return now.getTime() - created.getTime() < 7 * 24 * 60 * 60 * 1000;
      })
      .reduce((sum, s) => sum + (Array.isArray(s.comments) ? s.comments.length : 0), 0),
    viewsThisWeek: userSubmissions
      .filter((s) => {
        const created = new Date(s.createdAt);
        const now = new Date();
        return now.getTime() - created.getTime() < 7 * 24 * 60 * 60 * 1000;
      })
      .reduce((sum, s) => sum + (s.views || 0), 0),
    publishedThisWeek: userSubmissions.filter((s) => {
      const created = new Date(s.createdAt);
      const now = new Date();
      return s.status === "published" && now.getTime() - created.getTime() < 7 * 24 * 60 * 60 * 1000;
    }).length,
    ranking: leaderboardRank,
    engagementRate:
      userSubmissions.length > 0
        ? Math.min(
            Math.round(
              (userSubmissions.reduce(
                (sum, s) => sum + (Array.isArray(s.likes) ? s.likes.length : 0) + (Array.isArray(s.comments) ? s.comments.length : 0),
                0
              ) /
                (userSubmissions.length * 10)) *
                100
            ),
            100
          )
        : 0,
    communityImpact:
      userSubmissions.length > 0
        ? Math.min(
            Math.round(
              (userSubmissions.reduce(
                (sum, s) =>
                  sum +
                  (s.views || 0) +
                  (Array.isArray(s.likes) ? s.likes.length : 0) +
                  (Array.isArray(s.comments) ? s.comments.length : 0),
                0
              ) /
                (userSubmissions.length * 10)) *
                100
            ),
            100
          )
        : 0,
  };
  const [notifications, setNotifications] = useState({
    postLikes: true,
    postComments: true,
    statusUpdates: true,
    weeklyDigest: false,
  });

  const handleDownloadStats = async (endpoint: string, filename: string) => {
    try {
      const res = await fetch(endpoint, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          // Remove the Accept header since we're not requesting CSV anymore
        },
      });

      if (!res.ok) throw new Error("Download failed");

      // Get the response as a blob (for binary data like Excel files)
      const blob = await res.blob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up URL object
      URL.revokeObjectURL(url);

      toast.success("Download started successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download statistics");
    }
  };

  const [viewingSubmission, setViewingSubmission] = useState<any>(null);
  const [editingSubmission, setEditingSubmission] = useState<any>(null);

  const handleDeleteSubmission = (submissionId: number, submissionTitle: string) => {
    if (onDeleteSubmission) {
      onDeleteSubmission(submissionId);
      toast.success(`"${submissionTitle}" has been deleted successfully.`);
    }
  };

  // const handlePublishDraft = (submissionId: number, submissionTitle: string) => {
  //   if (onPublishDraft) {
  //     onPublishDraft(submissionId);
  //     toast.success(`"${submissionTitle}" has been published successfully! It's now live in the community feed.`);
  //   }
  // };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="h-4 w-4" />;
      case "draft":
        return <Edit className="h-4 w-4" />;
      default:
        return <Edit className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* User Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl sm:text-2xl">Welcome back, {user.name}!</CardTitle>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                {user.department} • Employee ID: {user.employeeId}
              </p>
            </div>
            <Badge className="bg-purple-100 text-purple-800 text-base sm:text-lg px-3 py-1 sm:px-4 sm:py-2">Rank #{stats.ranking}</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold">{stats.totalSubmissions}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Eye className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <Progress
                value={stats.totalSubmissions > 0 ? (stats.publishedSubmissions / stats.totalSubmissions) * 100 : 0}
                className="h-2"
              />
              <p className="text-xs text-gray-500 mt-1">{stats.publishedThisWeek} published this week</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Likes</p>
                <p className="text-2xl font-bold">{stats.totalLikes}</p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <Heart className="h-4 w-4 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">+{stats.likesThisWeek} this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Comments</p>
                <p className="text-2xl font-bold">{stats.totalComments}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">+{stats.commentsThisWeek} new</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Views</p>
                <p className="text-2xl font-bold">{stats.totalViews}</p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Eye className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">+{stats.viewsThisWeek} this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="submissions" className="space-y-6">
        <TabsList className="w-full flex">
          <TabsTrigger value="submissions" className="flex-1 text-xs sm:text-sm">
            My Submissions
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1 text-xs sm:text-sm">
            Analytics
          </TabsTrigger>
          {user.role === "admin" && (
            <TabsTrigger value="admin" className="flex-1 text-xs sm:text-sm">
              Admin Tools
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="submissions" className="space-y-4">
          {userSubmissions.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <p className="text-gray-500 mb-4">You haven't made any submissions yet.</p>
                <p className="text-sm text-gray-400">Create your first submission to see it here!</p>
              </CardContent>
            </Card>
          ) : (
            userSubmissions.map((submission) => (
              <Card key={submission.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg sm:text-base line-clamp-1">{submission.title}</h3>
                        <Badge className={getStatusColor(submission.status) + " self-start sm:self-center"}>
                          {getStatusIcon(submission.status)}
                          <span className="ml-1 capitalize">{submission.status}</span>
                        </Badge>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-600 mb-3">
                        <span>{submission.category}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Submitted {new Date(submission.timestamp).toLocaleDateString()}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="capitalize">{submission.type}</span>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span>{Array.isArray(submission.likes) ? submission.likes.length : 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{Array.isArray(submission.comments) ? submission.comments.length : 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{submission.views}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-start sm:justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-initial"
                        onClick={() => setViewingSubmission(submission)}>
                        <Eye className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-initial"
                        onClick={() => setEditingSubmission(submission)}>
                        <Edit className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      {submission.status === "draft" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="default"
                              size="sm"
                              className="flex-1 sm:flex-initial bg-green-600 hover:bg-green-700 text-white">
                              <Send className="h-4 w-4 sm:mr-2" />
                              <span className="hidden sm:inline">Publish</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-[95vw] rounded-lg">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Publish Draft</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you ready to publish "{submission.title}"? Once published, it will be visible to everyone in the
                                community feed and cannot be unpublished.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
                              <AlertDialogCancel className="m-0">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-green-600 hover:bg-green-700 m-0"
                                onClick={() => setEditingSubmission(submission)}>
                                Publish Now
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="flex-1 sm:flex-initial text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-[95vw] rounded-lg">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Submission</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{submission.title}"? This action cannot be undone and will permanently remove
                              your submission from the platform.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
                            <AlertDialogCancel className="m-0">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700 m-0"
                              onClick={() => handleDeleteSubmission(submission._id, submission.title)}>
                              Delete Submission
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Engagement Rate</span>
                  <span className="text-sm text-gray-600">{stats.engagementRate}%</span>
                </div>
                <Progress value={stats.engagementRate} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Publishing Rate</span>
                  <span className="text-sm text-gray-600">
                    {stats.totalSubmissions > 0 ? Math.round((stats.publishedSubmissions / stats.totalSubmissions) * 100) : 0}%
                  </span>
                </div>
                <Progress
                  value={stats.totalSubmissions > 0 ? (stats.publishedSubmissions / stats.totalSubmissions) * 100 : 0}
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Community Impact</span>
                  <span className="text-sm text-gray-600">{stats.communityImpact}%</span>
                </div>
                <Progress value={stats.communityImpact} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="post-likes" className="text-sm font-medium">
                  Notify when posts receive likes
                </Label>
                <Switch
                  id="post-likes"
                  checked={notifications.postLikes}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, postLikes: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="post-comments" className="text-sm font-medium">
                  Notify when posts receive comments
                </Label>
                <Switch
                  id="post-comments"
                  checked={notifications.postComments}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, postComments: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="status-updates" className="text-sm font-medium">
                  Post activity updates
                </Label>
                <Switch
                  id="status-updates"
                  checked={notifications.statusUpdates}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, statusUpdates: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="weekly-digest" className="text-sm font-medium">
                  Weekly digest email
                </Label>
                <Switch
                  id="weekly-digest"
                  checked={notifications.weeklyDigest}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {user.role === "admin" && (
          <TabsContent value="admin" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Admin Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={() => handleDownloadStats("/api/stats/getStats", "overall_stats.xlsx")} className="w-full">
                  Download Overall Stats
                </Button>
                <Button onClick={() => handleDownloadStats("/api/stats/getPostsStats", "overall_Posts_stats.xlsx")} className="w-full">
                  Download Posts Stats
                </Button>
                <Button
                  onClick={() => handleDownloadStats("/api/stats/getStatsByParticipantType", "overall_participant_type.xlsx")}
                  className="w-full">
                  Download Stats by Participant Type
                </Button>
                <Button onClick={() => handleDownloadStats("/api/stats/getUserStats", "user_stats.xlsx")} className="w-full">
                  Download User Stats
                </Button>
                <Button onClick={() => handleDownloadStats("/api/stats/getLikesStats", "user_stats.xlsx")} className="w-full">
                  Download Likes Stats
                </Button>
                <Button onClick={() => handleDownloadStats("/api/stats/getEntryStats", "entry_stats.xlsx")} className="w-full">
                  Download Entry Stats
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* View Post Modal */}
      <ViewPostModal isOpen={!!viewingSubmission} onClose={() => setViewingSubmission(null)} submission={viewingSubmission} user={user} />

      {/* Edit Post Modal */}
      <EditPostModal
        isOpen={!!editingSubmission}
        onClose={() => setEditingSubmission(null)}
        submission={editingSubmission}
        user={user}
        onUpdate={(submissionId, updatedData) => {
          if (onUpdateSubmission) {
            onUpdateSubmission(submissionId, updatedData);
          }
          setEditingSubmission(null);
        }}
      />
    </div>
  );
}
