import {
  Character,
  getCharactersForPlayer,
  ScriptBase,
  CommandParser,
  listMenu,
  who,
  elements,
  menuWithHeader,
} from '../SloUtils'
import { dropItem, getItemFromInventory, pickupItem, showItemCard } from './inventory'

import { SlotTracker } from './slotTracker'
import { itemListRow, link } from './ui'
const { span, div, a, b, ul, li } = elements

const invAttrRegex = new RegExp('^([csegp]p)|repeating_inventory_([^_]*)_(itemcount|itemweight|equipped)')

class _Slot5e extends ScriptBase({
  name: 'Slot5e',
  version: '0.3.1',
  stateKey: 'SLOT_5E',
  initialState: {
    groundItems: {},
  },
}) {
  log = (msg) => log(`${this.name}: ${msg}`)

  constructor() {
    super()
    this.trackers = {}

    on('ready', () => {
      on('add:attribute', this.onAddAttribute)
      on('change:attribute', this.onChangeAttribute)
      on('destroy:attribute', this.onDestroyAttribute)
      on('add:character', this.onAddCharacter)
      on('destroy:character', this.onDestroyCharacter)

      const chars = findObjs({
        _type: 'character',
        archived: false,
      }).filter((char) => String(getAttrByName(char.id, 'npc')) !== '1')

      for (const char of chars) {
        this.log(`Adding tracker for ${char.get('name')}`)
        this.trackers[char.id] = new SlotTracker(Character.fromId(char.id))
        this.trackers[char.id].update()
      }
    })

    this.parser = new CommandParser('!slot5e')
      .default(() => {
        let names = []
        for (const id in this.trackers) {
          this.trackers[id].update()
          names.push(this.trackers[id].charName)
        }
        sendChat(this.name, `Manually updated slots for ${names.join(', ')}`)
      })
      .command('container', (opts, msg) => {
        const name = opts._.join(' ') || 'Container'
        const containerChar = createObj('character', {
          name,
          inplayerjournals: 'all',
          controlledby: 'all',
        })
        const container = Character.fromId(containerChar.id)
        container.size = 'Container'
        container.npc = '0'
        container.class_resource_name = 'Capacity'
        container.class_resource = opts.slots
        container.mancer_cancel = 'on'
        sendChat(this.name, `Created container "${name}"`)
      })
      .command('listInventory', this.listInventory)
      .command('pickupItem', this.pickupItem)
      .command('dropItem', this.dropItem)
      .command('showInventoryItem', this.showInventoryItem)
  }

  /**
   * CLI Command: Whispers a menu listing the specified container's inventory
   * Usage:
   * ```
   * !slot5e listInventory --charId=123
   * ```
   */
  listInventory = ({ charId }, msg) => {
    let char = charId ? getObj('character', charId) : this._rerunWithChar(msg, `View Inventory`)
    if (!char) return

    let character = Character.fromId(char.id)
    sendChat(
      this.name,
      `/w "${who(msg.who)}" ${listMenu({
        title: char.get('name'),
        data: character.repeating.inventory,
        renderItem: (invItem, index) => {
          const item = getItemFromInventory(invItem.rowId, charId)

          const actions = [
            {
              icon: 'E',
              label: 'View Item',
              action: `!slot5e showInventoryItem --charId=${char.id} --itemId=${item.id}`,
            },
            {
              icon: '}',
              label: 'Drop Item',
              action: this.getDropCommand(item, charId),
            },
          ]

          return itemListRow({
            index,
            text: item.name,
            actions,
          })
        },
      })}`
    )
  }

  /**
   * CLI Command: Moves a ground item into the char's inventory
   * Usage:
   * ```
   * !slot5e pickupItem --charId=123 --itemId=abc --count=all
   * ```
   */
  pickupItem = ({ itemId, count, charId }, msg) => {
    const item = this.state.groundItems[itemId]
    if (!item) {
      throw new Error(`This item has already been picked up!`)
    }

    let char = charId ? getObj('character', charId) : this._rerunWithChar(msg, `Pick up ${item.name}`)
    if (!char) return

    if (count === 'all') count = parseInt(item.count)
    else count = parseInt(count)
    if (isNaN(count) || count < 1) count = 1
    if (count > item.count) count = item.count

    pickupItem(item, count, charId)

    let originalCount = item.count
    if (count === item.count) {
      delete this.state.groundItems[itemId]
      item.count = 0
    } else {
      item.count -= count
    }

    if (originalCount === 1) {
      sendChat(this.name, `${char.get('name')} picked up ${item.name}`)
    } else {
      sendChat(this.name, `${char.get('name')} picked up ${count} x ${item.name}`)
    }
    if (item.count) {
      this.showGroundItem(item)
    }
  }

  /**
   * CLI Command: Moves an inventory item to the ground
   * Usage:
   * ```
   * !slot5e dropItem --charId=123 --itemId=abc --count=all
   * ```
   */
  dropItem = ({ charId, itemId, count }) => {
    const item = getItemFromInventory(itemId, charId)

    if (count === 'all') count = parseInt(item.count)
    else count = parseInt(count)
    if (isNaN(count) || count < 1) count = 1

    const groundItem = dropItem(itemId, count, charId)
    this.state.groundItems[groundItem.id] = groundItem

    const charName = getObj('character', charId).get('name')
    sendChat(this.name, `${charName} dropped:`)
    this.showGroundItem(groundItem)
  }

  /**
   * CLI Command: Moves a ground item into the char's inventory
   * Usage:
   * ```
   * !slot5e pickupItem --charId=123 --itemId=abc --count=all
   * ```
   */
  showInventoryItem = ({ itemId, charId }, msg) => {
    let item = getItemFromInventory(itemId, charId)

    sendChat(
      this.name,
      `/w ${who(msg.who)} ${showItemCard(item, [
        {
          title: 'Drop',
          href: this.getDropCommand(item, charId),
        },
      ])}`
    )
  }

  showGroundItem = (item) => {
    sendChat(
      this.name,
      showItemCard(item, [
        {
          title: 'Pick Up',
          href: this.getPickupCommand(item),
        },
      ])
    )
  }

  ////////////////
  // COMMAND UTILS
  ////////////////

  _rerunWithChar = (msg, title) => {
    let allChars = getCharactersForPlayer(msg.playerid)
    if (allChars.length === 0) {
      throw new Error(`No characters found for ${msg.who}`)
    }

    if (allChars.length > 1) {
      sendChat(
        this.name,
        `/w "${who(msg.who)}" ${menuWithHeader(
          title,
          span(
            b('Pick: '),
            allChars.map((c) => link(c.get('name'), `${msg.content} --charId=${c.id}`))
          )
        )}`
      )
      return null
    }

    return allChars[0]
  }

  getDropCommand = (item, charId) => {
    return `!slot5e dropItem --charId=${charId} --itemId=${item.id} --count=${
      item.count === 1 ? '1' : `?{Drop how many? Enter a number or &quot;all&quot; (max: ${item.count})|all}`
    }`
  }

  getPickupCommand = (item) => {
    return `!slot5e pickupItem --itemId=${item.id} --count=${
      item.count === 1 ? '1' : `?{Pick up how many? Enter a number or &quot;all&quot; (max: ${item.count})|all}`
    }`
  }

  /////////////////
  // EVENT HANDLERS
  /////////////////

  getTrackerForId(id) {
    if (!(id in this.trackers)) {
      this.trackers[id] = new SlotTracker(Character.fromId(id))
    }
    return this.trackers[id]
  }

  onAddAttribute = (attr) => {
    if (attr.get('name').match(invAttrRegex)) {
      this.getTrackerForId(attr.get('_characterid')).update()
    }
  }

  onChangeAttribute = (attr, oldAttr) => {
    if (attr.get('name').match(invAttrRegex)) {
      this.getTrackerForId(attr.get('_characterid')).update()
    }
  }

  onDestroyAttribute = (attr) => {
    if (attr.get('name').match(invAttrRegex)) {
      this.getTrackerForId(attr.get('_characterid')).update()
    }
  }

  onAddCharacter = (char) => {
    this.log(`Adding tracker for ${char.get('name')}`)
    this.trackers[char.id] = new SlotTracker(Character.fromId(char.id))
    this.trackers[char.id].update()
  }

  onDestroyCharacter = (char) => {
    this.log(`Removing tracker for ${char.get('name')}`)
    delete this.pcs[char.id]
  }
}

const Slot5e = new _Slot5e()
