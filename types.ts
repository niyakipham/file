
export enum UploadStatus {
  UPLOADING = 'uploading',
  COMPLETE = 'complete',
  ERROR = 'error'
}

export interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: UploadStatus;
  shareLink?: string;
}