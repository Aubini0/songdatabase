
import React, { useRef, useCallback, useState } from "react";
import { FileMusic } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface AudioFileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  files: File[];
}

const AudioFileDropzone = ({ onFilesSelected, files }: AudioFileDropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (selectedFiles: File[]) => {
    // Filter only audio files
    const audioFiles = selectedFiles.filter(file => file.type.startsWith('audio/'));
    
    if (audioFiles.length === 0) {
      toast({
        description: "Please select audio files only",
        duration: 2000,
      });
      return;
    }
    
    onFilesSelected(audioFiles);
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      handleFiles(droppedFiles);
    }
  }, [onFilesSelected]);

  return (
    <div>
      <label className="form-label">Song File(s) <span className="text-purple-400">*</span></label>
      <div 
        className={`upload-dropzone ${isDragging ? 'upload-dropzone-active' : 'upload-dropzone-idle'}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          {files.length === 0 ? (
            <>
              <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center mb-2">
                <FileMusic size={24} className="text-purple-400" />
              </div>
              <p className="font-medium text-white">Drop your audio files here</p>
              <p className="text-white/60 text-sm">or click to browse your files</p>
            </>
          ) : (
            <>
              <FileMusic size={24} className="text-purple-400 mb-1" />
              <p className="font-medium text-white">{files.length} file{files.length !== 1 ? 's' : ''} selected</p>
              <div className="mt-2 max-w-full overflow-hidden text-ellipsis">
                <p className="text-sm text-white/60 truncate">{files[0].name}{files.length > 1 ? ` and ${files.length - 1} more` : ''}</p>
              </div>
            </>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
          multiple
          required={files.length === 0}
        />
      </div>
    </div>
  );
};

export default AudioFileDropzone;
