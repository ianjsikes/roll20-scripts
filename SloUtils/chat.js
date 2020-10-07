export const who = (name) => name.replace(/\(GM\)/, '').trim()

export const whisper = (from, to, msg) => sendChat(from, `/w "${this.who(to)}" ${msg}`)

export const sendChatAsync = (from, msg, opts) =>
  new Promise((resolve, reject) => {
    try {
      sendChat(from, msg, (results) => resolve(results), opts)
    } catch (err) {
      reject(err)
    }
  })

export const roll = async (rollFormula) => {
  const [rollResultMsg] = await this.sendChatAsync('', `/r ${rollFormula}`)
  if (rollResultMsg.type !== 'rollresult') {
    throw new Error(`Roll failed: ${rollFormula}`)
  }
  const rollResult = JSON.parse(rollResultMsg.content)
  return rollResult.total
}

export const rollData = async (rollFormula) => {
  const [rollResultMsg] = await this.sendChatAsync('', `/r ${rollFormula}`)
  if (rollResultMsg.type !== 'rollresult') {
    throw new Error(`Roll failed: ${rollFormula}`)
  }
  const rollResult = JSON.parse(rollResultMsg.content)
  return rollResult
}
