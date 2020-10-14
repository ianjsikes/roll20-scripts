import { elements } from '../SloUtils'
const { span, div, a, b, ul, li } = elements

export const link = (text, href) => {
  return a(
    {
      href,
      style: {
        backgroundColor: 'transparent',
        color: 'black',
        padding: 0,
        display: 'initial',
        border: 'none',
        textDecoration: 'underline',
      },
    },
    text
  )
}

export const iconButton = (icon, title, link) => {
  return div(
    {
      style: {
        display: 'inline-block',
        marginRight: 3,
        padding: 1,
        verticalAlign: 'middle',
      },
    },
    a(
      {
        href: link,
        title,
        style: {
          margin: 0,
          padding: 0,
          border: 'none',
          backgroundColor: 'transparent',
        },
      },
      span(
        {
          style: { color: 'black', padding: 0, fontSize: 12, fontFamily: `&quot;pictos&quot;` },
        },
        icon
      )
    )
  )
}

export const itemListRow = ({ index, text, actions }) => {
  return div(
    {
      style: {
        backgroundColor: index % 2 === 0 ? 'white' : 'lightgrey',
        width: '100%',
        paddingLeft: 4,
      },
    },
    span(
      {
        style: {
          maxWidth: '85%',
          width: '100%',
          display: 'inline-block',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        },
      },
      text
    ),
    span(actions.map(({ icon, label, action }) => iconButton(icon, label, action)))
  )
}
