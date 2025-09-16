import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2, Clock, Sparkles, Play } from "lucide-react";
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
  onLikeSubmission?: (submissionId: string, userId: string) => void;
  searchResults: any[];
}

export function MainFeed({ onOpenHighlights, user, submissions, onLikeSubmission, searchResults }: MainFeedProps) {
  const [filter, setFilter] = useState<"mostLoved" | "new" | "all">("mostLoved");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [likedSubmissions, setLikedSubmissions] = useState<Set<string>>(() => {
    const liked = new Set<string>();
    submissions.forEach((submission) => {
      if (Array.isArray(submission.likes) && submission.likes.includes(user._id)) {
        liked.add(submission._id);
      }
    });
    return liked;
  });
  const [submissionLikes, setSubmissionLikes] = useState<{ [key: string]: number }>(() => {
    const likes: { [key: string]: number } = {};
    submissions.forEach((submission) => {
      likes[submission._id] = Array.isArray(submission.likes) ? submission.likes.length : 0;
    });
    return likes;
  });

  useEffect(() => {
    const newLiked = new Set<string>();
    const newLikesCount: { [key: string]: number } = {};

    submissions.forEach((submission) => {
      newLikesCount[submission._id] = Array.isArray(submission.likes) ? submission.likes.length : 0;
      if (Array.isArray(submission.likes) && submission.likes.includes(user._id)) {
        newLiked.add(submission._id);
      }
    });

    setLikedSubmissions(newLiked);
    setSubmissionLikes(newLikesCount);
  }, [submissions, user._id]);

  const categories = [
    "All Categories",
    "Voice of ITC (Individual Performance)",
    "Dance ITC Dance (Individual Performance)",
    "Strokes of a Genius (Individual Performance)",
    "Generations in Harmony (Family Group Performance)",
    "Reel Stars (Only Employees)",
    "Generation in Unity (Group Employee Performance/ Interdepartmental)",
  ];

  const filteredSubmissions = (searchResults.length > 0 ? searchResults : submissions)
    .filter((submission) => {
      if (submission.status !== "published") return false;
      if (selectedCategory !== "all" && submission.category !== selectedCategory) return false;
      return true;
    })
    .sort((a, b) => {
      if (filter === "mostLoved") return (submissionLikes[b._id] || 0) - (submissionLikes[a._id] || 0);
      if (filter === "new") {
        if (a.timestamp === "Just now" && b.timestamp !== "Just now") return -1;
        if (b.timestamp === "Just now" && a.timestamp !== "Just now") return 1;
        if (a.timestamp === "Just now" && b.timestamp === "Just now") return b._id.localeCompare(a._id);
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

  const handleToggleLike = (submissionId: string) => {
    const isLiked = likedSubmissions.has(submissionId);
    const url = `/api/posts/${submissionId}/${isLiked ? "unlike" : "like"}`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user._id }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update like status");
        return res.json();
      })
      .then(() => {
        if (onLikeSubmission) {
          onLikeSubmission(submissionId, user._id);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleViewPost = (submission: any) => {
    setSelectedSubmission(submission);
    setIsViewModalOpen(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4">
      {/* Main Feed */}
      <div className="lg:col-span-3 space-y-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-center text-[#8200db] leading-normal tracking-wide">
          Welcome to ITC’s Shining Stars Season 3
        </h1>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Community Feed</h2>
              <div className="flex items-center space-x-2">
                <Tabs value={filter} onValueChange={(value) => setFilter(value as any)}>
                  <TabsList className="flex-wrap">
                    <TabsTrigger value="mostLoved" className="text-xs sm:text-sm">
                      <Heart className="h-3 w-3 mr-1" />
                      Most Loved
                    </TabsTrigger>
                    <TabsTrigger value="new" className="text-xs sm:text-sm">
                      <Clock className="h-3 w-3 mr-1" />
                      New
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Category Filter - Horizontal Scroll for Mobile */}
            <div className="mt-4 overflow-x-auto pb-2">
              <div className="flex gap-2 w-max min-w-full">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === (category === "All Categories" ? "all" : category) ? "default" : "outline"}
                    size="sm"
                    className="whitespace-nowrap text-xs sm:text-sm"
                    onClick={() => setSelectedCategory(category === "All Categories" ? "all" : category)}>
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Submissions */}
        <div className="space-y-6">
          {filteredSubmissions.map((submission) => (
            <Card key={submission._id} className="overflow-hidden">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {submission.author.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold truncate">{submission.title}</h3>
                      <div className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
                        <span className="truncate">{submission.author.name}</span>
                        <span>•</span>
                        <span className="truncate">{submission.author.department}</span>
                        <span>•</span>
                        {/* <span>{submission.timestamp}</span> */}
                        <span>{new Date(submission.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-end">
                    <Badge variant="secondary" className="text-xs max-w-full truncate">
                      {submission.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {submission.participantType}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-700 break-words">{submission.description}</p>

                {/* Media Content */}
                <div className="rounded-lg overflow-hidden cursor-pointer" onClick={() => handleViewPost(submission)}>
                  <AspectRatio ratio={16 / 9}>
                    {submission.mediaType === "video" || (submission.content && submission.content.match(/\.(mp4|webm|ogg)$/i)) ? (
                      <div className="relative w-full h-full">
                        <video
                          src={submission.content}
                          poster={submission.thumbnail || undefined}
                          className="w-full h-full object-cover bg-black"
                        />
                        {/* Play button overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                          <div className="bg-black/50 rounded-full p-2">
                            <Play
                              // onClick={(e) => {
                              //   e.stopPropagation();
                              //   const parent = e.currentTarget.closest("div.relative");
                              //   const video = parent?.querySelector("video");
                              //   if (video) {
                              //     if (video.paused) {
                              //       video.play();
                              //     } else {
                              //       video.pause();
                              //     }
                              //   }
                              // }}
                              className="h-8 w-8 text-white fill-white"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <ImageWithFallback
                        src={submission.content}
                        alt={submission.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </AspectRatio>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`transition-colors p-2 sm:px-3 sm:py-2 ${
                        likedSubmissions.has(submission._id) ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-red-500"
                      }`}
                      onClick={() => handleToggleLike(submission._id)}>
                      <Heart
                        className={`h-4 w-4 sm:mr-2 transition-all ${
                          likedSubmissions.has(submission._id) ? "fill-current" : "fill-transparent"
                        }`}
                      />
                      <span className="hidden sm:inline">
                        {submissionLikes[submission._id] ?? (Array.isArray(submission.likes) ? submission.likes.length : 0)}
                      </span>
                      <span className="sm:hidden text-xs">
                        {submissionLikes[submission._id] ?? (Array.isArray(submission.likes) ? submission.likes.length : 0)}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-blue-500 p-2 sm:px-3 sm:py-2"
                      onClick={() => handleOpenComments(submission)}>
                      <MessageCircle className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">{Array.isArray(submission.comments) ? submission.comments.length : 0}</span>
                      <span className="sm:hidden text-xs">{Array.isArray(submission.comments) ? submission.comments.length : 0}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-green-500 p-2 sm:px-3 sm:py-2"
                      onClick={() => handleOpenShare(submission)}>
                      <Share2 className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Share</span>
                    </Button>
                  </div>
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

        {/* Quick Stats (Dynamic) */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">ITC Shining Stars Season 3 Stats</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Submissions</span>
              <span className="font-medium">{submissions.filter((s) => s.status === "published").length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Active Participants</span>
              <span className="font-medium">
                {new Set(submissions.filter((s) => s.status === "published").map((s) => s.author?.name)).size}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Categories</span>
              <span className="font-medium">
                {new Set(submissions.filter((s) => s.status === "published").map((s) => s.category)).size}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Likes</span>
              <span className="font-medium">
                {submissions
                  .filter((s) => s.status === "published")
                  .reduce((sum, s) => sum + (Array.isArray(s.likes) ? s.likes.length : 0), 0)}
              </span>
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
      <ViewPostModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} submission={selectedSubmission} user={user} />
    </div>
  );
}
