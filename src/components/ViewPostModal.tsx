import { useState, useRef, useEffect } from "react";
import { X, Share2, Eye, ZoomIn, Play, Pause, Maximize, Volume2, VolumeX } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ShareModal } from "./ShareModal";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface ViewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: any;
  user: any;
}

export function ViewPostModal({ isOpen, onClose, submission, user }: ViewPostModalProps) {
  // Increment post views when modal opens and submission changes
  useEffect(() => {
    if (isOpen && submission && submission._id) {
      fetch(`/api/posts/${submission._id}/view`, { method: "POST" });
    }
  }, [isOpen, submission]);

  const [isFullSizeOpen, setIsFullSizeOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingFullscreen, setIsPlayingFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTimeFullscreen, setCurrentTimeFullscreen] = useState(0);
  const [durationFullscreen, setDurationFullscreen] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isSeekingFullscreen, setIsSeekingFullscreen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeFullscreen, setVolumeFullscreen] = useState(100);
  const [isMutedFullscreen, setIsMutedFullscreen] = useState(false);
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

  if (!submission) return null;

  const isVideo = (() => {
    if (!submission) return false;
    const t = (submission.type || submission.mediaType || "").toString().toLowerCase();
    if (t === "video" || t === "reel" || t === "mp4" || t === "webm") return true;
    const content = (submission.content || "").toString();
    if (/^data:video\//i.test(content)) return true;
    if (content.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) return true;
    if (submission.isVideo === true) return true;
    return false;
  })();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl p-0 h-auto w-[90vw] md:w-full md:max-w-4xl lg:max-w-7xl">
        <DialogTitle className="sr-only">{submission.title} - Submission Details</DialogTitle>
        <DialogDescription className="sr-only">
          View full details of the submission including media, engagement stats, and author information.
        </DialogDescription>

        <div className="flex flex-col lg:flex-row h-full max-h-[90vh] md:max-h-[80vh]">
          {/* Left side - Media */}
          <div className="flex-1 relative bg-gray-900 lg:max-w-[70%]">
            {isVideo ? (
              <div className="relative w-full h-full">
                <video
                  src={submission.content}
                  controls
                  // Conditionally apply the attribute:
                  // If the user is NOT an admin, include controlsList="nodownload"
                  // If the user IS an admin, the attribute is omitted (null or undefined)
                  controlsList={user.role == "admin" ? "nodownload" : undefined}
                  poster={submission.thumbnail || undefined}
                  className="w-full h-full object-contain bg-black"
                />

                {/* Video Controls Overlay */}
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
              <div className="h-full flex items-center justify-center p-4">
                <ImageWithFallback
                  src={submission.content}
                  alt={submission.title}
                  className="w-full h-auto max-h-[50vh] md:max-h-full object-contain cursor-pointer"
                  onClick={() => setIsFullSizeOpen(false)}
                />
              </div>
            )}
          </div>

          {/* Right side - Content */}
          <div className="w-full lg:w-[30%] flex flex-col bg-white border-t lg:border-l overflow-y-auto max-h-[40vh] lg:max-h-full">
            {/* Header */}
            <div className="p-4 border-b flex-shrink-0">
              <div className="flex items-center space-x-3">
                {/* Author Profile Picture */}
                <div className="relative flex-shrink-0">
                  <Avatar>
                    <AvatarFallback>
                      {submission.author.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 md:h-5 md:w-5 bg-green-500 rounded-full ring-2 ring-white flex items-center justify-center">
                    <div className="h-1 w-1 md:h-2 md:w-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{submission.author.name}</p>
                  <p className="text-xs md:text-sm text-gray-600 truncate">
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Title and Description */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-base md:text-lg leading-tight pr-2">{submission.title}</h3>
                  <Badge variant="secondary" className="flex-shrink-0 text-xs">
                    {submission.category}
                  </Badge>
                </div>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-3">{submission.description}</p>

                {/* Post Image Preview */}
                <div className="mb-3">
                  <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">Posted Content:</p>
                  <div className="rounded-lg overflow-hidden border border-gray-200">
                    {isVideo ? (
                      <div className="relative group">
                        <video
                          src={submission.content}
                          className="w-full h-24 md:h-32 object-cover cursor-pointer"
                          poster={submission.content}
                          onClick={() => setIsFullSizeOpen(true)}>
                          Your browser does not support the video tag.
                        </video>
                        <div
                          className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center cursor-pointer pointer-events-none group-hover:pointer-events-auto"
                          onClick={() => setIsFullSizeOpen(true)}>
                          <ZoomIn className="h-5 w-5 md:h-6 md:w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ) : (
                      <div className="relative group">
                        <ImageWithFallback
                          src={submission.content}
                          alt={submission.title}
                          className="w-full h-24 md:h-32 object-cover hover:scale-105 transition-transform cursor-pointer"
                          onClick={() => setIsFullSizeOpen(true)}
                        />
                        <div
                          className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center cursor-pointer"
                          onClick={() => setIsFullSizeOpen(true)}>
                          <ZoomIn className="h-5 w-5 md:h-6 md:w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* View Stats */}
              {submission.status === "published" && (
                <div className="flex items-center space-x-4 py-3 border-t border-b">
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <Eye className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
                    <span className="font-medium text-sm md:text-base">{submission.views || 0}</span>
                    <span className="text-gray-600 text-sm md:text-base">views</span>
                  </div>
                </div>
              )}

              {/* Draft Notice */}
              {submission.status === "draft" && (
                <div className="py-3 border-t border-b">
                  <div className="flex items-center space-x-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="h-2 w-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="font-medium text-yellow-800 text-sm">Draft Post</p>
                      <p className="text-xs text-yellow-700">This post is saved as a draft and only visible to you.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {submission.status === "published" && (
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="text-xs md:text-sm" onClick={() => setIsShareModalOpen(true)}>
                    <Share2 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    Share
                  </Button>
                </div>
              )}

              {/* Author Info Section */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <ImageWithFallback
                    src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face`}
                    alt={`${submission.author.name} profile`}
                    className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover ring-2 ring-purple-200 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-sm md:text-base truncate">Posted by {submission.author.name}</p>
                    <p className="text-xs text-gray-600 truncate">{submission.author.department} Department</p>
                  </div>
                </div>
              </div>

              {/* Submission Details */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Status</p>
                    <Badge
                      className={`text-xs ${
                        submission.status === "published" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}>
                      {submission.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Content Type</p>
                    <p className="text-xs md:text-sm capitalize">{submission.type}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Department</p>
                    <p className="text-xs md:text-sm truncate">{submission.department}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Posted</p>
                    <p className="text-xs md:text-sm">{submission.timestamp}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
              className="absolute top-2 right-2 md:top-4 md:right-4 z-10 text-white hover:bg-white/20"
              onClick={() => setIsFullSizeOpen(false)}>
              <X className="h-5 w-5 md:h-6 md:w-6" />
            </Button>

            {/* Media Content */}
            <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
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
                    className={`absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 bg-black/60 backdrop-blur-sm rounded-lg p-3 md:p-4 transition-opacity duration-200 ${
                      isPlayingFullscreen ? "opacity-0 hover:opacity-100" : "opacity-0 pointer-events-none"
                    }`}>
                    <div className="space-y-3 md:space-y-4">
                      {/* Timeline Slider */}
                      <div className="flex items-center space-x-2 md:space-x-4">
                        <span className="text-white font-mono text-xs md:text-sm min-w-[40px] md:min-w-[50px]">
                          {formatTime(currentTimeFullscreen)}
                        </span>
                        <Slider
                          value={[currentTimeFullscreen]}
                          max={durationFullscreen || 0}
                          step={0.1}
                          className="flex-1"
                          onValueChange={(value) => handleSeek(fullscreenVideoRef.current, value)}
                          onValueCommit={() => handleSeekEnd(true)}
                          onPointerDown={() => handleSeekStart(true)}
                        />
                        <span className="text-white font-mono text-xs md:text-sm min-w-[40px] md:min-w-[50px]">
                          {formatTime(durationFullscreen)}
                        </span>
                      </div>

                      {/* Control Buttons */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 md:space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20 p-2 md:p-3"
                            onClick={() => handlePlayPause(fullscreenVideoRef.current, setIsPlayingFullscreen)}>
                            {isPlayingFullscreen ? <Pause className="h-4 w-4 md:h-6 md:w-6" /> : <Play className="h-4 w-4 md:h-6 md:w-6" />}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20 p-2 md:p-3"
                            onClick={() => handleMuteToggle(fullscreenVideoRef.current, true)}>
                            {isMutedFullscreen ? (
                              <VolumeX className="h-4 w-4 md:h-5 md:w-5" />
                            ) : (
                              <Volume2 className="h-4 w-4 md:h-5 md:w-5" />
                            )}
                          </Button>

                          <div className="flex items-center space-x-2 md:space-x-3 w-24 md:w-32">
                            <Slider
                              value={[isMutedFullscreen ? 0 : volumeFullscreen]}
                              max={100}
                              step={1}
                              className="flex-1"
                              onValueChange={(value) => handleVolumeChange(fullscreenVideoRef.current, value, true)}
                            />
                            <span className="text-white text-xs md:text-sm font-mono min-w-[30px] md:min-w-[35px]">
                              {isMutedFullscreen ? "0%" : `${Math.round(volumeFullscreen)}%`}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20 p-2 md:p-3"
                          onClick={() => handleFullscreen(fullscreenVideoRef.current)}>
                          <Maximize className="h-4 w-4 md:h-6 md:w-6" />
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
            <div className="absolute bottom-2 left-2 right-2 md:bottom-4 md:left-4 md:right-4 bg-black/60 backdrop-blur-sm rounded-lg p-2 md:p-4">
              <div className="flex items-center justify-between text-white">
                <div className="truncate pr-2">
                  <h3 className="font-semibold text-sm md:text-lg truncate">{submission.title}</h3>
                  <p className="text-xs md:text-sm text-gray-300 truncate">
                    by {submission.author.name} • {submission.timestamp}
                  </p>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs flex-shrink-0">
                  {submission.category}
                </Badge>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Modal - Only for published posts */}
      {submission.status === "published" && (
        <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} submission={submission} />
      )}
    </Dialog>
  );
}
