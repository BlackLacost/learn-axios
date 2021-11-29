import axios, { AxiosResponse } from 'axios'
import { from, Observable } from 'rxjs'
import { Stream } from 'stream'
import { LoggerInterceptor } from '../promise/logger.interceptor'

export const axiosApi = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com/',
  timeout: 10000,
})

LoggerInterceptor(axiosApi, console.log)

interface ImageResponse {
  albumId: number
  id: number
  title: string
  url: string
  thumbnailUrl: string
}

export const api = {
  getImages(): Observable<AxiosResponse<ImageResponse[]>> {
    return from(axiosApi.get('photos'))
  },

  getImage(url: string): Observable<AxiosResponse<Stream>> {
    return from(axiosApi.get(url, { responseType: 'stream' }))
  },

  getIp(): Observable<AxiosResponse> {
    return from(axiosApi.get(`https://api.ipify.org/`, { headers: { tor: 'true' } }))
  },
}
