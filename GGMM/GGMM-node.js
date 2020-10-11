#! /usr/bin/env node
//@ts-check

/** @returns {string} */
const generateUUID = (function () {
  'use strict'

  var a = 0,
    b = []
  return function () {
    var c = new Date().getTime() + 0,
      d = c === a
    a = c
    for (var e = new Array(8), f = 7; 0 <= f; f--) {
      e[f] = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'.charAt(c % 64)
      c = Math.floor(c / 64)
    }
    c = e.join('')
    if (d) {
      for (f = 11; 0 <= f && 63 === b[f]; f--) {
        b[f] = 0
      }
      b[f]++
    } else {
      for (f = 0; 12 > f; f++) {
        b[f] = Math.floor(64 * Math.random())
      }
    }
    for (f = 0; 12 > f; f++) {
      c += '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'.charAt(b[f])
    }
    return c
  }
})()

const generateRowID = () => {
  'use strict'
  return generateUUID().replace(/_/g, 'Z')
}

const GGMM_VERSION_ID = 1

/**
 * Unofficial Roll20 import script for GiffyGlyph's Monster Maker
 * https://giffyglyph.com/monstermaker/
 *
 * Script by @ianjsikes
 */

const GGMM = {
  /**
   * @param {string} str
   * @returns {string}
   */
  caps: (str) => str.slice(0, 1).toUpperCase() + str.slice(1),
  /**
   * @param {{
   *  rating: string;
   *  custom: {
   *    rating: string | null;
   *    proficiency: number | null;
   *    xp: number | null;
   *  }
   * }} challenge
   * @returns {number}
   */
  challengeToProficiency: (challenge) => {
    if (challenge.rating === 'custom') {
      return challenge.custom.proficiency
    }
    if (challenge.rating.includes('/')) return 2
    let cr = parseInt(challenge.rating)
    if (cr === 0) return 2
    return Math.floor((cr - 1) / 4) + 2
  },
  /**
   * @param {string} expr
   * @returns {number}
   */
  evalMath: (expr) => {
    return Math.floor(Function(`"use strict";return (${expr})`)())
  },
  /**
   * @param {number} num
   * @param {number} die
   * @returns {string}
   */
  getDice: (num, die) => {
    let avg = die / 2 + 0.5

    let numDice = Math.floor(num / avg)
    if (numDice * avg === num) {
      return `${numDice}d${die}`
    }

    return `${numDice}d${die} + ${Math.round(num - numDice * avg)}`
  },
  /**
   * @param {GGMMMonster} monster
   * @param {string} shortcode
   * @returns {string}
   */
  parseShortcode: (monster, shortcode) => {
    let expr = shortcode
    let die = null

    // Check for the random die syntax [hp, d4]
    let matches = shortcode.match(/(.*)\, ?d(\d+)$/)
    if (matches) {
      expr = matches[1]
      die = parseInt(matches[2])
    }

    let [_, code] = expr.match(/[^a-z\-]*([a-z\-]+)[^a-z\-]*/) || []
    if (!code) {
      throw new Error(`Unable to parse ${shortcode}`)
    }

    let getVal = (code) => {
      if (code === 'level') return monster.level
      if (code.startsWith('attack')) return monster.attack
      if (code === 'damage') return monster.damage
      if (code === 'ac') return monster.ac
      if (code === 'hp') return monster.hp
      if (code.startsWith('dc-primary')) return monster.dcs[0]
      if (code.startsWith('dc-secondary')) return monster.dcs[0]
      if (code === 'xp') return monster.xp
      if (code === 'proficiency') return monster.proficiencyBonus
      if (code === 'cr') return monster.challengeRating
      if (code.endsWith('-mod')) {
        let stat = code.slice(0, 3)
        return Math.floor((monster.abilityScores[stat] - 10) / 2)
      }
      if (code.endsWith('-score')) {
        let stat = code.slice(0, 3)
        return monster.abilityScores[stat]
      }
      if (code.endsWith('-save')) {
        let stat = code.slice(0, 3)
        return monster.savingThrows[stat]
      }
    }
    let val = getVal(code)
    if (val === undefined) {
      throw new Error(`Unable to parse ${shortcode}`)
    }

    let computedExpr = GGMM.evalMath(expr.replace(code, val))
    if (computedExpr === undefined || computedExpr === null || isNaN(computedExpr)) {
      throw new Error(`Unable to parse ${shortcode}`)
    }

    let str = `${computedExpr}`
    if (code === 'attack') {
      str = `${computedExpr < 0 ? '-' : '+'}${str}`
    }
    if (code === 'dc-primary' || code === 'dc-secondary') {
      str = `DC ${str}`
    }

    if (die !== null) {
      str = `${str} (${GGMM.getDice(computedExpr, die)})`
    }
    return str
  },
  /**
   * @param {GGMMMonster} monster
   * @param {string} text
   * @returns {string}
   */
  parseText: (monster, text) => {
    if (!text) return ''
    return text.replace(/\[[^\[\]]+\]/g, (substr) => {
      try {
        return GGMM.parseShortcode(monster, substr.slice(1, -1))
      } catch (error) {
        return substr
      }
    })
  },
}

class GGMMMonster {
  /**
   * @param {object} data
   */
  constructor(data) {
    if (data.vid !== GGMM_VERSION_ID) {
      throw new Error(
        `Giffyglyph Monster Maker schema version mismatch. Expected ${GGMM_VERSION_ID}, found ${data.vid}`
      )
    }
    this.data = data
  }

  get quickstart() {
    return this.data.method === 'quickstart'
  }

