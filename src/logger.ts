export default (instance: any, callback: any) => {
  instance.interceptors.request.use((request: any) => {
    request.startTime = Date.now()
    return request
  })

  instance.interceptors.response.use((response: any) => {
    const timeDelta = Number(Date.now() - response.config.startTime)
    callback(`Запрос ${response.config.url} выполнен за ${timeDelta}ms`)
    return response
  })
}
