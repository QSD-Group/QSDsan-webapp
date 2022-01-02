/**
 * Split underscored words into capitalized words with spacing
 * e.g. distribution_alt ==> Distribution Alt
 * @param {string} input
 * @returns {string}
 */
export const humanize = (input) => {
  const frags = input.split('_')
  for (let i = 0; i < frags.length; i++) frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1)
  return frags.join(' ')
}

/**
 * Transform human-readable world into machine-friendly word
 * e.g. Distribution Alt ==> distribution_alt
 * @param {string} input
 * @param {string} [delimiter='_']
 * @returns {string}
 */
export const computerize = (input, delimiter = '_') => input.toLowerCase().replaceAll(' ', delimiter)

/* eslint-disable no-restricted-globals */
/**
 * Check if string is a valid number (integer or float with '.')
 * @param {string} input
 * @return {boolean}
 */
export const isNumeric = (input) => {
  if (typeof input !== 'string') return false
  return !isNaN(input) // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    && !isNaN(parseFloat(input)) // ...and ensure strings of whitespace fail
}
/* eslint-enable no-restricted-globals */
