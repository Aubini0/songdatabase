
import React from 'react';
import { X, Trash2 } from 'lucide-react';
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
  onRemoveFromCrate?: (crateId: string, trackId: string) => void;
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
  onDeleteTrack,
  onRemoveFromCrate
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

  // Handle removing a track specifically from this crate
  const handleRemoveFromCrate = (trackId: string) => {
    if (onRemoveFromCrate) {
      onRemoveFromCrate(crate.id, trackId);
    }
  };

  return (
    <div className="crate-modal-overlay" onClick={onClose}>
      <div className="crate-modal-content" onClick={handleContentClick}>
        <div className="crate-modal-header">
          <h2 className="text-lg font-semibold text-white">{crate.name}</h2>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          {crateTracksData.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-white/70">No tracks in this crate yet.</p>
              <p className="text-sm text-white/50 mt-2">Add tracks from the library to this crate.</p>
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto pr-1">
              {crateTracksData.map(track => (
                <div key={track.id} className="flex items-center animate-enter mb-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex-1">
                    <TrackItem 
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
                  </div>
                  <button 
                    onClick={() => handleRemoveFromCrate(track.id)}
                    className="p-2 text-white/50 hover:text-red-400 transition-colors mr-2" 
                    aria-label="Remove from crate"
                    title="Remove from crate"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrateModal;
