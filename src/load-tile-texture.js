import {
  DataArrayTexture,
  LinearFilter,
  LinearMipMapLinearFilter
} from 'three'

export default function(images) {
  function nextTile() {
    const bytes = new Uint8Array(buffer, pointer, tileWidth ** 2 * 4)
    pointer = bytes.byteOffset + bytes.byteLength

    return bytes
  }

  function *sliceTileRow(row, index) {
    const xoff = index * tileWidth
    const size = tileWidth * 3
    const length = tileWidth * tileGridWidth

    for (let i = 0; i < tileWidth; i++) {
      const offset = (i * length + xoff) * 3
      yield [row.subarray(offset, offset + size), i]
    }
  }

  function *sliceImage(image) {
    const length = 4
    const rowlen = tileWidth ** 2 * 3 * length

    for (let i = 0; i < 4; i++) {
      const rowstart = i * rowlen
      yield image.subarray(rowstart, rowstart + rowlen)
    }
  }

  const numImages = images.length
  const tileGridWidth = 4
  const tileWidth = 64
  const byteLength = (tileWidth ** 2) * (tileGridWidth ** 2) * numImages * 4

  const buffer = new ArrayBuffer(byteLength)
  const data = new Uint8Array(buffer)
  const depth = numImages * 16

  let pointer = 0

  data.fill(255)

  for (let buf of images) {
    const image = new Uint8Array(buf)

    for (let slice of sliceImage(image)) {
      for (let i = 0; i < 4; i++) {
        const tile = nextTile()

        for (let [row, r] of sliceTileRow(slice, i)) {
          const s = r * 64 * 4

          for (let x = 0; x < 64; x++) {
            tile[s + x * 4 + 0] = row[x * 3 + 0]
            tile[s + x * 4 + 1] = row[x * 3 + 1]
            tile[s + x * 4 + 2] = row[x * 3 + 2]
          }
        }
      }
    }
  }

  const texture = new DataArrayTexture(data, 64, 64, depth)

  texture.magFilter = LinearFilter
  texture.minFilter = LinearMipMapLinearFilter
  texture.generateMipmaps = true
  texture.needsUpdate = true

  return texture
}
