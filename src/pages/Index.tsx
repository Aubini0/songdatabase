
import { useState, useMemo, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import { Track } from "@/components/TrackItem";
import sampleTracks from "@/data/sampleTracks";
import { toast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() !== "") {
      setIsLoading(true);
      // Simulate network request
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    }
  };
  
  // Initial load simulation
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);
  
  const handleAddToPlaylist = (track: Track) => {
    if (playlistTracks.some(t => t.id === track.id)) {
      // Store previous playlist to enable undo
      const previousPlaylist = [...playlistTracks];
      
      // Remove from playlist if already added
      setPlaylistTracks(prev => prev.filter(t => t.id !== track.id));
      
      toast({
        description: `${track.title} removed from your broadcast`,
        duration: 2000,
        action: {
          label: "Undo",
          onClick: () => setPlaylistTracks(previousPlaylist),
        },
      });
    } else {
      // Store previous playlist to enable undo
      const previousPlaylist = [...playlistTracks];
      
      // Add to playlist
      setPlaylistTracks(prev => [track, ...prev]);
      
      toast({
        description: `${track.title} added to your broadcast`,
        duration: 2000,
        action: {
          label: "Undo",
          onClick: () => setPlaylistTracks(previousPlaylist),
        },
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
        
        {isLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spinner size="lg" />
          </div>
        ) : (
          <SearchResults 
            tracks={filteredTracks} 
            onAddToPlaylist={handleAddToPlaylist}
            playlistTracks={playlistTracks}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
