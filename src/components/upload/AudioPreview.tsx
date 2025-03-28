
import React from "react";
import { Play, Pause } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface AudioPreviewProps {
  audioUrl: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  formattedCurrentTime: string;
  formattedDuration: string;
  audioRef: React.RefObject<HTMLAudioElement>;
  onPlayPause: () => void;
  onTimeUpdate: () => void;
  onLoadedMetadata: () => void;
  onSeek: (value: number[]) => void;
  onEnded: () => void;
}

const AudioPreview = ({
  audioUrl,
  isPlaying,
  currentTime,
  duration,
  formattedCurrentTime,
  formattedDuration,
  audioRef,
  onPlayPause,
  onTimeUpdate,
  onLoadedMetadata,
  onSeek,
  onEnded
}: AudioPreviewProps) => {
  if (!audioUrl) return null;

  return (
    <div className="mt-4 rounded-lg bg-black/50 p-4 border border-white/15">
      <audio 
        ref={audioRef} 
        src={audioUrl}
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        className="hidden"
      />
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onPlayPause}
            className="play-button"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <span className="text-sm text-white/80 font-medium">Preview</span>
        </div>
        
        <div className="flex items-center gap-2 pt-2">
          <span className="time-display">{formattedCurrentTime}</span>
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={1}
            onValueChange={onSeek}
            className="flex-1"
          />
          <span className="time-display">{formattedDuration}</span>
        </div>
      </div>
    </div>
  );
};

export default AudioPreview;
