
import { useState, useMemo, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import { Track, Crate } from "@/types/music";
import sampleTracks from "@/data/sampleTracks";
import { toast } from "@/components/ui/use-toast";
import UploadSongModal from "@/components/UploadSongModal";
import AudioPlayer from "@/components/audio-player";
import Sidebar from "@/components/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Plus, X, FolderClosed } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [allTracks, setAllTracks] = useState<Track[]>(sampleTracks);
  const isMobile = useIsMobile();
  
  // Crates state
  const [crates, setCrates] = useState<Crate[]>([
    { id: "1", name: "Favorites", tracks: [] },
    { id: "2", name: "Party Mix", tracks: [] }
  ]);
  const [isCreatingCrate, setIsCreatingCrate] = useState(false);
  const [newCrateName, setNewCrateName] = useState("");
  
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
  
  // Crates handlers
  const handleAddToCrate = (trackId: string, crateId: string) => {
    setCrates(prevCrates => 
      prevCrates.map(crate => {
        if (crate.id === crateId) {
          // If track is already in crate, don't add it again
          if (crate.tracks.includes(trackId)) {
            return crate;
          }
          // Add track to crate
          return {
            ...crate,
            tracks: [...crate.tracks, trackId]
          };
        }
        return crate;
      })
    );
    
    // Find track and crate for toast message
    const track = allTracks.find(t => t.id === trackId);
    const crate = crates.find(c => c.id === crateId);
    
    if (track && crate) {
      toast({
        description: `${track.title} added to "${crate.name}" crate`,
      });
    }
  };
  
  const handleCreateCrate = () => {
    if (!newCrateName.trim()) return;
    
    const newCrate: Crate = {
      id: `crate-${Date.now()}`,
      name: newCrateName.trim(),
      tracks: []
    };
    
    setCrates(prev => [...prev, newCrate]);
    setNewCrateName("");
    setIsCreatingCrate(false);
    
    toast({
      description: `"${newCrateName}" crate created successfully`,
    });
  };
  
  const filteredTracks = useMemo(() => {
    if (!searchQuery.trim()) return allTracks;
    
    return allTracks.filter(track => 
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allTracks]);

  // Add padding to the bottom of the page when audio player or mobile nav is visible
  useEffect(() => {
    const body = document.body;
    
    if (currentTrack && isMobile) {
      body.style.paddingBottom = "140px"; // Space for both player and mobile nav
    } else if (currentTrack) {
      body.style.paddingBottom = "80px"; // Just for player on desktop
    } else if (isMobile) {
      body.style.paddingBottom = "60px"; // Just for mobile nav
    } else {
      body.style.paddingBottom = "0";
    }
    
    return () => {
      body.style.paddingBottom = "0";
    };
  }, [currentTrack, isMobile]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#0a0a0a] text-white flex">
      <Sidebar />
      
      <div className="flex-1 sm:ml-[70px] sidebar-expanded:ml-[220px] transition-all duration-300">
        <div className="max-w-5xl mx-auto pb-6 sm:pb-20">
          <SearchBar 
            onSearch={handleSearch} 
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
          />
          
          <div className="px-3 sm:px-6">
            {/* Crates section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-white">Your Crates</h2>
                <button 
                  onClick={() => setIsCreatingCrate(true)}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-white/10 hover:bg-white/15 rounded-md transition-colors"
                >
                  <Plus size={16} />
                  <span>New Crate</span>
                </button>
              </div>
              
              {isCreatingCrate ? (
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="text"
                    value={newCrateName}
                    onChange={(e) => setNewCrateName(e.target.value)}
                    placeholder="Enter crate name"
                    className="bg-white/5 border border-white/10 rounded px-3 py-1 text-sm flex-1"
                    autoFocus
                  />
                  <button 
                    onClick={handleCreateCrate}
                    className="px-3 py-1 text-sm bg-white/10 hover:bg-white/15 rounded-md transition-colors"
                  >
                    Create
                  </button>
                  <button 
                    onClick={() => {
                      setIsCreatingCrate(false);
                      setNewCrateName("");
                    }}
                    className="p-1 text-white/70 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : null}
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
                {crates.map(crate => (
                  <div key={crate.id} className="bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors cursor-pointer">
                    <div className="flex items-center mb-2">
                      <FolderClosed size={16} className="text-white/60 mr-2" />
                      <span className="text-sm font-medium text-white">{crate.name}</span>
                    </div>
                    <p className="text-xs text-white/50">{crate.tracks.length} tracks</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="glass-morphism rounded-lg overflow-hidden">
              <SearchResults 
                tracks={filteredTracks} 
                onAddToPlaylist={handleAddToPlaylist}
                playlistTracks={playlistTracks}
                onPlayTrack={handlePlayTrack}
                currentlyPlaying={currentTrack}
                isPaused={isPaused}
                onPauseTrack={handlePauseTrack}
                crates={crates}
                onAddToCrate={handleAddToCrate}
              />
            </div>
          </div>
          
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
    </div>
  );
};

export default Index;
