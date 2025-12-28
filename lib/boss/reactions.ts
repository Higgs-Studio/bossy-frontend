export type BossReaction = {
  message: string;
  eventType: 'praise' | 'warning' | 'escalation';
};

export type BossType = 'execution' | 'supportive' | 'mentor' | 'drill-sergeant';

export type BossPersonality = {
  id: BossType;
  name: string;
  description: string;
  avatar: string;
  rules: string[];
  tone: string;
};

export const BOSS_PERSONALITIES: Record<BossType, BossPersonality> = {
  execution: {
    id: 'execution',
    name: 'The Execution Boss',
    description: 'Direct, no-nonsense accountability. This boss does not negotiate.',
    avatar: '💼',
    rules: [
      'You commit. You execute. No excuses.',
      'Daily check-ins are non-negotiable.',
      'Misses are tracked. Patterns are noticed.',
      'This boss rewards consistency, not perfection.',
    ],
    tone: 'direct',
  },
  supportive: {
    id: 'supportive',
    name: 'The Supportive Coach',
    description: 'Encouraging and understanding, but still holds you accountable.',
    avatar: '🌟',
    rules: [
      'Progress over perfection—every step counts.',
      'Mistakes are learning opportunities.',
      'Consistency builds character.',
      'I believe in your ability to grow.',
    ],
    tone: 'encouraging',
  },
  mentor: {
    id: 'mentor',
    name: 'The Wise Mentor',
    description: 'Strategic guidance with thoughtful accountability.',
    avatar: '🎓',
    rules: [
      'Reflect on your "why" before each action.',
      'Learn from both successes and setbacks.',
      'Quality work requires consistent effort.',
      'Wisdom comes from sustained practice.',
    ],
    tone: 'thoughtful',
  },
  'drill-sergeant': {
    id: 'drill-sergeant',
    name: 'The Drill Sergeant',
    description: 'Intense, demanding, and pushing you to your limits.',
    avatar: '⚡',
    rules: [
      'Excuses are not accepted. Period.',
      'You said you wanted this—prove it.',
      'Missed days = weakness leaving the body.',
      'Excellence demands sacrifice.',
    ],
    tone: 'intense',
  },
};

export function getBossReaction(
  checkInStatus: 'done' | 'missed',
  context?: {
    consecutiveMisses?: number;
    goalTitle?: string;
    intensity?: 'low' | 'medium' | 'high';
    bossType?: BossType;
  }
): BossReaction {
  const bossType = context?.bossType || 'execution';
  const consecutiveMisses = context?.consecutiveMisses || 1;

  if (checkInStatus === 'done') {
    return getDoneFeedback(bossType);
  }

  return getMissedFeedback(bossType, consecutiveMisses);
}

function getDoneFeedback(bossType: BossType): BossReaction {
  const messages: Record<BossType, string[]> = {
    execution: [
      "Good. You did what you said you'd do. Keep it up.",
      "Solid work. Consistency is everything.",
      "That's how it's done. Tomorrow, same energy.",
    ],
    supportive: [
      "Great job showing up today! I'm proud of you.",
      "You're building something amazing, one day at a time.",
      "That's what commitment looks like. Keep going!",
    ],
    mentor: [
      "Well done. Reflect on what made today successful.",
      "Another day of progress. Notice how consistency compounds.",
      "Good execution. Remember this feeling tomorrow.",
    ],
    'drill-sergeant': [
      "DONE. That's the standard. Don't lower it.",
      "Good. Now do it again tomorrow. No slacking.",
      "That's what I expect. Keep pushing.",
    ],
  };

  const options = messages[bossType];
  const message = options[Math.floor(Math.random() * options.length)];
  
  return {
    message,
    eventType: 'praise',
  };
}

function getMissedFeedback(bossType: BossType, consecutiveMisses: number): BossReaction {
  if (consecutiveMisses === 1) {
    const messages: Record<BossType, string> = {
      execution: "You missed today. No excuses. Get back on track tomorrow.",
      supportive: "You missed today, and that's okay. Let's get back on track tomorrow—I know you can do this.",
      mentor: "A missed day. Analyze what happened and adjust your approach.",
      'drill-sergeant': "You MISSED. This is unacceptable. Get up and GET BACK TO WORK.",
    };
    
    return {
      message: messages[bossType],
      eventType: 'warning',
    };
  } else if (consecutiveMisses === 2) {
    const messages: Record<BossType, string> = {
      execution: "Two days in a row? This is not a negotiation. You committed to this goal. Show up or quit.",
      supportive: "Two days missed. I'm concerned. What's getting in your way? Let's tackle it together.",
      mentor: "Two consecutive misses indicate a pattern. Time to reassess your strategy.",
      'drill-sergeant': "TWO DAYS?! This is pathetic. You're either IN or you're OUT. Which is it?",
    };
    
    return {
      message: messages[bossType],
      eventType: 'warning',
    };
  } else {
    const messages: Record<BossType, string> = {
      execution: "You've missed multiple days. Either you're serious about this goal or you're not. Decide now.",
      supportive: "Multiple misses are a signal. Should we adjust your goal? Remember why you started.",
      mentor: "Multiple consecutive misses require serious reflection. Is this goal aligned with your current capacity?",
      'drill-sergeant': "MULTIPLE DAYS MISSED. You're failing yourself. Either recommit RIGHT NOW or abandon this goal.",
    };
    
    return {
      message: messages[bossType],
      eventType: 'escalation',
    };
  }
}

export function getBossPersonality(bossType?: BossType): BossPersonality {
  return BOSS_PERSONALITIES[bossType || 'execution'];
}

