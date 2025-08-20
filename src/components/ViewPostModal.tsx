import { useState, useRef, useEffect } from "react";
import { X, Heart, MessageCircle, Share2, Eye, ZoomIn, Play, Pause, Maximize, Volume2, VolumeX } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AspectRatio } from "./ui/aspect-ratio";
import { Slider } from "./ui/slider";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CommentsModal } from "./CommentsModal";
import { ShareModal } from "./ShareModal";

interface ViewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: any;
  user: any;
  onLike?: (submissionId: number, newLikeCount: number) => void;
}

export function ViewPostModal({ isOpen, onClose, submission, user, onLike }: ViewPostModalProps) {
  const [isFullSizeOpen, setIsFullSizeOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingFullscreen, setIsPlayingFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTimeFullscreen, setCurrentTimeFullscreen] = useState(0);
  const [durationFullscreen, setDurationFullscreen] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isSeekingFullscreen, setIsSeekingFullscreen] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeFullscreen, setVolumeFullscreen] = useState(100);
  const [isMutedFullscreen, setIsMutedFullscreen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(submission?.likes || 0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = (videoElement: HTMLVideoElement | null, setPlayingState: (playing: boolean) => void) => {
    if (!videoElement) return;

    if (videoElement.paused) {
      videoElement.play();
      setPlayingState(true);
    } else {
      videoElement.pause();
      setPlayingState(false);
    }
  };

  const handleFullscreen = (videoElement: HTMLVideoElement | null) => {
    if (!videoElement) return;

    if (videoElement.requestFullscreen) {
      videoElement.requestFullscreen();
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = (videoElement: HTMLVideoElement | null, value: number[]) => {
    if (!videoElement || !value.length || isNaN(value[0])) return;

    const seekTime = Math.max(0, Math.min(value[0], videoElement.duration || 0));
    videoElement.currentTime = seekTime;
  };

  const handleSeekStart = (isFullscreenMode: boolean = false) => {
    if (isFullscreenMode) {
      setIsSeekingFullscreen(true);
    } else {
      setIsSeeking(true);
    }
  };

  const handleSeekEnd = (isFullscreenMode: boolean = false) => {
    if (isFullscreenMode) {
      setIsSeekingFullscreen(false);
    } else {
      setIsSeeking(false);
    }
  };

  const handleVolumeChange = (videoElement: HTMLVideoElement | null, value: number[], isFullscreenMode: boolean = false) => {
    if (!videoElement || !value.length) return;

    const newVolume = value[0];
    videoElement.volume = newVolume / 100;

    if (isFullscreenMode) {
      setVolumeFullscreen(newVolume);
      if (newVolume === 0) {
        setIsMutedFullscreen(true);
      } else if (isMutedFullscreen) {
        setIsMutedFullscreen(false);
      }
    } else {
      setVolume(newVolume);
      if (newVolume === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
      }
    }
  };

  const handleMuteToggle = (videoElement: HTMLVideoElement | null, isFullscreenMode: boolean = false) => {
    if (!videoElement) return;

    if (isFullscreenMode) {
      const newMutedState = !isMutedFullscreen;
      setIsMutedFullscreen(newMutedState);
      videoElement.muted = newMutedState;

      if (newMutedState) {
        videoElement.volume = 0;
      } else {
        videoElement.volume = volumeFullscreen / 100;
      }
    } else {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      videoElement.muted = newMutedState;

      if (newMutedState) {
        videoElement.volume = 0;
      } else {
        videoElement.volume = volume / 100;
      }
    }
  };

  const handleLike = () => {
    if (submission.status !== "published") return; // Only allow likes on published posts

    const newIsLiked = !isLiked;
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;

    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);

    // Call the parent handler to update the submission in the main state
    if (onLike) {
      onLike(submission.id, newLikeCount);
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !submission) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(videoElement.duration || 0);
    };
    const handleSeeked = () => {
      setCurrentTime(videoElement.currentTime);
      setIsSeeking(false);
    };
    const handleTimeUpdate = () => {
      if (!isSeeking && !isNaN(videoElement.currentTime)) {
        setCurrentTime(videoElement.currentTime);
      }
    };
    const handleLoadedMetadata = () => {
      if (!isNaN(videoElement.duration) && isFinite(videoElement.duration)) {
        setDuration(videoElement.duration);
      }
      // Initialize volume
      videoElement.volume = volume / 100;
      videoElement.muted = isMuted;
      // Ensure current time is synced
      setCurrentTime(videoElement.currentTime || 0);
    };

    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("pause", handlePause);
    videoElement.addEventListener("ended", handleEnded);
    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    videoElement.addEventListener("seeked", handleSeeked);

    return () => {
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("pause", handlePause);
      videoElement.removeEventListener("ended", handleEnded);
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.removeEventListener("seeked", handleSeeked);
    };
  }, [submission, isSeeking]);

  useEffect(() => {
    const videoElement = fullscreenVideoRef.current;
    if (!videoElement || !submission) return;

    const handlePlay = () => setIsPlayingFullscreen(true);
    const handlePause = () => setIsPlayingFullscreen(false);
    const handleEnded = () => {
      setIsPlayingFullscreen(false);
      setCurrentTimeFullscreen(videoElement.duration || 0);
    };
    const handleSeeked = () => {
      setCurrentTimeFullscreen(videoElement.currentTime);
      setIsSeekingFullscreen(false);
    };
    const handleTimeUpdate = () => {
      if (!isSeekingFullscreen && !isNaN(videoElement.currentTime)) {
        setCurrentTimeFullscreen(videoElement.currentTime);
      }
    };
    const handleLoadedMetadata = () => {
      if (!isNaN(videoElement.duration) && isFinite(videoElement.duration)) {
        setDurationFullscreen(videoElement.duration);
      }
      // Initialize volume for fullscreen (sync with main player)
      videoElement.volume = volumeFullscreen / 100;
      videoElement.muted = isMutedFullscreen;
      // Ensure current time is synced
      setCurrentTimeFullscreen(videoElement.currentTime || 0);
    };

    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("pause", handlePause);
    videoElement.addEventListener("ended", handleEnded);
    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    videoElement.addEventListener("seeked", handleSeeked);

    return () => {
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("pause", handlePause);
      videoElement.removeEventListener("ended", handleEnded);
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.removeEventListener("seeked", handleSeeked);
    };
  }, [submission, isSeekingFullscreen]);

  // Sync volume states when opening fullscreen
  useEffect(() => {
    if (isFullSizeOpen) {
      setVolumeFullscreen(volume);
      setIsMutedFullscreen(isMuted);
    }
  }, [isFullSizeOpen, volume, isMuted]);

  // Reset like state when submission changes
  useEffect(() => {
    if (submission) {
      setLikeCount(submission.likes || 0);
      setIsLiked(false); // Reset to not liked when modal opens
    }
  }, [submission]);

  if (!submission) return null;

  const isVideo = submission.type === "video";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl p-0 h-auto w-[90vw]">
        <DialogTitle className="sr-only">{submission.title} - Submission Details</DialogTitle>
        <DialogDescription className="sr-only">
          View full details of the submission including media, engagement stats, and author information.
        </DialogDescription>

        <AspectRatio ratio={16 / 9} className="bg-white rounded-lg overflow-hidden">
          <div className="h-full flex">
            {/* Left side - Media */}
            <div className="flex-1 relative">
              {isVideo ? (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    src={submission.content}
                    className="w-full h-full object-cover"
                    poster={submission.content}
                    onClick={() => handlePlayPause(videoRef.current, setIsPlaying)}>
                    Your browser does not support the video tag.
                  </video>

                  {/* Video Controls Overlay - Only show when playing */}
                  <div
                    className={`absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 transition-opacity duration-200 ${
                      isPlaying ? "opacity-0 hover:opacity-100" : "opacity-0 pointer-events-none"
                    }`}>
                    <div className="space-y-3">
                      {/* Timeline Slider */}
                      <div className="flex items-center space-x-3">
                        <span className="text-white font-mono text-sm min-w-[40px]">{formatTime(currentTime)}</span>
                        <Slider
                          value={[currentTime]}
                          max={duration || 0}
                          step={0.1}
                          className="flex-1"
                          onValueChange={(value) => handleSeek(videoRef.current, value)}
                          onValueCommit={() => handleSeekEnd(false)}
                          onPointerDown={() => handleSeekStart(false)}
                        />
                        <span className="text-white font-mono text-sm min-w-[40px]">{formatTime(duration)}</span>
                      </div>

                      {/* Control Buttons */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20 p-2"
                            onClick={() => handlePlayPause(videoRef.current, setIsPlaying)}>
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20 p-2"
                            onClick={() => handleMuteToggle(videoRef.current, false)}>
                            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                          </Button>

                          <div className="flex items-center space-x-2 w-20">
                            <Slider
                              value={[isMuted ? 0 : volume]}
                              max={100}
                              step={1}
                              className="flex-1"
                              onValueChange={(value) => handleVolumeChange(videoRef.current, value, false)}
                            />
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20 p-2"
                          onClick={() => setIsFullSizeOpen(true)}>
                          <Maximize className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <ImageWithFallback src={submission.content} alt={submission.title} className="w-full h-full object-cover" />
              )}
            </div>

            {/* Right side - Content */}
            <div className="w-[480px] flex flex-col bg-white border-l">
              {/* Header */}
              <div className="p-6 border-b flex-shrink-0">
                <div className="flex items-center space-x-4">
                  {/* Author Profile Picture */}
                  <div className="relative">
                    <ImageWithFallback
                      src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`}
                      alt={`${submission.author.name} profile`}
                      className="h-14 w-14 rounded-full object-cover ring-2 ring-purple-200"
                    />
                    <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full ring-2 ring-white flex items-center justify-center">
                      <div className="h-2 w-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">{submission.author.name}</p>
                    <p className="text-sm text-gray-600">
                      {submission.author.department} • {submission.timestamp}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {submission.participantType}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Title and Description */}
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg leading-tight pr-4">{submission.title}</h3>
                    <Badge variant="secondary" className="flex-shrink-0">
                      {submission.category}
                    </Badge>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">{submission.description}</p>

                  {/* Post Image Preview */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Posted Content:</p>
                    <div className="rounded-lg overflow-hidden border border-gray-200">
                      {isVideo ? (
                        <div className="relative group">
                          <video
                            src={submission.content}
                            className="w-full h-32 object-cover cursor-pointer"
                            poster={submission.content}
                            onClick={() => setIsFullSizeOpen(true)}>
                            Your browser does not support the video tag.
                          </video>
                          <div
                            className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center cursor-pointer pointer-events-none group-hover:pointer-events-auto"
                            onClick={() => setIsFullSizeOpen(true)}>
                            <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ) : (
                        <div className="relative group">
                          <ImageWithFallback
                            src={submission.content}
                            alt={submission.title}
                            className="w-full h-32 object-cover hover:scale-105 transition-transform cursor-pointer"
                            onClick={() => setIsFullSizeOpen(true)}
                          />
                          <div
                            className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center cursor-pointer"
                            onClick={() => setIsFullSizeOpen(true)}>
                            <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Engagement Stats - Only show for published posts */}
                {submission.status === "published" && (
                  <div className="flex items-center space-x-6 py-4 border-t border-b">
                    <button className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-2 transition-colors" onClick={handleLike}>
                      <Heart
                        className={`h-5 w-5 transition-all duration-200 ${
                          isLiked ? "text-red-500 fill-red-500" : "text-red-500 fill-transparent hover:fill-red-100"
                        }`}
                      />
                      <span className="font-medium">{likeCount}</span>
                      <span className="text-gray-600">likes</span>
                    </button>
                    <button
                      className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-2 transition-colors"
                      onClick={() => setIsCommentsModalOpen(true)}>
                      <MessageCircle className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">{submission.comments}</span>
                      <span className="text-gray-600">comments</span>
                    </button>
                    <div className="flex items-center space-x-2">
                      <Eye className="h-5 w-5 text-gray-500" />
                      <span className="font-medium">{submission.views || 0}</span>
                      <span className="text-gray-600">views</span>
                    </div>
                  </div>
                )}

                {/* Draft Notice - Only show for draft posts */}
                {submission.status === "draft" && (
                  <div className="py-4 border-t border-b">
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-yellow-800">Draft Post</p>
                        <p className="text-sm text-yellow-700">
                          This post is saved as a draft and only visible to you. Publish it from your dashboard to share with the community.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons - Only show for published posts */}
                {submission.status === "published" && (
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" size="default" onClick={() => setIsShareModalOpen(true)}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                )}

                {/* Author Info Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <ImageWithFallback
                      src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face`}
                      alt={`${submission.author.name} profile`}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-purple-200"
                    />
                    <div className="flex-1">
                      <p className="font-medium">Posted by {submission.author.name}</p>
                      <p className="text-sm text-gray-600">{submission.author.department} Department</p>
                    </div>
                  </div>
                </div>

                {/* Submission Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Status</p>
                      <Badge className={submission.status === "published" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {submission.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Content Type</p>
                      <p className="capitalize">{submission.type}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Department</p>
                      <p>{submission.department}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Posted</p>
                      <p>{submission.timestamp}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AspectRatio>
      </DialogContent>

      {/* Full Size Media Viewer */}
      <Dialog open={isFullSizeOpen} onOpenChange={setIsFullSizeOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <DialogTitle className="sr-only">Full Size View - {submission.title}</DialogTitle>
          <DialogDescription className="sr-only">Full size view of the submission content</DialogDescription>

          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={() => setIsFullSizeOpen(false)}>
              <X className="h-6 w-6" />
            </Button>

            {/* Media Content */}
            <div className="w-full h-full flex items-center justify-center p-8">
              {isVideo ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <video
                    ref={fullscreenVideoRef}
                    src={submission.content}
                    className="max-w-full max-h-full object-contain"
                    autoPlay
                    poster={submission.content}
                    onClick={() => handlePlayPause(fullscreenVideoRef.current, setIsPlayingFullscreen)}>
                    Your browser does not support the video tag.
                  </video>

                  {/* Custom Video Controls for Fullscreen */}
                  <div
                    className={`absolute bottom-20 left-8 right-8 bg-black/60 backdrop-blur-sm rounded-lg p-4 transition-opacity duration-200 ${
                      isPlayingFullscreen ? "opacity-0 hover:opacity-100" : "opacity-0 pointer-events-none"
                    }`}>
                    <div className="space-y-4">
                      {/* Timeline Slider */}
                      <div className="flex items-center space-x-4">
                        <span className="text-white font-mono min-w-[50px]">{formatTime(currentTimeFullscreen)}</span>
                        <Slider
                          value={[currentTimeFullscreen]}
                          max={durationFullscreen || 0}
                          step={0.1}
                          className="flex-1"
                          onValueChange={(value) => handleSeek(fullscreenVideoRef.current, value)}
                          onValueCommit={() => handleSeekEnd(true)}
                          onPointerDown={() => handleSeekStart(true)}
                        />
                        <span className="text-white font-mono min-w-[50px]">{formatTime(durationFullscreen)}</span>
                      </div>

                      {/* Control Buttons */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20 p-3"
                            onClick={() => handlePlayPause(fullscreenVideoRef.current, setIsPlayingFullscreen)}>
                            {isPlayingFullscreen ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20 p-3"
                            onClick={() => handleMuteToggle(fullscreenVideoRef.current, true)}>
                            {isMutedFullscreen ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                          </Button>

                          <div className="flex items-center space-x-3 w-32">
                            <Slider
                              value={[isMutedFullscreen ? 0 : volumeFullscreen]}
                              max={100}
                              step={1}
                              className="flex-1"
                              onValueChange={(value) => handleVolumeChange(fullscreenVideoRef.current, value, true)}
                            />
                            <span className="text-white text-sm font-mono min-w-[35px]">
                              {isMutedFullscreen ? "0%" : `${Math.round(volumeFullscreen)}%`}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20 p-3"
                          onClick={() => handleFullscreen(fullscreenVideoRef.current)}>
                          <Maximize className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <ImageWithFallback src={submission.content} alt={submission.title} className="max-w-full max-h-full object-contain" />
              )}
            </div>

            {/* Media Info Overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="font-semibold text-lg">{submission.title}</h3>
                  <p className="text-sm text-gray-300">
                    by {submission.author.name} • {submission.timestamp}
                  </p>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {submission.category}
                </Badge>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Comments Modal - Only for published posts */}
      {submission.status === "published" && (
        <CommentsModal isOpen={isCommentsModalOpen} onClose={() => setIsCommentsModalOpen(false)} submission={submission} user={user} />
      )}

      {/* Share Modal - Only for published posts */}
      {submission.status === "published" && (
        <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} submission={submission} />
      )}
    </Dialog>
  );
}
