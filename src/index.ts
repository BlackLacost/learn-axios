import { AxiosResponse } from 'axios'
import { api } from './api'
import { saveStream } from './saveStream'

async function getImagesUrls(maxImages: number | undefined = undefined) {
  const response = await api.getImages()
  return response.data.map((data) => data.url).slice(0, maxImages)
}

function getFilenameFromImageResponse(response: AxiosResponse): string {
  const fileExtention = response.headers['content-type'].split('/')[1]
  const imageName = response.request.path.split('/').slice(-1)[0]
  const fileName = `${imageName}.${fileExtention}`
  return fileName
}

async function main() {
  const imagesUrls = await getImagesUrls(10)

  imagesUrls.forEach(async (imageUrl) => {
    const response = await api.getImage(imageUrl)
    saveStream(response.data, getFilenameFromImageResponse(response))
  })
}

main()
