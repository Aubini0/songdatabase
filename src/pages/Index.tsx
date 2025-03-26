
import { useState, useMemo, useEffect, useRef } from "react";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import { Track, Crate } from "@/types/music";
import sampleTracks from "@/data/sampleTracks";
import { toast } from "@/components/ui/use-toast";
import UploadSongModal from "@/components/UploadSongModal";
import AudioPlayer from "@/components/audio-player";
import Sidebar from "@/components/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Plus, X, FolderClosed, Edit2 } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [allTracks, setAllTracks] = useState<Track[]>(sampleTracks);
  const isMobile = useIsMobile();
  
  // Crates state
  const [crateCounter, setCrateCounter] = useState(1);
  const [crates, setCrates] = useState<Crate[]>([
    { id: "1", name: "Favorites", tracks: [] },
    { id: "2", name: "Party Mix", tracks: [] }
  ]);
  const [editingCrateId, setEditingCrateId] = useState<string | null>(null);
  const editCrateInputRef = useRef<HTMLInputElement>(null);
  
  // Audio player state
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPaused, setIsPaused] = useState(true);
  
  // Focus the input when editing a crate name
  useEffect(() => {
    if (editingCrateId && editCrateInputRef.current) {
      editCrateInputRef.current.focus();
    }
  }, [editingCrateId]);
  
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
    const newCrateName = `Crate ${crateCounter}`;
    const newCrateId = `crate-${Date.now()}`;
    
    const newCrate: Crate = {
      id: newCrateId,
      name: newCrateName,
      tracks: []
    };
    
    setCrates(prev => [...prev, newCrate]);
    setCrateCounter(prev => prev + 1);
    
    // Start editing the new crate name
    setEditingCrateId(newCrateId);
    
    toast({
      description: `New crate created successfully`,
    });
  };
  
  const handleRenameCrate = (id: string, newName: string) => {
    if (!newName.trim()) return;
    
    setCrates(prev => 
      prev.map(crate => 
        crate.id === id ? { ...crate, name: newName.trim() } : crate
      )
    );
    
    setEditingCrateId(null);
  };
  
  const handleDeleteTrack = (trackId: string) => {
    // Remove track from all crates
    setCrates(prevCrates => 
      prevCrates.map(crate => ({
        ...crate,
        tracks: crate.tracks.filter(id => id !== trackId)
      }))
    );
    
    // Remove from playlist if present
    setPlaylistTracks(prev => prev.filter(t => t.id !== trackId));
    
    // Remove from all tracks
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
                  onClick={handleCreateCrate}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-white/10 hover:bg-white/15 rounded-md transition-colors"
                >
                  <Plus size={16} />
                  <span>New Crate</span>
                </button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
                {crates.map(crate => (
                  <div key={crate.id} className="bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors cursor-pointer crate-item">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center flex-1">
                        <FolderClosed size={16} className="text-white/60 mr-2 shrink-0" />
                        
                        {editingCrateId === crate.id ? (
                          <input
                            ref={editCrateInputRef}
                            type="text"
                            defaultValue={crate.name}
                            className="editable-crate-name-input bg-white/10"
                            onBlur={(e) => handleRenameCrate(crate.id, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleRenameCrate(crate.id, e.currentTarget.value);
                              } else if (e.key === 'Escape') {
                                setEditingCrateId(null);
                              }
                            }}
                          />
                        ) : (
                          <span 
                            className="text-sm font-medium text-white editable-crate-name truncate"
                            onClick={() => setEditingCrateId(crate.id)}
                          >
                            {crate.name}
                          </span>
                        )}
                      </div>
                      
                      {!editingCrateId && (
                        <button 
                          onClick={() => setEditingCrateId(crate.id)}
                          className="p-1 text-white/50 hover:text-white/80 transition-colors"
                        >
                          <Edit2 size={12} />
                        </button>
                      )}
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
                onDeleteTrack={handleDeleteTrack}
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