  /** @returns {string} */
  get name() {
    let d = this.data.description
    return d.name
  }

  /** @returns {string} */
  get size() {
    return this.data.description.size
  }

  get tags() {
    return this.data.tags
  }

  /** @returns {string} */
  get type() {
    return this.data.description.type
  }

  /** @returns {string} */
  get alignment() {
    return this.data.description.alignment
  }

  /** @returns {string} */
  get level() {
    return this.data.description.level
  }

  /** @returns {string} */
  get role() {
    return this.data.description.role
  }

  /** @returns {string} */
  get rank() {
    return this.data.description.rank
  }

  /** @returns {string | null} */
  get image() {
    return this.data.display.image.url
  }

  /** @returns {[number, number]} */
  get dcs() {
    const bonus = GGMM_DATA.ranks[this.rank].spellDCs
    return GGMM_DATA.statsByLevel[this.level].spellDCs.map((dc) => dc + bonus)
  }

  /** @returns {number | null} */
  get attack() {
    if (!this.quickstart) return null
    return (
      GGMM_DATA.statsByLevel[this.level].attack + GGMM_DATA.roles[this.role].attack + GGMM_DATA.ranks[this.rank].attack
    )
  }

  /** @returns {number | null} */
  get damage() {
    if (!this.quickstart) return null
    return Math.round(
      GGMM_DATA.statsByLevel[this.level].damage * GGMM_DATA.roles[this.role].damage * GGMM_DATA.ranks[this.rank].damage
    )
  }

  /** @returns {number} */
  get ac() {
    if (this.quickstart) {
      return (
        GGMM_DATA.statsByLevel[this.level].ac +
        GGMM_DATA.ranks[this.rank].ac +
        GGMM_DATA.roles[this.role].ac +
        (this.data.ac.modifier || 0)
      )
    }

    return this.data.ac.base || 0
  }

  /** @returns {string | null} */
  get acType() {
    return this.data.ac.type
  }

  /** @returns {number} */
  get hp() {
    if (this.quickstart) {
      let hitpoints = GGMM_DATA.statsByLevel[this.level].hp * GGMM_DATA.roles[this.role].hp
      if (this.rank === 'solo') {
        hitpoints *= this.data.description.players || 4
        hitpoints /= this.data.description.phases || 1
      } else {
        hitpoints *= GGMM_DATA.ranks[this.rank].hp
      }
      hitpoints += this.data.hp.modifier
      hitpoints = Math.floor(hitpoints)
      return hitpoints
    }

    return this.data.hp.average || 0
  }

  /** @returns {string | null} */
  get hpFormula() {
    if (this.rank === 'solo') {
      let hp = Math.floor(
        (GGMM_DATA.statsByLevel[this.level].hp * GGMM_DATA.roles[this.role].hp) / (this.data.description.phases || 1)
      )
      return `${hp} per player`
    }
    return this.data.hp.roll
  }

  /** @returns {string} */
  get speed() {
    let s = this.data.speed
    let str = s.normal
    if (s.burrow) str += ', burrow ' + s.burrow
    if (s.climb) str += ', climb ' + s.climb
    if (s.fly) str += ', fly ' + s.fly
    if (s.swim) str += ', swim ' + s.swim
    if (s.other) str += ', ' + s.other
    return str
  }

  /** @returns {{ str: number; dex: number; con: number; int: number; wis: number; cha: number; }} */
  get abilityScores() {
    if (this.quickstart) {
      let scores = GGMM_DATA.statsByLevel[this.level].abilityModifiers.reduce((obj, mod, idx) => {
        let score = mod * 2 + 10
        let abilityName = this.data.abilities.quickstart[idx].ability
        return { ...obj, [abilityName]: score }
      }, {})
      return scores
    }

    return {
      str: this.data.abilities.str,
      dex: this.data.abilities.dex,
      con: this.data.abilities.con,
      int: this.data.abilities.int,
      wis: this.data.abilities.wis,
      cha: this.data.abilities.cha,
    }
  }

  /** @returns {{ str: number; dex: number; con: number; int: number; wis: number; cha: number; }} */
  get savingThrows() {
    let scores = this.abilityScores
    if (this.quickstart) {
      let savesByLevel = GGMM_DATA.statsByLevel[this.level].savingThrows.map(
        (num) => num + GGMM_DATA.roles[this.role].savingThrows + GGMM_DATA.ranks[this.rank].savingThrows
      )
      let saves = {}
      saves[this.data.savingThrows.quickstart[0].ability] = savesByLevel[0]
      saves[this.data.savingThrows.quickstart[1].ability] = savesByLevel[1]
      saves[this.data.savingThrows.quickstart[2].ability] = savesByLevel[1]
      saves[this.data.savingThrows.quickstart[3].ability] = savesByLevel[2]
      saves[this.data.savingThrows.quickstart[4].ability] = savesByLevel[2]
      saves[this.data.savingThrows.quickstart[5].ability] = savesByLevel[2]
      return saves
    }

    return this.data.savingThrows.manual.reduce((obj, { ability }, idx) => {
      let mod = Math.floor((scores[ability] - 10) / 2)
      return { ...obj, [ability]: mod + 2 }
    }, {})
  }

  /** @returns {number} */
  get proficiencyBonus() {
    if (this.quickstart) return GGMM_DATA.statsByLevel[this.level].proficiencyBonus

    return GGMM.challengeToProficiency(this.data.challenge)
  }

  /** @returns {number} */
  get xp() {
    if (this.quickstart) return GGMM_DATA.statsByLevel[this.level].xp
  }

