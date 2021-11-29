import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { SocksProxyAgent } from 'socks-proxy-agent'

export const TorInterceptor = (instance: AxiosInstance, socksPorts: number[] | number = 3) => {
  function* genProxyAgents(): Generator<SocksProxyAgent> {
    let proxyAgents: SocksProxyAgent[]
    if (typeof socksPorts === 'number') {
      proxyAgents = [...Array(socksPorts).keys()]
        .map((n) => n * 2 + 9050)
        .map((port) => `socks5://localhost:${port}`)
        .map((proxyOptions) => new SocksProxyAgent(proxyOptions))
    } else {
      proxyAgents = socksPorts
        .map((port) => `socks5://localhost:${port}`)
        .map((proxyOptions) => new SocksProxyAgent(proxyOptions))
    }

    while (true) {
      for (const variable of proxyAgents) {
        yield variable
      }
    }
  }
  const proxyAgents = genProxyAgents()

  instance.interceptors.request.use((request: AxiosRequestConfig) => {
    if (request.headers?.tor) {
      request.httpsAgent = proxyAgents.next().value
    }
    return request
  })

  instance.interceptors.response.use((response: AxiosResponse) => {
    if (response.config.httpsAgent) {
      delete response.config.httpsAgent
    }

    if (response.config.headers?.tor) {
      delete response.config.headers.tor
    }
    return response
  })
}
