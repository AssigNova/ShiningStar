import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { MessageCircle, Send, Heart, Reply, MoreHorizontal, Trash2, Edit3, Check, X } from 'lucide-react';
import { toast } from 'sonner';

// Mock comments data with replies
const mockComments = {
  1: [
    {
      id: 1,
      author: 'Sarah Wilson',
      department: 'HR',
      content: 'This is absolutely fantastic! Love the creativity and attention to detail.',
      timestamp: '2 hours ago',
      likes: 12,
      isLiked: false,
      replies: [
        {
          id: 101,
          author: 'John Doe',
          department: 'Marketing',
          content: 'I completely agree! The detail work is impressive.',
          timestamp: '1 hour ago',
          likes: 3,
          isLiked: false
        }
      ]
    },
    {
      id: 2,
      author: 'Mike Chen',
      department: 'IT',
      content: 'Great work! This really shows the innovation we strive for at ITC.',
      timestamp: '4 hours ago',
      likes: 8,
      isLiked: true,
      replies: []
    },
    {
      id: 3,
      author: 'Priya Sharma',
      department: 'Marketing',
      content: 'Wow! This is exactly what we need to showcase our team spirit. Well done!',
      timestamp: '6 hours ago',
      likes: 15,
      isLiked: false,
      replies: [
        {
          id: 102,
          author: 'John Doe',
          department: 'Marketing',
          content: 'Thanks Priya! Team spirit was exactly what we were going for.',
          timestamp: '5 hours ago',
          likes: 5,
          isLiked: true
        },
        {
          id: 103,
          author: 'David Kumar',
          department: 'Operations',
          content: 'Absolutely! This captures our culture perfectly.',
          timestamp: '4 hours ago',
          likes: 2,
          isLiked: false
        }
      ]
    }
  ],
  2: [
    {
      id: 4,
      author: 'David Kumar',
      department: 'Operations',
      content: 'Beautiful work! The colors and composition are perfect.',
      timestamp: '1 hour ago',
      likes: 6,
      isLiked: true,
      replies: []
    },
    {
      id: 5,
      author: 'Lisa Anderson',
      department: 'Finance',
      content: 'This made my day! Such positive energy captured in this submission.',
      timestamp: '3 hours ago',
      likes: 9,
      isLiked: false,
      replies: []
    }
  ],
  3: [
    {
      id: 6,
      author: 'Raj Patel',
      department: 'Sales',
      content: 'Outstanding! This really represents what our company is all about.',
      timestamp: '30 minutes ago',
      likes: 4,
      isLiked: false,
      replies: []
    }
  ]
};

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: any;
  user: any;
}

