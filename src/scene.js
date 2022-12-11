import {
  AxesHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from 'three'

import { MapControls } from 'orbit-controls'

import { TileTypes, TileLogic } from './parse-mlg.js'
import { TileFlags } from './parse-pve.js'
import Viewer from './viewer.js'

let camera
let controller
let renderer
let resizer
let scene

window.ondragover = window.ondrop = async function(event) {
  event.preventDefault()

  if (event.type != 'drop') return
  if (![...event.dataTransfer.types].includes('Files')) return

  if (!scene) init()

  const keys = await Viewer.initialize(event.dataTransfer.items)
  keys.sort()

  const maps = document.getElementById('maps')
  const children = []

  for (const child of maps.children) {
    children.push(child.text)
  }

  for (const key of keys) {
    if (!children.includes(key)) {
      const option = document.createElement('option')
      option.text = key
      maps.appendChild(option)
    }
  }
}

function init() {
  const container = document.getElementById('scene')
  const rectangle = container.getBoundingClientRect()

  scene = new Scene()
  scene.scale.z = -1

  renderer = new WebGLRenderer()
  renderer.setSize(rectangle.width, rectangle.height)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setClearColor(0x000000)
  renderer.setAnimationLoop(animate)

  container.appendChild(renderer.domElement)

  camera = new PerspectiveCamera(45, rectangle.width / rectangle.height, 1, 800)
  camera.position.set(30, 30, 30)

  controller = new MapControls(camera, renderer.domElement)
  controller.enableDamping = true
  controller.dampingFactor = .2
  controller.keyPanSpeed = 24
  controller.minDistance = 3
  controller.maxDistance = 500
  controller.maxPolarAngle = Math.PI / 2

  scene.add(new AxesHelper(5))

  resizer = new ResizeObserver(resize)
  resizer.observe(container)

  createList('logic', TileLogic, TileLogic.NONE)
  createList('type', TileTypes, TileTypes.UNUSED)
  createList('tile', TileFlags, TileFlags.TILE_VISIBLE)

  document.getElementById('nature').onchange = toggleLayer
  document.getElementById('water').onchange = toggleLayer
  document.getElementById('maps').onchange = selectMap
}

function showFlags(event) {
  const { id, value } = event.target
  if (id == 'logic') Viewer.setTerrainLogic(value)
  else if (id == 'type') Viewer.setTerrainType(value)
  else if (id == 'tile') Viewer.setTerrainTile(value)
}

function toggleLayer(event) {
  const { id, checked } = event.target
  if (id == 'nature') Viewer.nature.visible = checked
  else if (id == 'water') Viewer.water.visible = checked
}

function createList(id, flags, value, defaultVal) {
  const elm = document.getElementById(id)
  const frag = new DocumentFragment()

  if (defaultVal) {
    const option = frag.appendChild(document.createElement('option'))
    option.disabled = option.selected = option.hidden = true
    option.text = defaultVal
  }

  for (const [key, value] of Object.entries(flags)) {
    const option = frag.appendChild(document.createElement('option'))
    option.text = key
    option.value = value
  }

  elm.appendChild(frag)
  elm.onchange = showFlags
  elm.value = value

  return elm
}

async function selectMap(event) {
  event.target.disabled = true

  scene.remove(Viewer.tile, Viewer.water, Viewer.nature)

  await Viewer.build(event.target.value)

  Viewer.water.visible = document.getElementById('water').checked
  Viewer.nature.visible = document.getElementById('nature').checked

  Viewer.setTerrainLogic(document.getElementById('logic').value)
  Viewer.setTerrainType(document.getElementById('type').value)
  Viewer.setTerrainTile(document.getElementById('tile').value)

  scene.add(Viewer.tile, Viewer.water, Viewer.nature)

  controller.reset()

  event.target.disabled = false
}

function animate(time) {
  Viewer.update(time)
  controller.update()
  renderer.render(scene, camera)
}

function resize(entries) {
  const [{ devicePixelContentBoxSize: [box] }] = entries
  camera.aspect = box.inlineSize / box.blockSize
  camera.updateProjectionMatrix()
  renderer.setSize(box.inlineSize, box.blockSize)
}
