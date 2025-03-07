
import React, { useState } from "react";
import { Music, X, Upload } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Track } from "./TrackItem";

interface UploadSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (track: Track) => void;
}

const UploadSongModal = ({ isOpen, onClose, onUploadSuccess }: UploadSongModalProps) => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
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
    
    // Simulate upload process
    setTimeout(() => {
      // Create a new track with mockup data
      const newTrack: Track = {
        id: `upload-${Date.now()}`,
        title,
        artist,
        duration: "3:30", // Default duration
      };
      
      setIsUploading(false);
      onUploadSuccess(newTrack);
      
      // Reset form
      setTitle("");
      setArtist("");
      setFile(null);
      
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
      <div className="glass-morphism rounded-xl w-full max-w-sm sm:max-w-md p-4 sm:p-6 relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X size={18} className="text-white/70" />
        </button>
        
        <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-white flex items-center gap-2">
          <Upload size={18} className="text-purple-400" />
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
                className="w-full px-3 sm:px-4 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-white/70 mb-1 text-xs sm:text-sm">Artist Name *</label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-white/70 mb-1 text-xs sm:text-sm">Song File *</label>
              <div 
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-black/30 border border-white/10 text-white/70 text-xs sm:text-sm focus:outline-none hover:bg-black/40 cursor-pointer flex items-center gap-2 hover:border-purple-400/30 transition-all"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Music size={16} className="text-purple-400" />
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
          </div>
          
          <button
            type="submit"
            disabled={isUploading}
            className={`w-full py-2 sm:py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white text-sm transition-colors mt-4 sm:mt-6 flex items-center justify-center ${
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
