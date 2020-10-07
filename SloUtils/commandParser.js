import { randomId } from './ids'

export class CommandParser {
  constructor(trigger, ...aliases) {
    this.trigger = trigger
    this.aliases = aliases || []
    this.defaultCmd
    this.subCmds = {}
    this.buttonActions = {
      __ungrouped: {},
    }
  }

  default(action) {
    this.defaultCmd = { action }
    return this
  }

  command(name, action) {
    this.subCmds[name] = { action }
    return this
  }

  button({ action, group = '__ungrouped' }) {
    if (!this.buttonActions[group]) {
      this.buttonActions[group] = {}
    }
    let id = randomId()
    this.buttonActions[group][id] = action
    return `${this.trigger} _btn_${id}`
  }

  async handleMessage(msg) {
    if (msg.type !== 'api') return
    let content = msg.content.trim()
    let [trigger, subCommand, ...args] = content.split(' ')

    if (trigger !== this.trigger) {
      if (!this.aliases.length || !this.aliases.includes(trigger)) {
        return
      }
    }

    if (subCommand && subCommand.startsWith('_btn_')) {
      let btnId = subCommand.replace('_btn_', '')
      for (const group in this.buttonActions) {
        if (btnId in this.buttonActions[group]) {
          let action = this.buttonActions[group][btnId]
          if (group !== '__ungrouped') {
            delete this.buttonActions[group]
          } else {
            delete group[btnId]
          }
          await action()
          return
        }
      }
      throw new Error(`Hey, that button is expired!`)
    }

    if (!subCommand || subCommand.startsWith('--') || !(subCommand in this.subCmds)) {
      if (this.defaultCmd) {
        const opts = this.parseArgs([subCommand, ...args])
        await this.defaultCmd.action(opts, msg)
      } else {
        this.showHelp()
      }
    } else {
      if (subCommand in this.subCmds) {
        const opts = this.parseArgs(args)
        await this.subCmds[subCommand].action(opts, msg)
        return
      }
      this.showHelp()
    }
  }

  parseArgs(args) {
    let options = args.reduce(
      (opts, arg) => {
        if (!arg) return opts
        if (arg.startsWith('--')) {
          let [key, val] = arg.slice(2).split('=')
          return { ...opts, [key]: val === undefined ? true : val }
        }
        return {
          ...opts,
          _: [...opts._, arg],
        }
      },
      { _: [] }
    )

    return options
  }

  showHelp() {}
}
