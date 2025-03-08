
import { Search, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "../components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onOpenUploadModal: () => void;
}

const SearchBar = ({ onSearch, onOpenUploadModal }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const isMobile = useIsMobile();
  
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
    <div className={cn(
      "w-full flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in sticky top-0 z-30 pt-4 pb-4",
      "bg-[#121212] border-b border-white/10", // Solid background instead of gradient
      isMobile ? "px-3" : "px-4"
    )}>
      <form onSubmit={handleSearch} className="w-full flex-1">
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
      </form>
      
      <button
        type="button"
        onClick={onOpenUploadModal}
        className="px-4 py-3 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white transition-colors flex items-center justify-center gap-2 min-w-[120px]"
      >
        <Upload size={18} />
        <span>Upload</span>
      </button>
    </div>
  );
};

export default SearchBar;
