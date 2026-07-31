import { supabase } from '../lib/supabaseClient';
import { MeetingSession, TranscriptEntry, UserProfile } from '../types';

const LOCAL_MEETINGS_KEY = 'signmeet_saved_meetings';
const LOCAL_CUSTOM_SIGNS_KEY = 'signmeet_custom_signs';
const LOCAL_PROFILE_KEY = 'signmeet_user_profile';

// Initial default demo meetings if storage is empty
const INITIAL_DEMO_MEETINGS: MeetingSession[] = [
  {
    id: 'm1',
    title: 'Product Design Sync & Sign Review',
    platform: 'SignMeet Live',
    date: 'Today, 10:42 AM',
    duration: '45 mins',
    status: 'Verified',
    participants: ['Sarah Jenkins (You)', 'James Doe', 'Alex Rivera'],
    transcripts: [
      {
        id: 't1',
        timestamp: '10:42 AM',
        sender: 'Sarah Jenkins (You)',
        type: 'sign-to-text',
        originalText: 'Hello everyone, I wanted to discuss the new design updates for the user dashboard.',
        confidence: 0.98,
      },
      {
        id: 't2',
        timestamp: '10:43 AM',
        sender: 'James Doe',
        type: 'voice-to-text',
        originalText: 'Thanks Sarah. James here. I agree, the high-contrast mode looks much cleaner now.',
        confidence: 0.99,
      },
    ],
  },
  {
    id: 'm2',
    title: 'Accessibility Taskforce Weekly Standup',
    platform: 'Google Meet',
    date: 'Yesterday, 2:15 PM',
    duration: '30 mins',
    status: 'Verified',
    participants: ['Sarah Jenkins (You)', 'Elena Rostova'],
    transcripts: [
      {
        id: 't3',
        timestamp: '2:15 PM',
        sender: 'Elena Rostova',
        type: 'voice-to-text',
        originalText: 'The MediaPipe landmark tracker accuracy is performing exceptionally well.',
        confidence: 0.97,
      },
    ],
  },
];

// --- MEETINGS & TRANSCRIPTS SERVICE ---

export async function fetchUserMeetings(userId?: string): Promise<MeetingSession[]> {
  // 1. Attempt Supabase fetch from `meetings` and `transcripts` tables
  try {
    if (supabase) {
      let query = supabase.from('meetings').select('*').order('created_at', { ascending: false });
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data: meetingsData, error: meetingsErr } = await query;

      if (!meetingsErr && meetingsData && meetingsData.length > 0) {
        // Fetch transcripts for these meetings
        const meetingIds = meetingsData.map((m: any) => m.id);
        const { data: transcriptsData } = await supabase
          .from('transcripts')
          .select('*')
          .in('meeting_id', meetingIds);

        const transcriptsMap: Record<string, TranscriptEntry[]> = {};
        if (transcriptsData) {
          transcriptsData.forEach((row: any) => {
            if (!transcriptsMap[row.meeting_id]) {
              transcriptsMap[row.meeting_id] = [];
            }
            transcriptsMap[row.meeting_id].push({
              id: row.id || `t-${Math.random()}`,
              timestamp: row.timestamp || 'Live',
              sender: row.sender || 'Participant',
              type: row.type || 'sign-to-text',
              originalText: row.original_text || row.text || '',
              confidence: row.confidence || 0.98,
            });
          });
        }

        return meetingsData.map((item: any) => ({
          id: item.id,
          title: item.title || 'SignMeet Call',
          platform: item.platform || 'SignMeet Live',
          date: item.date || new Date(item.created_at || Date.now()).toLocaleDateString(),
          duration: item.duration || 'Live Session',
          status: item.status || 'Verified',
          participants: Array.isArray(item.participants) ? item.participants : ['Sarah Jenkins (You)'],
          transcripts: transcriptsMap[item.id] || item.transcripts || [],
        }));
      }
    }
  } catch (e) {
    console.warn('[Supabase] Falling back to local storage for meetings:', e);
  }

  // 2. Local storage fallback
  try {
    const local = localStorage.getItem(LOCAL_MEETINGS_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[LocalStorage] Error reading local meetings:', e);
  }

  // Save initial demo meetings if empty
  try {
    localStorage.setItem(LOCAL_MEETINGS_KEY, JSON.stringify(INITIAL_DEMO_MEETINGS));
  } catch (_) {}

  return INITIAL_DEMO_MEETINGS;
}

