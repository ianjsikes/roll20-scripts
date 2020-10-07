/**
 * Creates a cache for easy access of a particular Roll20 object type.
 * ```js
 * const CC = objectCache("character")
 * const myCharId = "123456"
 * // Calls `getObj` the first time
 * const myChar = CC[myCharId]
 * // Does NOT call `getObj` on subsequent accesses
 * CC[myCharId].get("name")
 * ```
 * @param {"graphic" | "attribute" | "character" | "path" | "text" | "page" | "campaign" | "player" | "macro" | "rollabletable" | "tableitem" | "ability" | "handout" | "deck" | "card" | "hand" | "jukeboxtrack" | "custfx"} type
 */
export const objectCache = (type) => {
  const cache = {}
  return new Proxy(cache, {
    get: (obj, objId) => {
      if (objId in obj) return obj[objId]

      let o = getObj(type, objId)
      if (o) obj[objId] = o

      return o
    },
  })
}
