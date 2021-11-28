const initialInputs = require('./initial-inputs')
const userInterface = require('./user-interface')
const decentralizedStorage = require('./decentralized-storage')
const conveyance = require('./conveyance')
const treatment = require('./treatment')
const reuseDisposal = require('./reuse-disposable')

const allSpecs = {
  initialInputs, userInterface, decentralizedStorage, conveyance, treatment, reuseDisposal,
}

class ExcelSpecs {
  constructor(spec = 'initialInputs') {
    if (!Object.keys(allSpecs).includes(spec)) throw new Error('Given spec is not allowed')
    this.spec = allSpecs[spec]
    this._cells = {}
  }

  get cells() {
    if (!this.areCellsPopulated) this._populateCells()
    return this._cells
  }

  get areCellsPopulated() {
    return Object.keys(this._cells).length > 0
  }

  _populateCells() {
    for (const [rowName, rowPos] of Object.entries(this.spec.rows)) {
      for (const [colName, colPos] of Object.entries(this.spec.columns)) {
        if (this._cells[rowName] === undefined) {
          this._cells[rowName] = {
            // Capitalize first letter of each word -- https://stackoverflow.com/a/4878800
            _display: rowName.split('_').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' '),
          }
        }
        this._cells[rowName][colName] = `${colPos}${rowPos}`
      }
    }
  }

  allCells(cb) {
    if (typeof cb !== 'function') return

    for (const [rowName, rowCells] of Object.entries(this.cells)) {
      for (const [cellName, cellPos] of Object.entries(rowCells)) {
        cb(`${rowName}_${cellName}`, cellPos)
      }
    }
  }
}

module.exports = ExcelSpecs
