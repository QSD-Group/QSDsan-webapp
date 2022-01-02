const classNames = (...classes) => classes.filter(Boolean).join(' ')

/**
 * Splits underscored words into capitalized words with spacing
 * e.g. distribution_alt ==> Distribution Alt
 * @param {string} input
 * @returns {string}
 */
const humanize = (input) => {
  const frags = input.split('_')
  for (let i = 0; i < frags.length; i++) frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1)
  return frags.join(' ')
}

export {
  classNames, humanize,
}
