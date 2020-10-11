export const StatusType = { DEFAULT: 'DEFAULT', CUSTOM: 'CUSTOM' }

const getTag = (status, statusType) =>
  statusType === StatusType.DEFAULT ? status : libTokenMarkers.getStatus(status).getTag()

export const removeStatus = (token, status, statusType = StatusType.DEFAULT) => {
  let tag = getTag(status, statusType)

  let statuses = token.get('statusmarkers').split(',')
  let oldStatusLength = statuses.length
  statuses = statuses.filter((s) => s !== tag)
  token.set('statusmarkers', statuses.join())
  return statuses.length < oldStatusLength
}

export const hasStatus = (token, status, statusType = StatusType.DEFAULT) => {
  let tag = getTag(status, statusType)
  let statuses = token.get('statusmarkers').split(',')
  return statuses.indexOf(tag) !== -1
}

export const addStatus = (token, status, statusType = StatusType.DEFAULT) => {
  let tag = getTag(status, statusType)

  let statuses = token.get('statusmarkers').split(',')
  if (statuses.indexOf(tag) !== -1) return false
  statuses.push(tag)
  token.set('statusmarkers', statuses.join())
  return true
}
