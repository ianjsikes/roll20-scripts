import { kebabCase } from './string'

const renderStyle = (style) => {
  if (typeof style === 'string') return style

  let res = ''
  for (const key in style) {
    let val = style[key]
    if (typeof val === 'number') {
      val = `${val}px`
    }

    res += `${kebabCase(key)}:${val};`
  }
  return `"${res}"`
}

export const h = (tag, attrsOrChild, ...children) => {
  try {
    let attrs = {}
    if (!!attrsOrChild) {
      if (typeof attrsOrChild === 'object' && !Array.isArray(attrsOrChild)) {
        attrs = attrsOrChild
      } else {
        children.unshift(attrsOrChild)
      }
    }

    const renderArr = (arr) => {
      let res = ''
      for (const el of arr) {
        if (typeof el === 'string' || typeof el === 'number') {
          res += el
        } else if (Array.isArray(el)) {
          res += renderArr(el)
        }
      }
      return res
    }

    let attrStr = ''
    for (const attrKey in attrs) {
      if (attrKey === 'style') {
        attrStr += `style=${renderStyle(attrs.style)} `
      } else {
        attrStr += `${kebabCase(attrKey)}="${attrs[attrKey]}" `
      }
    }

    const childrenStr = renderArr(children)
    return `<${tag} ${attrStr}>${childrenStr}</${tag}>`
  } catch (error) {
    return `ERROR ${error.message}`
  }
}

const makeEl = (tag) => (...children) => h(tag, ...children)
export const elements = {
  div: makeEl('div'),
  a: makeEl('a'),
  p: makeEl('p'),
  ul: makeEl('ul'),
  ol: makeEl('ol'),
  li: makeEl('li'),
  span: makeEl('span'),
  img: makeEl('img'),
  hr: makeEl('hr'),
  pre: makeEl('pre'),
  br: makeEl('br'),
  b: makeEl('b'),

  table: makeEl('table'),
  tr: makeEl('tr'),
  td: makeEl('td'),
  th: makeEl('th'),

  h1: makeEl('h1'),
  h2: makeEl('h2'),
  h3: makeEl('h3'),
  h4: makeEl('h4'),
  h5: makeEl('h5'),
  h6: makeEl('h6'),
}
