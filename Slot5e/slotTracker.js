import { addStatus, removeStatus, StatusType } from '../SloUtils'
import { CharResources } from './charResources'

export const SLOT_RESOURCE_NAME = 'Slots'

const buildStatusMessage = (title, body, color = '#000') => {
  return (
    `<div style="background-color: #fff ; border: 1px solid ${color} ; padding: 5px ; border-radius: 5px ; overflow: hidden">` +
    `<div style="font-size: 14px ; font-weight: bold ; background-color: ${color}; padding: 3px ; border-top-left-radius: 3px ; border-top-right-radius: 3px">` +
    `<span style="color: white">` +
    `<div style="width: 1.7em ; vertical-align: middle ; height: 1.7em ; display: inline-block ; margin: 0 3px 0 0 ; border: 0 ; padding: 0 ; background-image: url(&quot;https://s3.amazonaws.com/files.d20.io/images/2921607/-PQhRv3fWeAk7PLSUwYRQw/icon.png?1602013495&quot;) ; background-repeat: no-repeat ; background-size: auto 1.7em"></div>` +
    `${title}` +
    `</span>` +
    `</div>` +
    `${body}` +
    `</div>`
  )
}

const ENCUMBERED_MSG = (name) =>
  buildStatusMessage(
    `${name} is Encumbered`,
    `<ul>` +
      `<li>Your speed is halved</li>` +
      `<li>You have disadvantage on ability checks, attack rolls, and saving throws that use Strength, Dexterity, or Constitution</li>` +
      `</ul>`,
    `#c27913`
  )
const OVERLOADED_MSG = (name) =>
  buildStatusMessage(
    `${name} is Overloaded`,
    `You are carrying too much! You cannot do anything until you drop some items.`,
    `#c22513`
  )
const UNENCUMBERED_MSG = (name) => buildStatusMessage(`${name} is no longer Encumbered`, ``, `#13c24d`)

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

    const resources = new CharResources(char.id)
    this.slotRes = resources.getOrCreateByName(SLOT_RESOURCE_NAME)
    if (this.slotRes.curr === '') this.slotRes.curr = '0'
    if (this.slotRes.max === '') this.slotRes.max = '0'
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
    // TODO: Make Encumbered marker configurable
    let changed = addStatus(token, 'Encumbered', StatusType.CUSTOM)
    changed = changed || token.get('tint_color') !== 'transparent'
    token.set('tint_color', 'transparent')

    if (changed) {
      sendChat('Slot5e', ENCUMBERED_MSG(this.charName), null, { noarchive: true })
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
    let strMod = parseInt(this.char.strength_mod)
    let conMod = parseInt(this.char.constitution_mod)
    let mod = Math.max(strMod, conMod)

    if (isNaN(mod)) throw new Error(`Invalid str/con modifier for character ${this.char.id}`)

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

    // Take into account the 100 "free" coins
    numCoins = Math.max(0, numCoins - 100)
    let bulk = Math.ceil(numCoins / 100)
    return bulk
  }

  toString() {
    return `Inventory Slots: ${this.slotRes.curr} / ${this.slotRes.max}`
  }
}