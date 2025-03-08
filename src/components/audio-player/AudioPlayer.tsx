
import { useRef } from "react";
import { Track } from "@/types/music";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { MobilePlayerUI } from "./MobilePlayerUI";
import { DesktopPlayerUI } from "./DesktopPlayerUI";

interface AudioPlayerProps {
  currentTrack: Track | null;
  onClose: () => void;
}

const AudioPlayer = ({ currentTrack, onClose }: AudioPlayerProps) => {
  const isMobile = useIsMobile();
  
  // Use the track's audioUrl if available, otherwise use a sample
  const audioSrc = currentTrack?.audioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
  
  const {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    handlePlayPause,
    handleSeek,
    handleVolumeChange,
    toggleMute
  } = useAudioPlayer({ audioSrc });
  
  if (!currentTrack) return null;
  
  return (
    <div className="fixed inset-x-0 bg-[#121212] border-t border-white/10 text-white animate-slide-in-up shadow-lg z-30"
      style={{ 
        bottom: isMobile ? "60px" : "0",
        padding: isMobile ? "8px 12px" : "12px 16px" 
      }}
    >
      <audio 
        ref={audioRef} 
        src={audioSrc} 
        preload="metadata"
      />
      
      <div className="w-full max-w-7xl mx-auto audio-player-container">
        {isMobile ? (
          <MobilePlayerUI
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            handlePlayPause={handlePlayPause}
            handleSeek={handleSeek}
            onClose={onClose}
          />
        ) : (
          <DesktopPlayerUI
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            isMuted={isMuted}
            handlePlayPause={handlePlayPause}
            handleSeek={handleSeek}
            handleVolumeChange={handleVolumeChange}
            toggleMute={toggleMute}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;
