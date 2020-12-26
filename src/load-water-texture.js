import {
  DataTexture,
  LinearFilter,
  LinearMipMapLinearFilter,
  RepeatWrapping,
  RGBAFormat
} from './three.module.js'

export default function(image) {
  const texture = new DataTexture(image, 256, 256)

  texture.magFilter = LinearFilter
  texture.minFilter = LinearMipMapLinearFilter
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping
  texture.format = RGBAFormat
  texture.generateMipmaps = true

  return texture
}
