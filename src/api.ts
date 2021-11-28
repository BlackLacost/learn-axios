import axios, { AxiosResponse } from 'axios'
import { Stream } from 'stream'
import logger from './logger'

export const axiosApi = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com/',
  timeout: 1000,
})

logger(axiosApi, console.log)

interface ImageResponse {
  albumId: number
  id: number
  title: string
  url: string
  thumbnailUrl: string
}

export const api = {
  getImages(): Promise<AxiosResponse<ImageResponse[]>> {
    return axiosApi.get('photos')
  },

  getImage(url: string): Promise<AxiosResponse<Stream>> {
    return axiosApi.get(url, { responseType: 'stream' })
  },
}
