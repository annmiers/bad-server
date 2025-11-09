import { readFile } from 'fs/promises';

const MIME_SIGNATURES: Record<string, Uint8Array> = {
    'image/png': new Uint8Array([137, 80, 78, 71]), // PNG
    'image/jpeg': new Uint8Array([255, 216, 255]), // JPEG
    'image/gif': new Uint8Array([71, 73, 70, 56]), // GIF
};

const HEADER_READ_LENGTH = 512;

async function getFileHeader(path: string, bytesToRead = HEADER_READ_LENGTH): Promise<Uint8Array> {
    const fileHandle = await readFile(path);
    return new Uint8Array(fileHandle.slice(0, bytesToRead));
}

function checkSignatureMatch(data: Uint8Array, signature: Uint8Array): boolean {
    if (data.length < signature.length) return false;
    
    for (let index = 0; index < signature.length; index++) {
        if (data[index] !== signature[index]) return false;
    }
    return true;
}

function checkSvgContent(headerData: Uint8Array): boolean {
    const textContent = new TextDecoder('utf-8', { fatal: false })
        .decode(headerData)
        .trim();
    
    const beginning = textContent.substring(0, 60).toLowerCase();
    return beginning.includes('<?xml') || beginning.includes('<svg');
}

export async function identifyImageType(
    filePath: string
): Promise<string | undefined> {
    const initialBytes = await getFileHeader(filePath);

    for (const [mimeType, signature] of Object.entries(MIME_SIGNATURES)) {
        if (checkSignatureMatch(initialBytes, signature)) {
            return mimeType;
        }
    }

    if (checkSvgContent(initialBytes)) {
        return 'image/svg+xml';
    }

    return undefined;
}
