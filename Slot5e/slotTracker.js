import { addStatus, removeStatus, StatusType, elements, iconHeader, menuWithHeader } from '../SloUtils'

import { CharResources } from './charResources'
const { div, span, ul, li } = elements

export const SLOT_RESOURCE_NAME = 'Slots'

const ENCUMBERED_MSG = (name) =>
  menuWithHeader(
    iconHeader(
      `${name} is Encumbered`,
      'https://s3.amazonaws.com/files.d20.io/images/2921607/-PQhRv3fWeAk7PLSUwYRQw/icon.png?1602013495'
    ),
    ul(
      li(`Your speed is halved`),
      li(
        `You have disadvantage on ability checks, attack rolls, and saving throws that use Strength, Dexterity, or Constitution`
      )
    ),
    `#c27913`
  )

const OVERLOADED_MSG = (name) =>
  menuWithHeader(
    iconHeader(
      `${name} is Overloaded`,
      'https://s3.amazonaws.com/files.d20.io/images/2921607/-PQhRv3fWeAk7PLSUwYRQw/icon.png?1602013495'
    ),
    `You are carrying too much! You cannot do anything until you drop some items.`,
    `#c22513`
  )

const UNENCUMBERED_MSG = (name) =>
  menuWithHeader(
    iconHeader(
      `${name} is no longer Encumbered`,
      'https://s3.amazonaws.com/files.d20.io/images/2921607/-PQhRv3fWeAk7PLSUwYRQw/icon.png?1602013495'
    ),
    ``,
    `#13c24d`
  )

const parseItem = (item) => {
  const name = item.itemname

  // item.itemproperties - The "Prop" field - ""
  // item.itemcontent
  // item.itemmodifiers = The "Mod" field - ""
  // item.hasattack - If the item has a corresponding attack - 0 | 1
  // item.useasresource - If the item has a corresponding resource - 0 | 1
  // item.itemattackid - The item's corresponding attack ID - ""
  // item.inventorysubflag - Whether the submenu is opened or closed - "0" | "1"
  // item.equipped - If the item is equipped or not - "0" | "1"
  // item.itemresourceid - The item's corresponding resource ID - ""

  let bulk = !!item.itemweight ? parseFloat(item.itemweight) : 0
  if (isNaN(bulk)) bulk = 0

  let count = !!item.itemcount ? parseInt(item.itemcount) : 1
  if (isNaN(count)) count = 0

  return { name, bulk, count }
}

export class SlotTracker {
  constructor(char) {
    this.char = char
    this.charName = getObj('character', char.id)?.get('name')

    this.resources = new CharResources(char.id)
    this.slotRes = this.resources.getOrCreateByName(SLOT_RESOURCE_NAME)
    if (this.slotRes.curr === '') this.slotRes.curr = '0'
    if (this.slotRes.max === '') this.slotRes.max = '0'
  }

  get isContainer() {
    return this.char.size === 'Container'
  }

  update() {
    let max = this.maxSlots()
    let bulk = this.totalItemBulk() + this.totalCoinBulk()
    this.slotRes.curr = bulk
    this.slotRes.max = max

    let name = SLOT_RESOURCE_NAME
    if (bulk > Math.floor(max * 1.5)) {
      name += ' (OVERLOADED)'
      this.setOverloaded()
    } else if (bulk > max) {
      name += ' (ENCUMBERED)'
      this.setEncumbered()
    } else {
      this.setUnencumbered()
    }
    this.slotRes.name = name
  }

  setOverloaded() {
    let token = this.char.findToken()
    if (!token) return

    let changed = addStatus(token, 'Encumbered', StatusType.CUSTOM)
    changed = changed || token.get('tint_color') !== '#BB3333'
    token.set('tint_color', '#BB3333')

    if (changed) {
      sendChat('Slot5e', OVERLOADED_MSG(this.charName), null, { noarchive: true })
    }
  }

  setEncumbered() {
    let token = this.char.findToken()
    if (!token) return
    CombatMaster.addConditionToToken(token, 'encumbered')
    // TODO: Make Encumbered marker configurable
    let changed = addStatus(token, 'Encumbered', StatusType.CUSTOM)
    changed = changed || token.get('tint_color') !== 'transparent'
    token.set('tint_color', 'transparent')

    if (changed) {
      let msg = ENCUMBERED_MSG(this.charName)
      log(msg)
      sendChat('Slot5e', msg, null, { noarchive: true })
    }
  }

  setUnencumbered() {
    let token = this.char.findToken()
    if (!token) return
    let changed = removeStatus(token, 'Encumbered', StatusType.CUSTOM)
    token.set('tint_color', 'transparent')

    if (changed) {
      sendChat('Slot5e', UNENCUMBERED_MSG(this.charName), null, { noarchive: true })
    }
  }

  maxSlots() {
    if (this.isContainer) {
      return parseInt(this.char.class_resource)
    }

    let size = (this.char.size || 'Medium').toLowerCase()
    let strMod = parseInt(this.char.strength_mod)
    let conMod = parseInt(this.char.constitution_mod)
    let mod = Math.max(strMod, conMod)

    if (isNaN(mod)) throw new Error(`Invalid str/con modifier for character ${this.char.id}`)

    switch (size) {
      case 'tiny':
        return 6 + mod
      case 'small':
        return 14 + mod
      case 'medium':
        return 18 + mod
      case 'large':
        return 22 + mod * 2
      case 'huge':
        return 30 + mod * 4
      case 'gargantuan':
        return 46 + mod * 8
    }

    return 18 + mod
  }

  totalItemBulk() {
    let total = 0
    for (const item of this.char.repeating.inventory) {
      if (item.equipped === '0') continue

      const { name, bulk, count } = parseItem(item)
      total += bulk * count
    }
    return total
  }

  totalCoinBulk() {
    let coins = [this.char.cp, this.char.sp, this.char.ep, this.char.gp, this.char.pp]

    let numCoins = coins.reduce((sum, coin) => {
      let val = parseInt(coin)
      return isNaN(val) ? sum : sum + val
    }, 0)

    if (!this.isContainer) {
      // Take into account the 100 "free" coins
      numCoins = Math.max(0, numCoins - 100)
    }
    let bulk = Math.ceil(numCoins / 100)
    return bulk
  }

  toString() {
    return `Inventory Slots: ${this.slotRes.curr} / ${this.slotRes.max}`
  }
}
