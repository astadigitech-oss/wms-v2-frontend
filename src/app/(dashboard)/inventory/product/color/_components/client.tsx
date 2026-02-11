"use client";

import { DataTable } from "@/components/data-table";
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
import { cn, formatRupiah } from "@/lib/utils";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ReceiptText, RefreshCw, Trash2 } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import { useGetListProductColorWMS } from "../_api/use-get-list-product-color-wms";
import { Badge } from "@/components/ui/badge";

export const Client = () => {
  const queryClient = useQueryClient();
  // search WMS
  const [dataSearchWMS, setDataSearchWMS] = useQueryState("q", {
    defaultValue: "",
  });
  const searchValueWMS = useDebounce(dataSearchWMS);
  const [pageWMS, setPageWMS] = useQueryState(
    "p",
    parseAsInteger.withDefault(1),
  );
  const [metaPageWMS, setMetaPageWMS] = useState({
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
    perPage: 1,
  });

  // data WMS
  const {
    data: dataWMS,
    refetch: refetchWMS,
    isLoading: isLoadingWMS,
    isRefetching: isRefetchingWMS,
    isPending: isPendingWMS,
    isSuccess: isSuccessWMS,
    error: errorWMS,
    isError: isErrorWMS,
  } = useGetListProductColorWMS({ p: pageWMS, q: searchValueWMS });

  // data RES memo WMS
  const dataResWMS: any = useMemo(() => {
    return dataWMS?.data.data.resource.data;
  }, [dataWMS]);

  console.log("dataResWMS", dataResWMS);

  const columnSummaryColor: ColumnDef<any>[] = [
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
      accessorKey: "old_barcode",
      header: "Old Barcode",
      cell: ({ row }) => (
        <div className="break-all">{row.original.old_barcode}</div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="break-all">{row.original.name}</div>,
    },
    {
      accessorKey: "name_color",
      header: "Tag Color",
      cell: ({ row }) => (
        <div className="break-all">{row.original.name_color}</div>
      ),
    },

    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <div className="tabular-nums">{formatRupiah(row.original.price)}</div>
      ),
    },
     {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className="bg-sky-400/80 hover:bg-sky-400/80 text-black font-normal capitalize">
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "action",
      header: () => <div className="text-center">Action</div>,
      cell: ({ row }) => (
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
          <TooltipProviderPage value={<p>Delete</p>}>
            <Button
              className="items-center w-9 px-0 flex-none h-9 border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50 disabled:opacity-100 disabled:hover:bg-red-50 disabled:pointer-events-auto disabled:cursor-not-allowed"
              variant={"outline"}
              // disabled={isPendingDelete}
              // onClick={(e) => {
              //   e.preventDefault();
              //   handleDelete(row.original.id);
              // }}
            >
              {/* {isPendingDelete ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : ( */}
              <Trash2 className="w-4 h-4" />
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
          <BreadcrumbItem>Product</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Color WMS</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-xl font-semibold">Summary Product Colors WMS</h2>
        </div>

        <hr className="border-gray-200" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4 mb-6">
          {/* Card: Total Rack */}
          <div className="bg-white shadow rounded-xl p-5 flex flex-col border border-gray-200">
            <div className="flex items-center gap-2">
              {/* <div className="p-2 rounded-md bg-[#0B91FF] text-white">
                <Server className="w-4 h-4" />
              </div> */}
              <h4 className="text-sm text-gray-500">Total Products</h4>
            </div>

            <p className="text-3xl font-bold mt-3">0</p>
          </div>

          {/* Card: Total Product */}
          <div className="bg-white shadow rounded-xl p-5 flex flex-col border border-gray-200">
            <div className="flex items-center gap-2">
              {/* <div className="p-2 rounded-md bg-[#0B91FF] text-white">
                <Server className="w-4 h-4" />
              </div> */}
              <h4 className="text-sm text-gray-500">Total Value</h4>
            </div>

            <p className="text-3xl font-bold mt-3">0</p>
          </div>
        </div>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">List Product Colors WMS</h2>
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
            columns={columnSummaryColor}
            data={dataResWMS ?? []}
            // isLoading={loadingAPK}
          />
          {/* <Pagination
            pagination={{ ...metaPageAPK, current: pageAPK }}
            setPagination={setPageAPK}
          /> */}
        </div>
      </div>{" "}
    </div>
  );
};
