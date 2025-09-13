import { useState, useRef, useEffect } from "react";
import { Upload, X, File, Image, Video, Save, Edit } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  submission: any;
  onUpdate: (submissionId: number, updatedData: any) => void;
}

export function EditPostModal({ isOpen, onClose, submission, onUpdate }: EditPostModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    participantType: "Employee",
    department: "",
    tags: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ["Voice of ITC", "Dance ITC Dance", "Strokes of a Genius", "Generations in Harmony", "Reel Stars"];

  // Pre-populate form data when submission changes
  useEffect(() => {
    if (submission) {
      setFormData({
        title: submission.title || "",
        description: submission.description || "",
        category: submission.category || "",
        participantType: submission.participantType || "Employee",
        department: submission.department || submission.author?.department || "",
        tags: submission.tags || "",
      });
      setUploadedFile(null);
    }
  }, [submission]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Define allowed types and size limits
    const imageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    const videoTypes = ["video/mp4", "video/avi", "video/mov", "video/quicktime"];
    const maxImageSize = 2 * 1024 * 1024; // 2MB for images
    const maxVideoSize = 1.5 * 1024 * 1024 * 1024; // 1.5GB for videos

    const isImage = imageTypes.includes(file.type);
    const isVideo = videoTypes.includes(file.type);

    // Check if file type is allowed
    if (!isImage && !isVideo) {
      toast.error("Invalid file format. Please upload:\n• Images: JPEG, JPG, PNG, GIF\n• Videos: MP4, AVI, MOV", {
        duration: 5000,
      });
      return;
    }

    // Check file size based on type
    if (isImage && file.size > maxImageSize) {
      toast.error(`Image file is too large. Maximum size allowed is 2MB.\nYour file: ${(file.size / 1024 / 1024).toFixed(2)}MB`, {
        duration: 5000,
      });
      return;
    }

    if (isVideo && file.size > maxVideoSize) {
      toast.error(`Video file is too large. Maximum size allowed is 1.5GB.\nYour file: ${(file.size / 1024 / 1024 / 1024).toFixed(2)}GB`, {
        duration: 5000,
      });
      return;
    }

    // File is valid
    setUploadedFile(file);
    const fileType = isImage ? "Image" : "Video";
    const fileSize = isImage
      ? `${(file.size / 1024 / 1024).toFixed(2)}MB`
      : file.size > 1024 * 1024 * 1024
      ? `${(file.size / 1024 / 1024 / 1024).toFixed(2)}GB`
      : `${(file.size / 1024 / 1024).toFixed(2)}MB`;

    toast.success(`${fileType} uploaded successfully! This will replace your current media. (${fileSize})`, {
      duration: 3000,
    });
  };

  const handleUpdate = async () => {
    if (!formData.title || !formData.description || !formData.category) {
      toast.error("Please fill in all required fields (Title, Description, Category).");
      return;
    }

    const token = localStorage.getItem("token");
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("participantType", formData.participantType);
    formDataToSend.append("department", formData.department);
    formDataToSend.append("tags", formData.tags || "");
    formDataToSend.append("status", submission.status || "published");
    formDataToSend.append("type", uploadedFile ? (uploadedFile.type.startsWith("image/") ? "image" : "video") : submission.type);
    formDataToSend.append("timestamp", new Date().toISOString());
    formDataToSend.append("author", JSON.stringify(submission.author));
    // formDataToSend.append("likes", String(submission.likes || 0));
    // formDataToSend.append("comments", String(submission.comments || []));
    formDataToSend.append("content", submission.content);
    if (uploadedFile) {
      formDataToSend.append("media", uploadedFile);
    }

    try {
      const res = await fetch(`/api/posts/${submission._id}`, {
        method: "PUT",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formDataToSend,
      });
      const updatedPost = await res.json();
      if (res.ok) {
        onUpdate(submission.id, updatedPost);
        toast.success("Post updated successfully!");
        onClose();
      } else {
        toast.error(updatedPost.message || "Failed to update post");
      }
    } catch {
      toast.error("Server error");
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <Image className="h-8 w-8 text-blue-500" />;
    if (file.type.startsWith("video/")) return <Video className="h-8 w-8 text-purple-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const getCurrentMediaType = () => {
    if (uploadedFile) {
      return uploadedFile.type.startsWith("image/") ? "image" : "video";
    }
    return submission?.type || "image";
  };

  if (!submission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Edit className="h-5 w-5 text-purple-600" />
            <span>Edit Post</span>
          </DialogTitle>
          <DialogDescription>
            Update your submission details and replace media files if needed. Changes will be saved immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Media Preview */}
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="pt-4">
              <h4 className="font-medium text-purple-900 mb-3">Current Media</h4>
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                  {getCurrentMediaType() === "video" ? (
                    <div className="w-full h-full bg-purple-100 flex items-center justify-center">
                      <Video className="h-6 w-6 text-purple-600" />
                    </div>
                  ) : (
                    <img src={submission.content} alt={submission.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-purple-900">{submission.title}</p>
                  <p className="text-sm text-purple-700 capitalize">{getCurrentMediaType()}</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {uploadedFile ? "New media selected" : "Current media"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                placeholder="Enter entry title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description *</Label>
            <Textarea
              id="edit-description"
              placeholder="Describe your entry..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Participant Type *</Label>
              <Select value={formData.participantType} onValueChange={(value) => setFormData({ ...formData, participantType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select participant type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Employee">Employee</SelectItem>
                  <SelectItem value="Spouse">Spouse</SelectItem>
                  <SelectItem value="Child">Child</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-department">Department/Unit</Label>
              <Input
                id="edit-department"
                placeholder="Enter department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-tags">Tags (Optional)</Label>
            <Input
              id="edit-tags"
              placeholder="Add tags separated by commas"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>

          {/* File Upload Area for Replacement */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Replace Media (Optional)</Label>
              <Badge variant="secondary" className="text-xs">
                Leave empty to keep current media
              </Badge>
            </div>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}>
              {uploadedFile ? (
                <div className="flex items-center justify-center space-x-4">
                  {getFileIcon(uploadedFile)}
                  <div className="text-left">
                    <p className="font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {uploadedFile.size > 1024 * 1024 * 1024
                        ? `${(uploadedFile.size / 1024 / 1024 / 1024).toFixed(2)} GB`
                        : `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB`}
                    </p>
                    <div className="flex items-center mt-1">
                      <div
                        className={`h-2 w-2 rounded-full mr-2 ${
                          uploadedFile.type.startsWith("image/") ? "bg-green-500" : "bg-purple-500"
                        }`}></div>
                      <span className="text-xs text-gray-600 capitalize">
                        {uploadedFile.type.startsWith("image/") ? "Image" : "Video"} • Will replace current media
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setUploadedFile(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="h-10 w-10 text-gray-400 mx-auto" />
                  <div>
                    <p className="font-medium">Upload new media to replace current</p>
                    <p className="text-sm text-gray-500">Drag & drop or click to browse</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    Browse Files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".jpeg,.jpg,.png,.gif,.mp4,.avi,.mov"
                    onChange={handleFileSelect}
                  />
                </div>
              )}
            </div>

            {/* Upload Guidelines */}
            <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
              <p className="font-medium mb-1">Upload Guidelines:</p>
              <p>• Images: JPEG, PNG, GIF (Max 2MB) • Videos: MP4, AVI, MOV (Max 1.5GB)</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} className="bg-purple-600 hover:bg-purple-700">
              <Save className="h-4 w-4 mr-2" />
              Update Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
