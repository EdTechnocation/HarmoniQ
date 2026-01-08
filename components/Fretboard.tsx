
import React from 'react';
import { NoteData } from '../types';

interface FretboardProps {
  notes: NoteData[];
}

const Fretboard: React.FC<FretboardProps> = ({ notes }) => {
  const strings = [1, 2, 3, 4, 5, 6];
  const frets = Array.from({ length: 13 }, (_, i) => i); // 0 (open) to 12

  const getNoteAt = (s: number, f: number) => {
    return notes.find(n => n.string === s && n.fret === f);
  };

  return (
    <div className="bg-slate-900 p-8 rounded-xl shadow-2xl overflow-x-auto border border-slate-700">
      <div className="relative min-w-[800px]">
        {/* String Lines */}
        <div className="absolute inset-0 flex flex-col justify-between py-[12px]">
          {strings.map(s => (
            <div key={s} className="h-[2px] bg-slate-600 w-full shadow-sm" style={{ opacity: 1 - (s * 0.1) }} />
          ))}
        </div>

        {/* Fret Markers */}
        <div className="flex">
          {frets.map(f => (
            <div key={f} className="relative flex-1 min-w-[60px] h-40 border-r border-slate-500 last:border-r-0">
              {/* Fret Number */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-slate-500">
                {f === 0 ? 'NUT' : f}
              </div>

              {/* Inlays */}
              {[3, 5, 7, 9, 12].includes(f) && (
                <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-slate-800 rounded-full ${f === 12 ? 'shadow-[0_12px_0_#1e293b,0_-12px_0_#1e293b]' : ''}`} />
              )}

              {/* Notes */}
              <div className="absolute inset-0 flex flex-col justify-between py-1">
                {strings.map(s => {
                  const note = getNoteAt(s, f);
                  return (
                    <div key={s} className="h-6 flex items-center justify-center relative z-20">
                      {note && (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg transition-all duration-300 transform hover:scale-125 cursor-default
                          ${note.isRoot ? 'bg-red-500 text-white ring-2 ring-red-300' : 'bg-blue-500 text-white ring-1 ring-blue-300'}`}>
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
    </div>
  );
};

export default Fretboard;
