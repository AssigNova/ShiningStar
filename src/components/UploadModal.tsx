import { useState, useRef } from "react";
import { Upload, X, File, Image, Video, Save } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Card, CardContent } from "./ui/card";
import { toast } from "sonner";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSubmit: (submissionData: any) => void;
  uploading: boolean;
}

export function UploadModal({ isOpen, onClose, user, onSubmit, uploading }: UploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    participantType: "Employee",
    department: user?.department || "",
    tags: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    "Voice of ITC (Individual Performance)",
    "Dance ITC Dance (Individual Performance)",
    "Strokes of a Genius (Individual Performance)",
    "Generations in Harmony (Family Performance)",
    "Reel Stars (Only Employees)",
    "Harmony in Action (Group Employees)",
  ];

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
    const maxImageSize = 30 * 1024 * 1024; // 30MB for images
    const maxVideoSize = 1 * 1024 * 1024 * 1024; // 1GB for videos

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
      toast.error(`Image file is too large. Maximum size allowed is 30MB.\nYour file: ${(file.size / 1024 / 1024).toFixed(2)}MB`, {
        duration: 5000,
      });
      return;
    }

    if (isVideo && file.size > maxVideoSize) {
      toast.error(`Video file is too large. Maximum size allowed is 1GB.\nYour file: ${(file.size / 1024 / 1024 / 1024).toFixed(2)}GB`, {
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

    toast.success(`${fileType} is ready for upload! click post to start uploading (${fileSize})`, {
      duration: 3000,
    });
  };

  const handleSubmit = (saveAsDraft = false) => {
    if (!formData.title || !formData.description || !formData.category) {
      toast.error("Please fill in all required fields (Title, Description, Category).");
      return;
    }

    if (!uploadedFile && !saveAsDraft) {
      toast.error("Please upload a photo or video before posting.");
      return;
    }

    // Additional validation for file when posting (not for drafts)
    if (uploadedFile && !saveAsDraft) {
      const imageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      const videoTypes = ["video/mp4", "video/avi", "video/mov", "video/quicktime"];
      const isImage = imageTypes.includes(uploadedFile.type);
      const isVideo = videoTypes.includes(uploadedFile.type);

      if (!isImage && !isVideo) {
        toast.error("Invalid file type. Please upload a valid photo or video.");
        return;
      }

      const maxImageSize = 30 * 1024 * 1024; // 30MB
      const maxVideoSize = 1 * 1024 * 1024 * 1024; // 1GB

      if (isImage && uploadedFile.size > maxImageSize) {
        toast.error("Image file exceeds 30MB limit. Please choose a smaller image.");
        return;
      }

      if (isVideo && uploadedFile.size > maxVideoSize) {
        toast.error("Video file exceeds 1GB limit. Please choose a smaller video.");
        return;
      }
    }

    const submissionData = {
      ...formData,
      file: uploadedFile,
      status: saveAsDraft ? "draft" : "published",
      submittedBy: user.name,
      submittedAt: new Date().toISOString(),
      type: uploadedFile ? (uploadedFile.type.startsWith("image/") ? "image" : "video") : "image",
      content: uploadedFile
        ? URL.createObjectURL(uploadedFile)
        : "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
    };

    if (saveAsDraft) {
      console.log("Draft saved:", submissionData);
      onSubmit(submissionData);
      toast.success("Draft saved successfully! You can publish it later from your dashboard.");
    } else {
      console.log("Submission:", submissionData);
      onSubmit(submissionData);
      toast.success("Upload Started successfully! It will be live on the feed once uploaded.");
    }

    // Reset form and close modal
    setFormData({
      title: "",
      description: "",
      category: "",
      participantType: "Employee",
      department: user?.department || "",
      tags: "",
    });
    setUploadedFile(null);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <Image className="h-8 w-8 text-blue-500" />;
    if (file.type.startsWith("video/")) return <Video className="h-8 w-8 text-purple-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:max-h-[90vh] w-[95vw] sm:w-full p-4 sm:p-6">
        <DialogHeader className="px-0 sm:px-0">
          <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <Upload className="h-5 w-5" />
            <span>Upload Your Entry</span>
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Submit your creative work for the Shining Stars Season 3 competition. Fill in all required fields and upload your file to get
            started.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* File Upload Guidelines */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <h4 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">Upload Guidelines</h4>
              <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
                <li>• Images: JPEG, PNG, GIF (Max 30MB)</li>
                <li>• Videos: MP4, AVI, MOV (Max 1GB)</li>
                <li>• Recommended image size: 1920x1080px</li>
                <li>• Video length: </li>
                <li className="ml-4"> - Maximum 30 Seconds For Reels</li>
                <li className="ml-4"> - 2 minutes for Normal Video</li>
              </ul>
            </CardContent>
          </Card>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm sm:text-base">
                Title *
              </Label>
              <Input
                id="title"
                placeholder="Enter entry title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm sm:text-base">
                Category *
              </Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="text-sm sm:text-base">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm sm:text-base">
              Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your entry..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="text-sm sm:text-base"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Participant Type *</Label>
              <Select value={formData.participantType} onValueChange={(value) => setFormData({ ...formData, participantType: value })}>
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue placeholder="Select participant type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Employee" className="text-sm sm:text-base">
                    Employee
                  </SelectItem>
                  <SelectItem value="Family" className="text-sm sm:text-base">
                    Family
                  </SelectItem>
                  <SelectItem value="Child (Under 12)" className="text-sm sm:text-base">
                    Child (Under 12)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm sm:text-base">
                Department/Unit
              </Label>
              <Input
                id="department"
                placeholder="Enter department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm sm:text-base">
              Tags (Optional)
            </Label>
            <Input
              id="tags"
              placeholder="Add tags separated by commas"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="text-sm sm:text-base"
            />
          </div>

          {/* File Upload Area */}
          <div className="space-y-4">
            <Label className="text-sm sm:text-base">Upload File</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-colors ${
                dragActive ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}>
              {uploadedFile ? (
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  {getFileIcon(uploadedFile)}
                  <div className="text-center sm:text-left">
                    <p className="font-medium text-sm sm:text-base">{uploadedFile.name}</p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {uploadedFile.size > 1024 * 1024 * 1024
                        ? `${(uploadedFile.size / 1024 / 1024 / 1024).toFixed(2)} GB`
                        : `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB`}
                    </p>
                    <div className="flex items-center justify-center sm:justify-start mt-1">
                      <div
                        className={`h-2 w-2 rounded-full mr-2 ${
                          uploadedFile.type.startsWith("image/") ? "bg-green-500" : "bg-purple-500"
                        }`}></div>
                      <span className="text-xs text-gray-600 capitalize">
                        {uploadedFile.type.startsWith("image/") ? "Image" : "Video"} • Valid Format
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setUploadedFile(null)} className="self-center sm:self-auto">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-base sm:text-lg font-medium">Drag & Drop your file here</p>
                    <p className="text-xs sm:text-gray-500">or click to browse</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="text-xs sm:text-sm">
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
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between pt-4 gap-3 sm:gap-0">
            <Button variant="outline" onClick={() => handleSubmit(true)} className="w-full sm:w-auto text-xs sm:text-sm">
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full sm:w-auto gap-2 sm:space-x-3">
              <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto text-xs sm:text-sm">
                Cancel
              </Button>
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={uploading}
                className={`px-4 py-2 rounded-lg font-medium shadow-lg text-sm sm:text-base w-full sm:w-auto ${
                  uploading ? "bg-gray-400 cursor-not-allowed text-white" : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}>
                {uploading ? "Uploading..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
