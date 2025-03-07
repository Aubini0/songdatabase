
import { useState } from "react";
import { Plus, Check, X, Play, Pause } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration?: string;
}

interface TrackItemProps {
  track: Track;
  onAdd: (track: Track) => void;
  isInPlaylist?: boolean;
  isPlaying?: boolean;
  onPlay?: (track: Track) => void;
  onPause?: () => void;
}

const TrackItem = ({ 
  track, 
  onAdd, 
  isInPlaylist = false, 
  isPlaying = false,
  onPlay,
  onPause
}: TrackItemProps) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="track-item animate-enter">
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <div className="flex items-center gap-2">
          {onPlay && (
            <button
              onClick={isPlaying ? (onPause ? () => onPause() : undefined) : () => onPlay(track)}
              className="p-1 rounded-full hover:bg-white/10 transition-all text-white"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
          )}
          <h3 className="font-medium text-white text-sm sm:text-base">{track.title}</h3>
        </div>
        <p className="text-xs sm:text-sm text-white/70">{track.artist}</p>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        {track.duration && (
          <p className="text-xs sm:text-sm text-white/50">{track.duration}</p>
        )}
        {!isInPlaylist && (
          <button
            onClick={() => onAdd(track)}
            className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 transition-all"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            aria-label="Add to playlist"
          >
            <Plus size={18} className="text-white" />
          </button>
        )}
        {isInPlaylist && (
          <button
            onClick={() => onAdd(track)}
            className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 transition-all"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            aria-label="Remove from playlist"
          >
            {isHovering ? <X size={18} className="text-red-500" /> : <Check size={18} className="text-green-500" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default TrackItem;
