import { useState } from "react";
import { X, Facebook, MessageCircle, Linkedin, Link2, Copy, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: {
    id: number;
    title: string;
    description: string;
    content: string;
    author: {
      name: string;
      department: string;
    };
  } | null;
}

export function ShareModal({ isOpen, onClose, submission }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!submission) return null;

  // Use _id if available, else fallback to id
  const postId = (submission as any)._id || submission.id;
  const postUrl = `https://itcshiningstars.cosmosevents.in/posts/${postId}`;
  const shareText = `Check out this amazing submission: "${submission.title}" by ${submission.author.name} from ${submission.author.department}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText("Checkout this submission on ITC Shining Stars Season 3: " + postUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500 hover:bg-green-600",
      action: () => {
        const url = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${postUrl}`)}`;
        window.open(url, "_blank");
      },
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600 hover:bg-blue-700",
      action: () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
        window.open(url, "_blank");
      },
    },
    {
      name: "X (Twitter)",
      icon: X,
      color: "bg-black hover:bg-gray-800",
      action: () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`;
        window.open(url, "_blank");
      },
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-700 hover:bg-blue-800",
      action: () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
        window.open(url, "_blank");
      },
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="flex items-center justify-center gap-2">
            <Link2 className="h-5 w-5 text-purple-600" />
            Share this post
          </DialogTitle>
          <DialogDescription className="text-center">
            Share this submission with your friends and colleagues on social media or copy the link to share anywhere.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Post Preview */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100">
            <h4 className="font-medium text-gray-900 text-center">{submission.title}</h4>
            <p className="text-sm text-gray-600 mt-1 text-center">
              by {submission.author.name} • {submission.author.department}
            </p>
          </div>

          {/* Social Media Options */}
          <div className="space-y-4">
            <h5 className="font-medium text-gray-900 text-center">Share to social media</h5>
            <div className="grid grid-cols-2 gap-3">
              {shareOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Button
                    key={option.name}
                    variant="outline"
                    className={`${option.color} text-white border-0 transition-all duration-200 hover:scale-105 hover:shadow-md flex items-center justify-center py-3`}
                    onClick={option.action}>
                    <IconComponent className="h-4 w-4 mr-2" />
                    {option.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Copy Link */}
          <div className="space-y-4">
            <h5 className="font-medium text-gray-900 text-center">Or copy link</h5>
            <div className="flex items-center gap-2 w-full">
              <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-600 font-mono break-all border border-gray-200">
                Checkout this submission on ITC Shining Stars Season 3: <br />
                <br />
                {postUrl}
              </div>
              <Button
                variant="outline"
                onClick={handleCopyLink}
                className={`transition-all duration-200 hover:scale-105 flex-shrink-0 px-3 py-2 ${
                  copied ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" : "hover:bg-gray-50 hover:border-gray-300"
                }`}>
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-center pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-8 py-2 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
