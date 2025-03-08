import { useState } from "react";
import { Check, X, Play, Pause, Music, Plus } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Track } from "@/types/music";

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
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-all text-white"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
          )}
          
          <div className="w-8 h-8 flex items-center justify-center rounded bg-white/5 text-white/60">
            <Music size={14} />
          </div>
          
          <h3 className="font-medium text-white text-sm sm:text-base">{track.title}</h3>
        </div>
        <p className="text-xs sm:text-sm text-white/70 ml-10 sm:ml-0">{track.artist}</p>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        {track.duration && (
          <p className="text-xs sm:text-sm text-white/50">{track.duration}</p>
        )}
        
        <button
          onClick={() => onAdd(track)}
          className={`p-1.5 sm:p-2 rounded-full hover:bg-white/10 transition-all ${isInPlaylist ? 'visible' : 'invisible sm:visible'}`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          aria-label={isInPlaylist ? "Remove from playlist" : "Add to playlist"}
        >
          {isInPlaylist ? 
            (isHovering ? <X size={18} className="text-red-500" /> : <Check size={18} className="text-green-500" />) : 
            <Plus size={18} className="text-white/70" />}
        </button>
      </div>
    </div>
  );
};

export default TrackItem;
