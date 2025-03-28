
import { Play, Pause, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { formatTime } from "@/utils/audioUtils";
import { Track } from "@/types/music";

interface MobilePlayerUIProps {
  currentTrack: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  handlePlayPause: () => void;
  handleSeek: (value: number[]) => void;
  onClose?: () => void;
}

export const MobilePlayerUI = ({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  handlePlayPause,
  handleSeek,
  onClose
}: MobilePlayerUIProps) => {
  return (
    <div className="flex flex-col gap-2 w-full px-3 py-2">
      <div className="flex items-center gap-2 w-full">
        {currentTrack.imageUrl ? (
          <img 
            src={currentTrack.imageUrl} 
            alt={currentTrack.title} 
            className="h-10 w-10 object-cover rounded-md flex-shrink-0 border border-white/10"
          />
        ) : (
          <div className="h-10 w-10 rounded-md flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-purple-600/30 to-purple-800/30 border border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          </div>
        )}
        
        <button 
          onClick={handlePlayPause}
          className="p-2 rounded-full bg-white text-black hover:bg-white/90 transition-colors flex-shrink-0"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
        </button>
        
        <div className="text-xs truncate flex-1 mr-2">
          <div className="font-medium truncate">{currentTrack.title}</div>
          <div className="text-[0.65rem] text-white/70 truncate">{currentTrack.artist}</div>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        )}
      </div>
      
      <div className="flex items-center gap-1 w-full">
        <span className="text-[0.6rem] text-white/70 w-7 text-right flex-shrink-0">
          {formatTime(currentTime)}
        </span>
        <div className="relative w-full group h-6 flex items-center">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="flex-1"
          />
          <div className="absolute inset-0 -z-10 scale-y-0 opacity-0 group-hover:opacity-100 group-hover:scale-y-100 bg-white/5 rounded-full transition-all duration-150"></div>
        </div>
        <span className="text-[0.6rem] text-white/70 w-7 flex-shrink-0">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};