export function CommentsModal({ isOpen, onClose, submission, user }: CommentsModalProps) {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(mockComments[submission?.id as keyof typeof mockComments] || []);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editingReplyText, setEditingReplyText] = useState('');

  const handleSubmitComment = () => {
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    const comment = {
      id: Date.now(),
      author: user.name,
      department: user.department,
      content: newComment,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false
    };

    setComments([comment, ...comments]);
    setNewComment('');
    toast.success('Comment added successfully!');
  };

  const handleLikeComment = (commentId: number) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          }
        : comment
    ));
  };

  const handleDeleteComment = (commentId: number) => {
    setComments(comments.filter(comment => comment.id !== commentId));
    toast.success('Comment deleted successfully');
  };

  const handleEditComment = (comment: any) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.content);
  };

  const handleSaveEdit = (commentId: number) => {
    if (!editingText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, content: editingText.trim() }
        : comment
    ));
    
    setEditingCommentId(null);
    setEditingText('');
    toast.success('Comment updated successfully');
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingText('');
  };

  const handleReply = (commentId: number) => {
    setReplyingToId(commentId);
    setReplyText('');
  };

  const handleSubmitReply = (parentCommentId: number) => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    const reply = {
      id: Date.now(),
      author: user.name,
      department: user.department,
      content: replyText,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false
    };

    setComments(comments.map(comment => 
      comment.id === parentCommentId 
        ? { ...comment, replies: [...(comment.replies || []), reply] }
        : comment
    ));
    
    setReplyingToId(null);
    setReplyText('');
    toast.success('Reply added successfully!');
  };

  const handleCancelReply = () => {
    setReplyingToId(null);
    setReplyText('');
  };

  const handleLikeReply = (parentCommentId: number, replyId: number) => {
    setComments(comments.map(comment => 
      comment.id === parentCommentId 
        ? {
            ...comment,
            replies: comment.replies?.map(reply => 
              reply.id === replyId 
                ? { 
                    ...reply, 
                    isLiked: !reply.isLiked,
                    likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1
                  }
                : reply
            ) || []
          }
        : comment
    ));
  };

  const handleEditReply = (parentCommentId: number, reply: any) => {
    setEditingReplyId(reply.id);
    setEditingReplyText(reply.content);
  };

  const handleSaveReplyEdit = (parentCommentId: number, replyId: number) => {
    if (!editingReplyText.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }

    setComments(comments.map(comment => 
      comment.id === parentCommentId 
        ? {
            ...comment,
            replies: comment.replies?.map(reply => 
              reply.id === replyId 
                ? { ...reply, content: editingReplyText.trim() }
                : reply
            ) || []
          }
        : comment
    ));
    
    setEditingReplyId(null);
    setEditingReplyText('');
    toast.success('Reply updated successfully');
  };

  const handleCancelReplyEdit = () => {
    setEditingReplyId(null);
    setEditingReplyText('');
  };

  const handleDeleteReply = (parentCommentId: number, replyId: number) => {
    setComments(comments.map(comment => 
      comment.id === parentCommentId 
        ? {
            ...comment,
            replies: comment.replies?.filter(reply => reply.id !== replyId) || []
          }
        : comment
    ));
    toast.success('Reply deleted successfully');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
                <AvatarFallback className="bg-purple-100 text-purple-600">
                  {getInitials(user.name)}
                </AvatarFallback>
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
              {comments.length} Comment{comments.length !== 1 ? 's' : ''}
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
                    <div key={comment.id} className="flex items-start space-x-3 p-3 bg-white border rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {getInitials(comment.author)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{comment.author}</span>
                            <Badge variant="outline" className="text-xs">
                              {comment.department}
                            </Badge>
                            <span className="text-xs text-gray-500">{comment.timestamp}</span>
                          </div>
                          
                          {/* Three dot menu - only show for current user's comments and not in edit mode */}
                          {comment.author === user.name && editingCommentId !== comment.id && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-32">
                                <DropdownMenuItem 
                                  onClick={() => handleEditComment(comment)}
                                  className="cursor-pointer"
                                >
                                  <Edit3 className="h-3 w-3 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                                >
                                  <Trash2 className="h-3 w-3 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                        
                        {editingCommentId === comment.id ? (
                          <div className="space-y-2 mb-2">
                            <Textarea
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="text-sm resize-none"
                              rows={3}
                              autoFocus
                            />
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleSaveEdit(comment.id)}
                                className="h-7 px-2 text-xs"
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Save
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelEdit}
                                className="h-7 px-2 text-xs"
                              >
                                <X className="h-3 w-3 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">
                            {comment.content}
                          </p>
                        )}
                        
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikeComment(comment.id)}
                            className={`text-xs ${
                              comment.isLiked 
                                ? 'text-red-500 hover:text-red-600' 
                                : 'text-gray-500 hover:text-red-500'
                            }`}
                          >
                            <Heart className={`h-3 w-3 mr-1 ${comment.isLiked ? 'fill-current' : ''}`} />
                            {comment.likes}
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs text-gray-500 hover:text-blue-500"
                            onClick={() => handleReply(comment.id)}
                          >
                            <Reply className="h-3 w-3 mr-1" />
                            Reply
                          </Button>
                        </div>

                        {/* Reply Interface */}
                        {replyingToId === comment.id && (
                          <div className="mt-3 ml-8 bg-gray-50 rounded-lg p-3">
                            <div className="flex items-start space-x-2 mb-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                                  {getInitials(user.name)}
                                </AvatarFallback>
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
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelReply}
                                className="h-7 px-2 text-xs"
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleSubmitReply(comment.id)}
                                className="h-7 px-2 text-xs"
                              >
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
                              <div key={reply.id} className="flex items-start space-x-3 p-2 bg-gray-50 rounded-lg">
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
                                    {reply.author === user.name && editingReplyId !== reply.id && (
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600">
                                            <MoreHorizontal className="h-3 w-3" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-32">
                                          <DropdownMenuItem 
                                            onClick={() => handleEditReply(comment.id, reply)}
                                            className="cursor-pointer"
                                          >
                                            <Edit3 className="h-3 w-3 mr-2" />
                                            Edit
                                          </DropdownMenuItem>
                                          <DropdownMenuItem 
                                            onClick={() => handleDeleteReply(comment.id, reply.id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                                          >
                                            <Trash2 className="h-3 w-3 mr-2" />
                                            Delete
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    )}
                                  </div>
                                  
                                  {editingReplyId === reply.id ? (
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
                                          onClick={() => handleSaveReplyEdit(comment.id, reply.id)}
                                          className="h-6 px-2 text-xs"
                                        >
                                          <Check className="h-3 w-3 mr-1" />
                                          Save
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={handleCancelReplyEdit}
                                          className="h-6 px-2 text-xs"
                                        >
                                          <X className="h-3 w-3 mr-1" />
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-gray-700 text-sm leading-relaxed mb-2">
                                      {reply.content}
                                    </p>
                                  )}
                                  
                                  {editingReplyId !== reply.id && (
                                    <div className="flex items-center space-x-3">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleLikeReply(comment.id, reply.id)}
                                        className={`text-xs ${ 
                                          reply.isLiked 
                                            ? 'text-red-500 hover:text-red-600' 
                                            : 'text-gray-500 hover:text-red-500'
                                        }`}
                                      >
                                        <Heart className={`h-3 w-3 mr-1 ${reply.isLiked ? 'fill-current' : ''}`} />
                                        {reply.likes}
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