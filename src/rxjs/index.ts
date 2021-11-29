import { from, mergeMap, pluck, take } from 'rxjs'
import { getFilenameFromImageResponse } from '../promise'
import { saveStream } from '../promise/saveStream'
import { api } from '../rxjs/api.rxjs'

const imagesUrls$ = api.getImages().pipe(
  pluck('data'),
  mergeMap((data) => from(data)),
  pluck('url'),
  take(10),
)

imagesUrls$
  .pipe(
    mergeMap((url) => api.getImage(url), 1),
    mergeMap((response) => from(saveStream(response.data, getFilenameFromImageResponse(response)))),
  )
  .subscribe(console.log)
