import { api } from './api'

async function getImagesUrls(maxImages: number | undefined = undefined) {
  const response = await api.getImages()
  return response.data.map((data) => data.url).slice(0, maxImages)
}

async function main() {
  console.log(await getImagesUrls())
}

main()
