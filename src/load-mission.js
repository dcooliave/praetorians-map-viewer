import parseH2O from './parse-h2o.js'
import parseMLG, { Masks } from './parse-mlg.js'
import parseMOB from './parse-mob.js'
import parseMSS from './parse-mss.js'
import parsePBA from './parse-pba.js'
import parsePTE from './parse-pte.js'
import parsePVE from './parse-pve.js'
import parsePTX from './parse-ptx.js'

import { files } from './registry.js'

function getFileName(str) {
  return str.includes('/') ? str.slice(str.lastIndexOf('/') + 1, -4) : str.slice(-4)
}

function findFile(path) {
  return new Promise((resolve, reject) => {
    const s = path.toLowerCase()
    const map = files[s.slice(s.lastIndexOf('.') + 1)]
    const key = [...map.keys()].find(k => k.endsWith(s))
    map.get(key).file(resolve, reject)
  })
}

function readObjects(mob) {
  const map = new Map()
  const names = new Set(mob.map(obj => obj.name.toLowerCase()))
  names.forEach(name => map.set(name, findFile(`objmapa/${name}.pba`).then(f => f.arrayBuffer()).then(parsePBA)))
  return map
}

function readTextures(objects) {
  const map = new Map()
  const objs = [...objects.values()]
  const names = new Set(objs.flatMap(o => o.textures.map(t => t.toLowerCase())))
  names.forEach(name => map.set(name, findFile(`objmapa/texturas/${name}.ptx`).then(f => f.arrayBuffer()).then(parsePTX)))
  return map
}

async function parseObjects(objects) {
  const map = new Map()
  for (const [key, value] of objects) {
    map.set(key, await value)
  }
  return map
}

export default async function(name) {
  const mis = findFile(name).then(f => f.text()).then(parseMSS)
  const pve = mis.then(({ VISUAL }) => findFile(VISUAL)).then(f => f.arrayBuffer()).then(parsePVE)
  const pte = mis.then(({ VISUAL }) => findFile(getFileName(VISUAL) + '.pte')).then(f => f.arrayBuffer()).then(parsePTE)
  const mlg = mis.then(({ LOGICO }) => findFile(LOGICO)).then(f => f.arrayBuffer()).then(parseMLG)
  const h2o = mis.then(({ AGUA }) => AGUA && findFile(AGUA).then(f => f.arrayBuffer()).then(parseH2O))
  const mob = mis.then(({ OBJETOS }) => findFile(OBJETOS)).then(f => f.arrayBuffer()).then(parseMOB)
  const pba = mob.then(readObjects).then(parseObjects)
  const ptx = pba.then(readTextures).then(parseObjects)

  return {
    mob: await mob,
    pve: await pve,
    pte: await pte,
    mlg: await mlg,
    h2o: await h2o,
    pba: await pba,
    ptx: await ptx,
  }
}
