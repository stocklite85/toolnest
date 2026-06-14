export type Style = 'cool' | 'cute' | 'funny' | 'tech'
export type Separator = '-' | '_' | '.'

const words: Record<Style, { adj: string[]; noun: string[] }> = {
  cool: {
    adj: ['shadow', 'dark', 'iron', 'neon', 'phantom', 'silent', 'rogue', 'apex', 'prime', 'ultra', 'hyper', 'ghost', 'frozen', 'burning', 'electric', 'cosmic', 'solar', 'lunar', 'void', 'crimson'],
    noun: ['wolf', 'hawk', 'viper', 'cobra', 'titan', 'blade', 'storm', 'raven', 'phoenix', 'dragon', 'falcon', 'panther', 'jaguar', 'thunder', 'nova', 'comet', 'reaper', 'ranger', 'hunter', 'legend'],
  },
  cute: {
    adj: ['fluffy', 'tiny', 'sweet', 'soft', 'little', 'fuzzy', 'happy', 'sunny', 'starry', 'sleepy', 'chubby', 'bubbly', 'sparkly', 'dreamy', 'pastel', 'rosy', 'bouncy', 'glowy', 'snuggly', 'cozy'],
    noun: ['bunny', 'kitten', 'puppy', 'panda', 'bear', 'cloud', 'star', 'moon', 'pearl', 'cookie', 'mochi', 'daisy', 'peach', 'lemon', 'melon', 'button', 'pudding', 'cupcake', 'boba', 'tulip'],
  },
  funny: {
    adj: ['lazy', 'clumsy', 'grumpy', 'hangry', 'sassy', 'goofy', 'zany', 'wacky', 'cranky', 'sneaky', 'cheeky', 'derpy', 'extra', 'salty', 'sus', 'unhinged', 'feral', 'cursed', 'chaotic', 'spicy'],
    noun: ['potato', 'noodle', 'pickle', 'muffin', 'nugget', 'taco', 'biscuit', 'waffle', 'donut', 'burrito', 'dumpling', 'pretzel', 'bagel', 'tofu', 'nachos', 'pancake', 'churro', 'lasagna', 'hotdog', 'spaghetti'],
  },
  tech: {
    adj: ['cyber', 'binary', 'quantum', 'neural', 'crypto', 'digital', 'turbo', 'hyper', 'meta', 'nano', 'ultra', 'pixel', 'vector', 'async', 'cached', 'compiled', 'runtime', 'kernel', 'sudo', 'headless'],
    noun: ['nexus', 'matrix', 'node', 'proxy', 'kernel', 'stack', 'hash', 'loop', 'bot', 'daemon', 'socket', 'token', 'cipher', 'buffer', 'bitwise', 'payload', 'webhook', 'router', 'cluster', 'pipeline'],
  },
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateUUID(): string {
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

export interface IdOptions {
  style: Style
  separator: Separator
  includeNumber: boolean
}

export function generateUsername(opts: IdOptions): string {
  const { adj, noun } = words[opts.style]
  const sep = opts.separator
  const num = opts.includeNumber ? `${sep}${randomInt(10, 999)}` : ''
  return `${randomItem(adj)}${sep}${randomItem(noun)}${num}`
}

export function generateUsernames(opts: IdOptions, count: number): string[] {
  return Array.from({ length: count }, () => generateUsername(opts))
}

export function generateUUIDs(count: number): string[] {
  return Array.from({ length: count }, () => generateUUID())
}
