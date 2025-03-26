
import { useState, useRef, useEffect } from "react";
import { Play, Pause, Music, MoreVertical, Plus, Pencil, Trash2 } from "lucide-react";
import { Track, Crate } from "@/types/music";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TrackItemProps {
  track: Track;
  onAdd: (track: Track) => void;
  isInPlaylist?: boolean;
  isPlaying?: boolean;
  onPlay?: (track: Track) => void;
  onPause?: () => void;
  crates?: Crate[];
  onAddToCrate?: (trackId: string, crateId: string) => void;
  onDeleteTrack?: (trackId: string) => void;
}

const TrackItem = ({ 
  track, 
  onAdd, 
  isInPlaylist = false, 
  isPlaying = false,
  onPlay,
  onPause,
  crates = [],
  onAddToCrate,
  onDeleteTrack
}: TrackItemProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [addToCrateDialogOpen, setAddToCrateDialogOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  const handleAddToCrate = (e: React.MouseEvent, crateId: string) => {
    e.stopPropagation();
    if (onAddToCrate) {
      onAddToCrate(track.id, crateId);
      setAddToCrateDialogOpen(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);
  
  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setDropdownOpen(false);
    }
  };

  const handleDeleteTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteTrack) {
      onDeleteTrack(track.id);
      setDropdownOpen(false);
    }
  };

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
            <div className="absolute right-0 top-full mt-1 w-48 rounded-md bg-[#1a1a1a] border border-white/10 shadow-lg z-50 track-dropdown">
              <div className="py-1">
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAddToCrateDialogOpen(true);
                    setDropdownOpen(false);
                  }}
                >
                  <Plus size={14} className="mr-2" />
                  Add to Crate
                </button>
                
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Rename functionality to be implemented
                  }}
                >
                  <Pencil size={14} className="mr-2" />
                  Rename
                </button>
                
                {onDeleteTrack && (
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-white/10"
                    onClick={handleDeleteTrack}
                  >
                    <Trash2 size={14} className="mr-2" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add to Crate Dialog */}
      <Dialog open={addToCrateDialogOpen} onOpenChange={setAddToCrateDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Add to Crate</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-2 max-h-[300px] overflow-y-auto">
            {crates.length > 0 ? (
              crates.map(crate => (
                <button
                  key={crate.id}
                  className="flex items-center w-full p-3 rounded-md text-white/90 hover:bg-white/10 transition-colors text-left"
                  onClick={(e) => handleAddToCrate(e, crate.id)}
                >
                  <div className="flex-1">
                    <p className="font-medium">{crate.name}</p>
                    <p className="text-xs text-white/50">{crate.tracks.length} tracks</p>
                  </div>
                  <Plus size={16} className="text-white/50" />
                </button>
              ))
            ) : (
              <p className="text-center text-white/50 py-4">No crates yet. Create one first.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrackItem;
