
import TrackItem, { Track } from "./TrackItem";

interface SearchResultsProps {
  tracks: Track[];
  onAddToPlaylist: (track: Track) => void;
  playlistTracks: Track[];
}

const SearchResults = ({ tracks, onAddToPlaylist, playlistTracks }: SearchResultsProps) => {
  if (tracks.length === 0) {
    return (
      <div className="glass-morphism rounded-xl p-8 text-center">
        <p className="text-white/70">No tracks found. Try searching for something else.</p>
      </div>
    );
  }

  const isInPlaylist = (track: Track) => {
    return playlistTracks.some(t => t.id === track.id);
  };

  return (
    <div className="glass-morphism rounded-xl overflow-hidden animate-fade-in">
      <div className="px-4 py-3 bg-white/5 border-b border-white/10">
        <h2 className="text-lg font-medium">Search Results</h2>
      </div>
      <div className="max-h-[400px] overflow-y-auto scrollbar-none">
        {tracks.map(track => (
          <TrackItem 
            key={track.id} 
            track={track} 
            onAdd={onAddToPlaylist}
            isInPlaylist={isInPlaylist(track)}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
