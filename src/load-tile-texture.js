import {
  DataTexture2DArray,
  LinearFilter,
  LinearMipMapLinearFilter,
  RGBFormat
} from './three/build/three.module.js'

export default function(images) {
  function nextTile() {
    const bytes = new Uint8Array(buffer, pointer, tileWidth ** 2 * 3)
    pointer = bytes.byteOffset + bytes.byteLength

    return bytes
  }

  function sliceTileRow(row, index) {
    const tile = nextTile()
    const xoff = index * tileWidth
    const size = tileWidth * 3
    const length = tileWidth * tileGridWidth

    for (let i = 0; i < tileWidth; i++) {
      const offset = (i * length + xoff) * 3
      const rowbuf = row.subarray(offset, offset + size)
      tile.set(rowbuf, i * tileWidth * 3)
    }

    return tile
  }

  function sliceImage(image) {
    const length = 4
    const rowlen = tileWidth ** 2 * 3 * length
    const chunks = []

    for (let i = 0; i < 4; i++) {
      const rowstart = i * rowlen
      const row = image.subarray(rowstart, rowstart + rowlen)
      chunks.push(row)
    }

    return chunks
  }

  const numImages = images.length
  const tileGridWidth = 4
  const tileWidth = 64
  const byteLength = (tileWidth ** 2) * (tileGridWidth ** 2) * numImages * 3

  const buffer = new ArrayBuffer(byteLength)
  const data = new Uint8Array(buffer)
  const depth = numImages * 16

  const slices = []
  let pointer = 0

  for (let i = 0; i < numImages; i++) {
    const image = images[i]
    const slice = sliceImage(image)
    slices.push(...slice)
  }

  for (const slice of slices) {
    for (let i = 0; i < 4; i++) {
      sliceTileRow(slice, i)
    }
  }

  const texture = new DataTexture2DArray(data, 64, 64, depth)

  texture.magFilter = LinearFilter
  texture.minFilter = LinearMipMapLinearFilter
  texture.format = RGBFormat
  texture.generateMipmaps = true

  return texture
}
