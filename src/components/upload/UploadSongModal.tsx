
import React, { useState, useEffect } from "react";
import { Music, X, Upload } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Track } from "@/types/music";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AudioFileDropzone from "./AudioFileDropzone";
import AudioPreview from "./AudioPreview";
import { useAudioPreview } from "@/hooks/useAudioPreview";
import { formatTime } from "@/utils/audioUtils";

interface UploadSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (track: Track) => void;
}

const UploadSongModal = ({ isOpen, onClose, onUploadSuccess }: UploadSongModalProps) => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Use the audio preview hook with the first file
  const audioPreview = useAudioPreview(files.length > 0 ? files[0] : null);
  
  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setArtist("");
      setFiles([]);
    }
  }, [isOpen]);

  // Auto-extract title and artist from filename
  useEffect(() => {
    if (files.length > 0 && !title) {
      const fileName = files[0].name.replace(/\.[^/.]+$/, ""); // Remove extension
      if (fileName) {
        // Try to split on common separators
        const parts = fileName.split(/[-–—_]/);
        if (parts.length >= 2) {
          setTitle(parts[1].trim());
          setArtist(parts[0].trim());
        } else {
          setTitle(fileName);
        }
      }
    }
  }, [files, title]);

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
    
    // Stop playing if audio is playing
    if (audioPreview.isPlaying && audioPreview.audioRef.current) {
      audioPreview.audioRef.current.pause();
    }
    
    setTimeout(() => {
      let durationString = "3:30";
      if (audioPreview.duration) {
        durationString = formatTime(audioPreview.duration);
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
              <label className="form-label">Song Title <span className="text-purple-400">*</span></label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="form-label">Artist Name <span className="text-purple-400">*</span></label>
              <Input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="input-field"
                required
              />
            </div>
            
            <AudioFileDropzone 
              onFilesSelected={setFiles}
              files={files}
            />
            
            {audioPreview.audioPreviewUrl && (
              <AudioPreview 
                audioUrl={audioPreview.audioPreviewUrl}
                isPlaying={audioPreview.isPlaying}
                currentTime={audioPreview.currentTime}
                duration={audioPreview.duration}
                formattedCurrentTime={audioPreview.formattedCurrentTime}
                formattedDuration={audioPreview.formattedDuration}
                audioRef={audioPreview.audioRef}
                onPlayPause={audioPreview.handlePlayPause}
                onTimeUpdate={audioPreview.handleAudioTimeUpdate}
                onLoadedMetadata={audioPreview.handleAudioMetadata}
                onSeek={audioPreview.handleSeek}
                onEnded={() => audioPreview.setIsPlaying(false)}
              />
            )}
          </div>
          
          <Button
            type="submit"
            disabled={isUploading}
            className={`upload-button w-full ${isUploading ? "opacity-70 cursor-not-allowed" : ""}`}
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
