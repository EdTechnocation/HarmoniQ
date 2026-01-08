
import React from 'react';
import { NoteData } from '../types';

interface ViolinFingerboardProps {
  notes: NoteData[];
}

const ViolinFingerboard: React.FC<ViolinFingerboardProps> = ({ notes }) => {
  const strings = [1, 2, 3, 4]; // E, A, D, G
  const stringNames = ['E', 'A', 'D', 'G'];
  
  // Define positions (fret equivalents) for markers
  const positions = Array.from({ length: 13 }, (_, i) => i);

  const getNoteAt = (s: number, p: number) => {
    return notes.find(n => n.string === s && n.position === p);
  };

  return (
    <div className="bg-stone-950 p-10 rounded-2xl shadow-2xl overflow-x-auto border border-stone-800">
      <div className="relative min-w-[800px] h-48 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 rounded-lg shadow-inner">
        
        {/* String Labels */}
        <div className="absolute -left-8 inset-y-0 flex flex-col justify-between py-2 text-[10px] font-bold text-stone-500">
          {stringNames.map(name => <span key={name}>{name}</span>)}
        </div>

        {/* Strings */}
        <div className="absolute inset-0 flex flex-col justify-between py-[18px]">
          {strings.map(s => (
            <div key={s} className="h-[1px] bg-gradient-to-r from-stone-400 via-stone-200 to-stone-400 w-full opacity-60 shadow-sm" />
          ))}
        </div>

        {/* Fretless Markers (Learning Tapes) */}
        <div className="flex">
          {positions.map(p => (
            <div key={p} className={`relative flex-1 min-w-[60px] h-48 border-r border-white/5 last:border-r-0 ${[2, 4, 5, 7, 9, 11].includes(p) ? 'bg-white/5' : ''}`}>
              {/* Position Label */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-stone-600">
                {p === 0 ? 'NUT' : `${p}`}
              </div>

              {/* Learning Tape Marker */}
              {[2, 4, 5, 7].includes(p) && (
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/10" />
              )}

              {/* Notes */}
              <div className="absolute inset-0 flex flex-col justify-between py-1">
                {strings.map(s => {
                  const note = getNoteAt(s, p);
                  return (
                    <div key={s} className="h-10 flex items-center justify-center relative z-20">
                      {note && (
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xl transition-all duration-300 transform hover:scale-125 cursor-default
                          ${note.isRoot ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-300' : 'bg-indigo-500 text-white ring-1 ring-indigo-300'}`}>
                          {note.note}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 text-center text-[10px] text-stone-600 uppercase tracking-widest">
        Standard Tuning: G3, D4, A4, E5 • Fretless Position Guide
      </p>
    </div>
  );
};

export default ViolinFingerboard;
