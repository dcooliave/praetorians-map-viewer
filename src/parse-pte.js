export default function(buffer) {
  const data = new DataView(buffer)

  const numTextures = data.getUint32(0, true)
  const numMipMaps = data.getUint32(12, true)
  const images = []

  let pointer = 16

  for (let i = 0; i < numTextures; i++) {
    const image = new Uint8Array(buffer, pointer, (256 ** 2) * 3)

    pointer += image.byteLength

    let resolution = 2

    for (let j = 0; j < numMipMaps; j++) {
      pointer += ((256 / resolution) ** 2) * 3
      resolution *= 2
    }

    images.push(image)
  }

  return images
}
