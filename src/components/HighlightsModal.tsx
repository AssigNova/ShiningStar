import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Heart, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const lastSeasonHighlights = [
  {
    id: 1,
    title: "Winner: Digital Transformation Story",
    author: "Team Alpha",
    likes: 234,
    category: "Innovation",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop&auto=format",
    description: "An innovative approach to digital transformation that revolutionized our workflow processes and enhanced team collaboration across departments."
  },
  {
    id: 2,
    title: "People's Choice: Community Garden Project",
    author: "Green Team",
    likes: 189,
    category: "Sustainability",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&auto=format",
    description: "A beautiful community garden initiative that brought employees together while promoting sustainable practices and environmental awareness."
  },
  {
    id: 3,
    title: "Rising Star: New Employee Integration",
    author: "Jennifer Wilson",
    likes: 156,
    category: "Team Collaboration",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop&auto=format",
    description: "An outstanding program designed to help new employees integrate seamlessly into our company culture and build meaningful connections."
  }
];

interface HighlightsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HighlightsModal({ isOpen, onClose }: HighlightsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
            Last Season's Highlights
          </DialogTitle>
          <DialogDescription>
            Celebrating the outstanding submissions from Shining Stars Season 2
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {lastSeasonHighlights.map((highlight) => (
            <Card key={highlight.id} className="overflow-hidden shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-xl">{highlight.title}</h3>
                    <p className="text-gray-600 mt-1">by {highlight.author}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{highlight.category}</Badge>
                    <div className="flex items-center text-red-500">
                      <Heart className="h-5 w-5 mr-1 fill-current" />
                      <span className="font-medium text-lg">{highlight.likes}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={highlight.image}
                    alt={highlight.title}
                    className="w-full h-80 object-cover"
                  />
                </div>
                <p className="text-gray-700 leading-relaxed">{highlight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}