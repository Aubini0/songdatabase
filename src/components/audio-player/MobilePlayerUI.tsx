import { Play, Pause } from "lucide-react";
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
}

export const MobilePlayerUI = ({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  handlePlayPause,
  handleSeek
}: MobilePlayerUIProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <button 
          onClick={handlePlayPause}
          className="p-1.5 rounded-full bg-white text-black hover:bg-white/90 transition-colors"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>
        
        <div className="text-xs truncate flex-1">
          <div className="font-medium truncate">{currentTrack.title}</div>
          <div className="text-[0.65rem] text-white/70 truncate">{currentTrack.artist}</div>
        </div>
      </div>
      
      <div className="flex items-center gap-1 w-full">
        <span className="text-[0.6rem] text-white/70 w-6 text-right">
          {formatTime(currentTime)}
        </span>
        <Slider
          value={[currentTime]}
          min={0}
          max={duration || 100}
          step={1}
          onValueChange={handleSeek}
          className="flex-1 max-w-[85%] mx-auto"
        />
        <span className="text-[0.6rem] text-white/70 w-6">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};
