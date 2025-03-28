
import React, { useState, useRef, useCallback } from "react";
import { Music, X, Upload, Play, Pause, FileMusic } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Track } from "@/types/music";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UploadSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (track: Track) => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const UploadSongModal = ({ isOpen, onClose, onUploadSuccess }: UploadSongModalProps) => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
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
    
    setFiles(audioFiles);
    
    // Preview the first file
    if (audioFiles.length > 0) {
      if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl);
      }
      
      const previewUrl = URL.createObjectURL(audioFiles[0]);
      setAudioPreviewUrl(previewUrl);
      
      // Try to get the title and artist from the filename
      const fileName = audioFiles[0].name.replace(/\.[^/.]+$/, ""); // Remove extension
      if (!title && fileName) {
        // Try to split on common separators
        const parts = fileName.split(/[-–—_]/);
        if (parts.length >= 2) {
          setTitle(parts[1].trim());
          setArtist(parts[0].trim());
        } else {
          setTitle(fileName);
        }
      }
      
      setIsPlaying(false);
      setCurrentTime(0);
    }
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
  }, []);

  const handleAudioMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !audioPreviewUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      const newTime = value[0];
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artist || files.length === 0) {
      toast({
        description: "Please fill all required fields",
        duration: 2000,
      });
      return;
    }

    setIsUploading(true);
    
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    
    setTimeout(() => {
      let durationString = "3:30";
      if (duration) {
        durationString = formatTime(duration);
      }
      
      // Create a new track for each file
      files.forEach((file, index) => {
        const newTrack: Track = {
          id: `upload-${Date.now()}-${index}`,
          title: index === 0 ? title : `${title} (${index + 1})`,
          artist,
          duration: durationString,
        };
        
        onUploadSuccess(newTrack);
      });
      
      toast({
        description: `${files.length} ${files.length === 1 ? 'track' : 'tracks'} uploaded successfully`,
        duration: 2000,
        action: (
          <button
            onClick={() => console.log("Undo upload")}
            className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-md text-xs transition-colors"
          >
            Undo
          </button>
        ),
      });
      
      // Reset form
      setTitle("");
      setArtist("");
      setFiles([]);
      setAudioPreviewUrl(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setIsUploading(false);
      
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="neo-blur rounded-xl w-full max-w-sm sm:max-w-md p-4 sm:p-6 relative animate-scale-in border border-white/20 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/15 transition-colors"
          aria-label="Close"
        >
          <X size={18} className="text-white/80" />
        </button>
        
        <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6 text-white flex items-center gap-2">
          <Upload size={20} className="text-purple-400" />
          <span className="bg-gradient-to-r from-white to-white/80 text-transparent bg-clip-text">Upload Song</span>
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 mb-1.5 text-sm font-medium">Song Title <span className="text-purple-400">*</span></label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 rounded-lg bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all shadow-inner shadow-black/30"
                required
              />
            </div>
            
            <div>
              <label className="block text-white/80 mb-1.5 text-sm font-medium">Artist Name <span className="text-purple-400">*</span></label>
              <Input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 rounded-lg bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all shadow-inner shadow-black/30"
                required
              />
            </div>
            
            <div>
              <label className="block text-white/80 mb-1.5 text-sm font-medium">Song File(s) <span className="text-purple-400">*</span></label>
              <div 
                className={`w-full px-4 py-8 rounded-lg border-2 border-dashed cursor-pointer transition-all
                  ${isDragging 
                    ? 'border-purple-400 bg-purple-500/10' 
                    : 'border-white/20 bg-black/60 hover:bg-black/70 hover:border-purple-400/50'
                  }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    const droppedFiles = Array.from(e.dataTransfer.files);
                    handleFiles(droppedFiles);
                  }
                }}
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
                      <Music size={24} className="text-purple-400 mb-1" />
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
            
            {audioPreviewUrl && (
              <div className="mt-4 rounded-lg bg-black/50 p-4 border border-white/15">
                <audio 
                  ref={audioRef} 
                  src={audioPreviewUrl}
                  onLoadedMetadata={handleAudioMetadata}
                  onTimeUpdate={handleAudioTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />
                
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handlePlayPause}
                      className="p-2 rounded-full bg-purple-600 hover:bg-purple-500 transition-colors flex-shrink-0"
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <span className="text-sm text-white/80 font-medium">Preview</span>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-xs text-white/70 w-8">{formatTime(currentTime)}</span>
                    <Slider
                      value={[currentTime]}
                      min={0}
                      max={duration || 100}
                      step={1}
                      onValueChange={handleSeek}
                      className="flex-1"
                    />
                    <span className="text-xs text-white/70 w-8">{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <Button
            type="submit"
            disabled={isUploading}
            className={`w-full py-2.5 sm:py-3 rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-medium text-sm shadow-md transition-all duration-300 mt-4 sm:mt-6 ${
              isUploading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isUploading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Uploading...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Upload size={18} />
                <span>Upload Song{files.length > 1 ? 's' : ''}</span>
              </div>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UploadSongModal;
