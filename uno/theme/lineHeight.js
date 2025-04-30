import fontSizes from './fontSize.js'

function createLineHeight(scaleFactor) {
  return Object.fromEntries(
    Object.entries(fontSizes).map(([label, px]) => {
      let numeric = parseInt(px, 10)
      let lineHeight = Math.ceil(numeric * scaleFactor)
      return [label, `${lineHeight}px`]
    }),
  )
}

export default {
  heading: createLineHeight(1.33),
  body: createLineHeight(1.55),
}
