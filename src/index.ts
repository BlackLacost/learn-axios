import axios, { AxiosResponse } from 'axios'
import { api, axiosApi } from './api'
import { saveStream } from './saveStream'
import { ConcurrencyInterceptor } from './concurrency.interceptor'

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

async function concurrentDownload(imagesUrls: string[]) {
  return Promise.all(imagesUrls.map((imageUrl) => api.getImage(imageUrl))).then(
    axios.spread((...allResponse) => {
      allResponse.forEach((response) =>
        saveStream(response.data, getFilenameFromImageResponse(response)),
      )
    }),
  )
}
async function checkTor(times: number) {
  // return Promise.all([...Array(times)].map(() => api.getIp())).then(
  //   axios.spread((...allResponse) => {
  //     allResponse.forEach((response) => console.log(response.data))
  //   }),
  // )
  for (const _ of [...Array(times)]) {
    api.getIp().then((response) => console.log(response.data))
  }
  return
}

async function timeLog(target: Function, imagesUrls: string[]) {
  const startTime = Date.now()
  await target(imagesUrls)
  const endTime = Date.now()
  console.log(endTime - startTime)
}

async function main() {
  // const imagesUrls = await getImagesUrls(10)
  // const concurrencyInterceptor = ConcurrencyInterceptor(axiosApi, 2)
  // await timeLog(concurrentDownload, imagesUrls)
  // concurrencyInterceptor.detach()
  await checkTor(20)
}

main()
