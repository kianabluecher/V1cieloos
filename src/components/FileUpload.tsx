import { useState, useEffect, useRef } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Upload, File, FileText, Image, Trash2, Bot, Loader2 } from "lucide-react";
import { api } from "../utils/supabase/client";
import { toast } from "sonner@2.0.3";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  addedBy?: string;
  signedUrl?: string;
  uploadedAt?: string;
}

export function FileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const response = await api.getFiles();
      if (response.success) {
        setFiles(response.data);
      } else {
        console.error('Failed to load files:', response.error);
      }
    } catch (error) {
      console.error('Error loading files:', error);
      toast.error('Failed to load files');
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'image':
        return <Image className="h-4 w-4 text-green-500" />;
      default:
        return <File className="h-4 w-4 text-blue-500" />;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileUpload(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFileUpload(selectedFiles);
    }
  };

  const handleFileUpload = async (filesToUpload: File[]) => {
    if (filesToUpload.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of filesToUpload) {
        // Check file size (25MB limit)
        if (file.size > 25 * 1024 * 1024) {
          toast.error(`File ${file.name} is too large. Maximum size is 25MB.`);
          continue;
        }

        const response = await api.uploadFile(file, 'User');
        if (response.success) {
          setFiles(prev => [...prev, response.data]);
          toast.success(`${file.name} uploaded successfully`);
        } else {
          toast.error(`Failed to upload ${file.name}`);
        }
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = async (id: string) => {
    try {
      const response = await api.deleteFile(id);
      if (response.success) {
        setFiles(files.filter(file => file.id !== id));
        toast.success('File deleted successfully');
      } else {
        toast.error('Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  };

  const handleChooseFiles = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-accent" />
        <span className="ml-2 text-white/90">Loading files...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.zip,.ai,.psd,.sketch,.txt,.csv,.xlsx,.xls"
      />

      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed p-8 text-center transition-all duration-300 cursor-pointer hover:bg-accent/5 ${
          isDragOver ? 'border-primary bg-primary/5 glow-blue' : 'border-border'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleChooseFiles}
      >
        {isUploading ? (
          <>
            <Loader2 className="h-8 w-8 text-cyan-accent mx-auto mb-3 animate-spin" />
            <h4 className="mb-2">Uploading files...</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Please wait while your files are being uploaded
            </p>
          </>
        ) : (
          <>
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <h4 className="mb-2">Drag &amp; drop files here</h4>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse files (max 25MB each)
            </p>
            <Button variant="outline" className="hover:glow-blue transition-all duration-300">
              Choose Files
            </Button>
          </>
        )}
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <Card key={file.id} className="p-3 hover:bg-accent/5 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{file.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{file.size}</span>
                      {file.addedBy && (
                        <Badge variant="secondary" className="text-xs bg-[#20C997]/10 text-[#20C997]">
                          <Bot className="h-3 w-3 mr-1" />
                          {file.addedBy}
                        </Badge>
                      )}
                      {file.uploadedAt && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(file.uploadedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {file.signedUrl ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(file.signedUrl, '_blank');
                      }}
                      className="text-cyan-accent hover:text-cyan-accent hover:bg-cyan-accent/10"
                    >
                      View
                    </Button>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Metadata Only
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                    }}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}