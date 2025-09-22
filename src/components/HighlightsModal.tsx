import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Sparkles } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const lastSeasonImages = [
  "/PSP_0002.jpg",
  "/PSP_0040.jpg",
  "/PSP_0044.jpg",
  "/PSP_0048.jpg",
  "/PSP_0050.jpg",
  "/PSP_0064.jpg",
  "/PSP_0072.jpg",
  "/PSP_0126.jpg",
  "/PSP_0145.jpg",
  "/PSP_0245.jpg",
  "/PSP_9671.jpg",
  "/PSP_9685.jpg",
  "/PSP_9760.jpg",
  "/PSP_9781.jpg",
  "/PSP_9794.jpg",
  "/PSP_9809.jpg",
  "/PSP_9841.jpg",
  "/PSP_9952.jpg",
  "/PSP_9956.jpg",
  "/PSP_9957.jpg",
  "/PSP_9964.jpg",
];

interface HighlightsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HighlightsModal({ isOpen, onClose }: HighlightsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-6 bg-white rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl font-semibold mb-6">
            <Sparkles className="h-6 w-6 mr-2 text-yellow-500" />
            Last Season&apos;s Highlights
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {lastSeasonImages.map((src, idx) => (
            <div
              key={idx}
              className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-[1.02]">
              <ImageWithFallback src={src} alt={`Highlight ${idx + 1}`} className="w-full h-auto object-contain bg-gray-50" />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
