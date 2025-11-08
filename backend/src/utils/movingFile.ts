import { existsSync, rename } from 'fs'
import { basename, join } from 'path'

function movingFile(imagePath: string, from: string, to: string) {
    const safeFileName = basename(imagePath).replace(/[^a-zA-Z0-9._-]/g, '_')
    const fromPath = join(from, safeFileName)
    const toPath = join(to, safeFileName)

    if (!existsSync(fromPath)) {
        throw new Error('Файл не найден во временной папке')
    }

    rename(fromPath, toPath, (err) => {
        if (err) throw new Error('Ошибка при перемещении файла')
    })
}

export default movingFile
