
import TrackItem, { Track } from "./TrackItem";

interface PlaylistProps {
  tracks: Track[];
  onAddToPlaylist: (track: Track) => void;
}

const Playlist = ({ tracks, onAddToPlaylist }: PlaylistProps) => {
  if (tracks.length === 0) {
    return (
      <div className="glass-morphism rounded-xl p-8 text-center mt-8">
        <p className="text-white/70">Your playlist is empty. Add tracks from search results.</p>
      </div>
    );
  }

  return (
    <div className="glass-morphism rounded-xl overflow-hidden mt-8 animate-fade-in">
      <div className="px-4 py-3 bg-white/5 border-b border-white/10">
        <h2 className="text-lg font-medium">Your Playlist</h2>
      </div>
      <div className="max-h-[400px] overflow-y-auto scrollbar-none">
        {tracks.map(track => (
          <TrackItem 
            key={track.id} 
            track={track} 
            onAdd={onAddToPlaylist}
            isInPlaylist={true}
          />
        ))}
      </div>
    </div>
  );
};

export default Playlist;
