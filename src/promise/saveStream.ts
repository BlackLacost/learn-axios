import { Stream } from 'stream'
import { createWriteStream, existsSync, mkdirSync } from 'fs'
import path from 'path'

export function saveStream(stream: Stream, filename: string): Promise<string> {
  const dir = path.join(__dirname, '..', '..', 'images')

  if (!existsSync(dir)) {
    mkdirSync(dir)
  }
  const filenamePath = path.join(dir, filename)

  const writer = createWriteStream(filenamePath)
  stream.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(`saved ${filename}`))
    writer.on('error', reject)
  })
}
