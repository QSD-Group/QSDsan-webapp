import { Button } from '@mui/material'
import {
  DataGrid, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarExport,
} from '@mui/x-data-grid'
import axios from 'axios'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import Helmet from 'react-helmet'
import Select from 'react-select'

import countryParams from '../assets/data/country_params.json'
import GuideRow from '../components/Row/Guide'
import StretchRow from '../components/Row/Stretch'
import { computerize, isNumeric } from '../utils'

const countryNames = Object.keys(countryParams)

const countryNameOptions = countryNames.map((name) => ({ value: name, label: name }))

const commonColConfig = {
  flex: 1,
  headerClassName: 'bg-gray-200',
  minWidth: 50,
}

function parseConfigToData(countryName) {
  if (!countryNames.includes(countryName)) return []
  return countryParams[countryName].map((row, id) => ({ id, ...row }))
}

function parseDataForAPICall(data) {
  const parsed = {}
  // eslint-disable-next-line no-restricted-syntax
  for (const row of data) {
    parsed[computerize(row.Parameter)] = row.Value
  }
  return parsed
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
  const [countryName, setCountryName] = useState({})
  const [pageSize, setPageSize] = useState(15)
  // GridRowsProp
  const [data, setData] = useState([])

  const onRunHandle = () => {
    if (!data || (typeof data === 'object' && !Object.keys(data).length)) return

    const params = parseDataForAPICall(data)
    if (!Object.keys(params).length) return

    console.log(params)
    // axios.get(process.env.REACT_APP_API_URL, { params })
    //   .then((res) => res.data)
    //   .then(console.log)
    //   .catch(console.error)
  }

  function setUpdatedData(params) {
    const value = params.value.toString()
    if (!isNumeric(value)) return params.row

    const updatedData = data
    // eslint-disable-next-line array-callback-return,consistent-return
    updatedData.find((obj, i) => {
      if (obj.Parameter === params.row.Parameter) {
        updatedData[i].Value = Number(value)
        return true
      }
    })
    setData(updatedData)
    return { ...params.row, Value: value }
  }

  // GridColDef[]
  const tableColumns = [
    {
      ...commonColConfig,
      field: 'Parameter',
      headerName: 'Parameter',
      minWidth: 150,
    },
    {
      ...commonColConfig,
      // TODO: class is not added even if aria-invalid=true comes up for nested input
      cellClassName: (params) => clsx(!isNumeric(params.value.toString()) && 'bg-red-300'),
      editable: true,
      field: 'Value',
      headerName: 'Value',
      preProcessEditCellProps: (params) => {
        const hasError = !isNumeric(params.props.value.toString())
        return { ...params.props, error: hasError }
      },
      sortable: true,
      valueSetter: setUpdatedData,
    },
    {
      ...commonColConfig,
      field: 'Unit',
      headerName: 'Unit',
      sortable: false,
      filterable: false,
    },
  ]

  useEffect(() => {
    const newData = parseConfigToData(countryName)
    if (!newData) return
    setData(newData)
  }, [countryName])

  return (
    <>
      <Helmet>
        <title>Bwaise System - QSDsan</title>
      </Helmet>
      <StretchRow>
        <h2 className="text-xl font-bold">Bwaise: Sanitation Alternatives in Bwaise, Uganda</h2>
      </StretchRow>
      <GuideRow
        title="Step 1: Begin by selecting a predefined country configuration"
      >
        <div className="px-4">
          <div className="mb-2 text-alma font-semibold">Project Name:</div>
          <input id="project-name" placeholder="Enter Project Name" className="border py-1 px-2" />
        </div>

        <div className="px-4">
          <div className="mb-2 text-alma font-semibold">Country:</div>
          <Select
            className="py-1 px-2 w-52"
            options={countryNameOptions}
            onChange={({ value }) => setCountryName(value)}
          />
        </div>
      </GuideRow>
      <GuideRow
        title="Step 2: Configure parameters loaded from the selected country"
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
              onEditRowsModelChange={console.log}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              pageSize={pageSize}
              rows={data}
              rowsPerPageOptions={[5, 10, 15]}
              pagination
            />
          </div>
        </div>
      </GuideRow>

      <GuideRow
        title="Step 3: Run the model! This may take some time!"
      >
        <Button
          variant="contained"
          onClick={() => onRunHandle()}
        >
          Run the Model
        </Button>
      </GuideRow>
    </>
  )
}
