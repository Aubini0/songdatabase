
import { useState, useMemo, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import { Track } from "@/components/TrackItem";
import sampleTracks from "@/data/sampleTracks";
import { toast } from "@/components/ui/use-toast";
import UploadSongModal from "@/components/UploadSongModal";
import AudioPlayer from "@/components/AudioPlayer";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [allTracks, setAllTracks] = useState<Track[]>(sampleTracks);
  
  // Audio player state
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPaused, setIsPaused] = useState(true);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleAddToPlaylist = (track: Track) => {
    if (playlistTracks.some(t => t.id === track.id)) {
      // Remove from playlist if already added
      setPlaylistTracks(prev => prev.filter(t => t.id !== track.id));
      toast({
        description: `${track.title} removed from your broadcast`,
        action: (
          <button
            onClick={() => {
              setPlaylistTracks(prev => [track, ...prev]);
            }}
            className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-md text-xs transition-colors"
          >
            Undo
          </button>
        ),
      });
    } else {
      // Add to playlist
      setPlaylistTracks(prev => [track, ...prev]);
      toast({
        description: `${track.title} added to your broadcast`,
        action: (
          <button
            onClick={() => {
              setPlaylistTracks(prev => prev.filter(t => t.id !== track.id));
            }}
            className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-md text-xs transition-colors"
          >
            Undo
          </button>
        ),
      });
    }
  };
  
  const handleUploadSuccess = (track: Track) => {
    setAllTracks(prev => [track, ...prev]);
    setPlaylistTracks(prev => [track, ...prev]);
  };
  
  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPaused(false);
  };
  
  const handlePauseTrack = () => {
    setIsPaused(true);
  };
  
  const handleClosePlayer = () => {
    setCurrentTrack(null);
    setIsPaused(true);
  };
  
  const filteredTracks = useMemo(() => {
    if (!searchQuery.trim()) return allTracks;
    
    return allTracks.filter(track => 
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allTracks]);

  // Add padding to the bottom of the page when audio player is visible
  useEffect(() => {
    const body = document.body;
    if (currentTrack) {
      body.style.paddingBottom = "80px"; // Adjust based on player height
    } else {
      body.style.paddingBottom = "0";
    }
    
    return () => {
      body.style.paddingBottom = "0";
    };
  }, [currentTrack]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#0a0a0a] text-white">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-12">
        <SearchBar 
          onSearch={handleSearch} 
          onOpenUploadModal={() => setIsUploadModalOpen(true)}
        />
        
        <SearchResults 
          tracks={filteredTracks} 
          onAddToPlaylist={handleAddToPlaylist}
          playlistTracks={playlistTracks}
          onPlayTrack={handlePlayTrack}
          currentlyPlaying={currentTrack}
          isPaused={isPaused}
          onPauseTrack={handlePauseTrack}
        />
        
        <UploadSongModal 
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
        
        {currentTrack && (
          <AudioPlayer 
            currentTrack={currentTrack} 
            onClose={handleClosePlayer}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
