import {
  DataTexture2DArray,
  NearestFilter,
  RGBAFormat,
  UnsignedByteType
} from './three.module.js'

export default function(pve) {
  const sizeX = pve.width * 2 + 1
  const sizeY = pve.length * 2 + 1

  const rgbaArea = sizeX * sizeY
  const rgbaSize = rgbaArea * 4
  const depth = 2

  const buffer = new ArrayBuffer(rgbaSize * depth)
  const layers = new Uint8Array(buffer)

  layers.subarray(0, rgbaSize).set(pve.colors)

  const data = new Uint8Array(rgbaSize)

  for (let i = 0; i < rgbaArea; i++) {
    data[i * 4] = pve.heights[i]
  }

  layers.subarray(rgbaSize, rgbaSize * 2).set(data)

  const texture = new DataTexture2DArray(layers, sizeX, sizeY, depth)

  texture.magFilter = NearestFilter
  texture.minFilter = NearestFilter
  texture.format = RGBAFormat
  texture.type = UnsignedByteType

  return texture
}
