export default function(buffer) {
  const data = new DataView(buffer)
  const ptx = {}

  const dataId = data.getUint16(0, true)
  const dataLength = data.getUint32(2, true)

  ptx.width = data.getUint32(6, true)
  ptx.height = data.getUint32(10, true)
  ptx.bitsPerPixel = data.getUint32(14, true)

  const numComponents = ptx.bitsPerPixel / 8
  const length = ptx.width * ptx.height * numComponents
  ptx.image = buffer.slice(18, 18 + length)

  return ptx
}
