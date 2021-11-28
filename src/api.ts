import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com/',
  timeout: 1000,
})

export const api = {
  getImages() {
    return instance.get('https://jsonplaceholder.typicode.com/photos')
  },
}
