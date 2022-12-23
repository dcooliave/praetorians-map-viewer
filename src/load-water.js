import { Mesh, Uniform } from 'three'

import loadWaterGeometry from './load-water-geometry.js'
import loadWaterMaterial from './load-water-material.js'
import loadWaterTexture from './load-water-texture.js'

import Viewer from './viewer.js'

export default function() {
  const { mission } = Viewer

  if (mission.h2o) {
    const textures = mission.h2o.textures.map(t => loadWaterTexture(t.image))

    for (const geom of mission.h2o.geometries) {
      const texture = textures[geom.textureID]

      const material = loadWaterMaterial()
      material.transparent = true
      material.depthWrite = false
      material.uniforms.uTime = Viewer.timeUniform
      material.uniforms.uTexture = new Uniform(texture)
      material.uniforms.uDirection = new Uniform(geom.direction)

      const geometry = loadWaterGeometry(geom.vertices, geom.indices)
      const mesh = new Mesh(geometry, material)
      mesh.matrixAutoUpdate = false
      mesh.matrix.makeScale(1, 1, -1)

      Viewer.resources.add(texture)
      Viewer.resources.add(material)
      Viewer.resources.add(geometry)
      Viewer.water.add(mesh)
    }
  }
}
