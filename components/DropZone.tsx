
import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon } from './icons';

interface DropZoneProps {
    onFilesAdded: (files: File[]) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ onFilesAdded }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const preventDefaults = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        preventDefaults(e);
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        preventDefaults(e);
        setIsDragOver(false);
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        preventDefaults(e);
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        if (files && files.length > 0) {
            onFilesAdded(files);
            e.dataTransfer.clearData();
        }
    }, [onFilesAdded]);
    
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (files.length > 0) {
            onFilesAdded(files);
        }
         // Reset file input to allow uploading the same file again
        if(e.target) {
            e.target.value = '';
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const dragOverClasses = isDragOver
        ? 'bg-[var(--accent-purple-transparent)] border-[var(--accent-purple)] border-solid'
        : 'border-[var(--border-color)]';

    return (
        <div
            id="drop-zone"
            className={`border-2 border-dashed rounded-lg p-16 text-center cursor-pointer transition-all duration-300 ease-in-out ${dragOverClasses}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragEnter} // Use same handler for simplicity
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
        >
            <UploadIcon 
                className={`w-20 h-20 mx-auto mb-6 stroke-accent-cyan transition-all duration-300 ease-in-out drop-shadow-[0_0_5px_var(--accent-cyan)] ${isDragOver ? 'stroke-[var(--accent-purple)] drop-shadow-[0_0_8px_var(--accent-purple)] scale-110 -translate-y-2.5' : ''}`} 
            />
            <p className="font-display text-lg font-bold uppercase tracking-wider text-shadow-[0_0_5px_rgba(0,209,245,0.5)] text-text-primary">
                Click or Drag & Drop Files Here
            </p>
            <input
                type="file"
                id="file-input"
                ref={fileInputRef}
                multiple
                className="hidden"
                onChange={handleFileInputChange}
            />
        </div>
    );
};

export default DropZone;
