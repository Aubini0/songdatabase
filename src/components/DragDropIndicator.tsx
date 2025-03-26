
import React from 'react';
import { Upload } from 'lucide-react';

interface DragDropIndicatorProps {
  active: boolean;
}

const DragDropIndicator = ({ active }: DragDropIndicatorProps) => {
  if (!active) return null;
  
  return (
    <div className={`file-drop-active-indicator ${active ? 'active' : ''}`}>
      <div className="drop-icon">
        <Upload size={64} strokeWidth={1.5} />
      </div>
      <div className="drop-text">Drop files to upload</div>
    </div>
  );
};

export default DragDropIndicator;
