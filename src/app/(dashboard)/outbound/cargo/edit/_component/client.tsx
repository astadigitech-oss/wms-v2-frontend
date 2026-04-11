/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetListBundle } from "@/app/(dashboard)/inventory/moving-product/bundle/_api/use-get-list-bundle";
import { DataTable } from "@/components/data-table";
import Pagination from "@/components/pagination";
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
import { cn, formatRupiah, setPaginate } from "@/lib/utils";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { ColumnDef } from "@tanstack/react-table";
import {
    AlertCircle,
    ArrowLeft,
    Box,
    Boxes,
    CircleDollarSign,
    ClipboardList,
    Grid2X2Plus,
    RefreshCw,
    Save,
    ScanLine,
    Ticket,
    Trash2,
    Truck,
} from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import DialogEditCargo from "../dialog/dialog-edit-cargo";

export const Client = () => {
    const [dataSearch] = useQueryState("q", { defaultValue: "" });
    const searchValue = useDebounce(dataSearch);
    const [page, setPage] = useQueryState("p", parseAsInteger.withDefault(1));
    const [metaPage, setMetaPage] = useState({
        last: 1,
        from: 1,
        total: 1,
        to: 1,
        perPage: 1,
    });
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const { data, isSuccess } = useGetListBundle({ p: page, q: searchValue });

    useEffect(() => {
        setPaginate({
            isSuccess,
            data,
            dataPaginate: data?.data.data.resource,
            setPage,
            setMetaPage,
        });
    }, [data]);

    const handleOpenEdit = () => {
        setOpenEditDialog(true);
    };


    const dummyData: any[] = [];

    const columnListProduct: ColumnDef<any>[] = [
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
            accessorKey: "barcode",
            header: "Barcode",
            cell: ({ row }) => (
                <div className="break-all">{row.original?.barcode || "-"}</div>
            ),
        },
        {
            accessorKey: "product_name",
            header: "Product Name",
            cell: ({ row }) => (
                <div className="break-all">{row.original?.product_name || "-"}</div>
            ),
        },
        {
            accessorKey: "category",
            header: "Category",
            cell: ({ row }) => (
                <div className="break-all">{row.original?.category || "-"}</div>
            ),
        },
        {
            accessorKey: "qty",
            header: () => <div className="text-center">Qty</div>,
            size: 80,
            cell: ({ row }) => (
                <div className="text-center">{row.original?.qty ?? 0}</div>
            ),
        },
        {
            accessorKey: "price",
            header: "Price",
            cell: ({ row }) => (
                <div>{formatRupiah(row.original?.price ?? 0)}</div>
            ),
        },
        {
            accessorKey: "action",
            header: () => <div className="text-center">Action</div>,
            size: 80,
            cell: () => (
                <div className="flex gap-2 justify-center items-center">
                    <TooltipProviderPage
                        side="bottom"
                        align="start"
                        sideOffset={6}
                        value={
                            <div className="flex items-center gap-2">
                                <ClipboardList className="w-4 h-4" />
                                <span>Detail</span>
                            </div>
                        }
                    >
                        <Button
                            variant="outline"
                            className={cn(
                                "w-9 h-9 px-0 flex items-center justify-center",
                                "border-[#B0BAC9] text-[#B0BAC9]",
                                "hover:bg-sky-500 hover:text-white hover:border-sky-500",
                                "rounded-full transition-all duration-200",
                                "disabled:hover:bg-transparent",
                            )}
                        >
                            <ClipboardList className="w-4 h-4" />
                        </Button>
                    </TooltipProviderPage>
                </div>
            ),
        },
    ];

    return (
        <div className="flex flex-col bg-gray-100 w-full px-4 py-4 gap-4">
            {/* Breadcrumb */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>Outbound</BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/outbound/cargo">Cargo</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>Update Cargo</BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Card Utama */}
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-5 flex-col gap-5">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-sky-500 hover:text-sky-600 hover:bg-sky-50"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center justify-center bg-sky-500 text-white w-9 h-9 rounded-full">
                        <Truck className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-lg">Update Cargo</span>
                </div>

                {/* Row 1: Kode Cargo & User */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 bg-white">
                        <ScanLine className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">|</span>
                        <span>1-smasd2sad</span>
                    </div>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 bg-white">
                        <Grid2X2Plus className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-400">-</span>
                    </div>
                </div>

                {/* Row 2: Stats & Action Buttons */}
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Total Bag */}
                    <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 bg-white">
                        <Boxes className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">|</span>
                        <span>2</span>
                    </div>
                    {/* Total New Price */}
                    <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 bg-white">
                        <Ticket className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">|</span>
                        <span>Rp 10.000</span>
                    </div>
                    {/* Total Display Price */}
                    <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 bg-white">
                        <CircleDollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">|</span>
                        <span>Rp 10.000</span>
                    </div>
                    {/* Bag Label */}
                    <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 bg-white">
                        <Box className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">|</span>
                        <span>Bag</span>
                    </div>

                    {/* Add Bag */}
                    <Button
                        onClick={handleOpenEdit}
                        className="bg-sky-500 hover:bg-sky-600 text-white gap-2 px-4 h-9 rounded-md">
                        <Box className="w-4 h-4" />
                        Add Bag
                    </Button>

                    {/* Delete Bag */}
                    <Button
                        className="bg-red-500 text-white hover:bg-red-600 gap-2 px-4 h-9 rounded-md"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Bag
                    </Button>
                </div>

                {/* Update Button */}
                <Button className="w-full h-10 bg-sky-500 hover:bg-sky-600 text-white font-semibold gap-2">
                    <Save className="w-4 h-4" />
                    Update
                </Button>
            </div>

            {/* Card List Product */}
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-5 flex-col gap-4">
                {/* Warning Banner */}
                <div className="flex justify-center gap-3 bg-yellow-50 border border-yellow-200 rounded-md px-4 py-3 text-sm text-yellow-700">
                    <AlertCircle className="w-4 h-4 shrink-0 text-yellow-500" />
                    <span>Silahkan buat bag terlebih dahulu sebelum menambah produk!</span>
                </div>

                {/* Search & Refresh */}
                <div className="flex items-center gap-2">
                    <Input
                        className="w-2/5 border-sky-400/80 focus-visible:ring-sky-400"
                        placeholder="Search..."
                        autoFocus
                    />
                    <TooltipProviderPage value={"Reload Data"}>
                        <Button
                            className="items-center w-9 px-0 flex-none h-9 border-sky-400 text-black hover:bg-sky-50"
                            variant={"outline"}
                        >
                            <RefreshCw className="w-4 h-4" />
                        </Button>
                    </TooltipProviderPage>
                </div>

                {/* Table */}
                <DataTable
                    columns={columnListProduct}
                    data={[...dummyData]}
                />

                <Pagination
                    pagination={{ ...metaPage, current: page }}
                    setPagination={setPage}
                />
            </div>
            <DialogEditCargo
                open={openEditDialog}
                onOpenChange={setOpenEditDialog}
                onSelect={(row, type) => {
                    console.log("Selected:", row, type);
                    setOpenEditDialog(false); // auto close setelah pilih
                }}
            />
        </div>
    );
};