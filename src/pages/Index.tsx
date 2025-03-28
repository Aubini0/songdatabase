import React, { useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import AudioPlayer from "@/components/audio-player";
import Sidebar from "@/components/Sidebar";
import UploadSongModal from "@/components/upload/UploadSongModal";
import CratesSection from "@/components/crates/CratesSection";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCrates } from "@/hooks/useCrates";
import { usePlaylist } from "@/hooks/usePlaylist";
import sampleTracks from "@/data/sampleTracks";
import CrateModal from "@/components/CrateModal";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const isMobile = useIsMobile();
  
  // Initialize with default crates
  const cratesHook = useCrates([
    { id: "1", name: "Favorites", tracks: [] },
    { id: "2", name: "Party Mix", tracks: [] }
  ]);
  
  // Initialize with sample tracks
  const playlistHook = usePlaylist(sampleTracks);
  
  useEffect(() => {
    const body = document.body;
    
    if (playlistHook.currentTrack && isMobile) {
      body.style.paddingBottom = "140px";
    } else if (playlistHook.currentTrack) {
      body.style.paddingBottom = "80px";
    } else if (isMobile) {
      body.style.paddingBottom = "60px";
    } else {
      body.style.paddingBottom = "0";
    }
    
    return () => {
      body.style.paddingBottom = "0";
    };
  }, [playlistHook.currentTrack, isMobile]);

  const notifyCrateAction = (trackTitle: string, crateName: string, isAdding: boolean) => {
    if (isAdding) {
      toast({
        description: `${trackTitle} added to "${crateName}" crate`,
      });
    } else {
      toast({
        description: `${trackTitle} removed from "${crateName}" crate`,
      });
    }
  };

  // Handle adding track to crate with notification
  const handleAddToCrate = (trackId: string, crateId: string) => {
    cratesHook.handleAddToCrate(trackId, crateId);
    
    const track = playlistHook.allTracks.find(t => t.id === trackId);
    const crate = cratesHook.crates.find(c => c.id === crateId);
    
    if (track && crate) {
      notifyCrateAction(track.title, crate.name, true);
    }
  };

  // Handle removing track from crate with notification
  const handleRemoveFromCrate = (crateId: string, trackId: string) => {
    cratesHook.handleRemoveFromCrate(crateId, trackId);
    
    const track = playlistHook.allTracks.find(t => t.id === trackId);
    const crate = cratesHook.crates.find(c => c.id === crateId);
    
    if (track && crate) {
      notifyCrateAction(track.title, crate.name, false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#0a0a0a] text-white flex">
      <Sidebar />
      
      <div className="flex-1 sm:ml-[70px] sidebar-expanded:ml-[220px] transition-all duration-300">
        <div className="max-w-5xl mx-auto pb-6 sm:pb-20">
          <SearchBar 
            onSearch={playlistHook.handleSearch} 
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
          />
          
          <div className="px-3 sm:px-6">
            <CratesSection 
              crates={cratesHook.crates}
              editingCrateId={cratesHook.editingCrateId}
              editCrateInputRef={cratesHook.editCrateInputRef}
              onCreateCrate={cratesHook.handleCreateCrate}
              onRenameCrate={cratesHook.handleRenameCrate}
              onDeleteCrate={cratesHook.handleDeleteCrate}
              onOpenCrate={cratesHook.handleOpenCrate}
              setEditingCrateId={cratesHook.setEditingCrateId}
            />
            
            <div className="glass-morphism rounded-lg overflow-hidden">
              <SearchResults 
                tracks={playlistHook.filteredTracks} 
                onAddToPlaylist={playlistHook.handleAddToPlaylist}
                playlistTracks={playlistHook.playlistTracks}
                onPlayTrack={playlistHook.handlePlayTrack}
                currentlyPlaying={playlistHook.currentTrack}
                isPaused={playlistHook.isPaused}
                onPauseTrack={playlistHook.handlePauseTrack}
                crates={cratesHook.crates}
                onAddToCrate={handleAddToCrate}
                onDeleteTrack={playlistHook.handleDeleteTrack}
              />
            </div>
          </div>
          
          <UploadSongModal 
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            onUploadSuccess={playlistHook.handleUploadSuccess}
          />
          
          {cratesHook.selectedCrate && (
            <CrateModal
              crate={cratesHook.selectedCrate}
              isOpen={!!cratesHook.selectedCrate}
              onClose={cratesHook.handleCloseCrateModal}
              tracks={playlistHook.allTracks}
              onPlayTrack={playlistHook.handlePlayTrack}
              currentlyPlaying={playlistHook.currentTrack}
              isPaused={playlistHook.isPaused}
              onPauseTrack={playlistHook.handlePauseTrack}
              onAddToPlaylist={playlistHook.handleAddToPlaylist}
              playlistTracks={playlistHook.playlistTracks}
              crates={cratesHook.crates}
              onAddToCrate={handleAddToCrate}
              onDeleteTrack={playlistHook.handleDeleteTrack}
              onRemoveFromCrate={handleRemoveFromCrate}
            />
          )}
          
          {playlistHook.currentTrack && (
            <AudioPlayer 
              currentTrack={playlistHook.currentTrack} 
              onClose={playlistHook.handleClosePlayer}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
