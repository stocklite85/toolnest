export interface SubnetInfo {
  ip: string
  cidr: number
  subnetMask: string
  wildcardMask: string
  networkAddress: string
  broadcastAddress: string
  firstHost: string
  lastHost: string
  totalHosts: number
  usableHosts: number
  ipClass: string
  isPrivate: boolean
  binaryMask: string
}

function ipToInt(ip: string): number {
  return ip.split('.').reduce((acc, oct) => (acc << 8) + parseInt(oct), 0) >>> 0
}

function intToIp(n: number): string {
  return `${(n >>> 24) & 255}.${(n >>> 16) & 255}.${(n >>> 8) & 255}.${n & 255}`
}

function ipClass(first: number): string {
  if (first < 128) return 'A'
  if (first < 192) return 'B'
  if (first < 224) return 'C'
  if (first < 240) return 'D (Multicast)'
  return 'E (Reserved)'
}

function isPrivate(first: number, second: number): boolean {
  return first === 10 ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168)
}

export function calculateSubnet(ip: string, cidr: number): SubnetInfo | null {
  const parts = ip.trim().split('.')
  if (parts.length !== 4 || parts.some(p => isNaN(+p) || +p < 0 || +p > 255)) return null
  if (cidr < 0 || cidr > 32) return null

  const ipInt = ipToInt(ip)
  const maskInt = cidr === 0 ? 0 : ((0xffffffff << (32 - cidr)) >>> 0)
  const wildInt = (~maskInt) >>> 0
  const netInt = (ipInt & maskInt) >>> 0
  const bcastInt = (netInt | wildInt) >>> 0
  const total = Math.pow(2, 32 - cidr)
  const usable = cidr >= 31 ? total : Math.max(0, total - 2)

  const maskOctets = [maskInt >>> 24, (maskInt >>> 16) & 255, (maskInt >>> 8) & 255, maskInt & 255]
  const binaryMask = maskOctets.map(o => o.toString(2).padStart(8, '0')).join('.')

  const first = parseInt(parts[0])
  const second = parseInt(parts[1])

  return {
    ip: ip.trim(),
    cidr,
    subnetMask: intToIp(maskInt),
    wildcardMask: intToIp(wildInt),
    networkAddress: intToIp(netInt),
    broadcastAddress: intToIp(bcastInt),
    firstHost: intToIp(cidr >= 31 ? netInt : netInt + 1),
    lastHost: intToIp(cidr >= 31 ? bcastInt : bcastInt - 1),
    totalHosts: total,
    usableHosts: usable,
    ipClass: ipClass(first),
    isPrivate: isPrivate(first, second),
    binaryMask,
  }
}

export function parseCIDR(input: string): { ip: string; cidr: number } | null {
  const m = input.trim().match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/(\d{1,2})$/)
  if (!m) return null
  return { ip: m[1], cidr: parseInt(m[2]) }
}
