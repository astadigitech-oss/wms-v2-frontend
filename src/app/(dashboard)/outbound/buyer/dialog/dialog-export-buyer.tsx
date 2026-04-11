/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useGetListBundle } from "@/app/(dashboard)/inventory/moving-product/bundle/_api/use-get-list-bundle";
import { DataTable } from "@/components/data-table";
import Pagination from "@/components/pagination";
// import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/use-debounce";
import { cn, setPaginate } from "@/lib/utils";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { ColumnDef } from "@tanstack/react-table";
// import { format } from "date-fns";
import { NotebookText, RefreshCw, } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";

// import { Separator } from "@/components/ui/separator";
// import { Plus, Minus } from "lucide-react";

const DialogExportBuyer = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  isPendingCreate: boolean;
}) => {
  const [dataSearch] = useQueryState("q", { defaultValue: "" });

  const searchValue = useDebounce(dataSearch);
  const [page, setPage] = useQueryState("p", parseAsInteger.withDefault(1));
  const [metaPage, setMetaPage] = useState({
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
    to: 1, //data sampai
    perPage: 1,
  });

  const {
    data,
    isSuccess,
  } = useGetListBundle({ p: page, q: searchValue });

  useEffect(() => {
    setPaginate({
      isSuccess,
      data,
      dataPaginate: data?.data.data.resource,
      setPage,
      setMetaPage,
    });
  }, [data]);

  const dummyData = [
    {
      nama: "Don",
      bulan_tahun: "12-2025",
      email: "dono@gmail.com",
      status: "pending",
    },
  ];

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const columnListBuyerExort: ColumnDef<any>[] = [
    {
      header: () => <div className="text-center">No</div>,
      id: "id",
      size: 60,
      cell: ({ row }) => (
        <div className="text-center tabular-nums">
          {(metaPage.from + row.index).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "nama",
      header: "Nama",
      size: 150,
      cell: ({ row }) => (
        <div className="break-all">{row.original?.nama || '-'}</div>
      ),
    },
    {
      accessorKey: "bulan_tahun",
      header: "Bulan Tahun",
      size: 80,
      cell: ({ row }) => (
        <div className="break-all">{row.original?.bulan_tahun || 0}</div>
      ),
    },
    {
      accessorKey: "email",
      header: () => <div className="text-center">Email</div>,
      size: 100,
      cell: ({ row }) => (
        <div className="break-all text-center">{row.original?.email || '-'}</div>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Status</div>,
      size: 80,
      maxSize: 80,
      cell: ({ row }) => (
        <div className="flex gap-4 justify-center">
          <span
            style={{
              backgroundColor: row.original?.status === "process" ? "#0B91FF" : "#fef9c3",
              color: row.original?.status === "process" ? "#fefefe" : "#ca8a04",
              border: `1.5px solid ${row.original?.status === "process" ? "#fefefe" : "#facc15"}`,
              borderRadius: "999px",
              padding: "3px 14px",
              fontSize: "13px",
              fontWeight: 400,
              display: "inline-block",
            }}
          >
            {row.original?.status === "process" ? "Process" : "Pending"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: () => <div className="text-center">Action</div>,
      size: 100,
      cell: ({ row }) => (
        <div className="flex gap-2 justify-center items-center">
          {/* Checkbox sebelah kiri button */}
          <input
            type="checkbox"
            className="w-4 h-4 cursor-pointer accent-blue-600"
            checked={selectedRows.has(String(row.index))}
            onChange={() => toggleRow(String(row.index))}
          />

          <TooltipProviderPage
            side="bottom"
            align="start"
            sideOffset={6}
            value={
              <div className="flex items-center gap-2">
                <NotebookText className="w-4 h-4" />
                <span>Export</span>
              </div>
            }
          >
            <Button
              variant="outline"
              disabled={!selectedRows.has(String(row.index))}
              className={cn(
                "w-9 h-9 px-0 flex items-center justify-center",
                "border-[#B0BAC9] text-[#B0BAC9]",
                "hover:bg-blue-600 hover:text-white hover:border-blue-600",
                "rounded-full transition-all duration-200",
                "disabled:hover:bg-transparent",
              )}
            >
              <NotebookText className="w-4 h-4" />
            </Button>
          </TooltipProviderPage>
        </div>
      ),
    },
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>{"List Export"}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col w-full px-4 py-4 gap-4">
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
              <div className="flex flex-col w-full gap-4">
                <div className="flex gap-2 items-center w-full justify-between">
                  <div className="flex items-center gap-3 w-full">
                    <Input
                      className="w-2/5 border-sky-400/80 focus-visible:ring-sky-400"
                      // value={dataSearchAPK}
                      // onChange={(e) => setDataSearchAPK(e.target.value)}
                      placeholder="Search..."
                      autoFocus
                    />
                    <TooltipProviderPage value={"Reload Data"}>
                      <Button
                        // onClick={() => refetchAPK()}
                        className="items-center w-9 px-0 flex-none h-9 border-sky-400 text-black hover:bg-sky-50"
                        variant={"outline"}
                      >
                        <RefreshCw
                        // className={cn("w-4 h-4", loadingAPK ? "animate-spin" : "")}
                        />
                      </Button>
                    </TooltipProviderPage>
                  </div>
                </div>
                <DataTable
                  columns={columnListBuyerExort}
                  data={[...dummyData]}
                // isLoading={loadingAPK}
                />
                <Pagination
                  pagination={{ ...metaPage, current: page }}
                  setPagination={setPage}
                />
              </div>
            </div>{" "}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogExportBuyer;