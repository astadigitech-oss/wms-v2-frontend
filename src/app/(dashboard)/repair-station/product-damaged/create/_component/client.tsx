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
// import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/use-debounce";
import { cn, formatRupiah, setPaginate } from "@/lib/utils";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowLeft, CirclePlus, RefreshCw, ShieldAlert, Trash2 } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const Client = () => {
    const router = useRouter();
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

    const { data, isSuccess, refetch, isRefetching } = useGetListBundle({ p: page, q: searchValue });

    useEffect(() => {
        setPaginate({
            isSuccess,
            data,
            dataPaginate: data?.data.data.resource,
            setPage,
            setMetaPage,
        });
    }, [data]);

    // Summary data (replace with real API data as needed)
    const docId = "0007/DMG/02/2026";
    const totalProduct = 0;
    const totalOldPrice = 0;
    const totalNewPrice = 0;
    const status = "Proses";

    const dummyData = [
        {
            id: "1",
            barcode: "GRO25081800030",
            product_name: "Color Sampel",
            source: "Contoh",
            price: 0,
            status_so: "Contoh",
        },
    ];

    const columnListDamaged: ColumnDef<any>[] = [
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
            size: 170,
            cell: ({ row }) => (
                <div className="break-all">{row.original?.barcode || "-"}</div>
            ),
        },
        {
            accessorKey: "product_name",
            header: "Product Name",
            size: 200,
            cell: ({ row }) => (
                <div className="break-all">{row.original?.product_name || "-"}</div>
            ),
        },
        {
            accessorKey: "source",
            header: "Source",
            size: 120,
            cell: ({ row }) => (
                <div className="break-all">{row.original?.source || "-"}</div>
            ),
        },
        {
            accessorKey: "price",
            header: "Price",
            size: 130,
            cell: ({ row }) => (
                <div className="break-all">{formatRupiah(row.original?.price ?? 0)}</div>
            ),
        },
        {
            accessorKey: "status_so",
            header: "Status SO",
            size: 120,
            cell: ({ row }) => (
                <div>{row.original?.status_so || "-"}</div>
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
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                            </div>
                        }
                    >
                        <Button
                            variant="outline"
                            className={cn(
                                "w-9 h-9 px-0 flex items-center justify-center",
                                "border-[#B0BAC9] text-[#B0BAC9]",
                                "hover:bg-red-600 hover:text-white hover:border-red-600",
                                "rounded-full transition-all duration-200",
                                "disabled:hover:bg-transparent",
                            )}
                        >
                            <Trash2 className="w-4 h-4" />
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
                    <BreadcrumbItem>Repair Station</BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/repair-station/product-damaged">
                            List Product Damaged
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>Create Damaged</BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header Card */}
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3">
                <div className="flex items-center gap-3 w-full">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full border-sky-400 text-sky-500 hover:bg-sky-50 hover:text-sky-600 w-9 h-9 flex-none"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-2 bg-sky-500 text-sky-100 px-3 py-2.5 rounded-full border border-sky-300">
                        <ShieldAlert className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-xl">Create Damaged</span>
                </div>
            </div>

            {/* Info Card */}
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-4 gap-4 flex-col">
                {/* Doc ID */}
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <ShieldAlert className="w-4 h-4 text-gray-400" />
                    <span>{docId}</span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 py-2">
                    <div className="flex flex-col gap-0.5 py-2">
                        <span className="text-xs text-gray-500">Total Product</span>
                        <span className="text-sm font-semibold text-gray-900">{totalProduct}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 py-2">
                        <span className="text-xs text-gray-500">Total Old Price</span>
                        <span className="text-sm font-semibold text-gray-900">{formatRupiah(totalOldPrice)}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 py-2">
                        <span className="text-xs text-gray-500">Status</span>
                        <span className="text-sm font-semibold text-gray-900">
                            <span className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200 font-semibold text-xs py-0.5 rounded-full">
                                {status}
                            </span>
                        </span>
                    </div>
                    <div className="flex flex-col gap-0.5 py-2">
                        <span className="text-xs text-gray-500">Total New Price</span>
                        <span className="text-sm font-semibold text-gray-900">{formatRupiah(totalNewPrice)}</span>
                    </div>
                </div>

                {/* Create Button */}
                <Button className="w-full h-10 bg-sky-500 hover:bg-sky-600 text-white font-semibold gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    Create
                </Button>
            </div>

            {/* Table Card */}
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-4 flex-col">
                {/* Toolbar: Finish + Add Product */}
                <div className="flex items-center justify-end gap-2">
                    <Button
                        className="h-9 px-5 bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm"
                    >
                        Finish
                    </Button>
                    <Button
                        className="h-9 px-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm gap-1.5"
                    >
                        <CirclePlus className="w-4 h-4" />
                        Add Product
                    </Button>
                </div>

                {/* Search Row */}
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search..."
                        autoFocus
                        className="h-9 w-2/5 rounded-md border border-sky-400/80 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                    <TooltipProviderPage value={"Reload Data"}>
                        <Button
                            onClick={() => refetch()}
                            className="items-center w-9 px-0 flex-none h-9 border-sky-400 text-black hover:bg-sky-50"
                            variant={"outline"}
                        >
                            <RefreshCw
                                className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`}
                            />
                        </Button>
                    </TooltipProviderPage>
                </div>

                {/* Table */}
                <div className="flex flex-col w-full gap-4">
                    <DataTable
                        columns={columnListDamaged}
                        data={[...dummyData]}
                    />
                    <Pagination
                        pagination={{ ...metaPage, current: page }}
                        setPagination={setPage}
                    />
                </div>
            </div>
        </div>
    );
};