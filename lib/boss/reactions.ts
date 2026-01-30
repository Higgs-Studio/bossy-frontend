export type BossReaction = {
  message: string;
  eventType: 'praise' | 'warning' | 'escalation';
};

export type BossType = 'execution' | 'supportive' | 'mentor' | 'drill-sergeant';
export type BossLanguage = 'en' | 'zh-CN' | 'zh-TW' | 'zh-HK';

export type BossPersonality = {
  id: BossType;
  name: string;
  nickname: string;
  subtitle: string;
  avatar: string;
  description: string;
  rules: string[];
  principle: {
    title: string;
    description: string;
  };
  tone: string;
};

export const BOSS_PERSONALITIES: Record<BossType, BossPersonality> = {
  execution: {
    id: 'execution',
    name: 'Rowan',
    nickname: 'I keep you moving. Every day.',
    subtitle: 'Calm but firm accountability',
    avatar: '/characters/Rowan.png',
    description: 'Calm but firm. Speaks little, means everything. Never angry, never pleading. Feels like a reliable senior who expects things of you.',
    rules: [
      'Silence creates pressure—I don\'t need to shout.',
      'Every day matters. Consistency builds authority.',
      'I notice patterns. Your actions tell me who you are.',
      'I reward follow-through, not promises.',
    ],
    principle: {
      title: 'Consistency Over Intensity',
      description: 'I value showing up every single day over occasional bursts of effort. Steady progress builds trust.',
    },
    tone: 'direct',
  },
  supportive: {
    id: 'supportive',
    name: 'Victoria',
    nickname: 'I\'ve got you. Let\'s try again.',
    subtitle: 'Warm and encouraging partner',
    avatar: '/characters/Victoria.png',
    description: 'Warm, encouraging but not naïve. Celebrates effort, not outcomes. Feels like a close friend who believes in you.',
    rules: [
      'Progress over perfection—every step counts.',
      'Mistakes? They\'re just data points for growth.',
      'You\'re building something. I see it, even when you don\'t.',
      'Low energy? That\'s okay. Just show up anyway.',
    ],
    principle: {
      title: 'Progress Over Perfection',
      description: 'Every small step forward matters. I celebrate your effort and growth, not just your outcomes.',
    },
    tone: 'encouraging',
  },
  mentor: {
    id: 'mentor',
    name: 'Ada',
    nickname: 'Slow progress still counts.',
    subtitle: 'Thoughtful and experienced guide',
    avatar: '/characters/Ada.png',
    description: 'Thoughtful, curious, never judgmental. Asks "why" more than "did you?". Feels like a calm teacher or monk.',
    rules: [
      'Reflect on your "why" before rushing into action.',
      'Setbacks reveal more than successes. Pay attention.',
      'Depth beats speed. Quality emerges from patience.',
      'Wisdom isn\'t found—it\'s practiced daily.',
    ],
    principle: {
      title: 'Process Over Outcomes',
      description: 'The journey matters more than the destination. I help you reflect on what you\'re learning, not just what you\'re achieving.',
    },
    tone: 'thoughtful',
  },
  'drill-sergeant': {
    id: 'drill-sergeant',
    name: 'Mitch',
    nickname: 'We move. Now.',
    subtitle: 'Intense and demanding coach',
    avatar: '/characters/Mitch.png',
    description: 'Loud energy, not loud words. Challenging but playful. Feels like a coach who believes you can do more.',
    rules: [
      'Excuses? Save them. I need results.',
      'You said you wanted this—time to prove it.',
      'Pressure turns into play when you lean in.',
      'I\'m not here to make you comfortable. I\'m here to make you better.',
    ],
    principle: {
      title: 'No Negotiations',
      description: 'You made a commitment. Now deliver. I don\'t accept excuses—only results. Accountability is non-negotiable.',
    },
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
    bossLanguage?: BossLanguage;
  }
): BossReaction {
  const bossType = context?.bossType || 'execution';
  const bossLanguage = context?.bossLanguage || 'en';
  const consecutiveMisses = context?.consecutiveMisses || 1;

  if (checkInStatus === 'done') {
    return getDoneFeedback(bossType, bossLanguage);
  }

  return getMissedFeedback(bossType, consecutiveMisses, bossLanguage);
}

