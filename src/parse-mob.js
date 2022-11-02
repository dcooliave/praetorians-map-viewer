import createCursor from './create-cursor.js'

export default function(buffer) {
  const cursor = createCursor(buffer)
  const signature = cursor.readChars(4)
  const numObjects = cursor.readUint()

  const map = new Map()

  for (let i = 0; i < numObjects; i++) {
    const object = {}

    object.flags = cursor.readUint()
    object.name = cursor.readString(64)
    object.position = Float32Array.from({ length: 3 }, cursor.readFloat, cursor)
    object.orientation = cursor.readFloat()
    object.wind = cursor.readFloat()

    if (map.has(object.name)) map.get(object.name).push(object)
    else map.set(object.name, [object])
  }

  return [...map.values()].flat()
}
