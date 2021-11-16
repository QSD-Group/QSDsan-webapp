/**
 * Mock API
 */
const products = []

const TIMEOUT = 100

export default {
  getProducts: (cb, timeout) => setTimeout(() => cb(products), timeout || TIMEOUT),
  buyProducts: (payload, cb, timeout) => setTimeout(() => cb(), timeout || TIMEOUT),
}
