import {
  DataTexture,
  LessDepth,
  InstancedMesh,
  Object3D,
  Uniform
} from 'three'

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

  const defaultTexture = new DataTexture(new Uint8Array([255, 255, 255, 255]))
  defaultTexture.needsUpdate = true

  for (const modelName of pbaMap.keys()) {
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
    const instanceMatrices = []

    for (const obj of instanceObject) {
      instanceDummy.position.set(...obj.position)
      instanceDummy.rotation.y = obj.orientation
      instanceDummy.updateMatrix()
      instanceDummy.matrix.multiply(meshDummy.matrix)
      instanceMatrices.push(instanceDummy.matrix.clone())
    }

    for (const [index, surface] of pbaGeom.surfaces.entries()) {
      const texture = textures[surface.textureID] || defaultTexture

      const material = loadNatureMaterial()
      material.uniforms.uTime = Viewer.timeUniform
      material.uniforms.uTexture = new Uniform(texture)
      material.uniforms.uAlphaTest = new Uniform(0)

      const geometry = loadNatureGeometry(pbaGeom.vertices[index], surface.indices)
      geometry.setAttribute('aWind', instanceWind)

      const mesh = new InstancedMesh(geometry, material, instanceCount)
      mesh.name = pbaMesh.name
      mesh.matrixAutoUpdate = false
      mesh.matrix.makeScale(1, 1, -1)

      instanceMatrices.forEach((matrix, i) => mesh.setMatrixAt(i, matrix))

      Viewer.nature.add(mesh)

      switch (surface.materialFlags) {
        case MaterialType.ALPHATEST:
        material.transparent = true
        material.uniforms.uAlphaTest.value = 0.5
        break
        case MaterialType.ALPHA:
        material.transparent = true
        material.uniforms.uAlphaTest.value = 0.75
        const edgeMesh = mesh.clone()
        edgeMesh.material = material.clone()
        edgeMesh.material.uniforms.uTime = Viewer.timeUniform
        edgeMesh.material.uniforms.uTexture = new Uniform(texture)
        edgeMesh.material.uniforms.uAlphaTest = new Uniform(0.1)
        edgeMesh.material.depthFunc = LessDepth
        edgeMesh.material.depthWrite = false
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
