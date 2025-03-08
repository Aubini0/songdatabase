import React, { useState, useRef } from "react";
import { Music, X, Upload, Play, Pause } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Track } from "./TrackItem";
import { Slider } from "@/components/ui/slider";

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
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl);
      }
      const previewUrl = URL.createObjectURL(selectedFile);
      setAudioPreviewUrl(previewUrl);
      
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

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
    if (!title || !artist || !file) {
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
      
      const newTrack: Track = {
        id: `upload-${Date.now()}`,
        title,
        artist,
        duration: durationString,
      };
      
      setIsUploading(false);
      onUploadSuccess(newTrack);
      
      setTitle("");
      setArtist("");
      setFile(null);
      setAudioPreviewUrl(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      
      toast({
        description: `${title} by ${artist} uploaded successfully`,
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
      
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="neo-blur rounded-xl w-full max-w-sm sm:max-w-md p-4 sm:p-6 relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X size={18} className="text-white/70" />
        </button>
        
        <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-white flex items-center gap-2">
          <Upload size={18} className="text-white" />
          Upload Song
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-white/70 mb-1 text-xs sm:text-sm">Song Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-white/70 mb-1 text-xs sm:text-sm">Artist Name *</label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-white/70 mb-1 text-xs sm:text-sm">Song File *</label>
              <div 
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-black/30 border border-white/10 text-white/70 text-xs sm:text-sm focus:outline-none hover:bg-black/40 cursor-pointer flex items-center gap-2 hover:border-white/30 transition-all"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Music size={16} className="text-white" />
                <span className="truncate">{file ? file.name : 'Select audio file'}</span>
                <input
                  id="file-upload"
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
              </div>
            </div>
            
            {audioPreviewUrl && (
              <div className="mt-4 rounded-lg bg-black/30 p-3 border border-white/10">
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
                      className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <span className="text-xs text-white/80">Preview</span>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-1">
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
          
          <button
            type="submit"
            disabled={isUploading}
            className={`w-full py-2 sm:py-3 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white text-sm transition-colors mt-4 sm:mt-6 flex items-center justify-center ${
              isUploading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>Upload Song</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadSongModal;
