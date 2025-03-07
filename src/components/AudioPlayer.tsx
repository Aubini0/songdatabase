
import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Track } from "./TrackItem";
import { useIsMobile } from "@/hooks/use-mobile";

interface AudioPlayerProps {
  currentTrack: Track | null;
  onClose: () => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const AudioPlayer = ({ currentTrack, onClose }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMobile = useIsMobile();
  
  // In a real app, this would be the actual audio file
  const audioSrc = "https://example.com/sample-audio.mp3";
  
  useEffect(() => {
    if (!audioRef.current) return;
    
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };
    
    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
      }
    };
    
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioRef.current.addEventListener('ended', handleEnded);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [audioRef]);
  
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      const newTime = value[0];
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  if (!currentTrack) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#121212] border-t border-white/10 px-3 py-2 sm:px-4 sm:py-3 z-50 text-white animate-slide-in-up">
      <audio 
        ref={audioRef} 
        src={audioSrc} 
        preload="metadata"
      />
      
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 mb-0 sm:mb-0 min-w-[80px] sm:min-w-[120px]">
            <button 
              onClick={handlePlayPause}
              className="p-1.5 sm:p-2 rounded-full bg-white text-black hover:bg-white/90 transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={isMobile ? 14 : 18} /> : <Play size={isMobile ? 14 : 18} />}
            </button>
            
            <div className="text-xs sm:text-sm truncate max-w-[60px] sm:max-w-full">
              <div className="font-medium truncate">{currentTrack.title}</div>
              <div className="text-[0.65rem] sm:text-xs text-white/70 truncate">{currentTrack.artist}</div>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col w-full gap-0 sm:gap-1">
            <div className="flex items-center gap-1 sm:gap-2 w-full">
              <span className="text-[0.6rem] sm:text-xs text-white/70 w-6 sm:w-10 text-right">
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
              <span className="text-[0.6rem] sm:text-xs text-white/70 w-6 sm:w-10">
                {formatTime(duration)}
              </span>
            </div>
          </div>
          
          {!isMobile && (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
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
                className="w-20"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
