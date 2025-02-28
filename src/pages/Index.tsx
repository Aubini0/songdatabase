
import { useState, useMemo } from "react";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import { Track } from "@/components/TrackItem";
import sampleTracks from "@/data/sampleTracks";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleAddToPlaylist = (track: Track) => {
    if (playlistTracks.some(t => t.id === track.id)) {
      // Remove from playlist if already added
      setPlaylistTracks(prev => prev.filter(t => t.id !== track.id));
      toast({
        description: `${track.title} removed from your broadcast`,
      });
    } else {
      // Add to playlist
      setPlaylistTracks(prev => [track, ...prev]);
      toast({
        description: `${track.title} added to your broadcast`,
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
        <SearchBar onSearch={handleSearch} />
        
        <SearchResults 
          tracks={filteredTracks} 
          onAddToPlaylist={handleAddToPlaylist}
          playlistTracks={playlistTracks}
        />
      </div>
    </div>
  );
};

export default Index;
