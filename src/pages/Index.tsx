
import { useState, useMemo } from "react";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import Playlist from "@/components/Playlist";
import { Track } from "@/components/TrackItem";
import sampleTracks from "@/data/sampleTracks";
import { toast } from "@/components/ui/use-toast";
import { Music } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === "") {
      toast({
        description: "Please enter a search term",
      });
    }
  };
  
  const handleUpload = (file: File) => {
    // In a real app, we would handle file upload here
    // For demo purposes, we'll create a fake track
    
    const newTrack: Track = {
      id: `upload-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Uploaded by User",
      coverArt: "https://images.unsplash.com/photo-1485833077593-4278bba3f11f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      albumType: "U"
    };
    
    setPlaylistTracks(prev => [newTrack, ...prev]);
  };
  
  const handleAddToPlaylist = (track: Track) => {
    if (playlistTracks.some(t => t.id === track.id)) {
      // Remove from playlist if already added
      setPlaylistTracks(prev => prev.filter(t => t.id !== track.id));
      toast({
        description: `${track.title} removed from your playlist`,
      });
    } else {
      // Add to playlist
      setPlaylistTracks(prev => [track, ...prev]);
      toast({
        description: `${track.title} added to your playlist`,
      });
    }
  };
  
  const filteredTracks = useMemo(() => {
    if (!searchQuery.trim()) return sampleTracks;
    
    return sampleTracks.filter(track => 
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (track.album && track.album.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#0a0a0a] text-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <Music size={24} className="text-white" />
            <h4 className="text-sm font-medium uppercase tracking-wider text-white/70">
              Melodic Collection
            </h4>
          </div>
          <h1 className="text-4xl font-bold mb-2">Melody Mixer</h1>
          <p className="text-white/70 max-w-md mx-auto">
            Search for your favorite tracks, create custom playlists, and enjoy your music collection.
          </p>
        </header>

        <SearchBar onSearch={handleSearch} onUpload={handleUpload} />
        
        <SearchResults 
          tracks={filteredTracks} 
          onAddToPlaylist={handleAddToPlaylist}
          playlistTracks={playlistTracks}
        />
        
        <Playlist 
          tracks={playlistTracks} 
          onAddToPlaylist={handleAddToPlaylist} 
        />
      </div>
    </div>
  );
};

export default Index;
