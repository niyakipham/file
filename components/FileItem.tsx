
import React, { useState } from 'react';
import { UploadedFile, UploadStatus } from '../types';
import { formatBytes } from '../utils/formatBytes';
import { FileIcon, CheckIcon, CopyIcon, ExternalLinkIcon } from './icons';

interface FileItemProps {
    fileData: UploadedFile;
}

const FileItem: React.FC<FileItemProps> = ({ fileData }) => {
    const [isCopied, setIsCopied] = useState(false);
    const isComplete = fileData.status === UploadStatus.COMPLETE;

    const borderColor = isComplete ? 'border-success-green' : 'border-accent-purple';

    const handleCopy = () => {
        if (!fileData.shareLink) return;
        navigator.clipboard.writeText(fileData.shareLink).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    };

    return (
        <div className={`animate-slide-up flex items-start bg-black/20 rounded-md p-4 mb-4 border-l-4 ${borderColor}`}>
            <FileIcon className="w-10 h-10 mr-4 flex-shrink-0 text-accent-purple drop-shadow-[0_0_3px_var(--accent-purple)]" />
            <div className="flex-grow min-w-0">
                <div className="font-semibold truncate text-text-primary">{fileData.file.name}</div>
                <div className="text-sm opacity-70 mt-1 text-text-primary/70">{formatBytes(fileData.file.size)}</div>

                {isComplete && fileData.shareLink ? (
                    <div className="mt-2.5">
                        <div className="flex items-center bg-black/30 rounded-md">
                             <input 
                                type="text"
                                readOnly
                                value={fileData.shareLink}
                                className="flex-grow bg-transparent text-accent-cyan text-sm focus:outline-none min-w-0 p-2"
                                aria-label="Shareable file link"
                            />
                            <a 
                                href={fileData.shareLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-1.5 text-text-primary/80 hover:text-accent-cyan transition-colors"
                                aria-label="Open file in new tab"
                                title="Open file"
                            >
                                <ExternalLinkIcon className="w-5 h-5" />
                            </a>
                            <div className="relative">
                                <button 
                                    onClick={handleCopy} 
                                    className="p-1.5 text-text-primary/80 hover:text-accent-cyan transition-colors"
                                    aria-label="Copy link"
                                    title="Copy link"
                                >
                                    <CopyIcon className="w-5 h-5" />
                                </button>
                                <span className={`absolute -top-8 right-0 text-xs bg-accent-purple text-white px-2 py-0.5 rounded-md transition-all duration-300 ${isCopied ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                                    Copied!
                                </span>
                            </div>
                        </div>
                        <p className="text-xs opacity-60 mt-1.5 text-text-primary/60">
                            Link is temporary and only works on this device.
                        </p>
                    </div>
                ) : (
                    <div className="progress-bar-container w-full h-3 bg-black/40 rounded-full mt-2 overflow-hidden relative">
                        <div
                            className="progress-bar-bg animate-move-stripes h-full rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${fileData.progress}%` }}
                        ></div>
                    </div>
                )}
            </div>
            <div className="ml-4 w-16 text-right flex-shrink-0 pt-1">
                {isComplete ? (
                    <CheckIcon className="w-6 h-6 stroke-success-green inline-block drop-shadow-[0_0_3px_var(--success-green)]" />
                ) : (
                    <span className="font-display font-bold text-accent-cyan">
                        {Math.round(fileData.progress)}%
                    </span>
                )}
            </div>
        </div>
    );
};

export default FileItem;
