import { InstancedBufferAttribute } from 'three'

export default function(mob) {
  const data = []

  for (const obj of mob) {
    data.push(Math.random() * 360, obj.wind)
  }

  return new InstancedBufferAttribute(new Float32Array(data), 2)
}
