import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

interface Queue {
  request: AxiosRequestConfig
  resolve: CallableFunction
}

export const ConcurrencyInterceptor = (axios: AxiosInstance, MAX_CONCURRENT: number = 1) => {
  if (MAX_CONCURRENT < 1) {
    throw 'Concurrency Manager Error: minimun concurrent requests is 1'
  }

  const queue: Queue[] = []
  const running: Queue[] = []

  function runTaskFromQueue() {
    if (running.length < MAX_CONCURRENT) {
      const task = queue.shift()
      if (task) {
        task.resolve(task.request)
        running.push(task)
      }
    }
  }

  const requestInterceptor = axios.interceptors.request.use((request: AxiosRequestConfig) => {
    return new Promise((resolve) => {
      queue.push({ request, resolve })
      setTimeout(() => runTaskFromQueue(), 0)
    })
  })

  const responseInterceptor = axios.interceptors.response.use(
    (response: AxiosResponse) => {
      running.shift()
      setTimeout(() => runTaskFromQueue(), 0)
      return response
    },
    (error) => Promise.reject(error),
  )

  return {
    detach() {
      axios.interceptors.request.eject(requestInterceptor)
      axios.interceptors.response.eject(responseInterceptor)
    },
  }
}
