import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Sparkles } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

import img1 from "./assets/PSP_0002.JPG";
import img2 from "./assets/PSP_0040.JPG";
import img3 from "./assets/PSP_0044.JPG";
import img4 from "./assets/PSP_0048.JPG";
import img5 from "./assets/PSP_0050.JPG";
import img6 from "./assets/PSP_0064.JPG";
import img7 from "./assets/PSP_0072.JPG";
import img8 from "./assets/PSP_0126.JPG";
import img9 from "./assets/PSP_0145.JPG";
import img10 from "./assets/PSP_0245.JPG";
import img11 from "./assets/PSP_9671.JPG";
import img12 from "./assets/PSP_9685.JPG";
import img13 from "./assets/PSP_9760.JPG";
import img14 from "./assets/PSP_9781.JPG";
import img15 from "./assets/PSP_9794.JPG";
import img16 from "./assets/PSP_9809.JPG";
import img17 from "./assets/PSP_9841.JPG";
import img18 from "./assets/PSP_9952.JPG";
import img19 from "./assets/PSP_9956.JPG";
import img20 from "./assets/PSP_9957.JPG";
import img21 from "./assets/PSP_9964.JPG";

const lastSeasonImages = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
  img12,
  img13,
  img14,
  img15,
  img16,
  img17,
  img18,
  img19,
  img20,
  img21,
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
          {lastSeasonImages.map((image, idx) => (
            <div
              key={idx}
              className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-[1.02]">
              <ImageWithFallback src={image} alt={`Highlight ${idx + 1}`} className="w-full h-auto object-contain bg-gray-50" />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
