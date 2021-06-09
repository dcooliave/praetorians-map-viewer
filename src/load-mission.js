import parseH2O from './parse-h2o.js'
import parseMLG, { Masks } from './parse-mlg.js'
import parseMOB from './parse-mob.js'
import parseMSS from './parse-mss.js'
import parsePBA from './parse-pba.js'
import parsePTE from './parse-pte.js'
import parsePVE from './parse-pve.js'
import parsePTX from './parse-ptx.js'

import * as Registry from './registry.js'

function getFileName(str) {
  return str.includes('/') ? str.slice(str.lastIndexOf('/') + 1, -4) : str.slice(-4)
}

function readObjects(mob) {
  const map = new Map()
  const names = new Set(mob.map(obj => obj.name.toLowerCase()))
  names.forEach(name => map.set(name, Registry.read(`/${name}.pba`).then(parsePBA)))
  return map
}

function readTextures(objects) {
  const map = new Map()
  const objs = [...objects.values()]
  const names = new Set(objs.flatMap(o => o.textures.map(t => t.toLowerCase())))
  names.forEach(name => map.set(name, Registry.read(`/${name}.ptx`).then(parsePTX)))
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
  const mis = Registry.readText(name).then(parseMSS)
  const pve = mis.then(({ VISUAL })  => Registry.read(VISUAL)).then(parsePVE)
  const pte = mis.then(({ VISUAL }) => Registry.read(getFileName(VISUAL) + '.pte')).then(parsePTE)
  const mlg = mis.then(({ LOGICO })  => Registry.read(LOGICO)).then(parseMLG)
  const h2o = mis.then(({ AGUA }) => AGUA && Registry.read(AGUA).then(parseH2O))
  const mob = mis.then(({ OBJETOS })  => Registry.read(OBJETOS)).then(parseMOB)
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
