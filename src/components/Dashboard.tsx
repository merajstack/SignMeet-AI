import React, { useState } from 'react';
import { MeetingSession, UserProfile } from '../types';

interface DashboardProps {
  userProfile: UserProfile;
  meetings: MeetingSession[];
  onStartMeeting: (meetingUrl?: string) => void;
  onOpenExtension: () => void;
  onOpenDictionary: () => void;
  onSelectMeeting: (m: MeetingSession) => void;
  onDeleteMeeting?: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userProfile,
  meetings,
  onStartMeeting,
  onOpenExtension,
  onOpenDictionary,
  onSelectMeeting,
  onDeleteMeeting,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartMeeting(joinCodeInput);
  };

  const filteredMeetings = meetings.filter(m =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.platform.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-[#f8f9ff] dark:bg-[#0b0f19] pt-24 pb-16 px-6 md:px-12 transition-colors">
      <div className="max-w-[1440px] mx-auto space-y-10">
        
        {/* Header Greeting Banner */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white dark:bg-[#1e293b] p-8 rounded-3xl border border-[#c3c6d6]/30 dark:border-[#334155] shadow-sm">
          <div className="space-y-1 max-w-xl">
            <h1 className="font-display text-3xl font-extrabold text-[#121c2a] dark:text-white">
              Good morning, {userProfile.fullName.split(' ')[0]}.
            </h1>
            <p className="font-body-lg text-base text-[#424654] dark:text-[#94a3b8]">
              Your sign-to-speech communication pipeline is active and flowing seamlessly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">


            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={onOpenExtension}
                className="bg-[#dee9fc] dark:bg-[#0040a1]/20 text-[#0040a1] dark:text-[#38bdf8] px-4 py-3 rounded-full font-label-sm text-xs hover:bg-[#d4e2fb] dark:hover:bg-[#0040a1]/30 transition-colors flex items-center justify-center gap-1.5 shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">extension</span>
                Open Extension Widget
              </button>
            </div>
          </div>
        </div>

        {/* Analytics & Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Total Meetings */}
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-[#c3c6d6]/30 dark:border-[#334155] shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-sm text-[#424654] dark:text-[#94a3b8] font-semibold">Total Meetings</span>
              <div className="w-10 h-10 rounded-2xl bg-[#0040a1]/10 dark:bg-[#0040a1]/20 text-[#0040a1] dark:text-[#38bdf8] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">video_camera_front</span>
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-4xl text-[#121c2a] dark:text-white">42</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span> +12%
                </span>
              </div>
              <p className="text-xs text-[#424654] dark:text-[#64748b] mt-1">18 sessions completed this month</p>
            </div>
          </div>

          {/* Card 2: Hours Saved Chart */}
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-[#c3c6d6]/30 dark:border-[#334155] shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-sm text-[#424654] dark:text-[#94a3b8] font-semibold">Comm. Hours Saved</span>
              <div className="w-10 h-10 rounded-2xl bg-[#4648d4]/10 dark:bg-[#4648d4]/20 text-[#4648d4] dark:text-[#818cf8] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">schedule</span>
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl text-[#121c2a] dark:text-white">156 hrs</span>
              </div>
              
              {/* Mini Bar Chart */}
              <div className="flex items-end gap-2 h-10 mt-3 pt-2">
                {[40, 65, 80, 50, 95, 70, 85].map((val, idx) => (
                  <div key={idx} className="flex-1 bg-[#dee9fc] dark:bg-[#334155] hover:bg-[#0040a1] transition-colors rounded-t h-full relative group">
                    <div className="bg-[#0040a1] dark:bg-[#38bdf8] rounded-t w-full" style={{ height: `${val}%` }}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Sign Accuracy Trend */}
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-[#c3c6d6]/30 dark:border-[#334155] shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-sm text-[#424654] dark:text-[#94a3b8] font-semibold">Sign Accuracy Rate</span>
              <div className="w-10 h-10 rounded-2xl bg-[#00514a]/10 dark:bg-[#00514a]/20 text-[#00514a] dark:text-[#34d399] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">verified</span>
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl text-[#121c2a] dark:text-white">98.4%</span>
                <span className="text-xs text-[#00514a] dark:text-[#34d399] font-bold bg-[#00514a]/10 dark:bg-[#00514a]/20 px-2 py-0.5 rounded-full">Optimal</span>
              </div>

              <p className="text-xs text-[#424654] dark:text-[#64748b] mt-2">
                Powered by RunPod GPU & MediaPipe Holistic v0.10
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Split: Recent Meetings Table & Sidebar Tools */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Recent Meetings Table (Col 8) */}
          <div className="lg:col-span-8 bg-white dark:bg-[#1e293b] rounded-3xl border border-[#c3c6d6]/30 dark:border-[#334155] p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="font-headline-lg text-2xl text-[#121c2a] dark:text-white">Recent Meeting Transcripts</h2>
                <p className="font-body-md text-xs text-[#424654] dark:text-[#64748b]">Search and access past sign language interpretations.</p>
              </div>

              <div className="relative w-full sm:w-64">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#737785] dark:text-[#64748b] text-[20px]">search</span>
                <input
                  type="text"
                  placeholder="Search transcripts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#f8f9ff] dark:bg-[#0f172a] border border-[#c3c6d6]/40 dark:border-[#334155] rounded-full text-sm text-[#121c2a] dark:text-[#e2e8f0] focus:outline-none focus:border-[#0040a1] placeholder:text-[#94a3b8]"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#c3c6d6]/30 dark:border-[#334155] text-xs text-[#737785] dark:text-[#64748b] uppercase font-semibold">
                    <th className="py-3 px-4">Meeting Title</th>
                    <th className="py-3 px-4">Platform</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c3c6d6]/20 dark:divide-[#334155]">
                  {filteredMeetings.map((m) => (
                    <tr key={m.id} className="hover:bg-[#f8f9ff] dark:hover:bg-[#0f172a] transition-colors group">
                      <td className="py-4 px-4">
                        <div className="font-bold text-[#121c2a] dark:text-[#e2e8f0] text-sm group-hover:text-[#0040a1] dark:group-hover:text-[#38bdf8] transition-colors">
                          {m.title}
                        </div>
                        <div className="text-xs text-[#737785] dark:text-[#64748b] flex items-center gap-1">
                          {m.participants.length} participants
                        </div>
                      </td>

                      <td className="py-4 px-4 text-xs font-semibold text-[#424654] dark:text-[#94a3b8]">
                        <span className="px-2.5 py-1 bg-[#eff4ff] dark:bg-[#0f172a] rounded-full border border-[#c3c6d6]/30 dark:border-[#334155]">
                          {m.platform}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-xs text-[#424654] dark:text-[#94a3b8]">
                        <div>{m.date}</div>
                        <div className="text-[11px] text-[#737785] dark:text-[#64748b]">{m.duration}</div>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          m.status === 'Verified' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                        }`}>
                          {m.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onSelectMeeting(m)}
                            className="text-[#0040a1] hover:bg-[#0040a1] hover:text-white px-3 py-1.5 rounded-lg border border-[#0040a1]/30 text-xs font-semibold transition-all cursor-pointer"
                          >
                            View Transcript
                          </button>

                          {onDeleteMeeting && (
                            <button
                              onClick={() => onDeleteMeeting(m.id)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete Transcript Record"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar Recommended Tools & Extension Status (Col 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Chrome Extension Integration Status */}
            <div className="bg-[#0040a1] text-white p-6 rounded-3xl shadow-md space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#89f5e7]">
                  CHROME EXTENSION
                </span>
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
              </div>

              <div>
                <h3 className="font-headline-lg text-xl">Google Meet Overlay Connected</h3>
                <p className="text-xs text-white/80 mt-1">
                  Floating sign language interpreter widget is ready for your next Google Meet call.
                </p>
              </div>

              <button
                onClick={onOpenExtension}
                className="w-full bg-white text-[#0040a1] py-2.5 rounded-full font-label-sm text-sm hover:bg-white/90 transition-colors shadow"
              >
                Launch Overlay Preview
              </button>
            </div>

            {/* Quick Tools */}
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-[#c3c6d6]/30 dark:border-[#334155] shadow-sm space-y-4">
              <h3 className="font-headline-lg text-lg text-[#121c2a] dark:text-white">Accessibility Tools</h3>

              <div className="space-y-3">
                <button
                  onClick={onOpenDictionary}
                  className="w-full p-3.5 rounded-2xl bg-[#f8f9ff] dark:bg-[#0f172a] hover:bg-[#eff4ff] dark:hover:bg-[#334155] border border-[#c3c6d6]/30 dark:border-[#334155] flex items-center justify-between text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#0040a1] dark:text-[#38bdf8] text-[24px]">menu_book</span>
                    <div>
                      <div className="font-bold text-sm text-[#121c2a] dark:text-[#e2e8f0] group-hover:text-[#0040a1] dark:group-hover:text-[#38bdf8]">ASL Sign Dictionary</div>
                      <div className="text-xs text-[#737785] dark:text-[#64748b]">5,000+ signs with movement diagrams</div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#737785] dark:text-[#64748b]">chevron_right</span>
                </button>

                <button
                  onClick={() => alert("Voice Cloning Simulator: Custom Neural TTS voice model active for Sarah Jenkins.")}
                  className="w-full p-3.5 rounded-2xl bg-[#f8f9ff] dark:bg-[#0f172a] hover:bg-[#eff4ff] dark:hover:bg-[#334155] border border-[#c3c6d6]/30 dark:border-[#334155] flex items-center justify-between text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#4648d4] dark:text-[#818cf8] text-[24px]">record_voice_over</span>
                    <div>
                      <div className="font-bold text-sm text-[#121c2a] dark:text-[#e2e8f0] group-hover:text-[#4648d4] dark:group-hover:text-[#818cf8]">Voice Profile Sync</div>
                      <div className="text-xs text-[#737785] dark:text-[#64748b]">Natural Neural TTS pitch configured</div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#737785] dark:text-[#64748b]">chevron_right</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
