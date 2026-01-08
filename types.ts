
export interface NoteData {
  note: string;
  fret?: number; // Used for guitar
  position?: number; // Used for violin (half-steps from nut)
  string: number;
  isRoot?: boolean;
}

export interface TheoryResponse {
  name: string;
  type: 'scale' | 'chord';
  notes: string[];
  intervals: string[];
  description: string;
  pianoKeys: number[]; // Indices 0-11 for C-B
  guitarPositions: NoteData[];
  violinPositions: NoteData[];
}

export type ImageSize = '1K' | '2K' | '4K';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  size: ImageSize;
  timestamp: number;
}
