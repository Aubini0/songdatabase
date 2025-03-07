
import { useState } from "react";
import { Plus, Check, X } from "lucide-react";

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
}

const TrackItem = ({ track, onAdd, isInPlaylist = false }: TrackItemProps) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="track-item animate-enter">
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <h3 className="font-medium text-white text-sm sm:text-base">{track.title}</h3>
        <p className="text-xs sm:text-sm text-white/70">{track.artist}</p>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        {track.duration && (
          <p className="text-xs sm:text-sm text-white/50">{track.duration}</p>
        )}
        <button
          onClick={() => onAdd(track)}
          className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 transition-all"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          aria-label={isInPlaylist ? "Remove from playlist" : "Add to playlist"}
        >
          {isInPlaylist ? (
            isHovering ? <X size={18} className="text-red-500" /> : <Check size={18} className="text-green-500" />
          ) : (
            <Plus size={18} className="text-white" />
          )}
        </button>
      </div>
    </div>
  );
};

export default TrackItem;
