/**
 * Mock API
 */
const menu = [
  {
    name: 'Home',
    href: '/',
    contrast: false,
    external: false,
  },
  {
    name: 'About',
    href: '/about',
    contrast: false,
    external: false,
  },
  {
    name: 'Documentation',
    href: 'https://qsdsan.readthedocs.io/',
    contrast: true,
    external: true,
  },
]

const TIMEOUT = 100

async function getConfig() {
  return new Promise((resolve, reject) => {
    try {
      // NOTE: since we will catch the menu, and use the local storage while updating the menu,
      // there should zero delay in loading the menu
      setTimeout(() => {
        resolve({ menu })
      }, 0)
    } catch (err) {
      reject(err)
    }
  })
}

export {
  // eslint-disable-next-line import/prefer-default-export
  getConfig,
}
