import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Stream } from 'stream'
import { ConcurrencyInterceptor } from './concurrency.interceptor'
import { LoggerInterceptor } from './logger.interceptor'

export const axiosApi = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com/',
  timeout: 1000,
})

LoggerInterceptor(axiosApi, console.log)
ConcurrencyInterceptor(axiosApi, 2)

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
