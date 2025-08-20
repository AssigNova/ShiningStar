import { useState } from "react";
import { Heart, MessageCircle, Share2, Filter, TrendingUp, Clock, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { AspectRatio } from "./ui/aspect-ratio";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CommentsModal } from "./CommentsModal";
import { ShareModal } from "./ShareModal";
import { ViewPostModal } from "./ViewPostModal";

interface MainFeedProps {
  onOpenHighlights: () => void;
  user: any;
  submissions: any[];
  onLikeSubmission?: (submissionId: number, newLikeCount: number) => void;
}

export function MainFeed({ onOpenHighlights, user, submissions, onLikeSubmission }: MainFeedProps) {
  const [filter, setFilter] = useState<"mostLoved" | "new" | "all">("mostLoved");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [likedSubmissions, setLikedSubmissions] = useState<Set<number>>(new Set());
  const [submissionLikes, setSubmissionLikes] = useState<{ [key: number]: number }>(() => {
    const likes: { [key: number]: number } = {};
    submissions.forEach((submission) => {
      likes[submission.id] = submission.likes;
    });
    return likes;
  });

  const categories = [
    "All Categories",
    "Innovation",
    "Team Collaboration",
    "Family & Community",
    "Sustainability",
    "Customer Excellence",
    "Leadership",
  ];

  const filteredSubmissions = submissions
    .filter((submission) => {
      // Only show published submissions in the main feed
      if (submission.status !== "published") return false;
      if (selectedCategory !== "all" && submission.category !== selectedCategory) return false;
      return true;
    })
    .sort((a, b) => {
      if (filter === "mostLoved") return (submissionLikes[b.id] || b.likes) - (submissionLikes[a.id] || a.likes);
      if (filter === "new") {
        // For "Just now" entries, prioritize them
        if (a.timestamp === "Just now" && b.timestamp !== "Just now") return -1;
        if (b.timestamp === "Just now" && a.timestamp !== "Just now") return 1;
        if (a.timestamp === "Just now" && b.timestamp === "Just now") return b.id - a.id;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      return 0;
    });

  const handleOpenComments = (submission: any) => {
    setSelectedSubmission(submission);
    setIsCommentsModalOpen(true);
  };

  const handleOpenShare = (submission: any) => {
    setSelectedSubmission(submission);
    setIsShareModalOpen(true);
  };

  const handleToggleLike = (submissionId: number) => {
    setLikedSubmissions((prev) => {
      const newLiked = new Set(prev);
      const newLikeCount = newLiked.has(submissionId) ? submissionLikes[submissionId] - 1 : submissionLikes[submissionId] + 1;

      if (newLiked.has(submissionId)) {
        newLiked.delete(submissionId);
      } else {
        newLiked.add(submissionId);
      }

      setSubmissionLikes((prevLikes) => ({
        ...prevLikes,
        [submissionId]: newLikeCount,
      }));

      // Notify parent component
      if (onLikeSubmission) {
        onLikeSubmission(submissionId, newLikeCount);
      }

      return newLiked;
    });
  };

  const handleViewPost = (submission: any) => {
    setSelectedSubmission(submission);
    setIsViewModalOpen(true);
  };

  const handleModalLike = (submissionId: number, newLikeCount: number) => {
    setSubmissionLikes((prevLikes) => ({
      ...prevLikes,
      [submissionId]: newLikeCount,
    }));

    // Update liked submissions set
    setLikedSubmissions((prev) => {
      const newLiked = new Set(prev);
      const currentLikeCount = submissionLikes[submissionId];
      if (newLikeCount > currentLikeCount) {
        newLiked.add(submissionId);
      } else {
        newLiked.delete(submissionId);
      }
      return newLiked;
    });

    // Notify parent component
    if (onLikeSubmission) {
      onLikeSubmission(submissionId, newLikeCount);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Feed */}
      <div className="lg:col-span-3 space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Community Feed</h2>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Tabs value={filter} onValueChange={(value) => setFilter(value as any)}>
                  <TabsList>
                    <TabsTrigger value="mostLoved" className="text-sm">
                      <Heart className="h-3 w-3 mr-1" />
                      Most Loved
                    </TabsTrigger>
                    <TabsTrigger value="new" className="text-sm">
                      <Clock className="h-3 w-3 mr-1" />
                      New
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 pt-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === (category === "All Categories" ? "all" : category) ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category === "All Categories" ? "all" : category)}>
                  {category}
                </Button>
              ))}
            </div>
          </CardHeader>
        </Card>

        {/* Submissions */}
        <div className="space-y-6">
          {filteredSubmissions.map((submission) => (
            <Card key={submission.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {submission.author.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{submission.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{submission.author.name}</span>
                        <span>•</span>
                        <span>{submission.author.department}</span>
                        <span>•</span>
                        <span>{submission.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{submission.category}</Badge>
                    <Badge variant="outline">{submission.participantType}</Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-700">{submission.description}</p>

                {/* Media Content */}
                <div className="rounded-lg overflow-hidden cursor-pointer" onClick={() => handleViewPost(submission)}>
                  <AspectRatio ratio={16 / 9}>
                    <ImageWithFallback
                      src={submission.content}
                      alt={submission.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </AspectRatio>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`transition-colors ${
                        likedSubmissions.has(submission.id) ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-red-500"
                      }`}
                      onClick={() => handleToggleLike(submission.id)}>
                      <Heart
                        className={`h-4 w-4 mr-2 transition-all ${
                          likedSubmissions.has(submission.id) ? "fill-current" : "fill-transparent"
                        }`}
                      />
                      {submissionLikes[submission.id] || submission.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-blue-500"
                      onClick={() => handleOpenComments(submission)}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {submission.comments}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-green-500"
                      onClick={() => handleOpenShare(submission)}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>

                  <Button variant="ghost" size="sm" className="text-purple-600">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Internal Shoutout
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Last Season's Highlights */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
              Last Season's Highlights
            </h3>
          </CardHeader>
          <CardContent>
            <Button
              onClick={onOpenHighlights}
              variant="outline"
              className="w-full justify-center hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition-colors">
              <Sparkles className="h-4 w-4 mr-2" />
              View All Highlights
            </Button>
            <p className="text-sm text-gray-500 mt-2 text-center">Discover the amazing submissions from Season 2</p>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Season 3 Stats</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Submissions</span>
              <span className="font-medium">127</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Active Participants</span>
              <span className="font-medium">89</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Categories</span>
              <span className="font-medium">6</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Likes</span>
              <span className="font-medium">1,234</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comments Modal */}
      <CommentsModal
        isOpen={isCommentsModalOpen}
        onClose={() => setIsCommentsModalOpen(false)}
        submission={selectedSubmission}
        user={user}
      />

      {/* Share Modal */}
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} submission={selectedSubmission} />

      {/* View Post Modal */}
      <ViewPostModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        submission={selectedSubmission}
        user={user}
        onLike={handleModalLike}
      />
    </div>
  );
}