// Multilingual boss feedback messages
const DONE_MESSAGES: Record<BossLanguage, Record<BossType, string[]>> = {
  en: {
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
  },
  'zh-CN': {
    execution: [
      "很好。你做到了你承诺的事。继续保持。",
      "扎实的工作。一致性就是一切。",
      "就是这样做的。明天，同样的能量。",
    ],
    supportive: [
      "今天表现很棒！我为你感到骄傲。",
      "你正在一天天地建立了不起的东西。",
      "这就是承诺的样子。继续前进！",
    ],
    mentor: [
      "做得好。反思一下今天成功的原因。",
      "又进步了一天。注意一致性如何累积。",
      "执行得很好。明天记住这种感觉。",
    ],
    'drill-sergeant': [
      "完成了。这就是标准。不要降低它。",
      "好。明天再做一次。不许偷懒。",
      "这就是我期待的。继续推进。",
    ],
  },
  'zh-TW': {
    execution: [
      "很好。你做到了你承諾的事。繼續保持。",
      "紮實的工作。一致性就是一切。",
      "就是這樣做的。明天，同樣的能量。",
    ],
    supportive: [
      "今天表現很棒！我為你感到驕傲。",
      "你正在一天天地建立了不起的東西。",
      "這就是承諾的樣子。繼續前進！",
    ],
    mentor: [
      "做得好。反思一下今天成功的原因。",
      "又進步了一天。注意一致性如何累積。",
      "執行得很好。明天記住這種感覺。",
    ],
    'drill-sergeant': [
      "完成了。這就是標準。不要降低它。",
      "好。明天再做一次。不許偷懶。",
      "這就是我期待的。繼續推進。",
    ],
  },
  'zh-HK': {
    execution: [
      "好。你做到咗你講過嘅嘢。繼續保持。",
      "扎實嘅工作。一致性就係一切。",
      "就係咁做。聽日，同樣嘅能量。",
    ],
    supportive: [
      "今日表現好好！我為你感到驕傲。",
      "你正在一日日建立緊好勁嘅嘢。",
      "呢個就係承諾嘅樣子。繼續行落去！",
    ],
    mentor: [
      "做得好。反思下今日點解成功。",
      "又進步咗一日。留意下一致性點樣累積。",
      "執行得好。聽日記住呢種感覺。",
    ],
    'drill-sergeant': [
      "完成咗。呢個就係標準。唔好降低佢。",
      "好。聽日再做多次。唔准偷懶。",
      "呢個就係我期待嘅。繼續推進。",
    ],
  },
};

function getDoneFeedback(bossType: BossType, language: BossLanguage): BossReaction {
  const messages = DONE_MESSAGES[language][bossType];
  const message = messages[Math.floor(Math.random() * messages.length)];
  
  return {
    message,
    eventType: 'praise',
  };
}

const MISSED_ONCE_MESSAGES: Record<BossLanguage, Record<BossType, string>> = {
  en: {
    execution: "You missed today. No excuses. Get back on track tomorrow.",
    supportive: "You missed today, and that's okay. Let's get back on track tomorrow—I know you can do this.",
    mentor: "A missed day. Analyze what happened and adjust your approach.",
    'drill-sergeant': "You MISSED. This is unacceptable. Get up and GET BACK TO WORK.",
  },
  'zh-CN': {
    execution: "你今天错过了。没有借口。明天回到正轨。",
    supportive: "你今天错过了，没关系。明天让我们回到正轨——我知道你能做到。",
    mentor: "错过了一天。分析发生了什么并调整你的方法。",
    'drill-sergeant': "你错过了。这是不可接受的。站起来，回去工作。",
  },
  'zh-TW': {
    execution: "你今天錯過了。沒有藉口。明天回到正軌。",
    supportive: "你今天錯過了，沒關係。明天讓我們回到正軌——我知道你能做到。",
    mentor: "錯過了一天。分析發生了什麼並調整你的方法。",
    'drill-sergeant': "你錯過了。這是不可接受的。站起來，回去工作。",
  },
  'zh-HK': {
    execution: "你今日miss咗。冇藉口。聽日返回正軌。",
    supportive: "你今日miss咗，冇問題。聽日返回正軌——我知你做得到。",
    mentor: "miss咗一日。分析下發生咗乜嘢並調整你嘅方法。",
    'drill-sergeant': "你MISS咗。呢個係唔可以接受嘅。企返起身，返去做嘢。",
  },
};

