import pLimit from 'p-limit'
import { api } from './api'
import axios, { AxiosResponse } from 'axios'
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

async function maxConcurrentDownload(imagesUrls: string[]) {
  return Promise.all(imagesUrls.map((imageUrl) => api.getImage(imageUrl))).then(
    axios.spread((...allResponse) => {
      allResponse.forEach((response) =>
        saveStream(response.data, getFilenameFromImageResponse(response)),
      )
    }),
  )
}

async function oneConcurrentDownload(imagesUrls: string[]) {
  for (const imageUrl of imagesUrls) {
    const response = await api.getImage(imageUrl)
    saveStream(response.data, getFilenameFromImageResponse(response))
  }
}

function threeConcurrentDownload(imagesUrls: string[]) {
  const limit = pLimit(3)
  return Promise.all(imagesUrls.map((imageUrl) => limit(() => api.getImage(imageUrl))))
}

async function timeLog(target: Function, imagesUrls: string[]) {
  const startTime = Date.now()
  await target(imagesUrls)
  const endTime = Date.now()
  console.log(endTime - startTime)
}

async function main() {
  const imagesUrls = await getImagesUrls(10)
  await timeLog(oneConcurrentDownload, imagesUrls)
  await timeLog(threeConcurrentDownload, imagesUrls)
  await timeLog(maxConcurrentDownload, imagesUrls)
}

main()
