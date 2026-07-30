import React, { useState, useEffect } from 'react';
import { ASLSign } from '../types';

interface ASLDictionaryModalProps {
  onClose: () => void;
  onSelectSignToPractice?: (sign: string) => void;
}

export const ASLDictionaryModal: React.FC<ASLDictionaryModalProps> = ({
  onClose,
  onSelectSignToPractice,
}) => {
  const [signs, setSigns] = useState<ASLSign[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    fetch(`/api/dictionary?q=${encodeURIComponent(search)}`)
      .then(res => res.json())
      .then(data => setSigns(data))
      .catch(err => console.error("Failed to load ASL dictionary:", err));
  }, [search]);

  const categories = ['All', 'Greetings', 'Polite', 'Tech & Workplace', 'Common'];

  const filtered = signs.filter(s =>
    selectedCategory === 'All' || s.category === selectedCategory
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#121c2a]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-[#c3c6d6]/30">
        
        {/* Top Header */}
        <div className="p-6 bg-[#0040a1] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[28px] text-[#89f5e7]">menu_book</span>
            <div>
              <h2 className="font-headline-lg text-xl font-bold">ASL Gesture Dictionary</h2>
              <p className="text-xs text-white/80">Search hand shapes, joint movements, and sign meanings.</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Search & Categories */}
        <div className="p-6 bg-[#f8f9ff] border-b border-[#c3c6d6]/30 space-y-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#737785]">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sign by keyword (e.g., HELLO, MEETING, HELP)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#c3c6d6]/40 rounded-xl text-sm focus:outline-none focus:border-[#0040a1]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                  selectedCategory === cat ? 'bg-[#0040a1] text-white' : 'bg-white text-[#424654] border border-[#c3c6d6]/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Signs Grid */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {filtered.map(sign => (
            <div key={sign.id} className="p-4 bg-[#f8f9ff] rounded-2xl border border-[#c3c6d6]/30 hover:border-[#0040a1] transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-headline-lg text-lg text-[#0040a1]">{sign.sign}</span>
                <span className="px-2.5 py-0.5 bg-[#dee9fc] text-[#0040a1] rounded-full text-xs font-bold">
                  {sign.category}
                </span>
              </div>

              <p className="text-sm text-[#121c2a] leading-relaxed">{sign.description}</p>

              <div className="grid sm:grid-cols-2 gap-2 text-xs text-[#424654] pt-2 border-t border-[#c3c6d6]/20">
                <div><strong className="text-[#121c2a]">Handshape:</strong> {sign.handshape}</div>
                <div><strong className="text-[#121c2a]">Movement:</strong> {sign.movement}</div>
              </div>

              {onSelectSignToPractice && (
                <button
                  onClick={() => {
                    onSelectSignToPractice(sign.sign);
                    onClose();
                  }}
                  className="mt-2 text-xs font-bold text-[#0040a1] hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">videocam</span>
                  Test this sign in Live Meeting
                </button>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
