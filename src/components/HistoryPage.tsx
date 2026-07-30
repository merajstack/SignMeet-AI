import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { MeetingSession } from '../types';

interface HistoryPageProps {
  meetings: MeetingSession[];
  onSelectMeeting: (m: MeetingSession) => void;
  onDeleteMeeting: (id: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  meetings,
  onSelectMeeting,
  onDeleteMeeting,
}) => {
  const [search, setSearch] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<string>('All');

  const filtered = meetings.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.transcripts.some(t => t.originalText.toLowerCase().includes(search.toLowerCase()));
    const matchesPlatform = filterPlatform === 'All' || m.platform === filterPlatform;
    return matchesSearch && matchesPlatform;
  });

  const handleExportAllPDF = (session: MeetingSession) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`SignMeet AI - ${session.title}`, 14, 20);
    doc.setFontSize(11);
    doc.text(`Platform: ${session.platform} | Date: ${session.date} | Duration: ${session.duration}`, 14, 28);

    if (session.summary) {
      doc.setFont("helvetica", "bold");
      doc.text("AI Summary:", 14, 38);
      doc.setFont("helvetica", "normal");
      doc.text(session.summary, 14, 44, { maxWidth: 180 });
    }

    let y = session.summary ? 65 : 40;
    doc.setFont("helvetica", "bold");
    doc.text("Full Transcript:", 14, y);
    y += 8;

    session.transcripts.forEach((t) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.text(`[${t.timestamp}] ${t.sender} (${t.type}):`, 14, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.text(t.originalText, 20, y, { maxWidth: 170 });
      y += 10;
    });

    doc.save(`${session.title.replace(/\s+/g, '_')}_Transcript.pdf`);
  };

  return (
    <div className="w-full min-h-screen bg-[#f8f9ff] pt-24 pb-16 px-6 md:px-12">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-extrabold text-[#121c2a]">Translation History</h1>
          <p className="font-body-lg text-base text-[#424654] mt-1">
            Browse, search, and download transcripts from all past sign language meeting sessions.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-[#c3c6d6]/30 shadow-sm">
          <div className="relative w-full sm:w-80">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#737785] text-[20px]">search</span>
            <input
              type="text"
              placeholder="Search by meeting title or transcript text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#f8f9ff] border border-[#c3c6d6]/40 rounded-full text-sm focus:outline-none focus:border-[#0040a1]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-[#424654]">Platform Filter:</span>
            {['All', 'Google Meet', 'Zoom', 'MS Teams', 'SignMeet Native'].map((p) => (
              <button
                key={p}
                onClick={() => setFilterPlatform(p)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  filterPlatform === p ? 'bg-[#0040a1] text-white' : 'bg-[#f8f9ff] text-[#424654] hover:bg-[#dee9fc]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((m) => (
            <div key={m.id} className="bg-white rounded-3xl border border-[#c3c6d6]/30 p-6 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-[#eff4ff] text-[#0040a1] rounded-full text-xs font-bold border border-[#c3c6d6]/30">
                    {m.platform}
                  </span>
                  <span className="text-xs text-[#737785]">{m.date}</span>
                </div>

                <h3 className="font-headline-lg text-xl text-[#121c2a]">{m.title}</h3>

                <p className="text-xs text-[#424654] line-clamp-2">
                  {m.summary || m.transcripts[0]?.originalText || "No preview transcript available."}
                </p>
              </div>

              <div className="pt-4 border-t border-[#c3c6d6]/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectMeeting(m)}
                    className="bg-[#0040a1] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#0056d2]"
                  >
                    Open Transcript
                  </button>
                  <button
                    onClick={() => handleExportAllPDF(m)}
                    className="p-2 rounded-xl bg-[#dee9fc] text-[#0040a1] hover:bg-[#d0e0fb]"
                    title="Export PDF"
                  >
                    <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                  </button>
                </div>

                <button
                  onClick={() => onDeleteMeeting(m.id)}
                  className="p-2 text-[#ba1a1a] hover:bg-[#ba1a1a]/10 rounded-xl transition-colors"
                  title="Delete Session History"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
