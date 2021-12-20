const ExcelParse = require('exceljs')
const fs = require('fs')
const path = require('path')
// const util = require('util')

const ExcelSpecs = require('./excel-specs')

const workbook = new ExcelParse.Workbook()
const DATA_FOLDER = path.join(__dirname, 'excel-data')
const JSON_FOLDER = path.join(__dirname, 'excel-json')
const FILE_NAMES = [ // without extension
  'Bwaise_sanitation_inputs_baselineA',
  'Bwaise_sanitation_inputs_baselineB',
  'Bwaise_sanitation_inputs_baselineC',
  'Bwaise_sanitation_inputs_uncertaintyA',
  'Bwaise_sanitation_inputs_uncertaintyB',
  'Bwaise_sanitation_inputs_uncertaintyC',
]

function parseExcelSheets(_workbook) {
  const initialInputsSpec = new ExcelSpecs('initial_inputs')
  const userInterfaceSpec = new ExcelSpecs('user_interface')
  const decentralizedStorageSpec = new ExcelSpecs('decentralized_storage')
  const conveyanceSpec = new ExcelSpecs('conveyance')
  const treatmentSpec = new ExcelSpecs('treatment')
  const reuseDisposalSpec = new ExcelSpecs('reuse_disposal')

  const sheets = {
    initial_inputs: initialInputsSpec.cells,
    user_interface: userInterfaceSpec.cells,
    decentralized_storage: decentralizedStorageSpec.cells,
    conveyance: conveyanceSpec.cells,
    treatment: treatmentSpec.cells,
    reuse_disposal: reuseDisposalSpec.cells,
  }

  /* eslint-disable no-restricted-syntax, no-continue */
  for (const [topic, parameters] of Object.entries(sheets)) {
    const topicWorksheet = _workbook.getWorksheet(topic)
    for (const [pName, pCells] of Object.entries(parameters)) {
      if (pName === '_columns') continue

      for (const [pCellName, pCellPos] of Object.entries(pCells)) {
        if (pCellName === '_display') continue
        let pCellVal = topicWorksheet.getCell(pCellPos).value

        // any cells with formula (e.g. `=SUM()`) (make sure to ignore null)
        if (pCellVal && typeof pCellVal === 'object') pCellVal = pCellVal.result

        // `-` means no unit
        if (pCellVal === undefined || pCellVal === '-') pCellVal = null

        sheets[topic][pName][pCellName] = { pos: pCellPos, value: pCellVal }
      }
    }
  }
  /* eslint-enable no-restricted-syntax, no-continue */

  // console.log(util.inspect(sheets, false, null, true))
  return sheets
}

// eslint-disable-next-line semi-style
(async () => {
  try {
    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for (const FILE_NAME of FILE_NAMES) {
      await workbook.xlsx.readFile(`${DATA_FOLDER}/${FILE_NAME}.xlsx`)
      const sheets = parseExcelSheets(workbook)
      await fs.promises.writeFile(`${JSON_FOLDER}/${FILE_NAME}.json`, JSON.stringify(sheets, null, 2))
    }
    /* eslint-enable no-restricted-syntax, no-await-in-loop */
  } catch (err) {
    console.log(err)
  }
})()
