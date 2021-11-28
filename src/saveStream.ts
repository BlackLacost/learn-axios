import { Stream } from 'stream'
import { createWriteStream } from 'fs'
import path from 'path'

export function saveStream(stream: Stream, filename: string): Promise<unknown> {
  const filenamePath = path.join(__dirname, '..', 'images', filename)

  const writer = createWriteStream(filenamePath)
  stream.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}
