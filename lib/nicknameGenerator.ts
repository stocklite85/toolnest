export type NickStyle = 'any' | 'funny' | 'fantasy' | 'martial' | 'character' | 'general' | 'concept'
export type NickLang = 'ko' | 'en_lower' | 'en_upper' | 'mixed'

const koPool: Record<Exclude<NickStyle, 'any'>, { adj: string[]; noun: string[] }> = {
  funny: {
    adj: ['졸린', '배고픈', '멍한', '뻔뻔한', '억울한', '당황한', '어리둥절한', '게으른', '엉뚱한', '덜렁', '허당', '능글'],
    noun: ['감자', '두부', '고구마', '라면', '치킨', '참새', '거북이', '달팽이', '펭귄', '너구리', '도토리', '호박', '두더지'],
  },
  fantasy: {
    adj: ['어둠의', '빛나는', '신비한', '영원한', '전설의', '고대의', '마법의', '황금의', '은빛', '불꽃의', '폭풍의', '천상의'],
    noun: ['마법사', '용사', '기사', '드래곤', '천사', '악마', '정령', '마왕', '성기사', '현자', '마녀', '수호자', '예언자'],
  },
  martial: {
    adj: ['천하제일', '무적의', '검은', '붉은', '냉혹한', '고독한', '절세의', '강철의', '혈풍', '독보적'],
    noun: ['검객', '협객', '도인', '무사', '고수', '자객', '방랑자', '검신', '검호', '협사', '도협', '무신', '낭인'],
  },
  character: {
    adj: ['핑크', '블루', '미니', '큐트', '슈퍼', '꿈꾸는', '반짝이는', '귀여운', '작은', '동글동글'],
    noun: ['토끼', '고양이', '강아지', '팬더', '별이', '달님', '하늘이', '구름이', '꽃이', '솜이', '콩이', '방울이', '뽀롱이'],
  },
  general: {
    adj: ['행복한', '즐거운', '밝은', '멋진', '귀여운', '씩씩한', '활발한', '따뜻한', '빠른', '강한', '부드러운', '맑은'],
    noun: ['하늘', '바다', '별', '달', '꽃', '봄', '빛', '바람', '구름', '무지개', '이슬', '새벽', '노을'],
  },
  concept: {
    adj: ['다크', '네온', '사이버', '레트로', '빈티지', '스트릿', '언더', '딥', '로우', '하이'],
    noun: ['그림자', '번개', '폭풍', '화염', '얼음', '암흑', '혼돈', '코드', '비트', '글리치', '매트릭스', '파동'],
  },
}

const enPool: Record<Exclude<NickStyle, 'any'>, { adj: string[]; noun: string[] }> = {
  funny: {
    adj: ['lazy', 'clumsy', 'hungry', 'grumpy', 'sleepy', 'goofy', 'derpy', 'sassy', 'cheeky', 'fuzzy', 'cranky'],
    noun: ['potato', 'noodle', 'pickle', 'muffin', 'nugget', 'taco', 'waffle', 'donut', 'goblin', 'blob', 'raccoon'],
  },
  fantasy: {
    adj: ['dark', 'golden', 'eternal', 'mystic', 'ancient', 'divine', 'shadow', 'silver', 'cosmic', 'sacred', 'crimson'],
    noun: ['mage', 'knight', 'dragon', 'angel', 'phoenix', 'raven', 'wizard', 'sage', 'hunter', 'titan', 'seer'],
  },
  martial: {
    adj: ['iron', 'silent', 'lone', 'swift', 'steel', 'cold', 'fierce', 'bold', 'grim', 'wild', 'razor'],
    noun: ['blade', 'wolf', 'hawk', 'viper', 'storm', 'reaper', 'fox', 'cobra', 'panther', 'falcon', 'lynx'],
  },
  character: {
    adj: ['fluffy', 'tiny', 'sweet', 'soft', 'happy', 'sunny', 'sparkly', 'dreamy', 'bouncy', 'cozy', 'rosy'],
    noun: ['bunny', 'kitten', 'panda', 'cloud', 'star', 'moon', 'cookie', 'mochi', 'peach', 'pudding', 'cupcake'],
  },
  general: {
    adj: ['bright', 'calm', 'cool', 'kind', 'free', 'pure', 'true', 'wise', 'bold', 'swift', 'clear'],
    noun: ['sky', 'sea', 'star', 'moon', 'wind', 'fire', 'sun', 'dream', 'light', 'wave', 'dawn'],
  },
  concept: {
    adj: ['cyber', 'neon', 'retro', 'turbo', 'hyper', 'pixel', 'digital', 'glitch', 'vibe', 'ultra', 'void'],
    noun: ['matrix', 'ghost', 'cipher', 'node', 'byte', 'pulse', 'nexus', 'void', 'wave', 'flux', 'grid'],
  },
}

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }

function pickStyle(style: NickStyle): Exclude<NickStyle, 'any'> {
  if (style !== 'any') return style
  return rand(['funny', 'fantasy', 'martial', 'character', 'general', 'concept'] as const)
}

function charCount(str: string): number {
  return [...str].length
}

function buildKo(style: NickStyle): string {
  const s = pickStyle(style)
  const { adj, noun } = koPool[s]
  const r = Math.random()
  if (r < 0.65) return rand(adj) + rand(noun)
  if (r < 0.85) return rand(noun) + rand(noun)
  return rand(noun)
}

function buildEn(style: NickStyle, upper: boolean): string {
  const s = pickStyle(style)
  const { adj, noun } = enPool[s]
  const r = Math.random()
  let nick: string
  if (r < 0.5)       nick = rand(adj) + rand(noun)
  else if (r < 0.75) nick = rand(adj) + rand(noun) + String(Math.floor(Math.random() * 99) + 1)
  else               nick = rand(noun) + String(Math.floor(Math.random() * 999) + 1)
  return upper ? nick.toUpperCase() : nick
}

export function generateNicknames(
  style: NickStyle,
  lang: NickLang,
  targetLen: number | null,
  count: number
): string[] {
  const results = new Set<string>()
  let attempts = 0

  while (results.size < count && attempts < count * 150) {
    attempts++
    const useKo = lang === 'ko' || (lang === 'mixed' && Math.random() < 0.5)
    const nick = useKo ? buildKo(style) : buildEn(style, lang === 'en_upper')
    const len = charCount(nick)
    if (targetLen !== null && len !== targetLen) continue
    if (len >= 2) results.add(nick)
  }

  return Array.from(results).slice(0, count)
}
