import { Heart, MessageCircle, Upload, Trophy, Bell, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";

interface NotificationModalProps {
  user: any; // Replace 'any' with a more specific type if you know the shape of 'user'
  isOpen: boolean;
  onClose: () => void;
}

const mockNotifications = [
  {
    id: 1,
    type: "like",
    title: "New Like on Your Submission",
    message: 'Sarah Johnson liked your "Digital Marketing Campaign" submission',
    timestamp: "5 minutes ago",
    isRead: false,
    user: { name: "Sarah Johnson", initials: "SJ" },
  },
  {
    id: 2,
    type: "comment",
    title: "New Comment",
    message: 'Mike Chen commented: "Amazing work on the creative execution!"',
    timestamp: "1 hour ago",
    isRead: false,
    user: { name: "Mike Chen", initials: "MC" },
  },
  {
    id: 3,
    type: "submission",
    title: "New Submission in Your Category",
    message: "A new submission has been posted in Marketing category",
    timestamp: "2 hours ago",
    isRead: true,
    user: null,
  },
  {
    id: 4,
    type: "achievement",
    title: "Congratulations!",
    message: "Your submission reached #1 in the Marketing leaderboard",
    timestamp: "1 day ago",
    isRead: true,
    user: null,
  },
  {
    id: 5,
    type: "like",
    title: "Multiple Likes",
    message: 'Your "Brand Innovation Project" received 5 new likes',
    timestamp: "2 days ago",
    isRead: true,
    user: null,
  },
  {
    id: 6,
    type: "system",
    title: "Platform Update",
    message: "New features have been added to the submission dashboard",
    timestamp: "3 days ago",
    isRead: true,
    user: null,
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "like":
      return <Heart className="h-4 w-4 text-red-500" />;
    case "comment":
      return <MessageCircle className="h-4 w-4 text-blue-500" />;
    case "submission":
      return <Upload className="h-4 w-4 text-green-500" />;
    case "achievement":
      return <Trophy className="h-4 w-4 text-yellow-500" />;
    case "system":
      return <Bell className="h-4 w-4 text-purple-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

export function NotificationModal({ user, isOpen, onClose }: NotificationModalProps) {
  const unreadCount = mockNotifications.filter((n) => !n.isRead).length;
  console.log(user);
  const markAllAsRead = () => {
    // In a real app, this would make an API call
    console.log("Marking all notifications as read");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 mx-[29px] my-[0px]">
              <DialogTitle>Notifications</DialogTitle>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs px-[26px] py-[15px] mx-[21px] my-[30px] text-[15px] font-bold">
                  Mark all read
                </Button>
              )}
            </div>
          </div>
          <DialogDescription>View your recent notifications and updates from the platform.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="p-2">
            {mockNotifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {mockNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border-l-2 ${
                      notification.isRead ? "border-l-transparent" : "border-l-blue-500 bg-blue-50/50"
                    }`}>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {notification.user ? (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">{notification.user.initials}</AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm truncate">{notification.title}</h4>
                          {!notification.isRead && <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />}
                        </div>

                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>

                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {notification.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-gray-50">
          <Button variant="outline" className="w-full" onClick={onClose}>
            View All Notifications
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
