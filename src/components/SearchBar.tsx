
import { Search, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "../components/ui/use-toast";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onUpload: (file: File) => void;
}

const SearchBar = ({ onSearch, onUpload }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };
  
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpload(files[0]);
      toast({
        title: "Song uploaded",
        description: `${files[0].name} has been added to your library`,
      });
    }
  };
  
  return (
    <div className="w-full flex flex-col gap-4 md:flex-row md:items-center md:justify-between glass-morphism p-5 rounded-xl mb-8 animate-fade-in">
      <form onSubmit={handleSearch} className="flex-1">
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
      
      <div className="flex items-center">
        <label className="cursor-pointer flex items-center gap-2 px-5 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
          <Upload size={18} />
          <span>Upload</span>
          <input
            type="file"
            accept="audio/*"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default SearchBar;
