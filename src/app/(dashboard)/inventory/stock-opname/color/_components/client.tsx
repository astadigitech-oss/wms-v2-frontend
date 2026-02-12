/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { ColumnDef } from "@tanstack/react-table";
import { ReceiptText, Trash2 } from "lucide-react";

export const Client = () => {
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
      <DataTable
        columns={columnSummaryColor}
        data={[]}
        // isLoading={loadingAPK}
      />
    </div>
  );
};
