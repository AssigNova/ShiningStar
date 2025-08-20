import { useState } from "react";
import { Send, Bot, User, Paperclip, Smile } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
  senderName: string;
}

export function ChatModal({ isOpen, onClose, user }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! Welcome to the Support Chat. How can I assist you today?",
      sender: "support",
      timestamp: new Date(),
      senderName: "Support Team",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const quickResponses = ["Upload issues", "Login problems", "Submission guidelines", "Category questions", "Technical support"];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
      senderName: user.name,
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    // Simulate support response
    setTimeout(() => {
      const supportResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `Thank you for reaching out, ${user.name}. I understand your concern about "${newMessage}". Our support team will assist you shortly. Is there any additional information you'd like to provide?`,
        sender: "support",
        timestamp: new Date(),
        senderName: "Support Team",
      };
      setMessages((prev) => [...prev, supportResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleQuickResponse = (response: string) => {
    setNewMessage(response);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[600px] p-0 flex flex-col">
        <DialogHeader className="p-4 border-b bg-purple-600 text-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-white">Support Chat</DialogTitle>
              <DialogDescription className="text-purple-100">
                We're here to help with any questions or issues you may have.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Quick Responses */}
        <div className="p-4 border-b">
          <p className="text-sm text-gray-600 mb-3">Quick topics:</p>
          <div className="flex flex-wrap gap-2">
            {quickResponses.map((response, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-purple-100 hover:text-purple-700 transition-colors"
                onClick={() => handleQuickResponse(response)}>
                {response}
              </Badge>
            ))}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${
                    message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback
                      className={`text-xs ${message.sender === "user" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}>
                      {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      message.sender === "user" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === "user" ? "text-purple-200" : "text-gray-500"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gray-100 text-gray-700">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 text-gray-900 rounded-2xl px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-gray-400">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            <Button variant="ghost" size="icon" className="text-gray-400">
              <Smile className="h-4 w-4" />
            </Button>
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()} className="bg-purple-600 hover:bg-purple-700">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
