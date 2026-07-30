import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

interface SmartSummaryModalProps {
  transcriptText: string;
  onClose: () => void;
}

export const SmartSummaryModal: React.FC<SmartSummaryModalProps> = ({
  transcriptText,
  onClose,
}) => {
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState<{
    summary: string;
    actionItems: string[];
  }>({ summary: '', actionItems: [] });

  useEffect(() => {
    const generateSummary = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcriptText }),
        });
        const data = await res.json();
        setSummaryData(data);
      } catch (err) {
        console.error("Summary generation failed:", err);
      } finally {
        setLoading(false);
      }
    };

    generateSummary();
  }, [transcriptText]);

  const handleExportSummaryPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("SignMeet AI - Smart Meeting Summary", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Executive Summary:", 14, 40);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(summaryData.summary, 14, 48, { maxWidth: 180 });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Action Items:", 14, 80);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    let y = 88;
    summaryData.actionItems.forEach(item => {
      doc.text(`• ${item}`, 18, y, { maxWidth: 170 });
      y += 8;
    });

    doc.save(`SignMeet_Summary_${Date.now()}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#121c2a]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-8 space-y-6 shadow-2xl border border-[#c3c6d6]/30">
        <div className="flex items-center justify-between border-b border-[#c3c6d6]/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0040a1] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
            </div>
            <div>
              <h2 className="font-headline-lg text-xl font-bold text-[#121c2a]">Gemini AI Meeting Summary</h2>
              <p className="text-xs text-[#424654]">Automated key takeaway extraction and action item mapping.</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-[#f8f9ff] rounded-full">
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#0040a1] border-t-transparent rounded-full animate-spin"></div>
            <span className="font-label-sm text-sm text-[#0040a1] font-bold">
              Gemini 2.5 Flash is analyzing transcript...
            </span>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-[#eff4ff] rounded-2xl border border-[#c3c6d6]/30 space-y-2">
              <h3 className="font-bold text-sm text-[#0040a1] uppercase tracking-wider">Executive Summary</h3>
              <p className="text-sm text-[#121c2a] leading-relaxed">{summaryData.summary}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-sm text-[#121c2a] uppercase tracking-wider">Extracted Action Items</h3>
              <ul className="space-y-2">
                {summaryData.actionItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#424654] p-2 bg-[#f8f9ff] rounded-xl border border-[#c3c6d6]/20">
                    <span className="material-symbols-outlined text-[#00514a] text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-[#c3c6d6]/30 flex justify-end gap-3">
              <button
                onClick={handleExportSummaryPDF}
                className="bg-[#0040a1] text-white px-6 py-2.5 rounded-full font-label-sm text-sm hover:bg-[#0056d2] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                Export PDF Summary
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
