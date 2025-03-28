
import { Play, Pause, Volume2, VolumeX, X, SkipBack, SkipForward } from "lucide-react";
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
    <div className="flex items-center justify-between w-full h-full px-4">
      {/* Track info - left side */}
      <div className="flex items-center gap-3 min-w-[180px] max-w-[30%]">
        <div className="h-12 w-12 bg-neutral-800 rounded-md overflow-hidden flex-shrink-0 shadow-md border border-white/5">
          {currentTrack.imageUrl ? (
            <img 
              src={currentTrack.imageUrl} 
              alt={currentTrack.title} 
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-600/30 to-purple-800/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
            </div>
          )}
        </div>
        
        <div className="truncate">
          <div className="font-medium truncate text-sm">{currentTrack.title}</div>
          <div className="text-xs text-white/70 truncate">{currentTrack.artist}</div>
        </div>
      </div>
      
      {/* Player controls - center */}
      <div className="flex flex-col items-center max-w-[40%] w-full gap-1">
        <div className="flex items-center gap-4">
          <button 
            className="text-white/70 hover:text-white p-1.5 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Previous track"
          >
            <SkipBack size={16} />
          </button>
          
          <button 
            onClick={handlePlayPause}
            className="p-2 rounded-full bg-white text-black hover:bg-white/90 transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
          
          <button 
            className="text-white/70 hover:text-white p-1.5 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Next track"
          >
            <SkipForward size={16} />
          </button>
        </div>
        
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-white/70 w-8 text-right flex-shrink-0">
            {formatTime(currentTime)}
          </span>
          <div className="relative w-full group h-7 flex items-center">
            <Slider
              value={[currentTime]}
              min={0}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="w-full cursor-pointer"
            />
            <div className="absolute inset-0 -z-10 scale-y-0 opacity-0 group-hover:opacity-100 group-hover:scale-y-100 bg-white/5 rounded-full transition-all duration-150"></div>
          </div>
          <span className="text-xs text-white/70 w-8 flex-shrink-0">
            {formatTime(duration)}
          </span>
        </div>
      </div>
      
      {/* Volume controls - right side */}
      <div className="flex items-center gap-3 justify-end min-w-[180px] max-w-[30%]">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          
          <div className="relative w-24 group h-7 flex items-center">
            <Slider
              value={[isMuted ? 0 : volume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-full cursor-pointer"
            />
            <div className="absolute inset-0 -z-10 scale-y-0 opacity-0 group-hover:opacity-100 group-hover:scale-y-100 bg-white/5 rounded-full transition-all duration-150"></div>
          </div>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors ml-2"
            aria-label="Close player"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
