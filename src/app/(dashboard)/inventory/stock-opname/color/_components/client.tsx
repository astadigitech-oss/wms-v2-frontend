/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DataTable } from "@/components/data-table";
import Pagination from "@/components/pagination";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { cn, setPaginate } from "@/lib/utils";
// import { formatRupiah } from "@/lib/utils";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { ColumnDef } from "@tanstack/react-table";
import { ReceiptText, RefreshCw } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { useGetListBundle } from "../../../moving-product/bundle/_api/use-get-list-bundle";

export const Client = () => {
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

  const columnStockOpname: ColumnDef<any>[] = [
    {
      header: () => <div className="text-center">No</div>,
      id: "id",
      cell: ({ row }) => (
        <div className="text-center tabular-nums">
          {(1 + row.index).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "periode_start",
      header: "Periode Start",
      cell: ({ row }) => (
        <div className="break-all justify-center items-center min-w-52 max-w-125">{row.original.periode_start} - </div>
      ),
    },
    {
      accessorKey: "periode_end",
      header: "Periode End",
      cell: ({ row }) => <div className="break-all min-w-52 ">{row.original.periode_end} - </div>,
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => (
        <div className="flex gap-4 justify-center">
          <Badge
            className={cn(
              "rounded justify-center text-black font-normal capitalize",
              row.original.status === "done"
                ? "bg-green-400 hover:bg-green-400"
                : "bg-sky-400 hover:bg-sky-400"
            )}
          >
            {row.original.status}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: () => <div className="text-center">Action</div>,
      cell: ({ }) => (
        <div className="flex gap-4 justify-center items-center">
          <TooltipProviderPage value={<p>Detail</p>}>
            <Button
              className="items-center w-9 px-0 flex-none h-9 border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50 disabled:opacity-100 disabled:hover:bg-sky-50 disabled:pointer-events-auto disabled:cursor-not-allowed"
              variant={"outline"}
            // disabled={isLoadingProduct}
            // onClick={(e) => {
            //   e.preventDefault();
            //   setProductId(row.original.id);
            //   setOpenDialog(true);
            // }}
            >
              {/* {isLoadingProduct ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : ( */}
              <ReceiptText className="w-4 h-4" />
              {/* )} */}
            </Button>
          </TooltipProviderPage>
        </div>
      ),
    },
  ];
  return (
    <div className="flex flex-col bg-gray-100 w-full px-4 py-4 gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Inventory</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Stock Opname</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>List Stock Opname Color</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">List Stock Opname Color</h2>
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
            columns={columnStockOpname}
            data={[]}
          // isLoading={loadingAPK}
          />
          <Pagination
            pagination={{ ...metaPage, current: page }}
            setPagination={setPage}
          />
        </div>
      </div>{" "}
    </div>
  );
};
