export interface PhoneMessage {
  id: string;
  sender: string;
  timestamp: string;
  text: string;
  isFromFriend?: boolean;
}

export interface PhoneNote {
  id: string;
  title: string;
  date: string;
  content: string;
}

export interface PhoneAudioMemo {
  id: string;
  title: string;
  duration: string;
  status: 'corrupted' | 'partial';
  transcriptSnippet: string;
}

export const PHONE_MESSAGES: PhoneMessage[] = [
  {
    id: 'msg-1',
    sender: 'M.',
    timestamp: 'Oct 14, 11:42 PM',
    text: "Did you hear the scratching again? I told you not to ask the hostel keeper about the older rooms. He keeps the early tenant logs locked up for a reason.",
    isFromFriend: false,
  },
  {
    id: 'msg-2',
    sender: 'You',
    timestamp: 'Oct 15, 01:15 AM',
    text: "It's not mice, M. There's a persistent draft behind the baseboard beside the desk. Something was deliberately hidden inside the wall framing.",
    isFromFriend: true,
  },
  {
    id: 'msg-3',
    sender: 'M.',
    timestamp: 'Oct 15, 01:28 AM',
    text: "Stop looking into it. The person who stayed in 217 before you left their belongings behind without checking out too. If the cold starts following you, just leave.",
    isFromFriend: false,
  },
];

export const PHONE_NOTES: PhoneNote[] = [
  {
    id: 'note-1',
    title: 'Cavity Observations',
    date: 'Oct 16',
    content:
      "Pried the floorboard seam loose beside the desk. The cavity drops down behind the lath and plaster. The timber studs inside are marked with faded carpenter's chalk: 'FL.2 / UNRECORDED'.\n\nWhatever is in this wall was enclosed when the hostel was remodeled.",
  },
  {
    id: 'note-2',
    title: 'Room Anomalies',
    date: 'Oct 17',
    content:
      "- Temperature drops 8 degrees near the tall wardrobe.\n- Scratching rhythm repeats at 3:00 AM.\n- Need to find what releases the door latch if the exterior bolt slides shut.",
  },
];

export const PHONE_AUDIO_MEMO: PhoneAudioMemo = {
  id: 'memo-1',
  title: 'Voice Memo #04',
  duration: '0:42',
  status: 'partial',
  transcriptSnippet:
    "...the draft isn't just under the floor. It's pulling from the wardrobe in the corner. Behind the hanging coats, where the heavy wooden panel meets the back mirror... there's a recessed brass fixture tucked into the dark molding. If the door ever locks from outside, look where the glass doesn't reflect...",
};
