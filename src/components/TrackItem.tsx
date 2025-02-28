
import { useState } from "react";
import { Music, Plus, Check, X } from "lucide-react";

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  coverArt: string;
  albumType?: string;
  duration?: string;
}

interface TrackItemProps {
  track: Track;
  onAdd: (track: Track) => void;
  isInPlaylist?: boolean;
}

const TrackItem = ({ track, onAdd, isInPlaylist = false }: TrackItemProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="track-item animate-enter">
      <div className="flex items-center gap-4">
        <div className="relative w-14 h-14 flex-shrink-0">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
              <Music className="text-white/50" size={20} />
            </div>
          )}
          <img
            src={track.coverArt}
            alt={`${track.title} by ${track.artist}`}
            className={`w-full h-full object-cover rounded-md ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-white">{track.title}</h3>
            {track.albumType && (
              <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-white/70">
                {track.albumType}
              </span>
            )}
          </div>
          <p className="text-sm text-white/70">{track.artist}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {track.album && (
          <p className="text-sm text-white/50 hidden md:block">{track.album}</p>
        )}
        {track.duration && (
          <p className="text-sm text-white/50">{track.duration}</p>
        )}
        <button
          onClick={() => onAdd(track)}
          className="p-2 rounded-full hover:bg-white/10 transition-all"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {isInPlaylist ? (
            isHovering ? <X size={20} className="text-red-500" /> : <Check size={20} className="text-green-500" />
          ) : (
            <Plus size={20} className="text-white" />
          )}
        </button>
      </div>
    </div>
  );
};

export default TrackItem;