export async function saveMeetingSession(
  meeting: MeetingSession,
  userId?: string
): Promise<void> {
  // Update local storage immediately for fast UI responsiveness
  try {
    const existing = await fetchUserMeetings(userId);
    const updated = [meeting, ...existing.filter(m => m.id !== meeting.id)];
    localStorage.setItem(LOCAL_MEETINGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('[LocalStorage] Failed to save meeting locally:', e);
  }

  // Persist to Supabase DB tables: `meetings` and `transcripts`
  try {
    if (supabase) {
      // 1. Insert into `meetings` table
      await supabase.from('meetings').upsert({
        id: meeting.id,
        user_id: userId || 'anonymous',
        title: meeting.title,
        platform: meeting.platform,
        date: meeting.date,
        duration: meeting.duration,
        status: meeting.status,
        participants: meeting.participants,
        created_at: new Date().toISOString(),
      });

      // 2. Insert into `transcripts` table
      if (meeting.transcripts && meeting.transcripts.length > 0) {
        const transcriptRows = meeting.transcripts.map((t: TranscriptEntry) => ({
          id: t.id,
          meeting_id: meeting.id,
          sender: t.sender,
          type: t.type,
          original_text: t.originalText,
          confidence: t.confidence || 0.98,
          timestamp: t.timestamp,
          created_at: new Date().toISOString(),
        }));

        await supabase.from('transcripts').upsert(transcriptRows, { onConflict: 'id' });
      }
    }
  } catch (e) {
    console.warn('[Supabase] Could not persist meeting and transcripts to database:', e);
  }
}

export async function deleteMeetingSession(meetingId: string, userId?: string): Promise<void> {
  // Update local storage
  try {
    const existing = await fetchUserMeetings(userId);
    const updated = existing.filter(m => m.id !== meetingId);
    localStorage.setItem(LOCAL_MEETINGS_KEY, JSON.stringify(updated));
  } catch (e) {}

  // Delete from Supabase DB tables `meetings` and `transcripts`
  try {
    if (supabase) {
      await supabase.from('transcripts').delete().eq('meeting_id', meetingId);
      await supabase.from('meetings').delete().eq('id', meetingId);
    }
  } catch (e) {}
}

// --- CUSTOM SIGNS SERVICE ---

export async function fetchCustomSigns(userId?: string): Promise<Record<string, string>> {
  try {
    if (userId && supabase) {
      const { data, error } = await supabase
        .from('custom_signs')
        .select('*')
        .eq('user_id', userId);

      if (!error && data && data.length > 0) {
        const signMap: Record<string, string> = {};
        data.forEach((row: any) => {
          signMap[row.sign_id] = row.custom_val;
        });
        return signMap;
      }
    }
  } catch (e) {}

  try {
    const local = localStorage.getItem(LOCAL_CUSTOM_SIGNS_KEY);
    if (local) {
      return JSON.parse(local);
    }
  } catch (e) {}

  return {};
}

export async function saveCustomSigns(
  signValues: Record<string, string>,
  userId?: string
): Promise<void> {
  try {
    localStorage.setItem(LOCAL_CUSTOM_SIGNS_KEY, JSON.stringify(signValues));
  } catch (e) {}

  try {
    if (userId && supabase) {
      const rows = Object.entries(signValues).map(([signId, val]) => ({
        user_id: userId,
        sign_id: signId,
        custom_val: val,
        updated_at: new Date().toISOString(),
      }));
      await supabase.from('custom_signs').upsert(rows, { onConflict: 'user_id,sign_id' });
    }
  } catch (e) {}
}

// --- USERS SERVICE ---

export async function fetchUserProfileDB(userId: string): Promise<Partial<UserProfile> | null> {
  try {
    if (userId && supabase) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        return {
          fullName: data.full_name || data.name,
          displayName: data.display_name || data.name,
          email: data.email,
        };
      }
    }
  } catch (e) {}

  try {
    const local = localStorage.getItem(LOCAL_PROFILE_KEY);
    if (local) {
      return JSON.parse(local);
    }
  } catch (e) {}

  return null;
}

export async function saveUserProfileDB(
  profile: Partial<UserProfile>,
  userId: string
): Promise<void> {
  try {
    const existing = (await fetchUserProfileDB(userId)) || {};
    const updated = { ...existing, ...profile };
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(updated));
  } catch (e) {}

  try {
    if (userId && supabase) {
      await supabase.from('users').upsert({
        id: userId,
        full_name: profile.fullName,
        display_name: profile.displayName,
        email: profile.email,
        updated_at: new Date().toISOString(),
      });
    }
  } catch (e) {}
}

export async function saveGoogleUserToSupabase(userData: any, userId: string): Promise<void> {
  try {
    if (supabase) {
      const fullName = userData.user_metadata?.full_name || userData.name || userData.given_name || userData.email?.split('@')[0] || 'Google User';
      const email = userData.email || '';
      
      await supabase.from('users').upsert({
        id: userId,
        full_name: fullName,
        display_name: userData.given_name || fullName,
        email: email,
        updated_at: new Date().toISOString(),
      });
    }
  } catch (e) {
    console.warn('[Supabase] Failed to save user to database:', e);
  }
}
