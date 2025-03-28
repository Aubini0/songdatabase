
import React, { useState } from "react";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import { Track, Crate } from "@/types/music";

interface SearchResultsSectionProps {
  filteredTracks: Track[];
  playlistTracks: Track[];
  currentTrack: Track | null;
  isPaused: boolean;
  crates: Crate[];
  onSearch: (query: string) => void;
  onOpenUploadModal: () => void;
  onAddToPlaylist: (track: Track) => void;
  onPlayTrack: (track: Track) => void;
  onPauseTrack: () => void;
  onAddToCrate: (trackId: string, crateId: string) => void;
  onDeleteTrack: (trackId: string) => void;
}

const SearchResultsSection = ({
  filteredTracks,
  playlistTracks,
  currentTrack,
  isPaused,
  crates,
  onSearch,
  onOpenUploadModal,
  onAddToPlaylist,
  onPlayTrack,
  onPauseTrack,
  onAddToCrate,
  onDeleteTrack
}: SearchResultsSectionProps) => {
  return (
    <>
      <SearchBar 
        onSearch={onSearch} 
        onOpenUploadModal={onOpenUploadModal}
      />
      
      <div className="px-3 sm:px-6">
        <div className="glass-morphism rounded-lg overflow-hidden">
          <SearchResults 
            tracks={filteredTracks} 
            onAddToPlaylist={onAddToPlaylist}
            playlistTracks={playlistTracks}
            onPlayTrack={onPlayTrack}
            currentlyPlaying={currentTrack}
            isPaused={isPaused}
            onPauseTrack={onPauseTrack}
            crates={crates}
            onAddToCrate={onAddToCrate}
            onDeleteTrack={onDeleteTrack}
          />
        </div>
      </div>
    </>
  );
};

export default SearchResultsSection;
