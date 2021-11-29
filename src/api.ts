import axios, { AxiosResponse } from 'axios'
import { Stream } from 'stream'
import { ConcurrencyInterceptor } from './concurrency.interceptor'
import { LoggerInterceptor } from './logger.interceptor'
import { TorInterceptor } from './tor.interceptor'

export const axiosApi = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com/',
  timeout: 10000,
})

LoggerInterceptor(axiosApi, console.log)
ConcurrencyInterceptor(axiosApi, 2)
TorInterceptor(axiosApi, 2)

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

  getIp(): Promise<AxiosResponse> {
    return axiosApi.get(`https://api.ipify.org/`, { headers: { tor: 'true' } })
  },
}
