import createCursor from './create-cursor.js'

export default function(buffer) {
  const cursor = createCursor(buffer)
  const pra = {}

  pra.signature = cursor.readChars(4)
  pra.unknown = cursor.readChars(4)

  const nameLength = cursor.readUint()
  pra.name = cursor.readString(nameLength)

  const numFields = cursor.readUint()
  pra.fields = []

  for (let i = 0; i < numFields; i++) {
    pra.fields.push(readGrassField(cursor))
  }

  return pra

  function readGrassPatch(cursor) {
    const patch = {}

    patch.position = Int32Array.from({ length: 2 }, cursor.readInt, cursor)
    patch.unknown = Int32Array.from({ length: 2 }, cursor.readInt, cursor)
    patch.color = Uint8Array.from({ length: 3 }, cursor.readUchar, cursor)

    return patch
  }

  function readGrassField(cursor) {
    const numPatches = cursor.readUint()
    const field = {}

    field.boundary = Int32Array.from({ length: 4 }, cursor.readInt, cursor)

    const nameLength = cursor.readUchar()
    field.name = cursor.readString(nameLength)

    field.patches = []

    for (let i = 0; i < numPatches; i++) {
      field.patches.push(readGrassPatch(cursor))
    }

    return field
  }
}
