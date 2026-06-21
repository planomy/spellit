export interface ParsedWord {
  word: string
  segments: string[]
  definition?: string
}

function stripNumbering(line: string): string {
  return line.replace(/^\s*(?:\d+[\.\)\:\-]\s*|\(\d+\)\s*|[\-•*]\s*)/, '').trim()
}

function extractWord(raw: string): string {
  return raw.trim().toLowerCase().replace(/[^a-z'-]/g, '')
}

function parseSegments(raw: string): string[] {
  return raw
    .split(/[\s·/|]+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function isCommaSeparatedWordList(line: string): boolean {
  const parts = line.split(',').map((p) => p.trim()).filter(Boolean)
  if (parts.length < 2) return false
  return parts.every((p) => /^[a-z'-]+$/i.test(p))
}

function looksLikeDefinition(text: string): boolean {
  const t = text.trim()
  if (t.length > 20) return true
  if (
    /\b(the|and|of|that|with|for|is|are|was|be|a|an|to|in|on|at|part|your|their|when|where|who|which|means|something|someone)\b/i.test(
      t,
    )
  ) {
    return true
  }
  const parts = parseSegments(t)
  if (parts.some((p) => p.length > 6)) return true
  const shortParts = parts.filter((p) => p.length <= 2).length
  if (parts.length >= 2 && shortParts < parts.length / 2) return true
  return false
}

function parseLine(line: string): ParsedWord | null {
  const cleaned = stripNumbering(line)
  if (!cleaned) return null

  // Segments via pipe or spaced dash (not hyphenated words)
  const pipeMatch = cleaned.match(/^(.+?)\s*[|]\s*(.+)$/)
  if (pipeMatch) {
    const word = extractWord(pipeMatch[1])
    const segments = parseSegments(pipeMatch[2])
    if (word && segments.length) return { word, segments }
  }

  const dashSegments = cleaned.match(/^(.+?)\s+[–—\-]\s+(.+)$/)
  if (dashSegments) {
    const word = extractWord(dashSegments[1])
    const rest = dashSegments[2].trim()
    if (word && rest) {
      if (looksLikeDefinition(rest) || rest.includes(',')) {
        return { word, segments: word.split(''), definition: rest }
      }
      const segments = parseSegments(rest)
      if (segments.length) return { word, segments }
    }
  }

  const colonMatch = cleaned.match(/^(.+?)\s*:\s*(.+)$/)
  if (colonMatch) {
    const word = extractWord(colonMatch[1])
    const rest = colonMatch[2].trim()
    if (!word) return null
    if (looksLikeDefinition(rest) || rest.includes(',')) {
      return { word, segments: word.split(''), definition: rest }
    }
    const segments = parseSegments(rest)
    if (segments.length) return { word, segments }
  }

  const parenMatch = cleaned.match(/^(.+?)\s*\(\s*(.+?)\s*\)\s*$/)
  if (parenMatch) {
    const word = extractWord(parenMatch[1])
    const def = parenMatch[2].trim()
    if (word && def) return { word, segments: word.split(''), definition: def }
  }

  const word = extractWord(cleaned)
  if (!word) return null
  return { word, segments: word.split('') }
}

/** Parse pasted lists: one entry per line, optional definitions or segments. */
export function parseWordListText(text: string): ParsedWord[] {
  const lines = text.split(/\n/)
  const words: ParsedWord[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    if (
      !trimmed.includes(':') &&
      !trimmed.includes('|') &&
      !trimmed.includes('(') &&
      isCommaSeparatedWordList(trimmed)
    ) {
      for (const part of trimmed.split(',')) {
        const w = extractWord(part)
        if (w) words.push({ word: w, segments: w.split('') })
      }
      continue
    }

    const parsed = parseLine(trimmed)
    if (parsed) words.push(parsed)
  }

  return words
}

export function withSnipFlags<T extends { isSnip?: boolean }>(
  words: T[],
  snipEvery = 5,
): (T & { isSnip: boolean })[] {
  return words.map((w, i) => ({
    ...w,
    isSnip: w.isSnip ?? (i + 1) % snipEvery === 0,
  }))
}

export function splitTokens(text: string): string[] {
  return text.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean)
}

export function wordsToText(words: { word: string; definition?: string }[]): string {
  return words
    .map((w) => (w.definition ? `${w.word}: ${w.definition}` : w.word))
    .join('\n')
}
