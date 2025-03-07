
import { Search, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "../components/ui/use-toast";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onOpenUploadModal: () => void;
}

const SearchBar = ({ onSearch, onOpenUploadModal }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
    
    if (query.trim() === "") {
      toast({
        description: "Please enter a search term",
      });
    }
  };
  
  return (
    <div className="w-full glass-morphism p-5 rounded-xl mb-8 animate-fade-in">
      <form onSubmit={handleSearch} className="w-full flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
          <input
            type="text"
            placeholder="Search songs, artists, albums..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
          />
        </div>
        <button
          type="button"
          onClick={onOpenUploadModal}
          className="px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors flex items-center gap-2"
        >
          <Upload size={18} />
          <span>Upload</span>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
