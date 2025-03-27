
import React from 'react';
import { X } from 'lucide-react';
import { Track, Crate } from '@/types/music';
import TrackItem from './TrackItem';

interface CrateModalProps {
  crate: Crate;
  isOpen: boolean;
  onClose: () => void;
  tracks: Track[];
  onPlayTrack: (track: Track) => void;
  currentlyPlaying: Track | null;
  isPaused: boolean;
  onPauseTrack: () => void;
  onAddToPlaylist: (track: Track) => void;
  playlistTracks: Track[];
  crates: Crate[];
  onAddToCrate?: (trackId: string, crateId: string) => void;
  onDeleteTrack?: (trackId: string) => void;
}

const CrateModal: React.FC<CrateModalProps> = ({
  crate,
  isOpen,
  onClose,
  tracks,
  onPlayTrack,
  currentlyPlaying,
  isPaused,
  onPauseTrack,
  onAddToPlaylist,
  playlistTracks,
  crates,
  onAddToCrate,
  onDeleteTrack
}) => {
  if (!isOpen) return null;

  const crateTracksData = tracks.filter(track => crate.tracks.includes(track.id));
  
  const isInPlaylist = (track: Track) => {
    return playlistTracks.some(t => t.id === track.id);
  };

  const isTrackPlaying = (track: Track) => {
    return currentlyPlaying?.id === track.id && !isPaused;
  };

  // Prevent clicks inside the modal from closing it
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="crate-modal-overlay" onClick={onClose}>
      <div className="crate-modal-content" onClick={handleContentClick}>
        <div className="crate-modal-header">
          <h2 className="text-lg font-semibold text-white">{crate.name}</h2>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-1">
          {crateTracksData.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-white/70">No tracks in this crate yet.</p>
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto">
              {crateTracksData.map(track => (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default CrateModal;
