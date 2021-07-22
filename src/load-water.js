import { Mesh, Uniform } from './three/build/three.module.js'

import loadWaterGeometry from './load-water-geometry.js'
import loadWaterMaterial from './load-water-material.js'
import loadWaterTexture from './load-water-texture.js'

import Viewer from './viewer.js'

export default function() {
  const { mission } = Viewer

  if (mission.h2o) {
    const texture = loadWaterTexture(mission.h2o.textures[0].image)

    for (const geom of mission.h2o.geometries) {
      const material = loadWaterMaterial()
      material.transparent = true
      material.depthWrite = false
      material.uniforms.uTime = Viewer.timeUniform
      material.uniforms.uTexture = new Uniform(texture)
      material.uniforms.uDirection = new Uniform(geom.direction.subarray(0, 2))

      const geometry = loadWaterGeometry(geom.vertices, geom.indices)
      const mesh = new Mesh(geometry, material)
      mesh.matrixAutoUpdate = false

      Viewer.resources.add(texture)
      Viewer.resources.add(material)
      Viewer.resources.add(geometry)
      Viewer.water.add(mesh)
    }
  }
}
