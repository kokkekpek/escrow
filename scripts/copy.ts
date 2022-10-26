import fs from 'fs'
import FastGlob from 'fast-glob'
import colors from 'colors'
import path from 'path'
import ErrnoException = NodeJS.ErrnoException

export interface CopyConfig {
    sources: string[] | string
    words: string[] | string
}

/**
 * Search files with keyword and copy without keyword
 *     `config.example.ts` > `config.ts`
 *     `config.local.template.ts` > `config.local.ts`
 * @param config {CopyConfig} Example:
 *     {
 *         sources: [
 *             './*',
 *             './configs/*',
 *             './configs/config.example.ts'
 *         ],
 *         words: [
 *             'example',
 *             'template',
 *             'sample',
 *             'tmp'
 *         ]
 *     }
 * @see https://github.com/mrmlnc/fast-glob
 */
export async function copy(config: CopyConfig): Promise<void> {
    const sources: string[] = Array.isArray(config.sources) ? [...new Set(config.sources)] : [config.sources]
    const words: string[] = Array.isArray(config.words) ? [...new Set(config.words)] : [config.words]
    const files: string[] = FastGlob.sync(sources)
    for (let i: number = 0; i < files.length; i++) {
        const file: string = files[i]
        for (let j: number = 0; j < words.length; j++) {
            const search: string = `.${words[j]}.`
            if (!file.includes(search))
                continue

            const destination: string = file.replace(search, '.')
            fs.copyFile(file, destination, (error: ErrnoException | null) => {
                if (error)
                    throw error
                else {
                    const fileName: string = path.basename(file)
                    const destinationName: string = path.basename(destination)
                    console.log(`${colors.green(fileName)} > ${colors.green(destinationName)}`)
                }
            })
        }
    }
}

copy({
    sources: './config/*',
    words: 'example'
}).then()