  /** @returns {{ [key: string]: number }} */
  get skills() {
    let scores = this.abilityScores
    if (this.quickstart) {
      let data = {}
      const prof = GGMM_DATA.statsByLevel[this.level].proficiencyBonus
      for (const skill of this.data.skills) {
        let name
        let score
        if (skill.custom.name) {
          name = skill.custom.name
          score = scores[skill.custom.ability]
        } else {
          name = skill.name
          score = scores[GGMM_DATA.skillToStat[name]]
        }

        let mod = Math.floor((score - 10) / 2)
        data[name] = mod + (skill.proficiency === 'expertise' ? 2 * prof : prof)

        if (name === 'stealth') {
          data[name] += GGMM_DATA.ranks[this.rank].stealth
        } else if (name === 'perception') {
          data[name] += GGMM_DATA.ranks[this.rank].perception
        }
      }

      const role = GGMM_DATA.roles[this.role]
      if (data['stealth'] === undefined) {
        data['stealth'] =
          GGMM_DATA.statsByLevel[this.level].initiative + GGMM_DATA.ranks[this.rank].stealth + (role.stealth ? prof : 0)
      }
      if (data['perception'] === undefined) {
        data['perception'] =
          GGMM_DATA.statsByLevel[this.level].initiative +
          GGMM_DATA.ranks[this.rank].perception +
          (role.perception ? prof : 0)
      }

      return data
    }

    let data = {}
    for (const skill of this.data.skills) {
      let name
      let score
      if (skill.custom.name) {
        name = skill.custom.name
        score = scores[skill.custom.ability]
      } else {
        name = skill.name
        score = scores[GGMM_DATA.skillToStat[name]]
      }

      let mod = Math.floor((score - 10) / 2)
      data[name] = mod * (skill.proficiency === 'expertise' ? 2 : 1)
    }
    return data
  }

  /** @returns {number} */
  get initiative() {
    if (this.quickstart) {
      const { initiative, proficiencyBonus } = GGMM_DATA.statsByLevel[this.level]
      return (
        initiative +
        GGMM_DATA.ranks[this.rank].initiative +
        (GGMM_DATA.roles[this.role].initiative ? proficiencyBonus : 0)
      )
    }

    return this.abilityScores.dex
  }

  /** @returns {string} */
  get damageVulnerabilities() {
    return this.data.vulnerabilities.map((v) => (v.type === 'custom' ? v.custom : v.type)).join(', ')
  }

  /** @returns {string} */
  get damageResistances() {
    return this.data.resistances.map((r) => (r.type === 'custom' ? r.custom : r.type)).join(', ')
  }

  /** @returns {string} */
  get damageImmunities() {
    return this.data.immunities.map((i) => (i.type === 'custom' ? i.custom : i.type)).join(', ')
  }

  /** @returns {string} */
  get conditionImmunities() {
    return this.data.conditions.map((c) => (c.type === 'custom' ? c.custom : c.type)).join(', ')
  }

  /** @returns {string} */
  get senses() {
    const skills = this.skills
    let arr = Object.entries(this.data.senses)
      .map(([sense, range]) => {
        if (range === null) return null
        if (sense === 'other') return range
        return `${sense} ${range}`
      })
      .filter((s) => s !== null)

    let perception = skills.perception + 10
    arr.push(`passive Perception ${perception}`)

    return arr.join(', ')
  }

  /** @returns {string} */
  get languages() {
    return this.data.languages.map((l) => (l.name === 'custom' ? l.custom : l.name)).join(', ')
  }

  /** @returns {string} */
  get challengeRating() {
    if (this.quickstart) {
      return GGMM_DATA.mlToCr[this.rank][this.level]
    }
    if (this.data.challenge.rating === 'custom') {
      return this.data.challenge.custom.rating
    }
    return this.data.challenge.rating
  }

  /** @returns {{ name: string; detail: string }[]} */
  get traits() {
    let traits = [...this.data.traits]

    if (this.rank === 'solo') {
      if (this.data.description.phases > 1) {
        traits.unshift({
          name: `Phase Transition (Transformation)`,
          detail: `When reduced to 0 hit points, remove all on-going effects on yourself as you transform and start a new phase transition event.`,
        })
      } else {
        traits.unshift({
          name: `Phase Transition`,
          detail: `At 66% and 33% hit points, you may remove all on-going effects on yourself and start a new phase transition event.`,
        })
      }
    }

    let paragonActions = this.paragonActions
    if (paragonActions !== 0) {
      traits.unshift({
        name: `Paragon Actions`,
        detail: `You may take ${
          paragonActions === 'players' ? 'one Paragon Action per player (minus 1)' : `${paragonActions} Paragon Action`
        } per round to either move or act.`,
      })
    }

    traits.unshift({
      name: `Level ${this.level} ${GGMM.caps(this.rank)} ${GGMM.caps(this.role)}`,
      detail: `Attack: [attack], Damage: [damage]
Attack DCs: Primary [dc-primary], Secondary [dc-secondary]`,
    })

    return traits.map((trait) => {
      return {
        name: trait.name,
        detail: GGMM.parseText(this, trait.detail),
      }
    })
  }

  /** @returns {{ name: string; detail: string }[]} */
  get actions() {
    return this.data.actions.map((action) => {
      return {
        name: action.name,
        detail: GGMM.parseText(this, action.detail),
      }
    })
  }

  /** @returns {number | "players"} */
  get paragonActions() {
    if (!this.quickstart) return 0
    if (this.data.paragonActions.type === 'custom') {
      return this.data.paragonActions.amount
    }

    if (this.rank === 'elite') {
      return 1
    }

    if (this.rank === 'solo') {
      return 'players'
    }

    return 0
  }

