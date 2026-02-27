/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatRupiah } from "@/lib/utils";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Loader2,
  LucideIcon,
  MoreHorizontal,
  Printer,
  ReceiptText,
  Shield,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import React, { MouseEvent, useState } from "react";

const ButtonAction = ({
  isLoading,
  label,
  onClick,
  type,
  icon: Icon,
}: {
  isLoading: boolean;
  label: string;
  onClick: (e: MouseEvent) => void;
  type: "red" | "yellow" | "sky" | "grey";
  icon: LucideIcon;
}) => {
  const colorMap = {
    red: "border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50 disabled:hover:bg-red-50",
    yellow:
      "border-yellow-400 text-yellow-700 hover:text-yellow-700 hover:bg-yellow-50 disabled:hover:bg-yellow-50",
    sky: "border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50 disabled:hover:bg-sky-50",
    grey: "border-gray-400 text-gray-700 hover:text-gray-700 hover:bg-gray-50 disabled:hover:bg-gray-50",
  };

  return (
    <TooltipProviderPage value={label}>
      <Button
        className={cn(
          "items-center p-0 w-9 disabled:opacity-100 disabled:pointer-events-auto disabled:cursor-not-allowed",
          colorMap[type],
        )}
        disabled={isLoading}
        variant={"outline"}
        type="button"
        onClick={onClick}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Icon className="w-4 h-4" />
        )}
      </Button>
    </TooltipProviderPage>
  );
};
export const columnProductDisplay = ({
  metaPageProduct,
  isLoading,
  setProductId,
  setIsOpen,
  setIsOpenDamaged,
  setDamagedProductId,
  setDamagedBarcode,
}: any): ColumnDef<any>[] => [
  {
    header: () => <div className="text-center">No</div>,
    id: "id",
    cell: ({ row }) => (
      <div className="text-center tabular-nums">
        {(metaPageProduct.from + row.index + 1).toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "barcode",
    header: "Barcode",
    cell: ({ row }) => row.original.barcode ?? "-",
  },
  {
    accessorKey: "name",
    header: () => <div className="text-center">Product Name</div>,
    cell: ({ row }) => (
      <div className="max-w-75 break-all">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "name_category",
    header: "Category",
    cell: ({ row }) => row.original.name_category ?? "-",
  },
  {
    accessorKey: "display_price",
    header: "Price",
    cell: ({ row }) => (
      <div className="tabular-nums">
        {formatRupiah(row.original.display_price)}
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Input Date",
    cell: ({ row }) => (
      <div className="tabular-nums">
        {format(new Date(row.original.created_at), "iii, dd MMM yyyy")}
      </div>
    ),
  },
  {
    accessorKey: "new_status_product",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.new_status_product;
      return (
        <Badge
          className={cn(
            "shadow-none font-normal rounded-full capitalize text-black",
            status === "display" && "bg-green-400/80 hover:bg-green-400/80",
            status === "expired" && "bg-red-400/80 hover:bg-red-400/80",
            status === "slow_moving" &&
              "bg-yellow-400/80 hover:bg-yellow-400/80",
          )}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "action",
    header: () => <div className="text-center">Action</div>,
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      return (
        <div className="flex justify-center">
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-9 h-9 p-0",
                  open ? "text-blue-600 bg-blue-50" : "text-muted-foreground",
                )}
              >
                <MoreHorizontal className="size-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="center" className="w-40">
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen("detail");
                  setProductId(row.original.id);
                }}
                className="flex items-center gap-2 text-yellow-700 focus:text-yellow-700"
                disabled={isLoading}
              >
                <ReceiptText className="size-4" />
                Detail
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  setDamagedProductId(row.original.id);
                  setDamagedBarcode(row.original.barcode ?? "-");
                  setIsOpenDamaged(true);
                }}
                className="flex items-center gap-2 text-red-700 focus:text-red-700"
                disabled={isLoading}
              >
                <Shield className="size-4" />
                Damaged
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export const columnFilteredProductDisplay = ({
  metaPage,
  isLoading,
  handleRemoveFilter,
}: any): ColumnDef<any>[] => [
  {
    header: () => <div className="text-center">No</div>,
    id: "id",
    cell: ({ row }) => (
      <div className="text-center tabular-nums">
        {(metaPage.from + row.index).toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "barcode",
    header: "Barcode",
    cell: ({ row }) => row.original.barcode ?? "-",
  },
  {
    accessorKey: "name",
    header: "Product Name",
    cell: ({ row }) => (
      <div className="max-w-125 break-all">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "action",
    header: () => <div className="text-center">Action</div>,
    cell: ({ row }) => (
      <div className="flex gap-4 justify-center items-center">
        <ButtonAction
          label="Delete"
          onClick={(e) => {
            e.preventDefault();
            handleRemoveFilter(row.original.id);
          }}
          isLoading={isLoading}
          icon={Trash2}
          type="grey"
        />
      </div>
    ),
  },
];

export const columnRackDisplay = ({
  metaPage,
  setSelectedBarcode,
  setSelectedNameRack,
  setSelectedTotalProduct,
  setBarcodeOpen,
}: any): ColumnDef<any>[] => [
  {
    header: () => <div className="text-center">No</div>,
    id: "id",
    cell: ({ row }) => (
      <div className="text-center tabular-nums">
        {(metaPage.from + row.index).toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "new_barcode_product||old_barcode_product",
    header: "Barcode",
    cell: ({ row }) => row.original.barcode ?? "-",
  },
  {
    accessorKey: "name",
    header: "Name Rack",
    cell: ({ row }) => (
      <div className="max-w-75 break-all">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "total_data",
    header: "Total Data",
    cell: ({ row }) => row.original.total_data ?? "-",
  },
  {
    accessorKey: "total_new_price_product",
    header: "New Price",
    cell: ({ row }) => (
      <div className="tabular-nums">
        {formatRupiah(row.original.total_new_price_product ?? 0)}
      </div>
    ),
  },
  {
    accessorKey: "action",
    header: () => <div className="text-center">Action</div>,
    cell: ({ row }) => {
      const [open, setOpen] = React.useState(false);

      return (
        <div className="flex justify-center">
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-9 h-9 p-0",
                  open ? "text-blue-600 bg-blue-50" : "text-muted-foreground",
                )}
              >
                <MoreHorizontal className="size-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="center" className="w-44">
              {/* Detail */}
              <DropdownMenuItem asChild>
                <Link
                  href={`/inventory/product/rack/details/${row.original.id}`}
                  className="flex items-center gap-2 text-sky-700 focus:text-sky-700"
                >
                  <ReceiptText className="size-4" />
                  Detail
                </Link>
              </DropdownMenuItem>
              {/* Print QR */}
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedBarcode(row.original.barcode);
                  setSelectedNameRack(row.original.name);
                  setSelectedTotalProduct(row.original.total_data);
                  setBarcodeOpen(true);
                }}
                className="flex items-center gap-2 text-sky-700 focus:text-sky-700"
              >
                <Printer className="size-4" />
                Print QR
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
