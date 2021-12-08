import { Axios, AxiosError, AxiosRequestConfig } from 'axios'
import {
  catchError,
  delay,
  EMPTY,
  from,
  interval,
  map,
  mergeMap,
  of,
  pluck,
  range,
  repeat,
  take,
  tap,
  throttle,
  zip,
} from 'rxjs'
import { getFilenameFromImageResponse } from '../promise'
import { saveStream } from '../promise/saveStream'
import { api } from '../rxjs/api.rxjs'

// const imagesUrls$ = api.getImages().pipe(
//   pluck('data'),
//   mergeMap((data) => from(data)),
//   pluck('url'),
//   take(10),
// )

// imagesUrls$.subscribe(console.log)

// const downloadImages$ = imagesUrls$.pipe(
//   mergeMap((url) => api.getImage(url), 1),
//   mergeMap((response) => from(saveStream(response.data, getFilenameFromImageResponse(response)))),
// )

// downloadImages$.subscribe(console.log)

// range(1, 9)
//   .pipe(
//     mergeMap(() => api.getIp()),
//     catchError((err: AxiosError) => {
//       console.log(err.message, err.config.httpsAgent.proxy.port)

//       return EMPTY
//     }),
//     pluck('data'),
//   )
//   .subscribe(console.log)

const stream1$ = of(1, 2, 3, 4)
const stream2$ = of('q', 'w', 'e').pipe(repeat())

function rangeDelay(minMs: number, maxMs: number): number {
  return minMs + Math.round(Math.random() * (maxMs - minMs))
}

zip(stream1$, stream2$)
  .pipe(
    mergeMap(
      (data) =>
        of(data).pipe(
          tap(() => console.log(rangeDelay(1000, 2000))),
          delay(rangeDelay(1_000, 2_000)),
        ),
      1,
    ),
  )
  .subscribe(console.log)
