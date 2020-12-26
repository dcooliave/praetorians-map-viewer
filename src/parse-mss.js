export default function(text) {
  const [, block] = text.match(/\*ESCENARIO\s*{([^}]+)}/)
  const lines = block.matchAll(/\*([A-Z]+)\s+"([^"]+)"/g)
  const mss = {}

  for (const [, key, val] of lines) {
    mss[key] = val.replaceAll('\\', '/')
  }

  return mss
}
