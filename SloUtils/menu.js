import { elements } from './h'
const { div, span, ul, li } = elements

export const iconHeader = (title, url) => {
  return (
    div({
      style: {
        width: '1.7em',
        verticalAlign: 'middle',
        height: '1.7em',
        display: 'inline-block',
        margin: '0 3px 0 0',
        border: 0,
        padding: 0,
        backgroundImage: `url(&quot;${url}&quot;)`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'auto 1.7em',
      },
    }) + title
  )
}

export const menuWithHeader = (title, body, color = '#000') => {
  return div(
    {
      style: {
        backgroundColor: 'white',
        border: `1px solid ${color}`,
        padding: 5,
        borderRadius: 5,
        overflow: 'hidden',
      },
    },
    div(
      {
        style: {
          fontSize: 14,
          fontWeight: 'bold',
          backgroundColor: color,
          padding: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
        },
      },
      span({ style: { color: 'white' } }, title)
    ),
    body
  )
}

export const listMenu = ({ title, color = '#000', data, renderItem }) => {
  return menuWithHeader(
    title,
    ul(
      { style: 'padding:0;margin:0;list-style:none;' },
      ...data.map((item, index) => {
        return li(renderItem(item, index))
      })
    ),
    color
  )
}
