
import { useState, useRef, useEffect } from "react";
import { formatTime } from "@/utils/audioUtils";

export const useAudioPreview = (audioFile: File | null) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create/destroy audio preview URL when file changes
  useEffect(() => {
    if (audioFile) {
      if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl);
      }
      
      const previewUrl = URL.createObjectURL(audioFile);
      setAudioPreviewUrl(previewUrl);
      setIsPlaying(false);
      setCurrentTime(0);
    }
    
    return () => {
      if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl);
      }
    };
  }, [audioFile]);

  const handleAudioMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !audioPreviewUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      const newTime = value[0];
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  return {
    audioRef,
    audioPreviewUrl,
    isPlaying,
    setIsPlaying,
    currentTime,
    duration,
    handleAudioMetadata,
    handleAudioTimeUpdate,
    handlePlayPause,
    handleSeek,
    handleEnded,
    formattedCurrentTime: formatTime(currentTime),
    formattedDuration: formatTime(duration)
  };
};
