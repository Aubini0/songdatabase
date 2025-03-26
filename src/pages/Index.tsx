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
import { Plus, X, FolderClosed, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem 
} from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [allTracks, setAllTracks] = useState<Track[]>(sampleTracks);
  const isMobile = useIsMobile();
  
  const [crateCounter, setCrateCounter] = useState(1);
  const [crates, setCrates] = useState<Crate[]>([
    { id: "1", name: "Favorites", tracks: [] },
    { id: "2", name: "Party Mix", tracks: [] }
  ]);
  const [editingCrateId, setEditingCrateId] = useState<string | null>(null);
  const editCrateInputRef = useRef<HTMLInputElement>(null);
  
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPaused, setIsPaused] = useState(true);
  
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
  
  const handleAddToCrate = (trackId: string, crateId: string) => {
    setCrates(prevCrates => 
      prevCrates.map(crate => {
        if (crate.id === crateId) {
          if (crate.tracks.includes(trackId)) {
            return crate;
          }
          return {
            ...crate,
            tracks: [...crate.tracks, trackId]
          };
        }
        return crate;
      })
    );
    
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
    setCrates(prevCrates => 
      prevCrates.map(crate => ({
        ...crate,
        tracks: crate.tracks.filter(id => id !== trackId)
      }))
    );
    
    setPlaylistTracks(prev => prev.filter(t => t.id !== trackId));
    
    setAllTracks(prev => prev.filter(t => t.id !== trackId));
    
    toast({
      description: `Track deleted successfully`,
    });
  };
  
  const handleDeleteCrate = (crateId: string) => {
    setCrates(prev => prev.filter(crate => crate.id !== crateId));
    toast({
      description: "Crate deleted successfully",
    });
  };
  
  const filteredTracks = useMemo(() => {
    if (!searchQuery.trim()) return allTracks;
    
    return allTracks.filter(track => 
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allTracks]);

  useEffect(() => {
    const body = document.body;
    
    if (currentTrack && isMobile) {
      body.style.paddingBottom = "140px";
    } else if (currentTrack) {
      body.style.paddingBottom = "80px";
    } else if (isMobile) {
      body.style.paddingBottom = "60px";
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
              
              <div className="crates-scroll-container">
                <ScrollArea className="w-full whitespace-nowrap pb-4" orientation="horizontal">
                  <div className="flex space-x-4 p-1">
                    {crates.map(crate => (
                      <div key={crate.id} className="bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors cursor-pointer crate-item min-w-[180px] max-w-[220px]">
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
                                className="text-sm font-medium text-white truncate"
                              >
                                {crate.name}
                              </span>
                            )}
                          </div>
                          
                          {!editingCrateId && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button 
                                  className="p-1 text-white/50 hover:text-white/80 transition-colors"
                                >
                                  <MoreVertical size={14} />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/10 text-white">
                                <DropdownMenuItem 
                                  className="flex items-center cursor-pointer text-white/80 hover:text-white focus:text-white" 
                                  onClick={() => setEditingCrateId(crate.id)}
                                >
                                  <Pencil size={14} className="mr-2" />
                                  <span>Rename</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="flex items-center cursor-pointer text-red-400 hover:text-red-300 focus:text-red-300" 
                                  onClick={() => handleDeleteCrate(crate.id)}
                                >
                                  <Trash2 size={14} className="mr-2" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                        <p className="text-xs text-white/50">{crate.tracks.length} tracks</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
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
