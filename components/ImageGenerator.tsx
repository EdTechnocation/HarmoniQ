
import React, { useState } from 'react';
import { GeneratedImage } from '../types';
import { generateMusicImage } from '../services/geminiService';
import { Image as ImageIcon, Sparkles, Loader2, Download, Zap } from 'lucide-react';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<GeneratedImage[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    
    setLoading(true);
    try {
      const url = await generateMusicImage(prompt);
      const newImg: GeneratedImage = {
        url,
        prompt,
        size: '1K', // Default for Flash
        timestamp: Date.now()
      };
      setHistory(prev => [newImg, ...prev]);
    } catch (err: any) {
      console.error(err);
      alert("Error generating image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Background glow for the card */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 blur-3xl rounded-full" />
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <Sparkles className="text-indigo-400" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">Sonic Visualizer</h3>
              <div className="flex items-center gap-1.5 text-indigo-400">
                <Zap size={12} className="fill-current" />
                <span className="text-[10px] font-black uppercase tracking-widest">Fast Generation Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 relative z-10">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Visual Mood Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A golden violin floating in a cosmic ocean of sheet music..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all h-28 placeholder:text-slate-600 leading-relaxed"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-900/40 uppercase text-xs tracking-widest"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Rendering Visual...
                </>
              ) : (
                <>
                  <ImageIcon size={18} />
                  Generate Instant Art
                </>
              )}
            </button>
          </div>
          
          <p className="text-[10px] text-slate-600 text-center font-medium">
            Powered by Gemini 2.5 Flash Image. Optimized for creative speed and inspiration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {history.length === 0 && !loading && (
          <div className="md:col-span-2 h-48 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-slate-700">
            <ImageIcon size={32} className="mb-2 opacity-20" />
            <p className="text-xs font-bold uppercase tracking-widest opacity-40">Your gallery is empty</p>
          </div>
        )}
        {history.map((img) => (
          <div key={img.timestamp} className="group relative bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02]">
            <img src={img.url} alt={img.prompt} className="w-full aspect-video object-cover" />
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end backdrop-blur-sm">
              <p className="text-xs text-white font-medium line-clamp-3 mb-4 italic leading-relaxed">"{img.prompt}"</p>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest bg-indigo-600 px-3 py-1 rounded-full text-white shadow-lg">Fast Render</span>
                <a 
                  href={img.url} 
                  download={`harmoniq-${img.timestamp}.png`}
                  className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-all text-white border border-white/10"
                  title="Download Image"
                >
                  <Download size={16} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGenerator;
