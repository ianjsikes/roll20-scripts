export const ScriptBase = ({ name, version, stateKey = name, initialState = {} }) =>
  class {
    get state() {
      if (!state[stateKey]) {
        state[stateKey] = initialState
      }
      return state[stateKey]
    }

    onMessage = async (msg) => {
      if (!this.parser) return
      try {
        await this.parser.handleMessage(msg)
      } catch (err) {
        log(`${name} ERROR: ${err.message}`)
        sendChat(`${name} ERROR:`, `/w ${msg.who.replace(/\(GM\)/, '').trim()} ${err.message}`)
      }
    }

    constructor() {
      this.version = version
      this.name = name
      on('chat:message', this.onMessage)
      on('ready', () => {
        log(`\n[====== ${name} v${version} ======]`)
      })
    }

    resetState(newState = initialState) {
      state[stateKey] = newState
    }
  }
