import { Sprout32 } from '@carbon/icons-react'
import {
  DataGrid, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarExport,
} from '@mui/x-data-grid'
import { matchSorter } from 'match-sorter'
import React, { useState, useEffect } from 'react'
import Helmet from 'react-helmet'
import Select from 'react-select'

import uncertaintySysA from '../assets/data/Bwaise_sanitation_inputs_uncertaintyA.json'
import uncertaintySysB from '../assets/data/Bwaise_sanitation_inputs_uncertaintyB.json'
import uncertaintySysC from '../assets/data/Bwaise_sanitation_inputs_uncertaintyC.json'
import GuideRow from '../components/Row/Guide'
import StretchRow from '../components/Row/Stretch'
import { humanize } from '../utils'

const predefinedSystemOptions = [
  { value: 'uncertaintySysA', label: 'System A (uncertainty)' },
  { value: 'uncertaintySysB', label: 'System B (uncertainty)' },
  { value: 'uncertaintySysC', label: 'System C (uncertainty)' },
]

function parseConfigToData(config) {
  if (typeof config !== 'object' || Object.keys(config).length === 0) return []

  const finalData = []
  let id = 0
  /* eslint-disable */
  for (const [category, parameters] of Object.entries(config)) {
    for (const [pName, pCols] of Object.entries(parameters)) {
      if (pName === '_columns') continue

      const rowData = { id, name: pName }
      for (const [colName, colData] of Object.entries(pCols)) {
        if (colName === '_display') continue
        rowData[colName] = colData.value || null
      }
      finalData.push(rowData)
      id += 1
    }
  }
  /* eslint-enable */

  return finalData
}

function CustomTableToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  )
}

export default function Bwaise() {
  const [preSystemType, setPreSystemType] = useState(null)
  const [systemConfig, setSystemConfig] = useState({})
  const [skipPageReset, setSkipPageReset] = useState(false)
  const [pageSize, setPageSize] = useState(10)
  // GridColDef[]
  const [tableColumns, setTableColumns] = useState([])
  // GridRowsProp
  const [data, setData] = useState([])
  const [unchangedData, setUnchangedData] = useState(data)

  useEffect(() => {
    let preConfig = {}

    switch (preSystemType) {
      case 'uncertaintySysA': preConfig = uncertaintySysA; break
      case 'uncertaintySysB': preConfig = uncertaintySysB; break
      case 'uncertaintySysC': preConfig = uncertaintySysC; break
      default: break
    }

    if (typeof preConfig.initial_inputs === 'undefined') return

    setSystemConfig(preConfig)

    const commonColConfig = {
      flex: 1,
      headerClassName: 'bg-gray-200',
      minWidth: 30,
    }
    const defaultHeader = {
      ...commonColConfig,
      field: 'name',
      headerName: 'Name',
      minWidth: 150,
    }
    const skipCols = ['notes', 'std']
    const unsortableCols = ['units']
    const editableCols = ['expected', 'low', 'high', 'std', 'distribution', 'correlation']
    const editableColsAllowedValues = {
      distribution: ['constant', 'uniform', 'triangular'],
      correlation: ['yes', 'no'],
    }
    const paramColumnArr = preConfig.initial_inputs._columns.map((key) => {
      if (skipCols.includes(key)) return null
      const isEditable = editableCols.includes(key)
      const isSortable = !(unsortableCols.includes(key))
      return {
        ...commonColConfig,
        editable: isEditable,
        field: key,
        headerName: humanize(key),
        sortable: isSortable,
        // for columns with restricted options, define as such
        ...(editableColsAllowedValues[key] ? {
          // GridEditCellPropsChangeParams
          preProcessEditCellProps: (params) => {
            const hasError = !(editableColsAllowedValues[key].includes(params.props.value))
            return { ...params.props, error: hasError }
          },
        } : {}),
      }
    }).filter((x) => !!x)
    setTableColumns([defaultHeader, ...paramColumnArr])
  }, [preSystemType])

  useEffect(() => {
    const newData = parseConfigToData(systemConfig)
    setData(newData)
    setUnchangedData(newData)
  }, [systemConfig])

  return (
    <>
      <Helmet>
        <title>Bwaise System - QSDsan</title>
      </Helmet>
      <StretchRow>
        <h2 className="text-xl font-bold">Bwaise: Sanitation Alternatives in Bwaise, Uganda</h2>
      </StretchRow>
      <GuideRow
        title="Step 1: Begin by selecting a predefined model and country"
      >
        <div className="px-4">
          <div className="mb-2 text-alma font-semibold">Project Name:</div>
          <input id="project-name" placeholder="Enter Project Name" className="border py-1 px-2" />
        </div>

        <div className="px-4">
          <div className="mb-2 text-alma font-semibold">Model:</div>
          <Select
            className="py-1 px-2"
            options={predefinedSystemOptions}
            onChange={({ value }) => setPreSystemType(value)}
          />
        </div>

        <div className="px-4">
          <div className="mb-2 text-alma font-semibold">Country:</div>
          <Select
            className="py-1 px-2"
            options={predefinedSystemOptions}
            onChange={({ value }) => setPreSystemType(value)}
          />
        </div>
      </GuideRow>
      <GuideRow
        title="Step 2: Configure parameters loaded from the selected model and country"
      >
        <div className="flex w-full">
          <div className="flex-grow">
            <DataGrid
              autoHeight
              components={{
                Toolbar: CustomTableToolbar,
              }}
              columns={tableColumns}
              disableColumnMenu
              disableColumnResize
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              pageSize={pageSize}
              rows={data}
              rowsPerPageOptions={[5, 10, 20]}
              pagination
            />
          </div>
        </div>
      </GuideRow>

      <section className="max-w-7xl m-auto p-4">
        <div className="sr-only">Step 3</div>
        <div className="">
          <div className="sr-only">Step Header</div>
          <div className="text-alma text-lg font-bold">Step 3: Select a NRCS Conservation Practice Standard and a Practice Implementation that best describes your system. You may add multiple practices. If you would like to add a practice under a different class of practices, return to Step 2.</div>
        </div>
      </section>
    </>
  )
}
