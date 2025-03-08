
import { useState } from "react";
import { Track } from "@/components/TrackItem";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "@/components/Sidebar";
import AudioPlayer from "@/components/AudioPlayer";

const Broadcast = () => {
  const isMobile = useIsMobile();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  
  // This is a placeholder. In a real app, you would get this from global state
  const broadcastTracks: Track[] = [];
  
  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track);
  };
  
  const handleClosePlayer = () => {
    setCurrentTrack(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#0a0a0a] text-white flex">
      <Sidebar />
      
      <div className="flex-1 sm:ml-[220px]">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-12">
          <h1 className="text-2xl font-bold mb-6">Your Broadcast</h1>
          
          {broadcastTracks.length > 0 ? (
            <div className="border-t border-white/10">
              {/* Broadcast tracks list would go here */}
              <p className="p-4 text-white/70">Your broadcast tracks will appear here.</p>
            </div>
          ) : (
            <div className="p-8 text-center border border-white/10 rounded-lg bg-white/5">
              <p className="text-white/70">Your broadcast is empty. Add songs from the Song Pool.</p>
            </div>
          )}
          
          {currentTrack && (
            <AudioPlayer 
              currentTrack={currentTrack} 
              onClose={handleClosePlayer}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Broadcast;
