import {
  DataTexture,
  LinearFilter,
  LinearMipMapLinearFilter,
  RepeatWrapping,
  RGBAFormat,
  RGBFormat
} from './three.module.js'

export default function(ptx) {
  const texture = new DataTexture(ptx.image, ptx.width, ptx.height)

  texture.magFilter = LinearFilter
  texture.minFilter = LinearMipMapLinearFilter
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping
  texture.format = (ptx.bitsPerPixel == 32) ? RGBAFormat : RGBFormat
  texture.generateMipmaps = true

  return texture
}
