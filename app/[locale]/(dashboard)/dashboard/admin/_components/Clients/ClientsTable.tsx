"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Download,
  Upload,
  Phone,
  CircleDollarSign,
  CircleHelp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClientTablePropsWithRelations } from "@/lib/types";
import ClientDropdownCell from "./ClientDropdownCell";
import { exportToExcel } from "@/lib/utils";
import { DateRangePicker } from "../DateRangePicker";

export const columns: ColumnDef<ClientTablePropsWithRelations>[] = [
  {
    accessorKey: "transactionStatus",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Transaction Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("transactionStatus")}</div>,
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("fullName")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="pl-0">
          Phone Number
        </Button>
      );
    },
  },
  {
    accessorKey: "paymentMethodName",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="pl-0">
          Payment Method
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("paymentMethodName") || "No Payment Method"}
      </div>
    ),
  },
  {
    accessorKey: "transactionAction",
    header: ({ column }) => {
      return (
        <div className="flex justify-between items-center">
          <Button variant="ghost" className="pl-0">
            Transaction Action
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="capitalize flex items-center gap-4">
          <p>{row.getValue("transactionAction")}</p>
          {item.VodafoneWithdrawal.length > 0 ? (
            <Popover>
              <PopoverTrigger>
                <CircleHelp size={18} />
              </PopoverTrigger>
              <PopoverContent className="flex flex-col gap-4">
                {item.VodafoneWithdrawal.map((i: any, index: any) => (
                  <div key={index} className="flex items-center gap-2">
                    <p>
                      {index + 1}
                      {`)`}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone size={15} />: {i.phoneNumber}
                    </p>
                    <p className="flex items-center gap-2">
                      <CircleDollarSign size={15} />: {i.amount}
                    </p>
                  </div>
                ))}
              </PopoverContent>
            </Popover>
          ) : null}
          {item.InstaPayWithdrawal.length > 0 && (
            <Popover>
              <PopoverTrigger>
                <CircleHelp size={18} />
              </PopoverTrigger>
              <PopoverContent className="flex flex-col gap-4">
                {item.InstaPayWithdrawal.map((item: any, index: any) => (
                  <div key={index} className="flex items-center gap-2">
                    <p className="flex items-center gap-2">
                      User Code : {item.userCode}
                    </p>
                    <p className="flex items-center gap-2">
                      User Number : {item.userNumber}
                    </p>
                  </div>
                ))}
              </PopoverContent>
            </Popover>
          )}
          {item.BankTransferWithdrawal && (
            <Popover>
              <PopoverTrigger>
                <CircleHelp size={18} />
              </PopoverTrigger>
              <PopoverContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <p className="flex items-center gap-2">
                    Account Number : {item.BankTransferWithdrawal.accountNumber}
                  </p>
                  <p className="flex items-center gap-2">
                    Branch Name : {item.BankTransferWithdrawal.branchName}
                  </p>
                  <p className="flex items-center gap-2">
                    Bank Name : {item.BankTransferWithdrawal.bankName}
                  </p>
                  <p className="flex items-center gap-2">
                    Branch Code : {item.BankTransferWithdrawal.branchCode}
                  </p>
                  <p className="flex items-center gap-2">
                    SWIFT Code : {item.BankTransferWithdrawal.swiftCode}
                  </p>
                  <p className="flex items-center gap-2">
                    IBAN : {item.BankTransferWithdrawal.ibanNumber}
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "transactionCode",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="pl-0">
          Transaction Code
        </Button>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EGP",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const item = row.original;
      return (
        <ClientDropdownCell item={item}/>
      );
    },
  },
];

export function ClientsTable({
  clientData,
}: {
  clientData: ClientTablePropsWithRelations[];
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [rangeObject, setRangeObject] = React.useState<{
    from: Date;
    to: Date | undefined;
  }>({ from: new Date("2024-07-12T00:58:14.000Z"), to: undefined });

  const filteredClientData = React.useMemo(() => {
    if (!rangeObject.from || !rangeObject.to) {
      return clientData;
    }
    const endDate = rangeObject.to || new Date("9999-12-31");

    return clientData.filter((item) => {
      const itemDate = new Date(item.createdAt);
      return itemDate >= rangeObject.from && itemDate <= endDate;
    });
  }, [clientData, rangeObject]);

  const totalWithdrawalAmount = React.useMemo(() => {
    return filteredClientData
      .filter((item) => item.transactionAction.toLowerCase() === "withdrawal")
      .reduce((total, item) => total + (item.amount || 0), 0);
  }, [filteredClientData]);

  const totalDepositAmount = React.useMemo(() => {
    return filteredClientData
      .filter((item) => item.transactionAction.toLowerCase() === "deposit")
      .reduce((total, item) => total + (item.amount || 0), 0);
  }, [filteredClientData]);

  const table = useReactTable({
    data: filteredClientData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    filterFns: {},
  });

  return (
    <div className="w-full">
      <div className="flex flex-col xl:flex-row items-center justify-between gap-2 py-4">
        <div className="grid grid-cols-1 xl:grid-cols-2 w-full items-center gap-2 lg:gap-8">
          <Input
            placeholder="Filter all columns..."
            value={globalFilter ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="w-full"
          />
          <DateRangePicker setRangeObject={setRangeObject} />
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 w-full items-center gap-2 lg:gap-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto w-full">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            className="ml-auto w-full"
            onClick={() => exportToExcel(table.options.data, "clientData.xlsx")}
            title="Export"
          >
            Export
          </Button>
          <Button
            variant="outline"
            className="ml-auto w-full flex items-center gap-2"
            title="Total Withdrawal Amount"
          >
            <Upload size={15} /> {totalWithdrawalAmount} EGP
          </Button>
          <Button
            variant="outline"
            className="ml-auto w-full flex items-center gap-2"
            title="Total Deposit Amount"
          >
            <Download size={15} /> {totalDepositAmount} EGP
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
