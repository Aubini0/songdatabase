
import { useState } from "react";
import TrackItem from "./TrackItem";
import { Track, Crate } from "@/types/music";

interface SearchResultsProps {
  tracks: Track[];
  onAddToPlaylist: (track: Track) => void;
  playlistTracks: Track[];
  onPlayTrack: (track: Track) => void;
  currentlyPlaying: Track | null;
  isPaused: boolean;
  onPauseTrack: () => void;
  crates?: Crate[];
  onAddToCrate?: (trackId: string, crateId: string) => void;
  onDeleteTrack?: (trackId: string) => void;
}

const SearchResults = ({ 
  tracks, 
  onAddToPlaylist, 
  playlistTracks, 
  onPlayTrack,
  currentlyPlaying,
  isPaused,
  onPauseTrack,
  crates = [],
  onAddToCrate,
  onDeleteTrack
}: SearchResultsProps) => {
  if (tracks.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="p-6 rounded-lg bg-white/5 border border-white/10">
          <p className="text-white/70 text-sm sm:text-base">No tracks found. Try searching for something else.</p>
        </div>
      </div>
    );
  }

  const isInPlaylist = (track: Track) => {
    return playlistTracks.some(t => t.id === track.id);
  };

  const isTrackPlaying = (track: Track) => {
    return currentlyPlaying?.id === track.id && !isPaused;
  };

  return (
    <div className="overflow-hidden animate-fade-in">
      <div className="max-h-[350px] sm:max-h-[450px] overflow-y-auto scrollbar-none">
        {tracks.map(track => (
          <TrackItem 
            key={track.id} 
            track={track} 
            onAdd={onAddToPlaylist}
            isInPlaylist={isInPlaylist(track)}
            isPlaying={isTrackPlaying(track)}
            onPlay={onPlayTrack}
            onPause={onPauseTrack}
            crates={crates}
            onAddToCrate={onAddToCrate}
            onDeleteTrack={onDeleteTrack}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
