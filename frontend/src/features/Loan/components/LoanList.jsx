import { getAllLoan } from '../api/BaseAPI'

import { useEffect, useMemo, useState } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

// The five tracked documents. Order here drives both the progress count and
// the expanded-row checklist.
const DOC_FIELDS = [
  { key: 'has_note', label: 'Note' },
  { key: 'has_mortgage', label: 'Mortgage' },
  { key: 'has_title_insurance', label: 'Title Insurance' },
  { key: 'has_insurance', label: 'Insurance' },
  { key: 'has_recorded_mortgage', label: 'Recorded Mortgage' },
]

const DOC_TOTAL = DOC_FIELDS.length

function docsReceived(loan) {
  return DOC_FIELDS.reduce((n, f) => n + (loan[f.key] ? 1 : 0), 0)
}

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const columnHelper = createColumnHelper()

const columns = [
  columnHelper.accessor('loan', {
    header: 'Loan No.',
    cell: (info) => (
      <span className="font-mono font-semibold text-stone-800">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor('location', {
    header: 'Location',
    cell: (info) => info.getValue() || '—',
  }),
  columnHelper.accessor('is_active', {
    header: 'Status',
    cell: (info) => (
      <span
        className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold tracking-wide ${
          info.getValue() ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-200 text-stone-500'
        }`}
      >
        {info.getValue() ? 'Active' : 'Inactive'}
      </span>
    ),
  }),
  columnHelper.accessor('closed_at', {
    header: 'Closed',
    cell: (info) => formatDate(info.getValue()),
    sortingFn: (a, b) =>
      new Date(a.original.closed_at ?? 0).getTime() - new Date(b.original.closed_at ?? 0).getTime(),
  }),
  columnHelper.accessor((r) => docsReceived(r) / DOC_TOTAL, {
    id: 'progress',
    header: 'Docs',
    cell: (info) => {
      const r = info.row.original
      const received = docsReceived(r)
      const complete = received === DOC_TOTAL
      const pct = (received / DOC_TOTAL) * 100
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 font-mono text-xs ${
            complete ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-800'
          }`}
        >
          <span className="inline-block h-1.5 w-10 overflow-hidden rounded-full bg-stone-200">
            <span className="block h-full bg-current" style={{ width: `${pct}%` }} />
          </span>
          {received}/{DOC_TOTAL}
        </span>
      )
    },
  }),
  columnHelper.accessor('created_at', {
    header: 'Created At',
    cell: (info) => formatDate(info.getValue()),
  }),
]

const LoanList = () => {
  const [loans, setLoans] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [globalFilter, setGlobalFilter] = useState('')
  const [docFilter, setDocFilter] = useState('all') // 'all' | 'complete' | 'incomplete'
  const [isCommercial, setIsCommercial] = useState(false)

  const fetchLoans = async () => {
    setLoading(true)
    try {
      const data = await getAllLoan(isCommercial ? 'commercial' : 'residential')
      setLoans(data)
      setError(null)
    } catch (err) {
      setError(err.message)
      setLoans([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLoans()
  }, [isCommercial])

  const filteredData = useMemo(() => {
    if (docFilter === 'complete') return loans.filter((r) => docsReceived(r) === DOC_TOTAL)
    if (docFilter === 'incomplete') return loans.filter((r) => docsReceived(r) !== DOC_TOTAL)
    return loans
  }, [loans, docFilter])

  const globalFilterFn = (row, _columnId, filterValue) => {
    const r = row.original
    const haystack = `${r.loan} ${r.location ?? ''} ${r.comment ?? ''}`.toLowerCase()
    return haystack.includes(filterValue.toLowerCase())
  }

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
  })

  const rows = table.getRowModel().rows

  return (
    <div className="bg-stone-50 text-stone-800">
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-linear-to-b from-white to-stone-100 px-8 pb-5">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-stone-900">
            {isCommercial ? 'Commercial' : 'Residential'} Loan Document Tracker
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setIsCommercial(false)}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors ${
                !isCommercial
                  ? 'border-stone-900 bg-stone-900 text-white'
                  : 'border-stone-200 bg-white text-stone-500 hover:border-amber-700'
              }`}
            >
              Residential
            </button>
            <button
              onClick={() => setIsCommercial(true)}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors ${
                isCommercial
                  ? 'border-stone-900 bg-stone-900 text-white'
                  : 'border-stone-200 bg-white text-stone-500 hover:border-amber-700'
              }`}
            >
              Commercial
            </button>
          </div>
        </div>
        <div className="mb-4 mt-1 text-[13px] text-stone-500">
          {loans.length} loans &middot; click a row to see document status
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="text"
            placeholder="Search loan no, location, comment…"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="min-w-55 flex-1 rounded-md border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-800 focus:border-amber-700 focus:outline-none"
          />
          {['all', 'incomplete', 'complete'].map((f) => (
            <button
              key={f}
              onClick={() => setDocFilter(f)}
              className={`whitespace-nowrap rounded-full border px-3.5 py-2 text-[13px] transition-colors ${
                docFilter === f
                  ? 'border-stone-900 bg-stone-900 text-white'
                  : 'border-stone-200 bg-white text-stone-500 hover:border-amber-700'
              }`}
            >
              {f === 'all' ? 'All' : f === 'incomplete' ? 'Missing docs' : 'Complete'}
            </button>
          ))}
          <span className="ml-auto pl-2 font-mono text-xs text-stone-500">
            {rows.length} / {loans.length} loans
          </span>
        </div>
      </header>

      <main className="px-8 pb-16 pt-5">
        {loading && <div className="py-16 text-center text-stone-500">Loading…</div>}
        {error && !loading && (
          <div className="py-16 text-center text-red-600">Error fetching loans: {error}</div>
        )}
        {!loading && !error && (
          <>
            <table className="w-full border-collapse text-[13.5px]">
              <thead>
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((header) => {
                      const sortDir = header.column.getIsSorted()
                      return (
                        <th
                          key={header.id}
                          onClick={header.column.getToggleSortingHandler()}
                          className="cursor-pointer select-none whitespace-nowrap border-b-2 border-stone-900 px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-stone-500 hover:text-amber-700"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sortDir && (
                            <span className="text-amber-700 text-sm">{sortDir === 'asc' ? ' \u25B4' : ' \u25BE'}</span>
                          )}
                        </th>
                      )
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {rows.map((row) => (
                  <RowWithDetail key={row.id} row={row} />
                ))}
              </tbody>
            </table>
            {rows.length === 0 && (
              <div className="py-16 text-center text-stone-500">No matching records.</div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

// ---------- Row + expandable detail panel ----------

function RowWithDetail({ row }) {
  const r = row.original
  const expanded = row.getIsExpanded()

  return (
    <>
      <tr
        onClick={() => row.toggleExpanded()}
        className="cursor-pointer border-b border-stone-200 hover:bg-amber-50"
      >
        {row.getVisibleCells().map((cell) => (
          <td key={cell.id} className="px-3 py-2.5 align-top">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
      {expanded && (
        <tr className="border-b border-stone-200 bg-white">
          <td colSpan={row.getVisibleCells().length} className="px-3 pb-4">
            {r.comment && (
              <div className="mt-2.5 text-xs text-stone-500">
                Comment: <strong className="text-stone-800">{r.comment}</strong>
              </div>
            )}
            <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2 rounded-md border border-stone-200 bg-stone-50 p-3.5">
              {DOC_FIELDS.map((f) => {
                const received = Boolean(r[f.key])
                return (
                  <div key={f.key} className="rounded border border-stone-200 bg-white px-2.5 py-2">
                    <div className="mb-1 flex items-center text-xs font-semibold">
                      <span
                        className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${
                          received ? 'bg-emerald-700' : 'bg-stone-300'
                        }`}
                      />
                      {f.label}
                    </div>
                    <div className="text-[11.5px] leading-relaxed text-stone-500">
                      {received ? 'On file' : 'Not yet received'}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-2.5 flex gap-4 text-[11.5px] text-stone-500">
              <span>Created {formatDate(r.created_at)}</span>
              <span>Updated {formatDate(r.updated_at)}</span>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default LoanList
