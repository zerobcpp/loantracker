import {use, useEffect,  useState } from "react";

import { getAllInsurance, getInsuranceReport} from "../api/BaseAPI";
import { useReactTable, 
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table'



const columns = [
    {
        accessorKey: 'loan_number',
        header: 'Loan#',
    },
    {
        accessorKey: "insurance_provider",
        header: 'Insurance',
        cell: ({getValue}) => getValue() ? getValue() : 'n/a',
    },
    {
        accessorKey: 'insurance_agent',
        header: 'Agent',
        cell: ({getValue}) => getValue() ? getValue() : 'n/a',
    },
    {
        accessorKey: "insurance_end_date",
        header: 'Expire Date',
        cell: ({getValue}) => getValue() ? new Date(getValue()).toLocaleDateString() : 'n/a',
    }
]

const InsuranceList = () => {
    const [insurance, setInsurance] = useState([])
    const [fallback, setFallback] = useState(['error fetching insurance'])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [globalFilter, setGlobalFilter] = useState('')
    const [showReport, setShowReport] = useState(true)


    const fetchInsurance = async () => {
        try {
            const data = showReport ? await getInsuranceReport() : await getAllInsurance()
            const rows = Array.isArray(data) ? data : data.insurances
            setInsurance(rows)
        } catch (err) {
            setError(err.message)
            setInsurance(fallback)
            console.log(err)
            
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchInsurance()
        
    }, [showReport])

    const table = useReactTable({
        data: insurance,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })
  if(loading) return <div>Loading...</div>
  if(error != null) return <div>{error}</div>

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Insurances</h1>
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
            onClick = { () => { setShowReport(!showReport)
              console.log(showReport)
            }
          }

            className="px-3 py-1 border rounded 
            disabled:opacity-40 hover:bg-green-100 bg-orange-700 text-black"
          >
            {showReport ? 'Insurances' : 'Report'}
          </button>
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

export default InsuranceList