  /** @returns {{ name: string; detail: string }[]} */
  get reactions() {
    return this.data.reactions.map((reaction) => {
      return {
        name: reaction.name,
        detail: GGMM.parseText(this, reaction.detail),
      }
    })
  }

  /** @returns {number | null} */
  get legendaryActionsPerRound() {
    return this.data.legendaryActionsPerRound
  }

  /** @returns {{ name: string; detail: string }[]} */
  get legendaryActions() {
    return this.data.legendaryActions.map((action) => {
      return {
        name: action.name,
        detail: GGMM.parseText(this, action.detail),
      }
    })
  }

  /** @returns {number | null} */
  get lairActionsInitiative() {
    return this.data.lairActionsInitiative
  }

  /** @returns {{ name: string; detail: string }[]} */
  get lairActions() {
    return this.data.lairActions.map((action) => {
      return {
        name: action.name,
        detail: GGMM.parseText(this, action.detail),
      }
    })
  }

  /** @returns {string | null} */
  get note() {
    return (this.data.notes[0] || {}).detail
  }
}

const fs = require('fs')
const path = require('path')

const options = {
  pro: false,
}

const main = async () => {
  let filepath = path.resolve(process.cwd(), process.argv[2])
  const file = fs.readFileSync(filepath, 'utf8')
  let data = JSON.parse(file)
  let monsterDataArr = []

  if (!data.blueprint && !data.monster && !data.vault) {
    throw new Error('Invalid JSON structure')
  }

  if (data.blueprint) {
    monsterDataArr = [data.blueprint]
  } else if (data.monster) {
    monsterDataArr = [data.monster.blueprint]
  } else if (data.vault) {
    monsterDataArr = data.vault.map((m) => m.blueprint)
  }

  for (const monsterData of monsterDataArr) {
    createMonster(monsterData, path.dirname(filepath))
  }
}

let createMonster = (monsterData, outputPath) => {
  let char = new GGMMMonster(monsterData)

  let obj = {
    schema_version: 2,
    oldId: generateUUID(),
    name: char.name,
    avatar: ``,
    bio: `${char.note}`,
    gmnotes: ``,
    defaulttoken: ``,
    tags: JSON.stringify([...char.tags, char.rank, char.role, char.level].map((x) => String(x))),
    controlledby: ``,
    inplayerjournals: ``,
    attribs: [],
    abilities: [],
  }

  if (char.quickstart && options.pro) {
    obj.abilities.push({
      name: 'AttackRoll',
      description: '',
      istokenaction: true,
      action: `!ggmm attack --id=@{selected|character_id}`,
      order: -1,
    })
    obj.abilities.push({
      name: 'DamageRoll',
      description: '',
      istokenaction: true,
      action: `!ggmm damage --id=@{selected|character_id}`,
      order: -1,
    })
    obj.abilities.push({
      name: 'SaveAction',
      description: '',
      istokenaction: true,
      action: `!ggmm save --id=@{selected|character_id}`,
      order: -1,
    })
  }

  let set = (name, val, max = '') => {
    if (val === null) return
    if (val === undefined) {
      console.log(`Attempt to set undefined value for ${name} on ${char.name}`)
      return
    }
    obj.attribs.push({
      name,
      current: val,
      max,
      id: generateUUID(),
    })
  }

  set('npc_options-flag', '0')
  set('npc', 1)
  set('l1mancer_status', 'completed')
  set('rtype', '{{always=1}} {{r2=[[1d20')
  set('wtype', '@{whispertoggle}')
  set('dtype', 'full')
  set('init_tiebreaker', '@{dexterity}/100')
  set('global_save_mod_flag', 1)
  set('global_skill_mod_flag', 1)
  set('global_attack_mod_flag', 1)
  set('global_damage_mod_flag', 1)
  set('charname_output', '{{charname=@{character_name}}}')
  set('npc_name_flag', 0)
  set('showleveler', 0)
  set('invalidXP', 0)
  set('reaction_flag', 0)

  if (char.quickstart) {
    set('ggmm_level', char.level)
    set('ggmm_rank', char.rank)
    set('ggmm_role', char.role)
    set('ggmm_attack', char.attack)
    set('ggmm_damage', char.damage)
    set('ggmm_dc_primary', char.dcs[0])
    set('ggmm_dc_secondary', char.dcs[1])
  }

  set('cd_bar1_m', char.hp)
  set('cd_bar1_v', char.hp)
  set('cd_bar2_v', char.ac)

  let size = char.size
  let sizeToTokenSize = {
    tiny: 0.5,
    small: 1,
    medium: 1,
    large: 2,
    huge: 3,
    gargantuan: 4,
  }
  set('token_size', sizeToTokenSize[size] || 1)
  set('npc_name', char.name)

  set('npc_sizebase', char.size)
  set('npc_typebase', char.type)
  set('npc_alignmentbase', char.alignment)
  set('npc_type', `${char.size} ${char.type}, ${char.alignment}`)

  set('npc_ac', char.ac)
  if (char.acType) set('npc_actype', char.acType)

  let hp = char.hp
  let hpFormula = char.hpFormula
  set('hp', '', hp)
  set('npc_hpbase', `${hp}${hpFormula ? ` (${hpFormula})` : ''}`)
  set('npcd_hp', hp)
  if (hpFormula) {
    set('npc_hpformula', hpFormula)
    set('npcd_hpformula', `(${hpFormula})`)
  }

  set('npc_speed', char.speed)
  set('initiative_bonus', char.initiative)

  let scores = char.abilityScores
  let saves = char.savingThrows
  for (let stat of ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']) {
    let s = stat.slice(0, 3)
    let score = scores[s]
    set(`${stat}_base`, score)
    set(`${stat}`, score)
    set(`${stat}_mod`, Math.floor((score - 10) / 2))

    let save = saves[s]
    if (save !== undefined) {
      set(`npc_${s}_save`, save)
      set(`npcd_${s}_save`, save)
      set(`npc_${s}_save_flag`, 1)
      set(`npc_${s}_save_base`, save)
    }
  }
  set('npc_saving_flag', 1)

  let skills = char.skills
  for (let skill in skills) {
    let val = skills[skill]
    if (!skill) throw new Error('NO SKILLLLLL')
    let _skill = skill.replace(' ', '_')
    set(`${_skill}_bonus`, val)
    set(`npc_${_skill}`, val)
    set(`npc_${_skill}_base`, val)
    set(`npc_${_skill}_flag`, 1)
  }
  set('npc_skills_flag', 1)

  set('npc_vulnerabilities', char.damageVulnerabilities)
  set('npc_resistances', char.damageResistances)
  set('npc_immunities', char.damageImmunities)
  set('npc_condition_immunities', char.conditionImmunities)

  set('npc_senses', char.senses)
  set('npc_languages', char.languages)
  set('npc_challenge', char.challengeRating)
  set('npc_xp', char.xp)

  set('npcspellcastingflag', 0)
  set('npc_spelldc', char.dcs[0])
  set('npc_spellattackmod', char.attack)
  set('npcreactionsflag', char.reactions.length ? 1 : 0)
  set('npc_legendary_actions', char.legendaryActionsPerRound)

  for (const trait of char.traits) {
    let id = generateRowID()
    set(`repeating_npctrait_${id}_name`, trait.name)
    set(`repeating_npctrait_${id}_desc`, trait.detail)
  }

  for (const action of char.actions) {
    let id = generateRowID()
    set(`repeating_npcaction_${id}_name`, action.name)
    set(`repeating_npcaction_${id}_description`, action.detail)
  }

  for (const reaction of char.reactions) {
    let id = generateRowID()
    set(`repeating_npcreaction_${id}_name`, reaction.name)
    // TODO: Why don't reaction descriptions show?
    set(`repeating_npcreaction_${id}_description`, reaction.detail)
  }

  for (const action of char.legendaryActions) {
    let id = generateRowID()
    set(`repeating_npcaction-l_${id}_name`, action.name)
    set(`repeating_npcaction-l_${id}_description`, action.detail)
  }

  obj.defaulttoken = JSON.stringify({
    width: (sizeToTokenSize[size] || 1) * 70,
    height: (sizeToTokenSize[size] || 1) * 70,
    bar1_value: char.hp,
    bar1_max: char.hp,
    bar2_value: char.ac,
    represents: obj.oldId,
    name: char.name,
    imgsrc: '/images/character.png',
  })

  let newPath = path.join(outputPath, `GGMM_${char.name}.json`)
  fs.writeFileSync(newPath, JSON.stringify(obj, null, 2), 'utf8')
}

