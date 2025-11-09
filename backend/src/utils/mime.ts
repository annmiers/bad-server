import { open } from 'fs/promises'

const SIGNATURES: Record<string, number[]> = {
    'image/png': [0x89, 0x50, 0x4e, 0x47], // PNG
    'image/jpeg': [0xff, 0xd8, 0xff], // JPEG SOI
    'image/gif': [0x47, 0x49, 0x46, 0x38], // GIF8
}

async function readHeader(filePath: string, length = 256): Promise<Uint8Array> {
    const fh = await open(filePath, 'r')
    try {
        const buf = new Uint8Array(length)
        await fh.read(buf, 0, length, 0)
        return buf
    } finally {
        await fh.close()
    }
}

function matchesSignature(buffer: Uint8Array, signature: number[]): boolean {
    if (buffer.length < signature.length) return false
    for (let i = 0; i < signature.length; i += 1) {
        if (buffer[i] !== signature[i]) return false
    }
    return true
}

export async function detectImageMime(
    filePath: string
): Promise<string | null> {
    const header = await readHeader(filePath, 512)

    const matched = Object.entries(SIGNATURES).find(([_, sig]) =>
        matchesSignature(header, sig)
    )

    if (matched) return matched[0]

    const textStart = new TextDecoder('utf-8', { fatal: false })
        .decode(header)
        .trimStart()
    const normalized = textStart.slice(0, 64).toLowerCase()
    if (normalized.startsWith('<?xml') || normalized.startsWith('<svg')) {
        return 'image/svg+xml'
    }

    return null
}
