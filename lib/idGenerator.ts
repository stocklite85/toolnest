const adjectives = [
  'happy', 'swift', 'bright', 'calm', 'bold', 'cool', 'fast', 'deep',
  'sharp', 'wild', 'keen', 'pure', 'warm', 'clear', 'brave', 'silent',
  'golden', 'cosmic', 'electric', 'turbo', 'mega', 'hyper', 'ultra',
  'super', 'neo', 'prime', 'apex', 'zen', 'iron', 'silver', 'neon',
  'frozen', 'burning', 'flying', 'rising', 'dark', 'lucky', 'magic',
]

const nouns = [
  'tiger', 'panda', 'fox', 'wolf', 'eagle', 'hawk', 'bear', 'lion',
  'shark', 'cobra', 'falcon', 'raven', 'dragon', 'phoenix', 'titan',
  'viper', 'nexus', 'proxy', 'cipher', 'pixel', 'byte', 'node',
  'spark', 'storm', 'flame', 'frost', 'blade', 'comet', 'nova', 'orbit',
  'quasar', 'pulsar', 'vector', 'matrix', 'ranger', 'hunter', 'rider',
]

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomAlphanumeric(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const arr = new Uint32Array(length)
  crypto.getRandomValues(arr)
  return Array.from(arr).map(n => chars[n % chars.length]).join('')
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

export type IdType = 'wordcombo' | 'alphanumeric' | 'uuid'
export type Separator = '-' | '_' | '.'

export interface IdOptions {
  type: IdType
  separator: Separator
  includeNumber: boolean
  count: number
}

export function generateId(opts: IdOptions): string {
  const sep = opts.separator

  switch (opts.type) {
    case 'wordcombo': {
      const adj = randomItem(adjectives)
      const noun = randomItem(nouns)
      const num = opts.includeNumber ? `${sep}${randomInt(10, 9999)}` : ''
      return `${adj}${sep}${noun}${num}`
    }
    case 'alphanumeric': {
      const base = randomAlphanumeric(10)
      const num = opts.includeNumber ? `${sep}${randomInt(100, 999)}` : ''
      return `${base}${num}`
    }
    case 'uuid':
      return generateUUID()
  }
}

export function generateIds(opts: IdOptions): string[] {
  return Array.from({ length: opts.count }, () => generateId(opts))
}
