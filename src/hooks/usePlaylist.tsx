
import { useState, useMemo } from "react";
import { Track } from "@/types/music";
import { toast } from "@/components/ui/use-toast";

export function usePlaylist(initialTracks: Track[] = []) {
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);
  const [allTracks, setAllTracks] = useState<Track[]>(initialTracks);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPaused, setIsPaused] = useState(true);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleAddToPlaylist = (track: Track) => {
    if (playlistTracks.some(t => t.id === track.id)) {
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
  
  const handleDeleteTrack = (trackId: string) => {
    setPlaylistTracks(prev => prev.filter(t => t.id !== trackId));
    setAllTracks(prev => prev.filter(t => t.id !== trackId));
    
    toast({
      description: `Track deleted successfully`,
    });
  };
  
  const filteredTracks = useMemo(() => {
    if (!searchQuery.trim()) return allTracks;
    
    return allTracks.filter(track => 
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allTracks]);

  return {
    playlistTracks,
    allTracks,
    searchQuery,
    currentTrack,
    isPaused,
    filteredTracks,
    handleSearch,
    handleAddToPlaylist,
    handleUploadSuccess,
    handlePlayTrack,
    handlePauseTrack,
    handleClosePlayer,
    handleDeleteTrack
  };
}
