import {useEffect,  useState } from "react";

import { getAll } from "../api/BaseAPI";
import { useReactTable, 
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
        accessorKey: "Insurance",
        header: 'Insurance',
        cell: ({getValue}) => getValue() ? getValue() : 'n/a',
    },
    {
        accessorKey: 'Agent',
        header: 'Agent',
        cell: ({getValue}) => getValue() ? getValue() : 'n/a',
    },
    {
        accessorKey: "Expire Date",
        header: 'Expire Date',
        cell: ({getValue}) => getValue() ? new Date(getValue()).toLocaleDateString() : 'n/a',
    },
