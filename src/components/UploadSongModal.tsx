
import React, { useState } from "react";
import { Music, X } from "lucide-react";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artist || !file) {
      toast({
        description: "Please fill all required fields",
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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass-morphism rounded-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10"
        >
          <X size={20} className="text-white/70" />
        </button>
        
        <h2 className="text-xl font-bold mb-6 text-white">Upload Song</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/70 mb-1 text-sm">Cover Art</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-md bg-black/30 flex items-center justify-center overflow-hidden">
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                ) : (
                  <Music size={24} className="text-white/30" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="text-white/70 text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-white/70 mb-1 text-sm">Song Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              required
            />
          </div>
          
          <div>
            <label className="block text-white/70 mb-1 text-sm">Artist Name *</label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              required
            />
          </div>
          
          <div>
            <label className="block text-white/70 mb-1 text-sm">Album (Optional)</label>
            <input
              type="text"
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
          
          <div>
            <label className="block text-white/70 mb-1 text-sm">Song File *</label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
              className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/10 text-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isUploading}
            className={`w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors mt-2 ${
              isUploading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isUploading ? "Uploading..." : "Upload Song"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadSongModal;
