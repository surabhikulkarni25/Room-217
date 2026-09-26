export interface DiaryLine {
  text: string;
  style?: 'normal' | 'italic' | 'damaged' | 'heading';
  damageEffect?: 'none' | 'water_smudge' | 'ink_blot' | 'charred_edge' | 'torn_gap';
}

export interface DiaryPage {
  pageNumber: number;
  entryTitle: string;
  lines: DiaryLine[];
  damageType?: 'none' | 'water' | 'charred' | 'torn';
}

export const DIARY_ENTRIES: DiaryPage[] = [
  {
    pageNumber: 1,
    entryTitle: 'Entry 1',
    lines: [
      { text: 'Day 3 in Room 217.', style: 'heading' },
      {
        text: "The rain hasn't let up since Tuesday afternoon. The radiator in the corner clanks every hour like clockwork, but the room stays warm enough.",
        style: 'normal',
      },
      {
        text: 'Found a small café down the cobblestone alley with cheap black coffee and decent bread. Spent the rest of the day sitting by the courtyard window, watching the mist roll over the slate roofs.',
        style: 'normal',
      },
      {
        text: "It's quiet here. Almost too quiet.",
        style: 'italic',
      },
    ],
    damageType: 'none',
  },
  {
    pageNumber: 2,
    entryTitle: 'Entry 2',
    lines: [
      { text: 'Day 6.', style: 'heading' },
      {
        text: 'Another slow morning. The old hostel keeper barely glances up from his ledger when anyone comes or goes. I asked him how long this wing of the building has been standing, and he just muttered something about the 1920s before turning the page.',
        style: 'normal',
      },
      {
        text: "Still, for ten coins a night, I can't complain. The bed is stiff, but I slept without waking. Going to turn the lamp off early tonight.",
        style: 'normal',
      },
    ],
    damageType: 'none',
  },
  {
    pageNumber: 3,
    entryTitle: 'Entry 3',
    lines: [
      { text: 'Day 9.', style: 'heading' },
      {
        text: 'Woke up around 3:00 AM. There was a persistent scratching sound coming from behind the wainscoting near the floorboards. Like something dry and brittle dragging against the wood lath.',
        style: 'normal',
      },
      {
        text: 'Mice, probably. That’s what I told myself.',
        style: 'italic',
      },
      {
        text: "But when I tapped twice against the wall to scare it off, the scratching didn't stop. It stopped for one second... and then tapped twice right back. I sat upright with the bedside lamp on until sunrise.",
        style: 'normal',
      },
    ],
    damageType: 'water',
  },
  {
    pageNumber: 4,
    entryTitle: 'Entry 4',
    lines: [
      { text: 'Day 12.', style: 'heading' },
      {
        text: "Things aren't staying where I put them.",
        style: 'heading',
      },
      {
        text: 'Yesterday my fountain pen was on the windowsill when I distinctly remember leaving it beside my coffee mug. This morning both wardrobe doors were unlatched and standing slightly open.',
        style: 'normal',
      },
      {
        text: "When I stand in the center of this room, there's a cold, heavy pressure at the back of my neck. Like someone standing right in my shadow, watching my fingers write each word.",
        style: 'italic',
      },
    ],
    damageType: 'charred',
  },
  {
    pageNumber: 5,
    entryTitle: 'Entry 5',
    lines: [
      { text: 'Day 15.', style: 'heading' },
      {
        text: "I don't think whatever is here wants to hurt me.",
        style: 'heading',
      },
      {
        text: 'Last night I woke from a nightmare with my chest heaving and the room freezing cold. But the scratches on the wood... they weren’t wild clawing. They were rhythmic. Deliberate. Three long pauses, then two quick beats.',
        style: 'normal',
      },
      {
        text: 'Like a signal trying to keep me awake. It feels less like a threat and more like a desperate warning. It is trying to guide me toward something I keep overlooking.',
        style: 'italic',
      },
    ],
    damageType: 'water',
  },
  {
    pageNumber: 6,
    entryTitle: 'Final Entry',
    lines: [
      { text: 'Day 1', style: 'heading', damageEffect: 'charred_edge' },
      {
        text: 'I finally found it. The draft in this room was never coming from the window.',
        style: 'normal',
      },
      {
        text: 'Beneath the floorboard seam where the boards meet the wall near the writing desk... there is a hollow space behind the wood.',
        style: 'damaged',
        damageEffect: 'water_smudge',
      },
      {
        text: 'Someone concealed something here years ago. I heard the pipes hum three times, and then the seam gave way.',
        style: 'normal',
      },
      {
        text: 'If anyone finds this notebook—look where the draft breathes behind the',
        style: 'damaged',
        damageEffect: 'torn_gap',
      },
    ],
    damageType: 'torn',
  },
];
