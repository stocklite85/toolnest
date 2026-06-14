export interface PasswordOptions {
  length: number
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
}

const CHARS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

export function generatePassword(opts: PasswordOptions): string {
  let pool = ''
  const guaranteed: string[] = []

  if (opts.uppercase) {
    pool += CHARS.uppercase
    guaranteed.push(CHARS.uppercase[Math.floor(Math.random() * CHARS.uppercase.length)])
  }
  if (opts.lowercase) {
    pool += CHARS.lowercase
    guaranteed.push(CHARS.lowercase[Math.floor(Math.random() * CHARS.lowercase.length)])
  }
  if (opts.numbers) {
    pool += CHARS.numbers
    guaranteed.push(CHARS.numbers[Math.floor(Math.random() * CHARS.numbers.length)])
  }
  if (opts.symbols) {
    pool += CHARS.symbols
    guaranteed.push(CHARS.symbols[Math.floor(Math.random() * CHARS.symbols.length)])
  }

  if (!pool) return ''

  const arr = new Uint32Array(opts.length)
  crypto.getRandomValues(arr)
  const result = Array.from(arr).map(n => pool[n % pool.length])

  guaranteed.forEach((char, i) => { if (i < result.length) result[i] = char })

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }

  return result.join('')
}

export function getStrength(password: string): { score: number; label: string; color: string; width: string } {
  if (!password) return { score: 0, label: '', color: 'bg-slate-600', width: 'w-0' }

  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (password.length >= 16) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 2) return { score, label: 'weak', color: 'bg-red-500', width: 'w-1/4' }
  if (score <= 4) return { score, label: 'fair', color: 'bg-yellow-500', width: 'w-2/4' }
  if (score <= 5) return { score, label: 'good', color: 'bg-blue-500', width: 'w-3/4' }
  return { score, label: 'strong', color: 'bg-green-500', width: 'w-full' }
}
