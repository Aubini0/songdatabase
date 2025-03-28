
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
    <div className="audio-player fixed bottom-0 left-0 right-0 w-full bg-gradient-to-r from-[#121212] via-[#1a1a1a] to-[#121212] border-t border-white/10 text-white shadow-lg z-50 backdrop-blur-md"
      style={{ 
        bottom: isMobile ? "60px" : "0",
        height: isMobile ? "auto" : "80px"
      }}
    >
      <audio 
        ref={audioRef} 
        src={audioSrc} 
        preload="metadata"
      />
      
      <div className="h-full w-full mx-auto flex items-center">
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
