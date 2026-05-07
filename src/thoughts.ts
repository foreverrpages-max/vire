// Each thought has a small "kicker" (category) and the line itself.
// Tone: quiet, curious, slightly cosmic. Never prescriptive.

export type Thought = {
  kicker: string;
  line: string;
};

export const thoughts: Thought[] = [
  // — cosmic —
  { kicker: 'somewhere out there', line: 'There are more stars in the universe than grains of sand on every beach on Earth.' },
  { kicker: 'a slow truth', line: 'The light from the sun took eight minutes to reach you. You are reading by old light.' },
  { kicker: 'in your bones', line: 'The calcium in your teeth was forged inside a star that died before our sun was born.' },
  { kicker: 'spinning', line: 'You are moving at roughly 1,600 km per hour right now. You just don\'t feel it because everything moves with you.' },
  { kicker: 'far away', line: 'If you could drive to the moon at highway speed, it would take about six months. It is closer than you think, and farther than you know.' },
  { kicker: 'a quiet number', line: 'Saturn\'s rings are mostly water ice, glittering at minus 178 degrees. A frozen jewelry box around a giant.' },
  { kicker: 'old water', line: 'The water in your glass is older than the sun. It has been here, in some form, the whole time.' },

  // — body & sensory —
  { kicker: 'a soft fact', line: 'Your body replaces about 330 billion cells every day. A version of you from a year ago is mostly gone.' },
  { kicker: 'breath', line: 'Try this: breathe in for four, hold for four, out for six. Twice. That\'s it.' },
  { kicker: 'a small kindness', line: 'Unclench your jaw. Drop your shoulders. Soften your tongue from the roof of your mouth.' },
  { kicker: 'noticing', line: 'There is a sound in the room you weren\'t aware of a moment ago. It\'s been there the whole time.' },
  { kicker: 'sensation', line: 'Notice three things you can feel right now — the temperature on your skin, the weight of your phone, the floor.' },
  { kicker: 'a tiny rebellion', line: 'You don\'t have to reply to that message right now. You can let it sit.' },

  // — earth & nature —
  { kicker: 'the slow forest', line: 'Trees in a forest share nutrients through their roots. The healthy ones feed the sick ones, quietly, underground.' },
  { kicker: 'octopus thoughts', line: 'An octopus has nine brains. One central, and one in each arm. Each arm thinks for itself a little.' },
  { kicker: 'sky math', line: 'A cloud weighs about a million pounds, on average. It just spreads the weight out over so much sky.' },
  { kicker: 'a long hum', line: 'Whales sing in dialects. Pods on different sides of the ocean have different accents.' },
  { kicker: 'roots', line: 'The largest organism on earth is a fungus in Oregon. It quietly sprawls under nine square kilometers of forest.' },
  { kicker: 'rain', line: 'A single raindrop falls at about 9 meters per second. Gentler than it sounds, slower than it feels.' },

  // — time & mind —
  { kicker: 'a perspective', line: 'If your life were one day long, you\'re probably reading this somewhere around late morning. Plenty of day left.' },
  { kicker: 'memory', line: 'Every time you remember something, you slightly rewrite it. Your fondest memory is mostly a story you\'ve told yourself.' },
  { kicker: 'a permission', line: 'You do not need to be productive today. The day is already enough on its own.' },
  { kicker: 'on hard days', line: 'You have survived 100% of your worst days so far. The data is in your favor.' },
  { kicker: 'small wins', line: 'You drank water today. You woke up. You opened a strange link a stranger left in their bio. That\'s plenty.' },
  { kicker: 'a quiet truth', line: 'Most things you worried about last year are not things you remember today.' },

  // — language & wonder —
  { kicker: 'a word', line: 'In Japanese, "komorebi" means the sunlight that filters through leaves. There is a word for it because it is worth naming.' },
  { kicker: 'a word', line: 'In Marathi, "हुरहूर" — hurhur — is the soft restless feeling of missing someone. Not grief. Just a small ache.' },
  { kicker: 'a word', line: 'In Welsh, "hiraeth" is a homesickness for a place you can\'t return to, or that maybe never existed.' },
  { kicker: 'a word', line: 'In Sinhala, "සැනසීම" — sanaseema — means a quiet, settled comfort. The kind you feel when a worry finally lifts.' },

  // — humans —
  { kicker: 'a thought', line: 'Right now, somebody you have never met is having the best day of their life. And somebody else is being told a kind thing.' },
  { kicker: 'a small thing', line: 'Strangers smile at strangers all over the world today. A few of them are smiling at the same person you smiled at.' },
  { kicker: 'a reminder', line: 'Someone is thinking about you and not telling you. Statistically. Quietly.' },

  // — closing-feeling —
  { kicker: 'before you go', line: 'Wherever you\'re going next, you don\'t have to rush there. The world will hold the door.' },
  { kicker: 'before you go', line: 'Drink some water. Look out a window. The day will still be there in a minute.' },
];
