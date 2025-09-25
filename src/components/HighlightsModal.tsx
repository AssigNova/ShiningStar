import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Sparkles } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const lastSeasonImages = [
  "https://d1b9dnxh4j1pm.cloudfront.net/1758792233783.JPG",
  "https://d1b9dnxh4j1pm.cloudfront.net/1758792215421.JPG",
  "https://d1b9dnxh4j1pm.cloudfront.net/1758792380757.JPG",
  "https://d1b9dnxh4j1pm.cloudfront.net/1758792470092.JPG",
  "https://d1b9dnxh4j1pm.cloudfront.net/1758792503712.JPG",
  "https://d1b9dnxh4j1pm.cloudfront.net/1758792570756.JPG",
  "https://d1b9dnxh4j1pm.cloudfront.net/1758792621976.JPG",
  "https://d1b9dnxh4j1pm.cloudfront.net/1758792661676.JPG",
  "https://d1b9dnxh4j1pm.cloudfront.net/1758792690526.JPG",
  "https://d1b9dnxh4j1pm.cloudfront.net/PSP_0245.JPG",
  "https://d1b9dnxh4j1pm.cloudfront.net/PSP_9671.JPG",
  "https://d1b9dnxh4j1pm.cloudfront.net/PSP_9685.JPG",
  "https://d1b9dnxh4j1pm.cloudfront.net/PSP_9760.JPG",
  "https://d1b9dnxh4j1pm.cloudfront.net/PSP_9781.JPG",
  "https://d1b9dnxh4j1pm.cloudfront.net/PSP_9794.JPG",
  "https://d1b9dnxh4j1pm.cloudfront.net/PSP_9809.JPG",
  "https://d1b9dnxh4j1pm.cloudfront.net/PSP_9841.JPG",
  "https://d1b9dnxh4j1pm.cloudfront.net/PSP_9952.JPG",
  "https://d1b9dnxh4j1pm.cloudfront.net/PSP_9956.JPG",
  "https://d1b9dnxh4j1pm.cloudfront.net/PSP_9957.JPG",
  "https://d1b9dnxh4j1pm.cloudfront.net/PSP_9964.JPG",
];

interface HighlightsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HighlightsModal({ isOpen, onClose }: HighlightsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-screen max-h-[90vh] overflow-y-auto p-6 bg-white rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl font-semibold mb-6">
            <Sparkles className="h-6 w-6 mr-2 text-yellow-500" />
            Last Season&apos;s Highlights
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-8">
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
