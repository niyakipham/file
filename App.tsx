
import React, { useState, useCallback, useEffect } from 'react';
import { UploadedFile, UploadStatus } from './types';
import DropZone from './components/DropZone';
import FileList from './components/FileList';

const App: React.FC = () => {
    const [files, setFiles] = useState<UploadedFile[]>([]);

    useEffect(() => {
        // This is a cleanup function that runs when the App component unmounts.
        // It's important to revoke object URLs to avoid memory leaks.
        return () => {
            files.forEach(fileData => {
                if (fileData.shareLink && fileData.shareLink.startsWith('blob:')) {
                    URL.revokeObjectURL(fileData.shareLink);
                }
            });
        };
    }, [files]); // The dependency array includes 'files' to have the latest list on cleanup.

    const simulateUpload = (fileId: string) => {
        const interval = setInterval(() => {
            setFiles(prevFiles => {
                const newFiles = [...prevFiles];
                const fileIndex = newFiles.findIndex(f => f.id === fileId);
                if (fileIndex === -1 || newFiles[fileIndex].status === UploadStatus.COMPLETE) {
                    clearInterval(interval);
                    return prevFiles;
                }

                const currentFile = newFiles[fileIndex];
                const newProgress = currentFile.progress + Math.floor(Math.random() * 10) + 5;

                if (newProgress >= 100) {
                    // Create a local, temporary URL for the file
                    const shareLink = URL.createObjectURL(currentFile.file);
                    newFiles[fileIndex] = { ...currentFile, progress: 100, status: UploadStatus.COMPLETE, shareLink };
                    clearInterval(interval);
                } else {
                    newFiles[fileIndex] = { ...currentFile, progress: newProgress };
                }

                return newFiles;
            });
        }, 150);
    };

    const handleFilesAdded = useCallback((incomingFiles: File[]) => {
        const newFiles: UploadedFile[] = incomingFiles.map(file => ({
            id: `file-${Math.random().toString(36).substring(2, 9)}-${file.name}`,
            file,
            progress: 0,
            status: UploadStatus.UPLOADING,
        }));

        setFiles(prev => [...prev, ...newFiles]);
        newFiles.forEach(file => simulateUpload(file.id));
    }, []);


    return (
        <div className="flex items-center justify-center min-h-screen p-8 text-text-primary font-body">
            <main className="animate-fade-in uploader-container w-full max-w-3xl bg-[rgba(20,20,45,0.7)] border border-[var(--border-color)] rounded-xl p-8 relative backdrop-blur-lg shadow-[0_0_30px_rgba(176,38,255,0.1)] overflow-hidden">
                {/* Animated Borders */}
                <div className="animate-border-top absolute top-0 left-[-150px] w-[150px] h-0.5 bg-accent-cyan shadow-[0_0_5px_var(--accent-cyan),_0_0_10px_var(--accent-cyan)]"></div>
                <div className="animate-border-bottom absolute bottom-0 right-[-150px] w-[150px] h-0.5 bg-accent-cyan shadow-[0_0_5px_var(--accent-cyan),_0_0_10px_var(--accent-cyan)]"></div>
                
                {/* Decorative Corners */}
                <div className="absolute top-[-1px] left-[-1px] w-8 h-8 border-t-2 border-l-2 border-accent-purple"></div>
                <div className="absolute bottom-[-1px] right-[-1px] w-8 h-8 border-b-2 border-r-2 border-accent-purple"></div>
                
                <DropZone onFilesAdded={handleFilesAdded} />
                <FileList files={files} />
            </main>
        </div>
    );
};

export default App;
