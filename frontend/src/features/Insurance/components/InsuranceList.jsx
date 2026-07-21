import { useEffect, useMemo, useState } from 'react'

import { getAllInsurance, getInsuranceReport } from '../api/BaseAPI'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const columns = [
  {
    accessorKey: 'loan_number',
    header: 'Loan No.',
    cell: ({ getValue }) => (
      <span className="font-mono font-semibold text-stone-800">{getValue() || '—'}</span>
    ),
  },
  {
    accessorKey: 'insurance_provider',
    header: 'Insurance',
    cell: ({ getValue }) => <span>{getValue() ? getValue() : 'n/a'}</span>,
  },
  {
    accessorKey: 'insurance_agent',
    header: 'Agent',
    cell: ({ getValue }) => <span>{getValue() ? getValue() : 'n/a'}</span>,
  },
  {
    accessorKey: 'insurance_end_date',
    header: 'Expire Date',
    cell: ({ getValue }) => <span>{getValue() ? formatDate(getValue()) : 'n/a'}</span>,
  },
]

const InsuranceList = () => {
  const [insurance, setInsurance] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [globalFilter, setGlobalFilter] = useState('')
  const [showReport, setShowReport] = useState(false)

  const fetchInsurance = async () => {
    setLoading(true)
    try {
      const data = showReport ? await getInsuranceReport() : await getAllInsurance()
      const rows = Array.isArray(data) ? data : data.insurances ?? []
      setInsurance(rows)
      setError(null)
    } catch (err) {
      setError(err.message)
      setInsurance([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInsurance()
  }, [showReport])

  const filteredData = useMemo(() => {
    if (!globalFilter) return insurance
    const term = globalFilter.toLowerCase()
    return insurance.filter((row) => {
      const haystack = `${row.loan_number ?? ''} ${row.insurance_provider ?? ''} ${row.insurance_agent ?? ''} ${row.insurance_end_date ?? ''}`.toLowerCase()
      return haystack.includes(term)
    })
  }, [insurance, globalFilter])

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  const rows = table.getRowModel().rows

  return (
    <div className="bg-stone-50 text-stone-800">
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-gradient-to-b from-white to-stone-100 px-8 pb-5">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-stone-900">
            Insurance Tracker
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowReport(false)}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors ${
                !showReport
                  ? 'border-stone-900 bg-stone-900 text-white'
                  : 'border-stone-200 bg-white text-stone-500 hover:border-amber-700'
              }`}
            >
              Insurances
            </button>
            <button
              onClick={() => setShowReport(true)}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors ${
                showReport
                  ? 'border-stone-900 bg-stone-900 text-white'
                  : 'border-stone-200 bg-white text-stone-500 hover:border-amber-700'
              }`}
            >
              Report
            </button>
          </div>
        </div>
        <div className="mb-4 mt-1 text-[13px] text-stone-500">
          {insurance.length} records &middot; search across loan numbers, insurers, and agents
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="text"
            placeholder="Search loan no, insurance, agent…"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="min-w-[220px] flex-1 rounded-md border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-800 focus:border-amber-700 focus:outline-none"
          />
          <span className="ml-auto pl-2 font-mono text-xs text-stone-500">
            {rows.length} / {insurance.length} records
          </span>
        </div>
      </header>

      <main className="px-8 pb-16 pt-5">
        {loading && <div className="py-16 text-center text-stone-500">Loading…</div>}
        {error && !loading && (
          <div className="py-16 text-center text-red-600">Error fetching insurance: {error}</div>
        )}
        {!loading && !error && (
          <>
            <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white shadow-sm">
              <table className="w-full border-collapse text-[13.5px]">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        const sortDir = header.column.getIsSorted()
                        return (
                          <th
                            key={header.id}
                            onClick={header.column.getToggleSortingHandler()}
                            className="cursor-pointer select-none whitespace-nowrap border-b border-stone-200 px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-stone-500 hover:text-amber-700"
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {sortDir && (
                              <span className="ml-1 text-sm text-amber-700">
                                {sortDir === 'asc' ? '▴' : '▾'}
                              </span>
                            )}
                          </th>
                        )
                      })}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b border-stone-100 transition-colors hover:bg-amber-50">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-3 py-2.5 align-top">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {rows.length === 0 && (
              <div className="py-16 text-center text-stone-500">No matching records.</div>
            )}

            <div className="mt-4 flex items-center justify-between text-sm text-stone-600">
              <span>
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="rounded-full border border-stone-200 bg-white px-3.5 py-2 text-[13px] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-amber-50 hover:text-amber-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="rounded-full border border-stone-200 bg-white px-3.5 py-2 text-[13px] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-amber-50 hover:text-amber-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default InsuranceList
