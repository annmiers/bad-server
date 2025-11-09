import { Request, Express } from 'express'
import { randomUUID } from 'crypto'
import { extname} from 'path'
import fs from 'fs'
import { FILE_SIZE } from '../config'
import multer, { FileFilterCallback } from 'multer'
import { join } from 'path'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const temp = join(
    __dirname,
    process.env.UPLOAD_PATH_TEMP
        ? `../public/${process.env.UPLOAD_PATH_TEMP}`
        : '../public'
)

fs.mkdirSync(temp, { recursive: true })

const storage = multer.diskStorage({
    destination: (_req: Request, _file, cb: DestinationCallback) =>
        cb(null, temp),
    filename: (_req: Request, file, cb: FileNameCallback) => {
        const filename = randomUUID().concat(extname(file.originalname))
        cb(null, filename)
    }
})

export const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (!types.includes(file.mimetype)) {
        return cb(null, false)
    }

    return cb(null, true)
}

export default multer({
    storage,
    fileFilter,
    limits: { fileSize: FILE_SIZE.maxSize },
})
