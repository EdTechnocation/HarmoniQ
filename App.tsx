
import React, { useState } from 'react';
import { TheoryResponse } from './types';
import { getTheoryData } from './services/geminiService';
import Piano from './components/Piano';
import Fretboard from './components/Fretboard';
import ViolinFingerboard from './components/ViolinFingerboard';
import ChatBot from './components/ChatBot';
import ImageGenerator from './components/ImageGenerator';
import { Search, Music, Layout, MessageSquare, Palette, Loader2, Sparkles, BookOpen, ChevronRight } from 'lucide-react';

type Tab = 'visualizer' | 'chat' | 'art';

const App: React.FC = () => {
  const [query, setQuery] = useState('D Major scale');
  const [data, setData] = useState<TheoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('visualizer');

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const result = await getTheoryData(query);
      setData(result);
      setActiveTab('visualizer');
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Try something like 'A minor melodic scale' or 'G Major chord'.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Music className="text-white" size={20} />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white block leading-none">
                HarmoniQ
              </span>
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
                Strings Edition
              </span>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search scales, chords, positions..."
                className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-200 placeholder:text-slate-600"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-1.5 rounded-full text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={14} /> : 'Analyze'}
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<Layout size={18}/>} label="Lab" />
            <TabButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageSquare size={18}/>} label="Tutor" />
            <TabButton active={activeTab === 'art'} onClick={() => setActiveTab('art')} icon={<Palette size={18}/>} label="Gallery" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        {activeTab === 'visualizer' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {data ? (
              <>
                {/* Intro Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-4">
                      <h2 className="text-5xl font-black text-white tracking-tight">{data.name}</h2>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest">
                          {data.type}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-xl font-light max-w-3xl">
                      {data.description}
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                    <div className="flex items-center gap-2 mb-6 text-indigo-400 border-b border-white/5 pb-4">
                      <BookOpen size={20} />
                      <h3 className="font-black uppercase text-xs tracking-[0.2em]">Theory Breakdown</h3>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-widest">Notes in sequence</p>
                        <div className="flex flex-wrap gap-2">
                          {data.notes.map((n, i) => (
                            <div key={n} className="flex items-center">
                              <span className="px-3 py-1.5 bg-slate-900 border border-white/10 rounded-xl text-sm font-bold text-white shadow-xl">
                                {n}
                              </span>
                              {i < data.notes.length - 1 && <ChevronRight size={14} className="mx-1 text-slate-700" />}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-widest">Interval intervals</p>
                        <div className="flex flex-wrap gap-2">
                          {data.intervals.map(i => (
                            <span key={i} className="px-3 py-1 bg-indigo-950/50 border border-indigo-500/20 rounded-lg text-xs font-mono text-indigo-400">
                              {i}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Violin Section (Primary) */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                        <Music className="text-amber-500" size={16} />
                      </div>
                      <h3 className="uppercase text-xs font-black tracking-[0.3em] text-slate-500">Violin Master View</h3>
                    </div>
                    <span className="text-[10px] text-slate-600 font-mono">Standard Tuning G-D-A-E</span>
                  </div>
                  <ViolinFingerboard notes={data.violinPositions} />
                </section>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                  {/* Piano Section */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                        <Layout className="text-blue-500" size={16} />
                      </div>
                      <h3 className="uppercase text-xs font-black tracking-[0.3em] text-slate-500">Keyboard Map</h3>
                    </div>
                    <Piano highlightedKeys={data.pianoKeys} />
                  </section>

                  {/* Guitar Section */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                        <Music className="text-indigo-500" size={16} />
                      </div>
                      <h3 className="uppercase text-xs font-black tracking-[0.3em] text-slate-500">Guitar Fretboard (Reference)</h3>
                    </div>
                    <Fretboard notes={data.guitarPositions} />
                  </section>
                </div>
              </>
            ) : (
              <div className="h-[70vh] flex flex-col items-center justify-center text-center space-y-8">
                <div className="relative group">
                  <div className="absolute inset-0 blur-3xl bg-indigo-500/30 rounded-full group-hover:bg-indigo-500/50 transition-all duration-1000" />
                  <div className="relative z-10 w-24 h-24 bg-slate-900 border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Music size={48} className="text-indigo-500" />
                  </div>
                </div>
                <div className="space-y-3 max-w-lg">
                  <h2 className="text-4xl font-black text-white tracking-tight italic">Unlock the Strings.</h2>
                  <p className="text-slate-500 text-lg font-light leading-relaxed">
                    Search for any scale or chord to see its fingerprint across violin, piano, and guitar.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  {['G Major scale', 'A Harmonic minor', 'C Dominant 7th', 'D Dorian mode'].map(t => (
                    <button 
                      key={t}
                      onClick={() => { setQuery(t); handleSearch(); }}
                      className="px-6 py-3 bg-white/5 hover:bg-indigo-600 hover:text-white border border-white/10 hover:border-indigo-500 rounded-2xl text-sm font-bold transition-all text-slate-400 shadow-lg"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="max-w-4xl mx-auto py-8">
            <ChatBot />
          </div>
        )}

        {activeTab === 'art' && (
          <div className="max-w-4xl mx-auto py-8">
            <ImageGenerator />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center space-y-4">
        <div className="flex items-center justify-center gap-3 text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">
          <Sparkles size={14} className="text-indigo-500" />
          <span>Multimodal Intelligence by Gemini 3</span>
        </div>
        <p className="text-[9px] text-slate-700 max-w-xs mx-auto leading-relaxed">
          Designed for violinists and string enthusiasts. Accuracy depends on AI generation; always verify with a teacher.
        </p>
      </footer>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
    }`}
  >
    {icon}
    <span className="hidden lg:inline">{label}</span>
  </button>
);

export default App;
