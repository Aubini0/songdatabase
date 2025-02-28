
import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "../components/ui/use-toast";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
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
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
          <input
            type="text"
            placeholder="Search songs, artists, albums..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
          />
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
