import axios, { AxiosResponse } from 'axios'
import { Stream } from 'stream'

const instance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com/',
  timeout: 1000,
})

interface ImageResponse {
  albumId: number
  id: number
  title: string
  url: string
  thumbnailUrl: string
}

export const api = {
  getImages(): Promise<AxiosResponse<ImageResponse[]>> {
    return instance.get('photos')
  },

  getImage(url: string): Promise<AxiosResponse<Stream>> {
    return instance.get(url, { responseType: 'stream' })
  },
}
