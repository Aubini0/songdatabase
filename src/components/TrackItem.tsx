
import { useState, useRef } from "react";
import { Play, Pause, Music, MoreVertical, Plus } from "lucide-react";
import { Track, Crate } from "@/types/music";

interface TrackItemProps {
  track: Track;
  onAdd: (track: Track) => void;
  isInPlaylist?: boolean;
  isPlaying?: boolean;
  onPlay?: (track: Track) => void;
  onPause?: () => void;
  crates?: Crate[];
  onAddToCrate?: (trackId: string, crateId: string) => void;
}

const TrackItem = ({ 
  track, 
  onAdd, 
  isInPlaylist = false, 
  isPlaying = false,
  onPlay,
  onPause,
  crates = [],
  onAddToCrate
}: TrackItemProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  const handleAddToCrate = (e: React.MouseEvent, crateId: string) => {
    e.stopPropagation();
    if (onAddToCrate) {
      onAddToCrate(track.id, crateId);
      setDropdownOpen(false);
    }
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setDropdownOpen(false);
    }
  };

  // Add event listener when dropdown is open
  useState(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="track-item animate-enter" onClick={() => onAdd(track)}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <div className="flex items-center gap-2">
          {onPlay && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                isPlaying ? (onPause ? onPause() : undefined) : onPlay(track);
              }}
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
        
        {/* Three dots dropdown menu */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={toggleDropdown}
            className="p-1 rounded-full hover:bg-white/10 transition-all text-white/70"
            aria-label="More options"
          >
            <MoreVertical size={16} />
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 rounded-md bg-[#1a1a1a] border border-white/10 shadow-lg z-50">
              <div className="py-1">
                <p className="px-4 py-2 text-xs text-white/50">Add to Crate</p>
                {crates.length > 0 ? (
                  crates.map(crate => (
                    <button
                      key={crate.id}
                      className="flex items-center w-full px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                      onClick={(e) => handleAddToCrate(e, crate.id)}
                    >
                      <Plus size={14} className="mr-2" />
                      {crate.name}
                    </button>
                  ))
                ) : (
                  <p className="px-4 py-2 text-sm text-white/50">No crates created yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackItem;
