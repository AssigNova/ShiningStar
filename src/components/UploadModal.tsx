import { useState, useRef } from 'react';
import { Upload, X, File, Image, Video, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSubmit: (submissionData: any) => void;
}

export function UploadModal({ isOpen, onClose, user, onSubmit }: UploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    participantType: 'Employee',
    department: user?.department || '',
    tags: ''
  });
  const [isDraft, setIsDraft] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'Innovation',
    'Team Collaboration', 
    'Family & Community', 
    'Sustainability',
    'Customer Excellence',
    'Leadership',
    'Digital Transformation',
    'Health & Wellness'
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
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const videoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/quicktime'];
    const maxImageSize = 2 * 1024 * 1024; // 2MB for images
    const maxVideoSize = 1.5 * 1024 * 1024 * 1024; // 1.5GB for videos
    
    const isImage = imageTypes.includes(file.type);
    const isVideo = videoTypes.includes(file.type);
    
    // Check if file type is allowed
    if (!isImage && !isVideo) {
      toast.error('Invalid file format. Please upload:\n• Images: JPEG, JPG, PNG, GIF\n• Videos: MP4, AVI, MOV', {
        duration: 5000
      });
      return;
    }
    
    // Check file size based on type
    if (isImage && file.size > maxImageSize) {
      toast.error(`Image file is too large. Maximum size allowed is 2MB.\nYour file: ${(file.size / 1024 / 1024).toFixed(2)}MB`, {
        duration: 5000
      });
      return;
    }
    
    if (isVideo && file.size > maxVideoSize) {
      toast.error(`Video file is too large. Maximum size allowed is 1.5GB.\nYour file: ${(file.size / 1024 / 1024 / 1024).toFixed(2)}GB`, {
        duration: 5000
      });
      return;
    }
    
    // File is valid
    setUploadedFile(file);
    const fileType = isImage ? 'Image' : 'Video';
    const fileSize = isImage 
      ? `${(file.size / 1024 / 1024).toFixed(2)}MB` 
      : file.size > 1024 * 1024 * 1024 
        ? `${(file.size / 1024 / 1024 / 1024).toFixed(2)}GB`
        : `${(file.size / 1024 / 1024).toFixed(2)}MB`;
    
    toast.success(`${fileType} uploaded successfully! (${fileSize})`, {
      duration: 3000
    });
  };

  const handleSubmit = (saveAsDraft = false) => {
    if (!formData.title || !formData.description || !formData.category) {
      toast.error('Please fill in all required fields (Title, Description, Category).');
      return;
    }

    if (!uploadedFile && !saveAsDraft) {
      toast.error('Please upload a photo or video before posting.');
      return;
    }

    // Additional validation for file when posting (not for drafts)
    if (uploadedFile && !saveAsDraft) {
      const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      const videoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/quicktime'];
      const isImage = imageTypes.includes(uploadedFile.type);
      const isVideo = videoTypes.includes(uploadedFile.type);
      
      if (!isImage && !isVideo) {
        toast.error('Invalid file type. Please upload a valid photo or video.');
        return;
      }

      const maxImageSize = 2 * 1024 * 1024; // 2MB
      const maxVideoSize = 1.5 * 1024 * 1024 * 1024; // 1.5GB
      
      if (isImage && uploadedFile.size > maxImageSize) {
        toast.error('Image file exceeds 2MB limit. Please choose a smaller image.');
        return;
      }
      
      if (isVideo && uploadedFile.size > maxVideoSize) {
        toast.error('Video file exceeds 1.5GB limit. Please choose a smaller video.');
        return;
      }
    }

    const submissionData = {
      ...formData,
      file: uploadedFile,
      status: saveAsDraft ? 'draft' : 'published',
      submittedBy: user.name,
      submittedAt: new Date().toISOString(),
      type: uploadedFile ? (uploadedFile.type.startsWith('image/') ? 'image' : 'video') : 'image',
      content: uploadedFile ? URL.createObjectURL(uploadedFile) : 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop'
    };
    
    if (saveAsDraft) {
      console.log('Draft saved:', submissionData);
      onSubmit(submissionData);
      toast.success('Draft saved successfully! You can publish it later from your dashboard.');
    } else {
      console.log('Submission:', submissionData);
      onSubmit(submissionData);
      toast.success('Post published successfully! It\'s now live in the community feed.');
    }
    
    // Reset form and close modal
    setFormData({
      title: '',
      description: '',
      category: '',
      participantType: 'Employee',
      department: user?.department || '',
      tags: ''
    });
    setUploadedFile(null);
    onClose();
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-8 w-8 text-blue-500" />;
    if (file.type.startsWith('video/')) return <Video className="h-8 w-8 text-purple-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Your Entry</span>
          </DialogTitle>
          <DialogDescription>
            Submit your creative work for the Shining Stars Season 3 competition. Fill in all required fields and upload your file to get started.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload Guidelines */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <h4 className="font-medium text-blue-900 mb-2">Upload Guidelines</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Images: JPEG, PNG, GIF (Max 2MB)</li>
                <li>• Videos: MP4, AVI, MOV (Max 1.5GB)</li>
                <li>• Recommended image size: 1920x1080px</li>
                <li>• Video length: Maximum 2 minutes</li>
              </ul>
            </CardContent>
          </Card>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter entry title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
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
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your entry..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Participant Type *</Label>
              <Select 
                value={formData.participantType} 
                onValueChange={(value) => setFormData({...formData, participantType: value})}
              >
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
              <Label htmlFor="department">Department/Unit</Label>
              <Input
                id="department"
                placeholder="Enter department"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (Optional)</Label>
            <Input
              id="tags"
              placeholder="Add tags separated by commas"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
            />
          </div>

          {/* File Upload Area */}
          <div className="space-y-4">
            <Label>Upload File</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {uploadedFile ? (
                <div className="flex items-center justify-center space-x-4">
                  {getFileIcon(uploadedFile)}
                  <div className="text-left">
                    <p className="font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {uploadedFile.size > 1024 * 1024 * 1024 
                        ? `${(uploadedFile.size / 1024 / 1024 / 1024).toFixed(2)} GB`
                        : `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB`
                      }
                    </p>
                    <div className="flex items-center mt-1">
                      <div className={`h-2 w-2 rounded-full mr-2 ${
                        uploadedFile.type.startsWith('image/') ? 'bg-green-500' : 'bg-purple-500'
                      }`}></div>
                      <span className="text-xs text-gray-600 capitalize">
                        {uploadedFile.type.startsWith('image/') ? 'Image' : 'Video'} • Valid Format
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setUploadedFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-lg font-medium">Drag & Drop your file here</p>
                    <p className="text-gray-500">or click to browse</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
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
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => handleSubmit(true)}
            >
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>

            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={() => handleSubmit(false)}>
                Post
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}