const GGMM_DATA = {
  skillToStat: {
    acrobatics: 'dex',
    'animal handling': 'wis',
    arcana: 'int',
    athletics: 'str',
    deception: 'cha',
    history: 'int',
    insight: 'wis',
    intimidation: 'cha',
    investigation: 'int',
    medicine: 'wis',
    nature: 'int',
    perception: 'wis',
    performance: 'cha',
    persuasion: 'cha',
    religion: 'int',
    'sleight of hand': 'dex',
    stealth: 'dex',
    survival: 'wis',
  },
  ranks: {
    minion: {
      ac: -1,
      attack: -2,
      hp: 0.2,
      damage: 0.75,
      savingThrows: -2,
      spellDCs: -2,
      initiative: -2,
      perception: -2,
      xp: 0.25,
      stealth: -2,
    },
    standard: {
      ac: 0,
      attack: 0,
      hp: 1,
      damage: 1,
      savingThrows: 0,
      spellDCs: 0,
      initiative: 0,
      perception: 0,
      xp: 1,
      stealth: 0,
    },
    elite: {
      ac: 2,
      attack: 2,
      hp: 2,
      damage: 1.1,
      savingThrows: 2,
      spellDCs: 2,
      initiative: 2,
      perception: 2,
      xp: 2,
      stealth: 2,
    },
    solo: {
      ac: 2,
      attack: 2,
      hp: 'players',
      damage: 1.2,
      savingThrows: 2,
      spellDCs: 2,
      initiative: 4,
      perception: 4,
      xp: 'players',
      stealth: 2,
    },
  },
  roles: {
    controller: {
      ac: -2,
      savingThrows: -1,
      hp: 1,
      attack: 0,
      damage: 1,
      speed: 0,
      perception: false,
      stealth: false,
      initiative: true,
    },
    defender: {
      ac: 2,
      savingThrows: 1,
      hp: 1,
      attack: 0,
      damage: 1,
      speed: -10,
      perception: true,
      stealth: false,
      initiative: false,
    },
    lurker: {
      ac: -4,
      savingThrows: -2,
      hp: 0.5,
      attack: 2,
      damage: 1.5,
      speed: 0,
      perception: true,
      stealth: true,
      initiative: false,
    },
    scout: {
      ac: -2,
      savingThrows: -1,
      hp: 1,
      attack: 0,
      damage: 0.75,
      speed: 10,
      perception: true,
      stealth: true,
      initiative: true,
    },
    sniper: {
      ac: 0,
      savingThrows: 0,
      hp: 0.75,
      attack: 0,
      damage: 1.25,
      speed: 0,
      perception: false,
      stealth: true,
      initiative: false,
    },
    striker: {
      ac: -4,
      savingThrows: -2,
      hp: 1.25,
      attack: 2,
      damage: 1.25,
      speed: 0,
      perception: false,
      stealth: false,
      initiative: false,
    },
    supporter: {
      ac: -2,
      savingThrows: -1,
      hp: 0.75,
      attack: 0,
      damage: 0.75,
      speed: 0,
      perception: false,
      stealth: false,
      initiative: true,
    },
  },
  statsByLevel: {
    '−5': {
      ac: 11,
      hp: 1,
      attack: -1,
      damage: 1,
      spellDCs: [8, 5],
      initiative: 0,
      proficiencyBonus: 0,
      savingThrows: [1, 0, -1],
      abilityModifiers: [1, 0, 0, 0, 0, -1],
      xp: 0,
    },
    '−4': {
      ac: 12,
      hp: 1,
      attack: 0,
      damage: 1,
      spellDCs: [9, 6],
      initiative: 1,
      proficiencyBonus: 0,
      savingThrows: [2, 1, -1],
      abilityModifiers: [2, 1, 1, 0, 0, -1],
      xp: 0,
    },
    '−3': {
      ac: 13,
      hp: 4,
      attack: 1,
      damage: 1,
      spellDCs: [10, 7],
      initiative: 1,
      proficiencyBonus: 1,
      savingThrows: [3, 1, 0],
      abilityModifiers: [2, 1, 1, 0, 0, -1],
      xp: 2,
    },
    '−2': {
      ac: 13,
      hp: 8,
      attack: 1,
      damage: 1,
      spellDCs: [10, 7],
      initiative: 1,
      proficiencyBonus: 1,
      savingThrows: [3, 1, 0],
      abilityModifiers: [2, 1, 1, 0, 0, -1],
      xp: 6,
    },
    '−1': {
      ac: 13,
      hp: 12,
      attack: 1,
      damage: 1,
      spellDCs: [10, 7],
      initiative: 1,
      proficiencyBonus: 1,
      savingThrows: [3, 1, 0],
      abilityModifiers: [2, 1, 1, 0, 0, -1],
      xp: 12,
    },
    0: {
      ac: 14,
      hp: 16,
      attack: 2,
      damage: 1,
      spellDCs: [10, 7],
      initiative: 1,
      proficiencyBonus: 1,
      savingThrows: [4, 2, 0],
      abilityModifiers: [3, 2, 1, 1, 0, -1],
      xp: 25,
    },
    1: {
      ac: 14,
      hp: 26,
      attack: 3,
      damage: 2,
      spellDCs: [11, 8],
      initiative: 1,
      proficiencyBonus: 2,
      savingThrows: [5, 3, 0],
      abilityModifiers: [3, 2, 1, 1, 0, -1],
      xp: 50,
    },
    2: {
      ac: 14,
      hp: 30,
      attack: 3,
      damage: 4,
      spellDCs: [11, 8],
      initiative: 1,
      proficiencyBonus: 2,
      savingThrows: [5, 3, 0],
      abilityModifiers: [3, 2, 1, 1, 0, -1],
      xp: 112,
    },
    3: {
      ac: 14,
      hp: 33,
      attack: 3,
      damage: 5,
      spellDCs: [11, 8],
      initiative: 1,
      proficiencyBonus: 2,
      savingThrows: [5, 3, 0],
      abilityModifiers: [3, 2, 1, 1, 0, -1],
      xp: 175,
    },
    4: {
      ac: 15,
      hp: 36,
      attack: 4,
      damage: 8,
      spellDCs: [12, 9],
      initiative: 2,
      proficiencyBonus: 2,
      savingThrows: [6, 3, 1],
      abilityModifiers: [4, 3, 2, 1, 1, 0],
      xp: 275,
    },
    5: {
      ac: 16,
      hp: 60,
      attack: 5,
      damage: 10,
      spellDCs: [13, 10],
      initiative: 2,
      proficiencyBonus: 3,
      savingThrows: [7, 4, 1],
      abilityModifiers: [4, 3, 2, 1, 1, 0],
      xp: 450,
    },
    6: {
      ac: 16,
      hp: 64,
      attack: 5,
      damage: 11,
      spellDCs: [13, 10],
      initiative: 2,
      proficiencyBonus: 3,
      savingThrows: [7, 4, 1],
      abilityModifiers: [4, 3, 2, 1, 1, 0],
      xp: 575,
    },
    7: {
      ac: 16,
      hp: 68,
      attack: 5,
      damage: 13,
      spellDCs: [13, 10],
      initiative: 2,
      proficiencyBonus: 3,
      savingThrows: [7, 4, 1],
      abilityModifiers: [4, 3, 2, 1, 1, 0],
      xp: 725,
    },
    8: {
      ac: 17,
      hp: 72,
      attack: 6,
      damage: 17,
      spellDCs: [14, 11],
      initiative: 3,
      proficiencyBonus: 3,
      savingThrows: [8, 5, 1],
      abilityModifiers: [5, 3, 2, 2, 1, 0],
      xp: 975,
    },
    9: {
      ac: 18,
      hp: 102,
      attack: 7,
      damage: 19,
      spellDCs: [15, 12],
      initiative: 3,
      proficiencyBonus: 4,
      savingThrows: [9, 5, 2],
      abilityModifiers: [5, 3, 2, 2, 1, 0],
      xp: 1250,
    },
    10: {
      ac: 18,
      hp: 107,
      attack: 7,
      damage: 21,
      spellDCs: [15, 12],
      initiative: 3,
      proficiencyBonus: 4,
      savingThrows: [9, 5, 2],
      abilityModifiers: [5, 3, 2, 2, 1, 0],
      xp: 1475,
    },
    11: {
      ac: 18,
      hp: 111,
      attack: 7,
      damage: 23,
      spellDCs: [15, 12],
      initiative: 3,
      proficiencyBonus: 4,
      savingThrows: [9, 5, 2],
      abilityModifiers: [5, 3, 2, 2, 1, 0],
      xp: 1800,
    },
    12: {
      ac: 18,
      hp: 115,
      attack: 8,
      damage: 28,
      spellDCs: [15, 12],
      initiative: 3,
      proficiencyBonus: 4,
      savingThrows: [10, 6, 2],
      abilityModifiers: [6, 4, 3, 2, 1, 0],
      xp: 2100,
    },
    13: {
      ac: 19,
      hp: 152,
      attack: 9,
      damage: 30,
      spellDCs: [16, 13],
      initiative: 3,
      proficiencyBonus: 5,
      savingThrows: [11, 7, 2],
      abilityModifiers: [6, 4, 3, 2, 1, 0],
      xp: 2500,
    },
    14: {
      ac: 19,
      hp: 157,
      attack: 9,
      damage: 32,
      spellDCs: [16, 13],
      initiative: 3,
      proficiencyBonus: 5,
      savingThrows: [11, 7, 2],
      abilityModifiers: [6, 4, 3, 2, 1, 0],
      xp: 2875,
    },
    15: {
      ac: 19,
      hp: 162,
      attack: 9,
      damage: 35,
      spellDCs: [16, 13],
      initiative: 3,
      proficiencyBonus: 5,
      savingThrows: [11, 7, 2],
      abilityModifiers: [6, 4, 3, 2, 1, 0],
      xp: 3250,
    },
    16: {
      ac: 20,
      hp: 167,
      attack: 10,
      damage: 41,
      spellDCs: [17, 14],
      initiative: 4,
      proficiencyBonus: 5,
      savingThrows: [12, 7, 3],
      abilityModifiers: [7, 5, 3, 2, 2, 1],
      xp: 3750,
    },
    17: {
      ac: 21,
      hp: 210,
      attack: 11,
      damage: 43,
      spellDCs: [18, 15],
      initiative: 4,
      proficiencyBonus: 6,
      savingThrows: [13, 8, 3],
      abilityModifiers: [7, 5, 3, 2, 2, 1],
      xp: 4500,
    },
    18: {
      ac: 21,
      hp: 216,
      attack: 11,
      damage: 46,
      spellDCs: [18, 15],
      initiative: 4,
      proficiencyBonus: 6,
      savingThrows: [13, 8, 3],
      abilityModifiers: [7, 5, 3, 2, 2, 1],
      xp: 5000,
    },
    19: {
      ac: 21,
      hp: 221,
      attack: 11,
      damage: 48,
      spellDCs: [18, 15],
      initiative: 4,
      proficiencyBonus: 6,
      savingThrows: [13, 8, 3],
      abilityModifiers: [7, 5, 3, 2, 2, 1],
      xp: 5500,
    },
    20: {
      ac: 22,
      hp: 226,
      attack: 12,
      damage: 51,
      spellDCs: [19, 16],
      initiative: 5,
      proficiencyBonus: 6,
      savingThrows: [14, 9, 3],
      abilityModifiers: [8, 6, 4, 3, 2, 1],
      xp: 6250,
    },
    21: {
      ac: 22,
      hp: 276,
      attack: 13,
      damage: 53,
      spellDCs: [20, 17],
      initiative: 5,
      proficiencyBonus: 7,
      savingThrows: [15, 9, 4],
      abilityModifiers: [8, 6, 4, 3, 2, 1],
      xp: 8250,
    },
    22: {
      ac: 22,
      hp: 282,
      attack: 13,
      damage: 56,
      spellDCs: [20, 17],
      initiative: 5,
      proficiencyBonus: 7,
      savingThrows: [15, 9, 4],
      abilityModifiers: [8, 6, 4, 3, 2, 1],
      xp: 10250,
    },
    23: {
      ac: 22,
      hp: 288,
      attack: 13,
      damage: 58,
      spellDCs: [20, 17],
      initiative: 5,
      proficiencyBonus: 7,
      savingThrows: [15, 9, 4],
      abilityModifiers: [8, 6, 4, 3, 2, 1],
      xp: 12500,
    },
    24: {
      ac: 23,
      hp: 294,
      attack: 14,
      damage: 61,
      spellDCs: [20, 17],
      initiative: 5,
      proficiencyBonus: 7,
      savingThrows: [16, 10, 4],
      abilityModifiers: [9, 6, 4, 3, 2, 1],
      xp: 15500,
    },
    25: {
      ac: 24,
      hp: 350,
      attack: 15,
      damage: 63,
      spellDCs: [21, 18],
      initiative: 5,
      proficiencyBonus: 8,
      savingThrows: [17, 11, 4],
      abilityModifiers: [9, 6, 4, 3, 2, 1],
      xp: 18750,
    },
    26: {
      ac: 24,
      hp: 357,
      attack: 15,
      damage: 66,
      spellDCs: [21, 18],
      initiative: 5,
      proficiencyBonus: 8,
      savingThrows: [17, 11, 4],
      abilityModifiers: [9, 6, 4, 3, 2, 1],
      xp: 22500,
    },
    27: {
      ac: 24,
      hp: 363,
      attack: 15,
      damage: 68,
      spellDCs: [21, 18],
      initiative: 5,
      proficiencyBonus: 8,
      savingThrows: [17, 11, 4],
      abilityModifiers: [9, 6, 4, 3, 2, 1],
      xp: 26250,
    },
    28: {
      ac: 25,
      hp: 369,
      attack: 16,
      damage: 71,
      spellDCs: [22, 19],
      initiative: 6,
      proficiencyBonus: 8,
      savingThrows: [18, 11, 5],
      abilityModifiers: [10, 7, 5, 4, 3, 2],
      xp: 30000,
    },
    29: {
      ac: 26,
      hp: 432,
      attack: 17,
      damage: 73,
      spellDCs: [23, 20],
      initiative: 6,
      proficiencyBonus: 9,
      savingThrows: [19, 12, 5],
      abilityModifiers: [10, 7, 5, 4, 3, 2],
      xp: 33750,
    },
    30: {
      ac: 26,
      hp: 439,
      attack: 17,
      damage: 76,
      spellDCs: [23, 20],
      initiative: 6,
      proficiencyBonus: 9,
      savingThrows: [19, 12, 5],
      abilityModifiers: [10, 7, 5, 4, 3, 2],
      xp: 38750,
    },
    31: {
      ac: 26,
      hp: 446,
      attack: 17,
      damage: 78,
      spellDCs: [23, 20],
      initiative: 6,
      proficiencyBonus: 9,
      savingThrows: [19, 12, 5],
      abilityModifiers: [10, 7, 5, 4, 3, 2],
      xp: 44500,
    },
    32: {
      ac: 26,
      hp: 453,
      attack: 18,
      damage: 81,
      spellDCs: [24, 21],
      initiative: 7,
      proficiencyBonus: 9,
      savingThrows: [20, 13, 5],
      abilityModifiers: [11, 8, 5, 4, 3, 2],
      xp: 51000,
    },
    33: {
      ac: 27,
      hp: 522,
      attack: 19,
      damage: 83,
      spellDCs: [25, 22],
      initiative: 7,
      proficiencyBonus: 10,
      savingThrows: [21, 13, 6],
      abilityModifiers: [11, 8, 5, 4, 3, 2],
      xp: 58750,
    },
    34: {
      ac: 27,
      hp: 530,
      attack: 19,
      damage: 86,
      spellDCs: [25, 22],
      initiative: 7,
      proficiencyBonus: 10,
      savingThrows: [21, 13, 6],
      abilityModifiers: [11, 8, 5, 4, 3, 2],
      xp: 67750,
    },
    35: {
      ac: 27,
      hp: 537,
      attack: 19,
      damage: 88,
      spellDCs: [25, 22],
      initiative: 7,
      proficiencyBonus: 10,
      savingThrows: [21, 13, 6],
      abilityModifiers: [11, 8, 5, 4, 3, 2],
      xp: 77750,
    },
  },
  mlToCr: {
    minion: {
      '-5': '0',
      '-4': '0',
      '-3': '0',
      '-2': '0',
      '-1': '0',
      0: '0',
      1: '1/8',
      2: '1/4',
      3: '1/2',
      4: '1/2',
      5: '1/2',
      6: '1/2',
      7: '1',
      8: '1',
      9: '1',
      10: '1',
      11: '2',
      12: '2',
      13: '2',
      14: '3',
      15: '3',
      16: '3',
      17: '4',
      18: '4',
      19: '4',
      20: '4',
      21: '5',
      22: '6',
      23: '7',
      24: '8',
      25: '9',
      26: '10',
      27: '10',
      28: '11',
      29: '12',
      30: '12',
    },
    standard: {
      '-5': '0',
      '-4': '0',
      '-3': '0',
      '-2': '0',
      '-1': '0',
      0: '1/8',
      1: '1/4',
      2: '1/2',
      3: '1',
      4: '1',
      5: '2',
      6: '2',
      7: '3',
      8: '4',
      9: '4',
      10: '4',
      11: '5',
      12: '5',
      13: '6',
      14: '7',
      15: '7',
      16: '8',
      17: '8',
      18: '9',
      19: '10',
      20: '11',
      21: '12',
      22: '13',
      23: '14',
      24: '15',
      25: '16',
      26: '17',
      27: '18',
      28: '19',
      29: '20',
      30: '21',
    },
    elite: {
      '-5': '0',
      '-4': '0',
      '-3': '0',
      '-2': '0',
      '-1': '1/8',
      0: '1/4',
      1: '1/2',
      2: '1',
      3: '2',
      4: '3',
      5: '3',
      6: '4',
      7: '4',
      8: '5',
      9: '6',
      10: '7',
      11: '7',
      12: '8',
      13: '9',
      14: '10',
      15: '10',
      16: '11',
      17: '12',
      18: '13',
      19: '14',
      20: '15',
      21: '16',
      22: '17',
      23: '18',
      24: '19',
      25: '20',
      26: '21',
      27: '22',
      28: '23',
      29: '24',
      30: '25',
    },
    solo: {
      '-5': '0',
      '-4': '0',
      '-3': '0',
      '-2': '1/8',
      '-1': '1/4',
      0: '1/2',
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      6: '6',
      7: '7',
      8: '8',
      9: '9',
      10: '10',
      11: '11',
      12: '12',
      13: '13',
      14: '14',
      15: '15',
      16: '16',
      17: '17',
      18: '18',
      19: '19',
      20: '20',
      21: '21',
      22: '22',
      23: '23',
      24: '24',
      25: '25',
      26: '26',
      27: '27',
      28: '28',
      29: '29',
      30: '30',
    },
  },
}

main().catch((err) => console.error(err))
