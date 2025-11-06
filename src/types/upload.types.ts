// Upload Types - From reference repository (uploadthing integration)

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  key: string;
  uploadedBy: string;
  metadata: {
    originalName: string;
    mimeType: string;
    dimensions?: {
      width: number;
      height: number;
    };
    alt?: string;
    description?: string;
    tags?: string[];
  };
  uploadStatus: 'pending' | 'completed' | 'failed' | 'processing';
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Upload configuration
export interface UploadConfig {
  maxFileSize: number; // in bytes
  allowedFileTypes: string[];
  maxFiles: number;
  uploadPath: string;
  generateThumbnails: boolean;
  thumbnailSizes?: {
    name: string;
    width: number;
    height: number;
  }[];
  allowedImageTypes: string[];
  allowedDocumentTypes: string[];
  allowedVideoTypes: string[];
  allowedAudioTypes: string[];
  imageOptimization: {
    quality: number;
    format: 'auto' | 'jpeg' | 'png' | 'webp';
    compression: boolean;
  };
}

// Upload progress
export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number; // 0-100
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  errorMessage?: string;
  estimatedTimeRemaining?: number; // in seconds
}

// Upload response
export interface UploadResponse {
  success: boolean;
  files: UploadedFile[];
  errors: {
    fileName: string;
    error: string;
  }[];
  totalSize: number;
  uploadDuration: number; // in seconds
}

// Upload request
export interface UploadRequest {
  files: File[];
  metadata?: {
    propertyId?: string;
    userId?: string;
    type?: 'property_image' | 'property_document' | 'user_avatar' | 'user_document';
    tags?: string[];
  };
  config?: Partial<UploadConfig>;
}

// File validation
export interface FileValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fileSize: number;
  fileType: string;
  isImage: boolean;
  isVideo: boolean;
  isDocument: boolean;
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number; // for videos/audio
}

// Upload statistics
export interface UploadStats {
  totalUploads: number;
  totalSizeUploaded: number; // in bytes
  averageFileSize: number; // in bytes
  uploadsByType: {
    images: number;
    documents: number;
    videos: number;
    audio: number;
    other: number;
  };
  storageUsed: number; // in bytes
  storageLimit: number; // in bytes
  successRate: number; // percentage
  lastUploadAt?: Date;
}

// Upload error handling
export interface UploadError {
  code: 'FILE_TOO_LARGE' | 'INVALID_FILE_TYPE' | 'STORAGE_QUOTA_EXCEEDED' | 'UPLOAD_FAILED' | 'PROCESSING_FAILED';
  message: string;
  fileName: string;
  details?: {
    code?: string;
    field?: string;
    value?: unknown;
    reason?: string;
  };
}

// Batch upload operations
export interface BatchUploadOperation {
  operationId: string;
  files: File[];
  totalFiles: number;
  completedFiles: number;
  failedFiles: number;
  progress: number; // 0-100
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  errors: UploadError[];
}

// Upload queue management
export interface UploadQueue {
  id: string;
  userId: string;
  operations: BatchUploadOperation[];
  totalOperations: number;
  completedOperations: number;
  overallProgress: number; // 0-100
  status: 'active' | 'paused' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

// File cleanup
export interface FileCleanup {
  deleteUnusedFiles: boolean;
  deleteExpiredUploads: boolean;
  maxAge: number; // in days
  previewFileRetention: boolean;
}