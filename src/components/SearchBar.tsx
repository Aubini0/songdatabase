
import { Search, Upload, Music } from "lucide-react";
import { useState } from "react";
import { toast } from "../components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

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
      "w-full flex flex-col sm:flex-row gap-4 mb-6 animate-fade-in sticky top-0 z-30 pt-4 pb-4",
      "bg-gradient-to-b from-[#121212] via-[#121212] to-[#121212]/95 backdrop-blur-sm border-b border-white/10", 
      isMobile ? "px-3" : "px-6"
    )}>
      <form onSubmit={handleSearch} className="w-full flex-1">
        <div className="relative flex-grow group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search songs, artists, albums..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/60 border border-white/10 text-white shadow-inner shadow-black/30
              focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all"
          />
        </div>
      </form>
      
      <Button
        onClick={onOpenUploadModal}
        className={cn(
          "rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-medium shadow-md transition-all duration-300 flex items-center gap-2",
          isMobile ? "py-2 px-3" : "py-2.5 px-4"
        )}
      >
        <Upload size={isMobile ? 16 : 18} className="text-white/90" />
        <span>Upload</span>
      </Button>
    </div>
  );
};

export default SearchBar;
