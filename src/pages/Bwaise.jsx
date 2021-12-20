import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import {
  useTable, useFilters, useGlobalFilter, useAsyncDebounce, usePagination,
} from 'react-table'
import { matchSorter } from 'match-sorter'
import { Sprout32 } from '@carbon/icons-react'

import Header from '../layouts/Header'
import HeaderNav from '../layouts/HeaderNav'
// import Card from '../components/Card'

import uncertaintySysA from '../assets/data/Bwaise_sanitation_inputs_uncertaintyA.json'
import uncertaintySysB from '../assets/data/Bwaise_sanitation_inputs_uncertaintyB.json'
import uncertaintySysC from '../assets/data/Bwaise_sanitation_inputs_uncertaintyC.json'

const predefinedSystemOptions = [
  { value: 'uncertaintySysA', label: 'System A (uncertainty)' },
  { value: 'uncertaintySysB', label: 'System B (uncertainty)' },
  { value: 'uncertaintySysC', label: 'System C (uncertainty)' },
]

/**
 * Splits underscored words into capitalized words with spacing
 * e.g. distribution_alt ==> Distribution Alt
 * @param str
 * @returns {*}
 */
function humanize(str) {
  const frags = str.split('_')
  for (let i = 0; i < frags.length; i++) frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1)
  return frags.join(' ')
}

function parseConfigToData(config) {
  if (typeof config !== 'object' || Object.keys(config).length === 0) return []

  const finalData = []
  /* eslint-disable */
  for (const [category, parameters] of Object.entries(config)) {
    for (const [pName, pCols] of Object.entries(parameters)) {
      if (pName === '_columns') continue

      const rowData = { name: pName }
      for (const [colName, colData] of Object.entries(pCols)) {
        if (colName === '_display') continue
        rowData[colName] = colData.value || null
      }
      finalData.push(rowData)
    }
  }
  /* eslint-enable */

  return finalData
}

// Create an editable cell renderer
const EditableCell = ({
  /* eslint-disable react/prop-types */
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
  /* eslint-enable react/prop-types */
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue)

  const onChange = (e) => {
    setValue(e.target.value)
  }

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value)
  }

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return <input value={value} onChange={onChange} onBlur={onBlur} />
}

// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
  Cell: EditableCell,
}

// Define a default UI for filtering
function GlobalFilter({
  /* eslint-disable react/prop-types */
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  /* eslint-enable react/prop-types */
}) {
  // eslint-disable-next-line react/prop-types
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)
  const onChange = useAsyncDebounce((_value) => setGlobalFilter(_value || undefined), 200)

  return (
    <div>
      <span className="mr-2">Search:</span>
      <input
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value)
          onChange(e.target.value)
        }}
        placeholder={`${count} parameters...`}
        className="p-2 border-2 border-cyan round-lg"
      />
    </div>
  )
}

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
  // eslint-disable-next-line react/prop-types
  column: {
    // eslint-disable-next-line react/prop-types
    filterValue, setFilter, preFilteredRows, id,
  },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const _options = new Set()
    // eslint-disable-next-line react/prop-types
    preFilteredRows.forEach((row) => {
      _options.add(row.values[id])
    })
    return [..._options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val

// Our table component
const ROWS_PER_PAGE = 20

function Table({
  // eslint-disable-next-line react/prop-types
  columns, data, updateMyData, skipPageReset,
}) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => rows.filter((row) => {
        const rowValue = row.values[id]
        return rowValue !== undefined
          ? String(rowValue)
            .toLowerCase()
            .startsWith(String(filterValue).toLowerCase())
          : true
      }),
    }),
    [],
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: {
      pageIndex, pageSize, globalFilter,
    },
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: {
        pageSize: ROWS_PER_PAGE,
        pageIndex: 0,
      },
      // use the skipPageReset option to disable page resetting temporarily
      autoResetPage: !skipPageReset,
      // updateMyData isn't part of the API, but anything we put into these options will automatically
      // be available on the instance. That way we can call this function from our cell renderer!
      updateMyData,
    },
    useFilters,
    useGlobalFilter,
    usePagination,
  )

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          <tr>
            <th
              colSpan={visibleColumns.length}
              style={{
                textAlign: 'left',
              }}
            >
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </th>
          </tr>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => <td {...cell.getCellProps()}>{cell.render('Cell')}</td>)}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button type="button" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>&lt;&lt;</button>
        &nbsp;
        <button type="button" onClick={() => previousPage()} disabled={!canPreviousPage}>&lt;</button>
        &nbsp;
        <button type="button" onClick={() => nextPage()} disabled={!canNextPage}>&gt;</button>
        &nbsp;
        <button type="button" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>&gt;&gt;</button>
        &nbsp;
        <span>
          Page&nbsp;
          <strong>{`${pageIndex + 1} of ${pageOptions.length}`}</strong>
          &nbsp;
        </span>
        <span>
          | Go to page:&nbsp;
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const _page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(_page)
            }}
            style={{ width: '100px' }}
          />
        </span>
        &nbsp;
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map((_pageSize) => (
            <option key={_pageSize} value={_pageSize}>{`Show ${_pageSize}`}</option>
          ))}
        </select>
      </div>
    </>
  )
}

