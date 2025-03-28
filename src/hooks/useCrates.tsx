
import { useState, useRef, useEffect } from "react";
import { Crate, Track } from "@/types/music";
import { toast } from "@/components/ui/use-toast";

export function useCrates(initialCrates: Crate[] = []) {
  const [crateCounter, setCrateCounter] = useState(1);
  const [crates, setCrates] = useState<Crate[]>(initialCrates);
  const [editingCrateId, setEditingCrateId] = useState<string | null>(null);
  const [selectedCrate, setSelectedCrate] = useState<Crate | null>(null);
  const editCrateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingCrateId && editCrateInputRef.current) {
      editCrateInputRef.current.focus();
    }
  }, [editingCrateId]);

  const handleCreateCrate = () => {
    const newCrateName = `Crate ${crateCounter}`;
    const newCrateId = `crate-${Date.now()}`;
    
    const newCrate: Crate = {
      id: newCrateId,
      name: newCrateName,
      tracks: []
    };
    
    setCrates(prev => [...prev, newCrate]);
    setCrateCounter(prev => prev + 1);
    
    setEditingCrateId(newCrateId);
    
    toast({
      description: `New crate created successfully`,
    });
  };
  
  const handleRenameCrate = (id: string, newName: string) => {
    if (!newName.trim()) return;
    
    setCrates(prev => 
      prev.map(crate => 
        crate.id === id ? { ...crate, name: newName.trim() } : crate
      )
    );
    
    setEditingCrateId(null);
  };
  
  const handleDeleteCrate = (crateId: string) => {
    setCrates(prev => prev.filter(crate => crate.id !== crateId));
    toast({
      description: "Crate deleted successfully",
    });
  };
  
  const handleOpenCrate = (crate: Crate) => {
    setSelectedCrate(crate);
  };
  
  const handleCloseCrateModal = () => {
    setSelectedCrate(null);
  };
  
  const handleAddToCrate = (trackId: string, crateId: string) => {
    setCrates(prevCrates => 
      prevCrates.map(crate => {
        if (crate.id === crateId) {
          if (crate.tracks.includes(trackId)) {
            return crate;
          }
          return {
            ...crate,
            tracks: [...crate.tracks, trackId]
          };
        }
        return crate;
      })
    );
  };
  
  const handleRemoveFromCrate = (crateId: string, trackId: string) => {
    setCrates(prevCrates => 
      prevCrates.map(crate => {
        if (crate.id === crateId) {
          return {
            ...crate,
            tracks: crate.tracks.filter(id => id !== trackId)
          };
        }
        return crate;
      })
    );
  };

  return {
    crates,
    editingCrateId,
    selectedCrate,
    editCrateInputRef,
    handleCreateCrate,
    handleRenameCrate,
    handleDeleteCrate,
    handleOpenCrate,
    handleCloseCrateModal,
    handleAddToCrate,
    handleRemoveFromCrate,
    setEditingCrateId
  };
}
