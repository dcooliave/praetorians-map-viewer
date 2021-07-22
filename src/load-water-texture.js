import loadNatureTexture from './load-nature-texture.js'

export default function(image) {
  return loadNatureTexture({
    image,
    width: 256,
    height: 256,
    bitsPerPixel: 32
  })
}
