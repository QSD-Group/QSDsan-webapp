const Excel = require('exceljs')

const ExcelSpecs = require('./excel-specs')

const workbook = new Excel.Workbook()
const fileName = 'Bwaise_sanitation_inputs_baselineA.xlsx'
// const fileName = 'test.xlsx'

// eslint-disable-next-line semi-style
;(async () => {
  try {
    await workbook.xlsx.readFile(fileName)

    const initialInputsSpec = new ExcelSpecs('initialInputs')
    const userInterfaceSpec = new ExcelSpecs('userInterface')
    const decentralizedStorageSpec = new ExcelSpecs('decentralizedStorage')
    const conveyanceSpec = new ExcelSpecs('conveyance')
    const treatmentSpec = new ExcelSpecs('treatment')
    const reuseDisposalSpec = new ExcelSpecs('reuseDisposal')

    const cells = {
      initialInputs: initialInputsSpec.cells,
      userInterface: userInterfaceSpec.cells,
      decentralizedStorage: decentralizedStorageSpec.cells,
      conveyance: conveyanceSpec.cells,
      treatment: treatmentSpec.cells,
      reuseDisposal: reuseDisposalSpec.cells,
    }

    const wsInitialInputs = workbook.getWorksheet('initial_inputs')
    // const row = worksheet.getRow('caloric_intake')
    // const cell = row.getCell(2)

    console.log(cells)

    // initialInputsSpec.allCells((cellName, cellPos) => {
    //   wsInitialInputs.getCell(cellPos).name = cellName
    // })
    //
    // const cell = wsInitialInputs.getCell('C4')
    // console.log(cell.value)
    // console.log(cell.name)
    // console.log(wsInitialInputs.getCell('E40').name)
    // cell.value = 2000
    // workbook.xlsx.writeFile('test.xlsx')
  } catch (err) {
    console.log(err)
  }
})()
