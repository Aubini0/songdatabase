
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration?: string;
  audioUrl?: string;
  imageUrl?: string;
}

export interface Crate {
  id: string;
  name: string;
  tracks: string[]; // Array of track IDs
}