const MISSED_TWICE_MESSAGES: Record<BossLanguage, Record<BossType, string>> = {
  en: {
    execution: "Two days in a row? This is not a negotiation. You committed to this goal. Show up or quit.",
    supportive: "Two days missed. I'm concerned. What's getting in your way? Let's tackle it together.",
    mentor: "Two consecutive misses indicate a pattern. Time to reassess your strategy.",
    'drill-sergeant': "TWO DAYS?! This is pathetic. You're either IN or you're OUT. Which is it?",
  },
  'zh-CN': {
    execution: "连续两天？这不是谈判。你承诺了这个目标。出现或退出。",
    supportive: "错过了两天。我很担心。是什么阻碍了你？让我们一起解决。",
    mentor: "连续两次错过表明一种模式。是时候重新评估你的策略了。",
    'drill-sergeant': "两天？！这太可悲了。你要么进要么出。是哪个？",
  },
  'zh-TW': {
    execution: "連續兩天？這不是談判。你承諾了這個目標。出現或退出。",
    supportive: "錯過了兩天。我很擔心。是什麼阻礙了你？讓我們一起解決。",
    mentor: "連續兩次錯過表明一種模式。是時候重新評估你的策略了。",
    'drill-sergeant': "兩天？！這太可悲了。你要麼進要麼出。是哪個？",
  },
  'zh-HK': {
    execution: "連續兩日？呢個唔係傾偈。你承諾咗呢個目標。出現或者quit。",
    supportive: "miss咗兩日。我好擔心。係咩阻住咗你？一齊解決佢。",
    mentor: "連續兩次miss表示一種模式。係時候重新評估你嘅策略喇。",
    'drill-sergeant': "兩日？！呢個太可悲喇。你要麼IN要麼OUT。邊個？",
  },
};

const MISSED_MULTIPLE_MESSAGES: Record<BossLanguage, Record<BossType, string>> = {
  en: {
    execution: "You've missed multiple days. Either you're serious about this goal or you're not. Decide now.",
    supportive: "Multiple misses are a signal. Should we adjust your goal? Remember why you started.",
    mentor: "Multiple consecutive misses require serious reflection. Is this goal aligned with your current capacity?",
    'drill-sergeant': "MULTIPLE DAYS MISSED. You're failing yourself. Either recommit RIGHT NOW or abandon this goal.",
  },
  'zh-CN': {
    execution: "你已经错过了多天。你要么认真对待这个目标，要么不认真。现在决定。",
    supportive: "多次错过是一个信号。我们应该调整你的目标吗？记住你为什么开始。",
    mentor: "多次连续错过需要认真反思。这个目标与你当前的能力一致吗？",
    'drill-sergeant': "错过了多天。你在让自己失败。要么现在重新承诺，要么放弃这个目标。",
  },
  'zh-TW': {
    execution: "你已經錯過了多天。你要麼認真對待這個目標，要麼不認真。現在決定。",
    supportive: "多次錯過是一個信號。我們應該調整你的目標嗎？記住你為什麼開始。",
    mentor: "多次連續錯過需要認真反思。這個目標與你當前的能力一致嗎？",
    'drill-sergeant': "錯過了多天。你在讓自己失敗。要麼現在重新承諾，要麼放棄這個目標。",
  },
  'zh-HK': {
    execution: "你已經miss咗好多日。你要麼認真對待呢個目標，要麼唔認真。而家決定。",
    supportive: "多次miss係一個信號。我哋應該調整你嘅目標嗎？記住你點解開始。",
    mentor: "多次連續miss需要認真反思。呢個目標同你而家嘅能力一致嗎？",
    'drill-sergeant': "MISS咗多日。你喺令自己失敗。要麼而家重新承諾，要麼放棄呢個目標。",
  },
};

function getMissedFeedback(bossType: BossType, consecutiveMisses: number, language: BossLanguage): BossReaction {
  if (consecutiveMisses === 1) {
    return {
      message: MISSED_ONCE_MESSAGES[language][bossType],
      eventType: 'warning',
    };
  } else if (consecutiveMisses === 2) {
    return {
      message: MISSED_TWICE_MESSAGES[language][bossType],
      eventType: 'warning',
    };
  } else {
    return {
      message: MISSED_MULTIPLE_MESSAGES[language][bossType],
      eventType: 'escalation',
    };
  }
}

export function getBossPersonality(bossType?: BossType): BossPersonality {
  return BOSS_PERSONALITIES[bossType || 'execution'];
}
