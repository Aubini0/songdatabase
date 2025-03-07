
import React, { useState } from "react";
import { Music, X, Upload, Image } from "lucide-react";
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
  const [album, setAlbum] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setCoverImage(selectedFile);
      setCoverPreview(URL.createObjectURL(selectedFile));
    }
  };

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
        album: album || undefined,
        coverArt: coverPreview || "https://images.unsplash.com/photo-1485833077593-4278bba3f11f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
        duration: "3:30", // Default duration
      };
      
      setIsUploading(false);
      onUploadSuccess(newTrack);
      
      // Reset form
      setTitle("");
      setArtist("");
      setAlbum("");
      setFile(null);
      setCoverImage(null);
      setCoverPreview("");
      
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
      <div className="glass-morphism rounded-xl w-full max-w-md p-6 relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={20} className="text-white/70" />
        </button>
        
        <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
          <Upload size={20} className="text-purple-400" />
          Upload Song
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center mb-6">
            <div 
              className={`w-32 h-32 rounded-xl ${!coverPreview ? 'bg-gradient-to-br from-purple-800/30 to-purple-600/30' : ''} flex items-center justify-center overflow-hidden border-2 border-dashed border-white/20 hover:border-purple-400/50 transition-all cursor-pointer group relative`}
              onClick={() => document.getElementById('cover-upload')?.click()}
            >
              {coverPreview ? (
                <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center p-2 text-center">
                  <Image size={36} className="text-white/40 group-hover:text-purple-400 transition-colors mb-2" />
                  <span className="text-white/50 text-xs group-hover:text-white/70 transition-colors">Choose cover image</span>
                </div>
              )}
              <input
                type="file"
                id="cover-upload"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/70 mb-1 text-sm">Song Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-white/70 mb-1 text-sm">Artist Name *</label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-white/70 mb-1 text-sm">Album (Optional)</label>
              <input
                type="text"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-white/70 mb-1 text-sm">Song File *</label>
              <div 
                className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white/70 text-sm focus:outline-none hover:bg-black/40 cursor-pointer flex items-center gap-2 hover:border-purple-400/30 transition-all"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Music size={18} className="text-purple-400" />
                <span>{file ? file.name : 'Select audio file'}</span>
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
            className={`w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white transition-colors mt-6 flex items-center justify-center ${
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
