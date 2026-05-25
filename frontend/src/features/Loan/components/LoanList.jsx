import {getAll} from '../api/BaseAPI'

import React from 'react'
import {useState, useEffect} from 'react'
import {useReactTable, 
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
 } from '@tanstack/react-table'

const columns = [
  {
    accessorKey: 'loan',
    header: 'Loan#',
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({getValue}) => getValue() ? getValue() : 'n/a',
  },
  {
    accessorKey:'has_note',
    header: 'Note',
    cell : ({getValue}) => getValue() ? 'True' : 'False',
  },
  {
    accessorKey: 'has_mortgage',
    header: 'Mortgage',
    cell : ({getValue}) => getValue() ? 'True' : 'False',
  },
  {
    accessorKey: 'has_insurance',
    header: 'Insurance',
    cell : ({getValue}) => getValue() ? 'True' : 'False',
  },
  {
    accessorKey: 'has_titlepolicy',
    header: 'Title Policy',
    cell : ({getValue}) => getValue() ? 'True' : 'False',
  },
  {
    accessorKey: 'has_recorded_mortgage',
    header: 'Recorded Mortgage',
    cell : ({getValue}) => getValue() ? 'True' : 'False',
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell : ({getValue}) => getValue() ? new Date(getValue()).toLocaleDateString() : 'n/a',
  }
  
]

const LoanList = () => {
  const [loans, setLoans] = useState([])
  const [fallback, setFallback] = useState(['error fetching loans'])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [globalFilter, setGlobalFilter] = useState('')


  const fetchLoans = async () => {
    try {
      const data = await getAll()
      setLoans(data)
      //console.log(data)
    } catch (err) {
      setError(err.message)
      setLoans(fallback)
    }
    finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchLoans()
  } , [])

const table = useReactTable({
  data: loans,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  initialState: {
    pagination: {
      pageSize: 10,
    },
  },
})


return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Loans</h1>
        <input
          value={globalFilter}
          onChange={e => {setGlobalFilter(e.target.value)
            table.setGlobalFilter(e.target.value)
          }}
          placeholder="Search..."
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-blue-50 border-blue border-gray-200">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc' ? ' ↑' : header.column.getIsSorted() === 'desc' ? ' ↓' : ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-emerald-200 bg-stone-200">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-3 text-white-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-green-100 bg-blue-700 text-black"
          >
            Prev
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-green-100 bg-blue-700 text-black"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoanList