import { Character, ScriptBase, hasStatus, StatusType, roll } from '../SloUtils'

// TODO: Move this into SloUtils
const multiCommand = (opts, msg, targetArg, action) => {
  let targets
  if (opts[targetArg]) {
    targets = opts[targetArg].split(',').map((id) => getObj('graphic', id))
  } else {
    targets = msg.selected.map((s) => getObj('graphic', s._id))
  }
  targets = targets.filter((t) => !!t)
  if (!targets.length) throw new Error(`Targets must be specified with a selection or with the --${targetArg} arg!`)

  targets.map((target) => action(target))
}

class _SaltySeas extends ScriptBase({
  name: 'SaltySeas',
  version: '0.0.1',
  stateKey: 'SALTY_SEAS',
  initialState: {},
}) {
  log = (msg) => log(`${this.name}: ${msg}`)

  constructor() {
    super()
    if (!CombatMaster) throw new Error('You must have CombatMaster installed for this script to work!')

    on('ready', () => {})

    this.parser = new CommandParser('!saltyseas')
      .default(() => {
        sendChat(`Salty Seas campaign companion script v${this.version}`)
      })
      .command('addCondition', ({ targetId, condition }, msg) => {
        if (!condition) throw new Error('Invalid args supplied for addCondition. Expected targetId and condition')
        multiCommand({ targetId, condition }, msg, 'targetId', (target) => {
          CombatMaster.addConditionToToken(target, condition)
        })
      })
      .command('hasCondition', ({ targetId, condition, custom }, msg) => {
        if (!condition) throw new Error('Invalid args supplied for hasCondition. Expected targetId and condition')

        const target = targetId ? getObj('graphic', targetId) : getObj('graphic', msg.selected[0]._id)
        const hasCondition = hasStatus(target, condition, custom ? StatusType.CUSTOM : StatusType.DEFAULT)
        sendChat(this.name, hasCondition ? '1' : '0')
      })
      .command('thunderGauntlet', ({ sourceId, targetId }) => {
        const source = getObj('graphic', sourceId)
        const target = getObj('graphic', targetId)
        CombatMaster.addConditionToToken(source, 'distracted')
        setTimeout(() => {
          CombatMaster.addTargetsToCondition([{ _id: targetId }], sourceId, 'distracted')
        }, 600)
      })
      .command(
        'hexbladeAttack',
        ({ title, attackRoll, toHitBonus = '+0', baseDamage, critDamage, selectedId, targetId, sneak }, msg) => {
          const selected = Character.fromToken(selectedId)
          const target = Character.fromToken(targetId)
          const targetToken = getObj('graphic', targetId)
          const isCursed = hasStatus(targetToken, 'HexbladesCurse', StatusType.CUSTOM)
          const isHexed = hasStatus(targetToken, 'Hex', StatusType.CUSTOM)
          const cursedBonus = isCursed ? `+ ${selected.pb} [Curse] ` : ''
          const hexedBonus = isHexed ? `+ 1d6 [Hex] ` : ''
          const critHexedBonus = isHexed ? `+ 2d6 [Hex] ` : ''

          const healAmount = Math.max(parseInt(selected.multiclass1_lvl) + parseInt(selected.charisma_mod), 1)
          const sneakBonus = sneak ? `+ ${Math.ceil(selected.base_level / 2)}d6 [Sneak] ` : ''
          const critSneakBonus = sneak ? `+ ${Math.ceil(selected.base_level / 2) * 2}d6 [Sneak] ` : ''

          sendChat(
            msg.who,
            `!power {{ 
  --name|${title}
  --Attack Roll|You roll [[ [$atk] ${attackRoll}${toHitBonus} + ${selected.dexterity_mod} [DEX] + ${
              selected.pb
            } [Prof] ]]
  --?? ${isCursed ? '1' : '0'} == 1 ?? Curse|The target is cursed!
  --?? ${isHexed ? '1' : '0'} == 1 ?? Hex|The target is hexed!
  --?? $atk.base == 20 ?? skipto*1|Critical
  --?? $atk.base == 19 AND ${isCursed ? '1' : '0'} == 1 ?? skipto*2|Critical
  --?? $atk.base == 1 ?? skipto*3|Fumble
  --?? $atk.total >= ${target.npc_ac} ?? skipto*4|Hit
  
  --:Miss| Since we didn't skip to anywhere else, assume a miss
  --Miss|Your attack missed.
  --skipto*5|EndOfCard

  --:Fumble|
  --Natural 1|You miss horribly!
  --skipto*6|EndOfCard

  --:Hit|
  --Hit!|Your ${sneak ? 'sneak ' : ''}attack hit for [[ [$Dmg] ${baseDamage} + ${
              selected.dexterity_mod
            }${cursedBonus}${hexedBonus}${sneakBonus} ]] damage!
  --skipto*7|EndOfCard

  --:Critical|
  --Critical Hit|You strike a decisive blow for [[ [$CritDmg] ${critDamage} + ${
              selected.dexterity_mod
            }${cursedBonus}${critHexedBonus}${critSneakBonus} ]] damage!

  --:EndOfCard|
}}`
          )
          if (isCursed) sendChat(this.name, `If the target dies, heal for ${healAmount}`)
        }
      )
      .command('test', ({}, msg) => {
        sendChat(
          this.name,
          `!power {{
          --name|Hexblade's Curse
          --leftsub|Debuff
          --rightsub|Range 30 ft.
          --?? 1 == 1 ?? api_saltyseas|addCondition _targetId=@{target|token_id} _condition=hexbladecurse
          }}`
        )
      })
  }
}

const SaltySeas = new _SaltySeas()
