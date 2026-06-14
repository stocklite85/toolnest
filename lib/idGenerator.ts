export type Style = 'any' | 'cool' | 'cute' | 'funny' | 'tech'
export type Separator = '' | '-' | '_'

const pool: Record<Exclude<Style, 'any'>, { adj: string[]; noun: string[] }> = {
  cool: {
    adj: ['shadow', 'dark', 'iron', 'neon', 'phantom', 'silent', 'rogue', 'apex', 'prime', 'ultra', 'ghost', 'frozen', 'electric', 'cosmic', 'void', 'crimson', 'stealth', 'brutal', 'savage', 'lone', 'bold', 'grim', 'wild', 'cold', 'raw'],
    noun: ['wolf', 'hawk', 'viper', 'cobra', 'titan', 'blade', 'storm', 'raven', 'phoenix', 'dragon', 'falcon', 'panther', 'thunder', 'nova', 'reaper', 'ranger', 'hunter', 'knight', 'sniper', 'rebel', 'fox', 'bear', 'crow', 'lynx', 'boar'],
  },
  cute: {
    adj: ['fluffy', 'tiny', 'sweet', 'soft', 'fuzzy', 'happy', 'sunny', 'starry', 'sleepy', 'chubby', 'bubbly', 'sparkly', 'dreamy', 'pastel', 'rosy', 'bouncy', 'glowy', 'snuggly', 'cozy', 'chibi', 'mini', 'cute', 'puffy', 'dewy', 'silky'],
    noun: ['bunny', 'kitten', 'puppy', 'panda', 'bear', 'cloud', 'star', 'moon', 'pearl', 'cookie', 'mochi', 'daisy', 'peach', 'lemon', 'button', 'pudding', 'cupcake', 'boba', 'tulip', 'sprout', 'cake', 'dew', 'puff', 'bean', 'pie'],
  },
  funny: {
    adj: ['lazy', 'clumsy', 'grumpy', 'hangry', 'sassy', 'goofy', 'wacky', 'cranky', 'sneaky', 'cheeky', 'derpy', 'extra', 'salty', 'sus', 'feral', 'cursed', 'chaotic', 'spicy', 'crispy', 'soggy', 'dumb', 'zany', 'odd', 'big', 'soft'],
    noun: ['potato', 'noodle', 'pickle', 'muffin', 'nugget', 'taco', 'waffle', 'donut', 'burrito', 'dumpling', 'pretzel', 'bagel', 'tofu', 'pancake', 'churro', 'hotdog', 'biscuit', 'goblin', 'gremlin', 'raccoon', 'rat', 'blob', 'sock', 'egg', 'ham'],
  },
  tech: {
    adj: ['cyber', 'binary', 'quantum', 'neural', 'crypto', 'digital', 'turbo', 'hyper', 'nano', 'pixel', 'vector', 'async', 'cached', 'runtime', 'kernel', 'sudo', 'headless', 'lambda', 'recursive', 'compiled', 'null', 'root', 'raw', 'dry', 'hex'],
    noun: ['nexus', 'matrix', 'node', 'proxy', 'kernel', 'stack', 'hash', 'bot', 'daemon', 'socket', 'token', 'cipher', 'buffer', 'payload', 'webhook', 'router', 'cluster', 'pipeline', 'runtime', 'api', 'cpu', 'ram', 'log', 'loop', 'byte'],
  },
}

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }

function pickStyle(style: Style): Exclude<Style, 'any'> {
  if (style !== 'any') return style
  const styles: Exclude<Style, 'any'>[] = ['cool', 'cute', 'funny', 'tech']
  return rand(styles)
}

export interface GenOptions {
  name: string
  hobbies: string
  numbers: string
  style: Style
  separator: Separator
}

function cleanWord(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, '')
}

function getNumbers(numbers: string): string[] {
  const cleaned = numbers.trim()
  if (!cleaned) return ['', `${randInt(1, 99)}`, `${randInt(100, 999)}`, `${randInt(10, 99)}`]
  const explicit = cleaned.replace(/[^0-9,\s]/g, '').split(/[,\s]+/).filter(Boolean)
  return explicit.length ? explicit : [`${randInt(1, 99)}`]
}

function getHobbyWords(hobbies: string): string[] {
  return hobbies.split(/[,\s]+/).map(cleanWord).filter(w => w.length >= 2).slice(0, 5)
}

export function generateUsernames(opts: GenOptions, count: number): string[] {
  const { name, hobbies, numbers, style, separator } = opts
  const sep = separator
  const nameWord = cleanWord(name)
  const hobbyWords = getHobbyWords(hobbies)
  const nums = getNumbers(numbers)
  const results = new Set<string>()

  const add = (parts: (string | undefined)[], num = '') => {
    const joined = parts.filter(Boolean).join(sep) + num
    if (joined.length >= 3) results.add(joined)
  }

  let attempts = 0
  while (results.size < count && attempts < count * 10) {
    attempts++
    const s = pickStyle(style)
    const { adj, noun } = pool[s]
    const a = rand(adj)
    const n = rand(noun)
    const num = rand(nums) ? `${sep}${rand(nums)}` : ''
    const hobby = hobbyWords.length ? rand(hobbyWords) : ''

    // Generation patterns
    const pattern = randInt(0, nameWord ? 7 : 4)
    switch (pattern) {
      case 0: add([a, n], num); break
      case 1: add([a, n]); break
      case 2: add([a, n], `${sep}${randInt(1, 999)}`); break
      case 3: add([n, a], num); break
      case 4: add([a, n, `${randInt(10, 99)}`]); break
      case 5: add([nameWord, n], num); break
      case 6: add([a, nameWord], num); break
      case 7: add([nameWord, hobby || n], num); break
    }

    if (hobby) {
      const p2 = randInt(0, 2)
      if (p2 === 0) add([hobby, n], num)
      else if (p2 === 1) add([a, hobby], num)
      else add([nameWord || a, hobby], num)
    }
  }

  return Array.from(results).slice(0, count)
}

export function generateUUID(): string {
  const arr = new Uint8Array(16)
  crypto.getRandomValues(arr)
  arr[6] = (arr[6] & 0x0f) | 0x40
  arr[8] = (arr[8] & 0x3f) | 0x80
  return [
    [...arr.slice(0, 4)].map(b => b.toString(16).padStart(2, '0')).join(''),
    [...arr.slice(4, 6)].map(b => b.toString(16).padStart(2, '0')).join(''),
    [...arr.slice(6, 8)].map(b => b.toString(16).padStart(2, '0')).join(''),
    [...arr.slice(8, 10)].map(b => b.toString(16).padStart(2, '0')).join(''),
    [...arr.slice(10)].map(b => b.toString(16).padStart(2, '0')).join(''),
  ].join('-')
}
