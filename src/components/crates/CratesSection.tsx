
import React from "react";
import { Crate } from "@/types/music";
import { Plus, FolderClosed, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CratesSectionProps {
  crates: Crate[];
  editingCrateId: string | null;
  editCrateInputRef: React.RefObject<HTMLInputElement>;
  onCreateCrate: () => void;
  onRenameCrate: (id: string, newName: string) => void;
  onDeleteCrate: (id: string) => void;
  onOpenCrate: (crate: Crate) => void;
  setEditingCrateId: (id: string | null) => void;
}

const CratesSection: React.FC<CratesSectionProps> = ({
  crates,
  editingCrateId,
  editCrateInputRef,
  onCreateCrate,
  onRenameCrate,
  onDeleteCrate,
  onOpenCrate,
  setEditingCrateId
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-white">Your Crates</h2>
        <button 
          onClick={onCreateCrate}
          className="flex items-center gap-1 px-3 py-1 text-sm bg-white/10 hover:bg-white/15 rounded-md transition-colors"
        >
          <Plus size={16} />
          <span>New Crate</span>
        </button>
      </div>
      
      <div className="crates-scroll-container">
        <ScrollArea className="w-full crates-scroll">
          <div className="flex space-x-4 p-1">
            {crates.map(crate => (
              <div 
                key={crate.id} 
                className="bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors cursor-pointer crate-item min-w-[180px] max-w-[220px]"
                onClick={() => !editingCrateId && onOpenCrate(crate)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center flex-1">
                    <FolderClosed size={16} className="text-white/60 mr-2 shrink-0" />
                    
                    {editingCrateId === crate.id ? (
                      <input
                        ref={editCrateInputRef}
                        type="text"
                        defaultValue={crate.name}
                        className="editable-crate-name-input bg-white/10"
                        onBlur={(e) => onRenameCrate(crate.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            onRenameCrate(crate.id, e.currentTarget.value);
                          } else if (e.key === 'Escape') {
                            setEditingCrateId(null);
                          }
                        }}
                      />
                    ) : (
                      <span 
                        className="text-sm font-medium text-white truncate"
                      >
                        {crate.name}
                      </span>
                    )}
                  </div>
                  
                  {!editingCrateId && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button 
                          className="p-1 text-white/50 hover:text-white/80 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical size={14} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/10 text-white">
                        <DropdownMenuItem 
                          className="flex items-center cursor-pointer text-white/80 hover:text-white focus:text-white" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingCrateId(crate.id);
                          }}
                        >
                          <Pencil size={14} className="mr-2" />
                          <span>Rename</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="flex items-center cursor-pointer text-red-400 hover:text-red-300 focus:text-red-300" 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCrate(crate.id);
                          }}
                        >
                          <Trash2 size={14} className="mr-2" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <p className="text-xs text-white/50">{crate.tracks.length} tracks</p>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="scrollbar" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default CratesSection;