export default function Bwaise() {
  const [preSystemType, setPreSystemType] = useState(null)
  const [systemConfig, setSystemConfig] = useState({})
  const [data, setData] = useState([])
  const [unchangedData, setUnchangedData] = useState(data)
  const [skipPageReset, setSkipPageReset] = useState(false)
  const [tableColumns, setTableColumns] = useState([
    {
      Header: 'Name',
      accessor: 'name',
      // Use our custom `fuzzyText` filter on this column
      filter: 'fuzzyText',
    },
    // {
    //   Header: 'Value',
    //   accessor: 'value',
    //   // Filter: SelectColumnFilter,
    //   // filter: 'includes',
    // }
  ])

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

    const headColumn = {
      Header: 'Name',
      accessor: 'name',
      filter: 'fuzzyText',
    }
    const paramColumnArr = preConfig.initial_inputs._columns.map((key) => ({ Header: humanize(key), accessor: key }))
    setTableColumns([headColumn, ...paramColumnArr])
  }, [preSystemType])

  useEffect(() => {
    const newData = parseConfigToData(systemConfig)
    setData(newData)
    setUnchangedData(newData)
  }, [systemConfig])

  // const columns = React.useMemo(() => [
  //   {
  //     Header: 'Name',
  //     accessor: 'name',
  //     // Use our custom `fuzzyText` filter on this column
  //     filter: 'fuzzyText',
  //   },
  //   // {
  //   //   Header: 'Value',
  //   //   accessor: 'value',
  //   //   // Filter: SelectColumnFilter,
  //   //   // filter: 'includes',
  //   // },
  // ], [])

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true)
    setData((old) => old.map((row, index) => (index === rowIndex ? { ...old[rowIndex], [columnId]: value } : row)))
  }

  // After data chagnes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  React.useEffect(() => {
    setSkipPageReset(false)
  }, [data])

  const resetData = () => setData(unchangedData)

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <Header />
      <HeaderNav />

      <section className="max-w-7xl m-auto p-4">
        <h2 className="text-xl font-bold">Bwaise: Sanitation Alternatives in Bwaise, Uganda</h2>
      </section>

      <section className="max-w-7xl m-auto p-4">
        <div className="sr-only">Step 1</div>

        <div className="">
          <div className="sr-only">Step 1 Header</div>
          <div className="text-alma text-lg font-bold">Step 1: Begin by selecting the predefined systems or the &quot;Customize&quot; option</div>
        </div>

        <div className="mt-4">
          <div className="sr-only">Step 1 Body</div>
          <div className="flex">
            <div className="px-4">
              <div className="mb-2 text-alma font-semibold">Project Name:</div>
              <input id="project-name" placeholder="Enter Project Name" className="border py-1 px-2" />
            </div>

            <div className="px-4">
              <div className="mb-2 text-alma font-semibold">Country:</div>
              <Select
                className="py-1 px-2"
                options={predefinedSystemOptions}
                onChange={({ value }) => setPreSystemType(value)}
              />
            </div>

            <div className="px-4">
              <div className="mb-2 text-alma font-semibold">Customize Options?</div>
              <input
                name="customize"
                type="checkbox"
                onChange={() => {}}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl m-auto p-4">
        <div className="sr-only">Step 2</div>

        <div className="">
          <div className="sr-only">Step 2 Header</div>
          <div className="text-alma text-lg font-bold">Step 2: Select the class of conservation practices that best describes the practice you would like to evaluate</div>
        </div>

        <div className="mt-4">
          <div className="sr-only">Step 2 Body</div>
          <button type="button" onClick={resetData}>Reset Data</button>
          <Table
            columns={tableColumns}
            data={data}
            updateMyData={updateMyData}
            skipPageReset={skipPageReset}
          />
          {
            // <div className="grid grid-cols-4 gap-4">
            //   <div
            //     className="group px-6 py-5 border border-indigo-500 border-opacity-25 cursor-pointer select-none text-center overflow-hidden space-y-1 hover:bg-white hover:shadow-lg hover:border-transparent">
            //     <Sprout32 className="m-auto"/>
            //     <p className="font-semibold text-indigo-600 group-hover:text-gray-900">Cropland Management</p>
            //   </div>
            //
            //   <div
            //     className="group px-6 py-5 border border-indigo-500 border-opacity-25 cursor-pointer select-none text-center overflow-hidden space-y-1 hover:bg-white hover:shadow-lg hover:border-transparent">
            //     <Sprout32 className="m-auto"/>
            //     <p className="font-semibold text-indigo-600 group-hover:text-gray-900">Grazing Lands</p>
            //   </div>
            //
            //   <div
            //     className="group px-6 py-5 border border-indigo-500 border-opacity-25 cursor-pointer select-none text-center overflow-hidden space-y-1 hover:bg-white hover:shadow-lg hover:border-transparent">
            //     <Sprout32 className="m-auto"/>
            //     <p className="font-semibold text-indigo-600 group-hover:text-gray-900">Grazing Lands</p>
            //   </div>
            //
            //   <div
            //     className="group px-6 py-5 border border-indigo-500 border-opacity-25 cursor-pointer select-none text-center overflow-hidden space-y-1 hover:bg-white hover:shadow-lg hover:border-transparent">
            //     <Sprout32 className="m-auto"/>
            //     <p className="font-semibold text-indigo-600 group-hover:text-gray-900">Grazing Lands</p>
            //   </div>
            // </div>
          }
        </div>
      </section>

      <section className="max-w-7xl m-auto p-4">
        <div className="sr-only">Step 3</div>
        <div className="">
          <div className="sr-only">Step Header</div>
          <div className="text-alma text-lg font-bold">Step 3: Select a NRCS Conservation Practice Standard and a Practice Implementation that best describes your system. You may add multiple practices. If you would like to add a practice under a different class of practices, return to Step 2.</div>
        </div>
      </section>
    </div>
  )
}
