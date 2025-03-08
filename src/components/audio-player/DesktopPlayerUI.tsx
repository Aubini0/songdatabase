
import { Play, Pause, Volume2, VolumeX, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { formatTime } from "@/utils/audioUtils";
import { Track } from "@/types/music";

interface DesktopPlayerUIProps {
  currentTrack: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  handlePlayPause: () => void;
  handleSeek: (value: number[]) => void;
  handleVolumeChange: (value: number[]) => void;
  toggleMute: () => void;
  onClose?: () => void;
}

export const DesktopPlayerUI = ({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  handlePlayPause,
  handleSeek,
  handleVolumeChange,
  toggleMute,
  onClose
}: DesktopPlayerUIProps) => {
  return (
    <div className="flex items-center gap-4 w-full">
      <div className="flex items-center gap-4 min-w-[200px] w-[25%]">
        <button 
          onClick={handlePlayPause}
          className="p-2 rounded-full bg-white text-black hover:bg-white/90 transition-colors flex-shrink-0"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        
        <div className="truncate">
          <div className="font-medium truncate text-sm">{currentTrack.title}</div>
          <div className="text-xs text-white/70 truncate">{currentTrack.artist}</div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 flex-1 mx-4">
        <span className="text-xs text-white/70 w-10 text-right flex-shrink-0">
          {formatTime(currentTime)}
        </span>
        <Slider
          value={[currentTime]}
          min={0}
          max={duration || 100}
          step={1}
          onValueChange={handleSeek}
          className="w-full"
        />
        <span className="text-xs text-white/70 w-10 flex-shrink-0">
          {formatTime(duration)}
        </span>
      </div>
      
      <div className="flex items-center gap-4 min-w-[150px]">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-1 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          
          <Slider
            value={[isMuted ? 0 : volume]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-24"
          />
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close player"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
