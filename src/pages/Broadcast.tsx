
import { useState, useEffect } from "react";
import { Track } from "@/types/music";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "@/components/Sidebar";
import AudioPlayer from "@/components/audio-player";

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

  // Add padding to the bottom of the page when audio player or mobile nav is visible
  useEffect(() => {
    const body = document.body;
    if (currentTrack && isMobile) {
      body.style.paddingBottom = "160px"; // Space for both player and mobile nav
    } else if (currentTrack) {
      body.style.paddingBottom = "80px"; // Just for player on desktop
    } else if (isMobile) {
      body.style.paddingBottom = "60px"; // Just for mobile nav
    } else {
      body.style.paddingBottom = "0";
    }
    
    return () => {
      body.style.paddingBottom = "0";
    };
  }, [currentTrack, isMobile]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#0a0a0a] text-white flex">
      <Sidebar />
      
      <div className="flex-1 sm:ml-[70px] sidebar-expanded:ml-[220px] transition-all duration-300">
        <div className="max-w-5xl mx-auto py-6 sm:py-12">
          <div className="px-3 sm:px-4">
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
          </div>
          
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
