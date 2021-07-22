import {
  DoubleSide,
  InstancedMesh,
  Object3D,
  Uniform
} from './three/build/three.module.js'

import loadNatureGeometry from './load-nature-geometry.js'
import loadNatureMaterial from './load-nature-material.js'
import loadNatureTexture from './load-nature-texture.js'
import loadNatureWind from './load-nature-wind.js'

import { MaterialType } from './parse-pba.js'

import Viewer from './viewer.js'

export default function() {
  const { mission } = Viewer

  const pbaMap = mission.pba

  const instanceMap = new Map()
  pbaMap.forEach((pba, name) => instanceMap.set(name, []))
  mission.mob.forEach(obj => instanceMap.get(obj.name.toLowerCase()).push(obj))

  const ptxMap = new Map()
  mission.ptx.forEach((value, key) => ptxMap.set(key, loadNatureTexture(value)))

  const meshDummy = new Object3D()
  const instanceDummy = new Object3D()

  const modelNames = [...pbaMap.keys()]
  modelNames.sort()

  for (const modelName of modelNames) {
    const model = pbaMap.get(modelName)

    const pbaMesh = model.meshes[0]
    const pbaGeom = pbaMesh.geometry
    const transform = model.transforms.find(t => t.name == pbaMesh.name)
    const textures = model.textures.map(t => ptxMap.get(t.toLowerCase()))

    meshDummy.matrix.identity()

    if (transform) {
      const [x, y, z] = transform.translation
      const [rw, rx, ry, rz] = transform.rotation
      meshDummy.position.set(x, y, z)
      meshDummy.quaternion.set(rx, ry, rz, rw)
      meshDummy.updateMatrix()
    }

    const instanceObject = instanceMap.get(modelName)
    const instanceCount = instanceObject.length
    const instanceWind = loadNatureWind(instanceObject)

    const instances = [...instanceObject]
    instances.sort((a, b) => b.position[2] - a.position[2])

    for (const [index, surface] of pbaGeom.surfaces.entries()) {
      const texture = textures[surface.textureID] || textures[0]

      const material = loadNatureMaterial()
      material.uniforms.uTime = Viewer.timeUniform
      material.uniforms.uTexture = new Uniform(texture)
      material.side = DoubleSide

      const geometry = loadNatureGeometry(pbaGeom.vertices[index], surface.indices)
      geometry.setAttribute('aWind', instanceWind)

      const mesh = new InstancedMesh(geometry, material, instanceCount)
      mesh.name = pbaMesh.name
      mesh.matrixAutoUpdate = false

      for (const [i, obj] of instances.entries()) {
        instanceDummy.position.set(...obj.position)
        instanceDummy.rotation.y = obj.orientation
        instanceDummy.updateMatrix()
        instanceDummy.matrix.multiply(meshDummy.matrix)
        mesh.setMatrixAt(i, instanceDummy.matrix)
      }

      Viewer.nature.add(mesh)

      switch (surface.materialFlags) {
        case MaterialType.ALPHATEST:
        material.alphaTest = .5
        break
        case MaterialType.ALPHA:
        material.transparent = true
        material.alphaTest = .5
        const edgeMesh = mesh.clone()
        edgeMesh.material = material.clone()
        edgeMesh.material.uniforms = material.uniforms
        edgeMesh.material.alphaTest = .1
        edgeMesh.renderOrder = 1
        Viewer.nature.add(edgeMesh)
        Viewer.resources.add(edgeMesh.material)
        break
        case MaterialType.SHADOW:
        material.transparent = true
        material.depthWrite = false
        break
      }

      Viewer.resources.add(texture)
      Viewer.resources.add(material)
      Viewer.resources.add(geometry)
    }
  }
}
