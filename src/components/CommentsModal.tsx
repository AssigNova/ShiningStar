import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { MessageCircle, Send, Heart, Reply, MoreHorizontal, Trash2, Edit3, Check, X } from "lucide-react";
import { toast } from "sonner";

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: any;
  user: any;
}

export function CommentsModal({ isOpen, onClose, submission, user }: CommentsModalProps) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(submission?.comments || []);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editingReplyText, setEditingReplyText] = useState("");

  useEffect(() => {
    setComments(submission?.comments || []);
  }, [submission?.comments]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    try {
      const res = await fetch(`/api/posts/${submission._id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, text: newComment }),
      });
      const data = await res.json();
      if (res.ok) {
        setComments(data.comments || []);
        setNewComment("");
        toast.success("Comment added successfully!");
      } else {
        toast.error(data.message || "Failed to add comment");
      }
    } catch {
      toast.error("Failed to add comment");
    }
  };

  const handleLikeComment = (commentId: number) => {
    if (!user?._id) return toast.error("Login required");
    const comment = comments.find((c) => c._id === commentId);
    const liked = comment?.likes?.includes(user._id);
    fetch(`/api/posts/${submission._id}/comments/${commentId}/${liked ? "unlike" : "like"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.likes !== undefined) {
          setComments(
            comments.map((c) =>
              c._id === commentId
                ? { ...c, likes: liked ? c.likes.filter((id: string) => id !== user._id) : [...(c.likes || []), user._id] }
                : c
            )
          );
        } else {
          toast.error(data.message || "Failed to update like");
        }
      })
      .catch(() => toast.error("Failed to update like"));
  };

  const handleDeleteComment = (commentId: number) => {
    setComments(comments.filter((comment) => comment._id !== commentId));
    toast.success("Comment deleted successfully");
  };

  const handleEditComment = (comment: any) => {
    setEditingCommentId(comment._id);
    setEditingText(comment.text);
  };

  const handleSaveEdit = (commentId: number) => {
    if (!editingText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setComments(comments.map((comment) => (comment._id === commentId ? { ...comment, content: editingText.trim() } : comment)));

    setEditingCommentId(null);
    setEditingText("");
    toast.success("Comment updated successfully");
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingText("");
  };

  const handleReply = (commentId: number) => {
    setReplyingToId(commentId);
    setReplyText("");
  };

  const handleSubmitReply = (parentCommentId: number) => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply");
      return;
    }
    fetch(`/api/posts/${submission._id}/comments/${parentCommentId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user._id,
        author: user.name,
        department: user.department,
        content: replyText,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.replies) {
          setComments(comments.map((comment) => (comment._id === parentCommentId ? { ...comment, replies: data.replies } : comment)));
          setReplyingToId(null);
          setReplyText("");
          toast.success("Reply added successfully!");
        } else {
          toast.error(data.message || "Failed to add reply");
        }
      })
      .catch(() => toast.error("Failed to add reply"));
  };

  const handleCancelReply = () => {
    setReplyingToId(null);
    setReplyText("");
  };

  const handleLikeReply = (parentCommentId: number, replyId: number) => {
    if (!user?._id) return toast.error("Login required");
    const parentComment = comments.find((c) => c._id === parentCommentId);
    const reply = parentComment?.replies?.find((r) => r._id === replyId);
    const liked = Array.isArray(reply?.likes) && reply.likes.includes(user._id);
    fetch(`/api/posts/${submission._id}/comments/${parentCommentId}/replies/${replyId}/${liked ? "unlike" : "like"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.likes !== undefined) {
          setComments(
            comments.map((comment) =>
              comment._id === parentCommentId
                ? {
                    ...comment,
                    replies:
                      comment.replies?.map((r) =>
                        r._id === replyId
                          ? { ...r, likes: liked ? r.likes.filter((id: string) => id !== user._id) : [...(r.likes || []), user._id] }
                          : r
                      ) || [],
                  }
                : comment
            )
          );
        } else {
          toast.error(data.message || "Failed to update like");
        }
      })
      .catch(() => toast.error("Failed to update like"));
  };

  const handleEditReply = (reply: any) => {
    setEditingReplyId(reply._id);
    setEditingReplyText(reply.content);
  };

  const handleSaveReplyEdit = (parentCommentId: number, replyId: number) => {
    if (!editingReplyText.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    setComments(
      comments.map((comment) =>
        comment._id === parentCommentId
          ? {
              ...comment,
              replies:
                comment.replies?.map((reply) => (reply._id === replyId ? { ...reply, content: editingReplyText.trim() } : reply)) || [],
            }
          : comment
      )
    );

    setEditingReplyId(null);
    setEditingReplyText("");
    toast.success("Reply updated successfully");
  };

  const handleCancelReplyEdit = () => {
    setEditingReplyId(null);
    setEditingReplyText("");
  };

  const handleDeleteReply = (parentCommentId: number, replyId: number) => {
    setComments(
      comments.map((comment) =>
        comment._id === parentCommentId
          ? {
              ...comment,
              replies: comment.replies?.filter((reply) => reply._id !== replyId) || [],
            }
          : comment
      )
    );
    toast.success("Reply deleted successfully");
  };

  const getInitials = (name: string | undefined | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (!submission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-blue-500" />
            <span>Comments</span>
          </DialogTitle>
          <DialogDescription>
            Comments for "{submission.title}" by {submission.author.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Post Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{submission.title}</h3>
              <Badge variant="secondary">{submission.category}</Badge>
            </div>
            <p className="text-gray-600 text-sm">{submission.description}</p>
          </div>

          {/* Add Comment */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-purple-100 text-purple-600">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSubmitComment} size="sm">
                <Send className="h-4 w-4 mr-2" />
                Post Comment
              </Button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">
              {comments.length} Comment{comments.length !== 1 ? "s" : ""}
            </h4>

            <ScrollArea className="max-h-96">
              <div className="space-y-4 pr-2">
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No comments yet. Be the first to comment!</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id || comment._id} className="flex items-start space-x-3 p-3 bg-white border rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 text-blue-600">{getInitials(comment.user?.name)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{comment.user?.name || "Unknown"}</span>
                            <Badge variant="outline" className="text-xs">
                              {comment.user?.department || ""}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ""}
                            </span>
                          </div>

                          {/* Three dot menu - only show for current user's comments and not in edit mode */}
                          {comment.author === user.name && editingCommentId !== comment._id && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-32">
                                <DropdownMenuItem onClick={() => handleEditComment(comment)} className="cursor-pointer">
                                  <Edit3 className="h-3 w-3 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteComment(comment._id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer">
                                  <Trash2 className="h-3 w-3 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>

                        {editingCommentId === comment._id ? (
                          <div className="space-y-2 mb-2">
                            <Textarea
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="text-sm resize-none"
                              rows={3}
                              autoFocus
                            />
                            <div className="flex items-center space-x-2">
                              <Button size="sm" onClick={() => handleSaveEdit(comment._id)} className="h-7 px-2 text-xs">
                                <Check className="h-3 w-3 mr-1" />
                                Save
                              </Button>
                              <Button variant="outline" size="sm" onClick={handleCancelEdit} className="h-7 px-2 text-xs">
                                <X className="h-3 w-3 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">{comment.text}</p>
                        )}

                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikeComment(comment._id)}
                            className={`text-xs ${
                              Array.isArray(comment.likes) && comment.likes.includes(user._id)
                                ? "text-red-500 hover:text-red-600"
                                : "text-gray-500 hover:text-red-500"
                            }`}>
                            <Heart
                              className={`h-3 w-3 mr-1 ${
                                Array.isArray(comment.likes) && comment.likes.includes(user._id) ? "fill-current" : ""
                              }`}
                            />
                            {Array.isArray(comment.likes) ? comment.likes.length : 0}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-gray-500 hover:text-blue-500"
                            onClick={() => handleReply(comment._id)}>
                            <Reply className="h-3 w-3 mr-1" />
                            Reply
                          </Button>
                        </div>

                        {/* Reply Interface */}
                        {replyingToId === comment._id && (
                          <div className="mt-3 ml-8 bg-gray-50 rounded-lg p-3">
                            <div className="flex items-start space-x-2 mb-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">{getInitials(user.name)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="text-xs text-gray-600 mb-1">Replying to {comment.author}</p>
                                <Textarea
                                  placeholder="Write a reply..."
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  rows={2}
                                  className="text-sm resize-none"
                                />
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 justify-end">
                              <Button variant="outline" size="sm" onClick={handleCancelReply} className="h-7 px-2 text-xs">
                                Cancel
                              </Button>
                              <Button size="sm" onClick={() => handleSubmitReply(comment._id)} className="h-7 px-2 text-xs">
                                <Send className="h-3 w-3 mr-1" />
                                Reply
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-3 ml-8 space-y-3">
                            {comment.replies.map((reply) => (
                              <div key={reply._id} className="flex items-start space-x-3 p-2 bg-gray-50 rounded-lg">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="bg-green-100 text-green-600 text-xs">
                                    {getInitials(reply.author)}
                                  </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium text-gray-900 text-sm">{reply.author}</span>
                                      <Badge variant="outline" className="text-xs px-1 py-0">
                                        {reply.department}
                                      </Badge>
                                      <span className="text-xs text-gray-500">{reply.timestamp}</span>
                                    </div>

                                    {/* Three dot menu for replies - only show for current user's replies and not in edit mode */}
                                    {reply.author === user.name && editingReplyId !== reply._id && (
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600">
                                            <MoreHorizontal className="h-3 w-3" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-32">
                                          <DropdownMenuItem onClick={() => handleEditReply(reply)} className="cursor-pointer">
                                            <Edit3 className="h-3 w-3 mr-2" />
                                            Edit
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() => handleDeleteReply(comment._id, reply._id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer">
                                            <Trash2 className="h-3 w-3 mr-2" />
                                            Delete
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    )}
                                  </div>

                                  {editingReplyId === reply._id ? (
                                    <div className="space-y-2 mb-2">
                                      <Textarea
                                        value={editingReplyText}
                                        onChange={(e) => setEditingReplyText(e.target.value)}
                                        className="text-sm resize-none"
                                        rows={2}
                                        autoFocus
                                      />
                                      <div className="flex items-center space-x-2">
                                        <Button
                                          size="sm"
                                          onClick={() => handleSaveReplyEdit(comment._id, reply._id)}
                                          className="h-6 px-2 text-xs">
                                          <Check className="h-3 w-3 mr-1" />
                                          Save
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={handleCancelReplyEdit} className="h-6 px-2 text-xs">
                                          <X className="h-3 w-3 mr-1" />
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-gray-700 text-sm leading-relaxed mb-2">{reply.content}</p>
                                  )}

                                  {editingReplyId !== reply._id && (
                                    <div className="flex items-center space-x-3">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleLikeReply(comment._id, reply._id)}
                                        className={`text-xs ${
                                          Array.isArray(reply.likes) && reply.likes.includes(user._id)
                                            ? "text-red-500 hover:text-red-600"
                                            : "text-gray-500 hover:text-red-500"
                                        }`}>
                                        <Heart
                                          className={`h-3 w-3 mr-1 ${
                                            Array.isArray(reply.likes) && reply.likes.includes(user._id) ? "fill-current" : ""
                                          }`}
                                        />
                                        {Array.isArray(reply.likes) ? reply.likes.length : 0}
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
