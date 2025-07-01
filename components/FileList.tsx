
import React from 'react';
import { UploadedFile } from '../types';
import FileItem from './FileItem';

interface FileListProps {
    files: UploadedFile[];
}

const FileList: React.FC<FileListProps> = ({ files }) => {
    if (files.length === 0) {
        return null;
    }

    return (
        <div className="mt-8">
            <div className="file-list-title font-display text-base font-bold uppercase border-b border-b-[var(--border-color)] pb-2 mb-4 flex items-center text-text-primary/90">
                UPLOAD QUEUE
                <div className="barcode ml-4 w-24 h-2.5 bg-[repeating-linear-gradient(90deg,var(--accent-cyan),var(--accent-cyan)_2px,transparent_2px,transparent_4px)]"></div>
            </div>
            <div id="file-list">
                {files.map(file => (
                    <FileItem key={file.id} fileData={file} />
                ))}
            </div>
        </div>
    );
};

export default FileList;
