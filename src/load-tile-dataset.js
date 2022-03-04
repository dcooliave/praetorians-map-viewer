import {
  DataArrayTexture,
  NearestFilter,
  UnsignedByteType
} from 'three'

export default function(pve) {
  const sizeX = pve.width * 2 + 1
  const sizeY = pve.length * 2 + 1

  const rgbaArea = sizeX * sizeY
  const rgbaSize = rgbaArea * 4
  const depth = 2

  const layers = new Uint8Array(rgbaSize * depth)
  const temp = new Uint8Array(rgbaSize)

  const colors = new Uint8Array(pve.colors)
  const heights = new Uint8Array(pve.heights)

  layers.set(colors)

  for (let i = 0; i < rgbaArea; i++) {
    temp[i * 4] = heights[i]
  }

  layers.set(temp, colors.byteLength)

  const texture = new DataArrayTexture(layers, sizeX, sizeY, depth)
  texture.magFilter = NearestFilter
  texture.minFilter = NearestFilter
  texture.type = UnsignedByteType
  texture.needsUpdate = true

  return texture
}
