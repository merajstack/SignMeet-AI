import React, { useState } from 'react';
import { MeetingSession, UserProfile } from '../types';

interface DashboardProps {
  userProfile: UserProfile;
  meetings: MeetingSession[];
  onStartMeeting: () => void;
  onOpenExtension: () => void;
  onOpenDictionary: () => void;
  onSelectMeeting: (m: MeetingSession) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userProfile,
  meetings,
  onStartMeeting,
  onOpenExtension,
  onOpenDictionary,
  onSelectMeeting,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMeetings = meetings.filter(m =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.platform.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-[#f8f9ff] pt-24 pb-16 px-6 md:px-12">
      <div className="max-w-[1440px] mx-auto space-y-10">
        
        {/* Header Greeting Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-3xl border border-[#c3c6d6]/30 shadow-sm">
          <div className="space-y-1">
            <h1 className="font-display text-3xl font-extrabold text-[#121c2a]">
              Good morning, {userProfile.fullName.split(' ')[0]}.
            </h1>
            <p className="font-body-lg text-base text-[#424654]">
              Your sign-to-speech communication pipeline is active and flowing seamlessly.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onOpenExtension}
              className="bg-[#dee9fc] text-[#0040a1] px-5 py-3 rounded-full font-label-sm text-sm hover:bg-[#d4e2fb] transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">extension</span>
              Extension Widget
            </button>
            <button
              onClick={onStartMeeting}
              className="bg-[#0040a1] text-white px-6 py-3 rounded-full font-label-sm text-sm hover:bg-[#0056d2] transition-transform active:scale-95 shadow-md flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">video_call</span>
              Quick Start Meeting
            </button>
          </div>
        </div>

        {/* Analytics & Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Total Meetings */}
          <div className="bg-white p-6 rounded-3xl border border-[#c3c6d6]/30 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-sm text-[#424654] font-semibold">Total Meetings</span>
              <div className="w-10 h-10 rounded-2xl bg-[#0040a1]/10 text-[#0040a1] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">video_camera_front</span>
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-4xl text-[#121c2a]">42</span>
                <span className="text-emerald-600 font-bold text-sm flex items-center">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span> +12%
                </span>
              </div>
              <p className="text-xs text-[#424654] mt-1">18 sessions completed this month</p>
            </div>
          </div>

          {/* Card 2: Hours Saved Chart */}
          <div className="bg-white p-6 rounded-3xl border border-[#c3c6d6]/30 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-sm text-[#424654] font-semibold">Comm. Hours Saved</span>
              <div className="w-10 h-10 rounded-2xl bg-[#4648d4]/10 text-[#4648d4] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">schedule</span>
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl text-[#121c2a]">156 hrs</span>
              </div>
              
              {/* Mini Bar Chart */}
              <div className="flex items-end gap-2 h-10 mt-3 pt-2">
                {[40, 65, 80, 50, 95, 70, 85].map((val, idx) => (
                  <div key={idx} className="flex-1 bg-[#dee9fc] hover:bg-[#0040a1] transition-colors rounded-t h-full relative group">
                    <div className="bg-[#0040a1] rounded-t w-full" style={{ height: `${val}%` }}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Sign Accuracy Trend */}
          <div className="bg-white p-6 rounded-3xl border border-[#c3c6d6]/30 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-sm text-[#424654] font-semibold">Sign Accuracy Rate</span>
              <div className="w-10 h-10 rounded-2xl bg-[#00514a]/10 text-[#00514a] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">verified</span>
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl text-[#121c2a]">98.4%</span>
                <span className="text-xs text-[#00514a] font-bold bg-[#00514a]/10 px-2 py-0.5 rounded-full">Optimal</span>
              </div>

              <p className="text-xs text-[#424654] mt-2">
                Powered by RunPod GPU & MediaPipe Holistic v0.10
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Split: Recent Meetings Table & Sidebar Tools */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Recent Meetings Table (Col 8) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-[#c3c6d6]/30 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="font-headline-lg text-2xl text-[#121c2a]">Recent Meeting Transcripts</h2>
                <p className="font-body-md text-xs text-[#424654]">Search and access past sign language interpretations.</p>
              </div>

              <div className="relative w-full sm:w-64">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#737785] text-[20px]">search</span>
                <input
                  type="text"
                  placeholder="Search transcripts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#f8f9ff] border border-[#c3c6d6]/40 rounded-full text-sm focus:outline-none focus:border-[#0040a1]"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#c3c6d6]/30 text-xs text-[#737785] uppercase font-semibold">
                    <th className="py-3 px-4">Meeting Title</th>
                    <th className="py-3 px-4">Platform</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c3c6d6]/20">
                  {filteredMeetings.map((m) => (
                    <tr key={m.id} className="hover:bg-[#f8f9ff] transition-colors group">
                      <td className="py-4 px-4">
                        <div className="font-bold text-[#121c2a] text-sm group-hover:text-[#0040a1] transition-colors">
                          {m.title}
                        </div>
                        <div className="text-xs text-[#737785] flex items-center gap-1">
                          {m.participants.length} participants
                        </div>
                      </td>

                      <td className="py-4 px-4 text-xs font-semibold text-[#424654]">
                        <span className="px-2.5 py-1 bg-[#eff4ff] rounded-full border border-[#c3c6d6]/30">
                          {m.platform}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-xs text-[#424654]">
                        <div>{m.date}</div>
                        <div className="text-[11px] text-[#737785]">{m.duration}</div>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          m.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {m.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => onSelectMeeting(m)}
                          className="text-[#0040a1] hover:bg-[#0040a1] hover:text-white px-3 py-1.5 rounded-lg border border-[#0040a1]/30 text-xs font-semibold transition-all"
                        >
                          View Transcript
                        </button>
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
            <div className="bg-white p-6 rounded-3xl border border-[#c3c6d6]/30 shadow-sm space-y-4">
              <h3 className="font-headline-lg text-lg text-[#121c2a]">Accessibility Tools</h3>

              <div className="space-y-3">
                <button
                  onClick={onOpenDictionary}
                  className="w-full p-3.5 rounded-2xl bg-[#f8f9ff] hover:bg-[#eff4ff] border border-[#c3c6d6]/30 flex items-center justify-between text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#0040a1] text-[24px]">menu_book</span>
                    <div>
                      <div className="font-bold text-sm text-[#121c2a] group-hover:text-[#0040a1]">ASL Sign Dictionary</div>
                      <div className="text-xs text-[#737785]">5,000+ signs with movement diagrams</div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#737785]">chevron_right</span>
                </button>

                <button
                  onClick={() => alert("Voice Cloning Simulator: Custom Neural TTS voice model active for Sarah Jenkins.")}
                  className="w-full p-3.5 rounded-2xl bg-[#f8f9ff] hover:bg-[#eff4ff] border border-[#c3c6d6]/30 flex items-center justify-between text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#4648d4] text-[24px]">record_voice_over</span>
                    <div>
                      <div className="font-bold text-sm text-[#121c2a] group-hover:text-[#4648d4]">Voice Profile Sync</div>
                      <div className="text-xs text-[#737785]">Natural Neural TTS pitch configured</div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#737785]">chevron_right</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
