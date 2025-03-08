
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
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2 w-full">
        <button 
          onClick={handlePlayPause}
          className="p-1.5 rounded-full bg-white text-black hover:bg-white/90 transition-colors flex-shrink-0"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
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
        <span className="text-[0.6rem] text-white/70 w-6 text-right flex-shrink-0">
          {formatTime(currentTime)}
        </span>
        <Slider
          value={[currentTime]}
          min={0}
          max={duration || 100}
          step={1}
          onValueChange={handleSeek}
          className="flex-1"
        />
        <span className="text-[0.6rem] text-white/70 w-6 flex-shrink-0">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};
