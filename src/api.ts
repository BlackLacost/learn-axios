import axios from 'axios'

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
  getImages() {
    return instance.get<ImageResponse[]>('photos')
  },
}
