export const StatusType = { DEFAULT: 'DEFAULT', CUSTOM: 'CUSTOM' }

export const removeStatus = (token, status, statusType = StatusType.DEFAULT) => {
  let tag = status
  if (statusType === StatusType.CUSTOM) {
    // TODO: Remove hard dependency on libTokenMarkers
    tag = libTokenMarkers.getStatus(status).getTag()
  }

  let statuses = token.get('statusmarkers').split(',')
  let oldStatusLength = statuses.length
  statuses = statuses.filter((s) => s !== tag)
  token.set('statusmarkers', statuses.join())
  return statuses.length < oldStatusLength
}

export const addStatus = (token, status, statusType = StatusType.DEFAULT) => {
  let tag = status
  if (statusType === StatusType.CUSTOM) {
    tag = libTokenMarkers.getStatus(status).getTag()
  }

  let statuses = token.get('statusmarkers').split(',')
  if (statuses.indexOf(tag) !== -1) return false
  statuses.push(tag)
  token.set('statusmarkers', statuses.join())
  return true
}
