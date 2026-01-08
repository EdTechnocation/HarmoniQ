
import React from 'react';

interface PianoProps {
  highlightedKeys: number[]; // 0-11
}

const Piano: React.FC<PianoProps> = ({ highlightedKeys }) => {
  const keys = [
    { note: 'C', isBlack: false, index: 0 },
    { note: 'C#', isBlack: true, index: 1 },
    { note: 'D', isBlack: false, index: 2 },
    { note: 'D#', isBlack: true, index: 3 },
    { note: 'E', isBlack: false, index: 4 },
    { note: 'F', isBlack: false, index: 5 },
    { note: 'F#', isBlack: true, index: 6 },
    { note: 'G', isBlack: false, index: 7 },
    { note: 'G#', isBlack: true, index: 8 },
    { note: 'A', isBlack: false, index: 9 },
    { note: 'A#', isBlack: true, index: 10 },
    { note: 'B', isBlack: false, index: 11 },
  ];

  // Render 2 octaves
  const renderOctave = (octaveIndex: number) => (
    <div key={octaveIndex} className="flex relative h-48 w-full min-w-[300px]">
      {keys.map((key) => {
        const isHighlighted = highlightedKeys.includes(key.index);
        if (key.isBlack) {
          return (
            <div
              key={`${octaveIndex}-${key.index}`}
              className={`absolute top-0 w-6 h-28 z-10 rounded-b-sm border border-black shadow-md transition-all duration-300
                ${isHighlighted ? 'bg-blue-500 scale-y-105' : 'bg-zinc-900'}`}
              style={{ left: `${(octaveIndex * 7 + (key.index === 1 ? 1 : key.index === 3 ? 2 : key.index === 6 ? 4 : key.index === 8 ? 5 : 6)) * 40 - 12}px` }}
            />
          );
        }
        return (
          <div
            key={`${octaveIndex}-${key.index}`}
            className={`w-10 h-48 border border-slate-300 rounded-b-md transition-all duration-300
              ${isHighlighted ? 'bg-blue-400' : 'bg-slate-50'}`}
          />
        );
      })}
    </div>
  );

  return (
    <div className="flex bg-slate-800 p-6 rounded-xl shadow-2xl overflow-x-auto">
      <div className="flex">
        {renderOctave(0)}
        {renderOctave(1)}
      </div>
    </div>
  );
};

export default Piano;
