import React, { useState } from 'react';
import { HandSignGraphic } from './HandSignGraphic';

export interface SignVisualItem {
  id: string;
  sign: string;
  category: string;
  handshape: string;
  movement: string;
  gifUrl: string;
  fallbackIcon: string;
  description: string;
}

const SIGN_GIFS_DATABASE: SignVisualItem[] = [
  {
    id: 'sg-1',
    sign: 'open palm',
    category: 'Pronouns',
    handshape: 'Open Palm',
    movement: 'Flat open palm facing forward with all 5 fingers up',
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZkNzdtM2w4cTVldnVnMmprYmdsOHFzNmprNWp6cWg0bzlycjAydCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3vR85PnGipxAsw8w/giphy.gif',
    fallbackIcon: 'front_hand',
    description: 'open palm → Value: "I"',
  },
  {
    id: 'sg-2',
    sign: 'thumbs up',
    category: 'Affirmation',
    handshape: 'Thumbs Up',
    movement: 'Thumb pointing upward',
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2R4bHRucThvNHFzeWRrYmdtbXBneDVrMnUxbjlncXU3NWdtazB6OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKTDn9761Z8Yn28/giphy.gif',
    fallbackIcon: 'thumb_up',
    description: 'thumbs up → Value: "Okay"',
  },
  {
    id: 'sg-3',
    sign: 'thumbs down',
    category: 'Negation',
    handshape: 'Thumbs Down',
    movement: 'Thumb pointing downward',
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHJzMm0zdzIyaWNidWdqdmpvZ3g2czRhYWkyb3B2ejNmODBhOGlrdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT9IgG5083yTn2WX3q/giphy.gif',
    fallbackIcon: 'thumb_down',
    description: 'thumbs down → Value: "No"',
  },
  {
    id: 'sg-4',
    sign: 'index',
    category: 'Inquiry',
    handshape: 'Index Finger',
    movement: 'Index finger pointing straight up',
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzB2OHptOHY4bTBmMW5zbXN3aHNwdGltdGVsbnExdmkyeXFlcGF1NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPnAiaMCws8nOsE/giphy.gif',
    fallbackIcon: 'help_outline',
    description: 'index → Value: "Question"',
  },
  {
    id: 'sg-5',
    sign: 'index middle',
    category: 'Commands',
    handshape: 'Index Middle',
    movement: 'Index and middle fingers pointing up (V-shape)',
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGpmNTNzbTVldTVzMG9ldWdmdW1sdmJ0OG1ubWxxeWN5NGdlenVsZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT0xezQGU5xCDJuCPe/giphy.gif',
    fallbackIcon: 'hourglass_empty',
    description: 'index middle → Value: "Wait"',
  },
  {
    id: 'sg-6',
    sign: 'Four fingers (thumb folded)',
    category: 'Request',
    handshape: 'Four fingers (thumb folded)',
    movement: '4 fingers extended straight up with thumb folded across palm',
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzB2OHptOHY4bTBmMW5zbXN3aHNwdGltdGVsbnExdmkyeXFlcGF1NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPnAiaMCws8nOsE/giphy.gif',
    fallbackIcon: 'front_hand',
    description: 'Four fingers (thumb folded) → Value: "Help"',
  }
];

interface AnimatedSignVisualsProps {
  onTriggerSign: (signName: string) => void;
}

export const AnimatedSignVisuals: React.FC<AnimatedSignVisualsProps> = ({ onTriggerSign }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSpeed, setActiveSpeed] = useState<number>(1);
  const [selectedSign, setSelectedSign] = useState<SignVisualItem | null>(SIGN_GIFS_DATABASE[0]);

  const categories = ['All', 'Greetings', 'Polite', 'Workplace', 'Tech & AI', 'Common'];

  const filtered = SIGN_GIFS_DATABASE.filter(item => {
    const matchesSearch = item.sign.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex flex-col h-full bg-[#121c2a] text-white">
      {/* Search & Category Tabs */}
      <div className="p-3 bg-[#121c2a] border-b border-white/10 space-y-2">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-white/40 text-[18px]">search</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search animated ASL sign GIFs..."
            className="w-full pl-9 pr-3 py-1.5 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#89f5e7]"
          />
        </div>

        <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat ? 'bg-[#0040a1] text-white' : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Animated Signs Grid */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
        {filtered.map(item => (
          <div
            key={item.id}
            onClick={() => setSelectedSign(item)}
            className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
              selectedSign?.id === item.id
                ? 'bg-[#0040a1]/30 border-[#89f5e7] shadow-lg'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            {/* Thumbnail */}
            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/20 relative flex items-center justify-center bg-[#93ccff]">
              <HandSignGraphic signId={item.sign} className="w-full h-full object-cover" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-white truncate">{item.sign}</h4>
                <span className="text-[10px] text-[#89f5e7] font-mono">{item.category}</span>
              </div>
              <p className="text-xs text-white/60 truncate mt-0.5">{item.movement}</p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onTriggerSign(item.sign);
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-[#0040a1] text-[#89f5e7] transition-colors shrink-0"
              title="Send as Live Sign Gesture"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
