// We need to update the import for Track
import { Track } from "@/types/music";

import TrackItem from "./TrackItem";

interface PlaylistProps {
  tracks: Track[];
  onRemove: (track: Track) => void;
  onPlayTrack: (track: Track) => void;
  currentlyPlaying: Track | null;
  isPaused: boolean;
  onPauseTrack: () => void;
}

const Playlist = ({ 
  tracks, 
  onRemove,
  onPlayTrack,
  currentlyPlaying,
  isPaused,
  onPauseTrack
}: PlaylistProps) => {
  if (tracks.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="p-6 rounded-lg bg-white/5 border border-white/10">
          <p className="text-white/70 text-sm sm:text-base">Your broadcast is empty. Add songs from the Song Pool.</p>
        </div>
      </div>
    );
  }

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
            onAdd={onRemove}
            isInPlaylist={true}
            isPlaying={isTrackPlaying(track)}
            onPlay={onPlayTrack}
            onPause={onPauseTrack}
          />
        ))}
      </div>
    </div>
  );
};

export default Playlist;
