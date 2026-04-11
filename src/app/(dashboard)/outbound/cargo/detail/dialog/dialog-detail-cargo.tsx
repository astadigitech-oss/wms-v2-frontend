/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetListBundle } from "@/app/(dashboard)/inventory/moving-product/bundle/_api/use-get-list-bundle";
import { DataTable } from "@/components/data-table";
import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { cn, formatRupiah, setPaginate } from "@/lib/utils";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { ColumnDef } from "@tanstack/react-table";
import { RefreshCw, Trash2 } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Props = {
    open: boolean;
    onOpenChange: (val: boolean) => void;
    data: any;
};

const DialogDetailCargo = ({ open, onOpenChange, data: propData }: Props) => {
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

    const dummyData = [
        {
            barcode: "23131231",
            product_name: "Mainan",
            category: "Toys",
            qty: 1,
            price: 10000,
        },
    ];

    const dummyDataCategory = [
        {
            category_name: "Touys",
            total: 1,
        },
    ];

    const columnCategory: ColumnDef<any>[] = [
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
            accessorKey: "category_name",
            header: "Category Name",
            cell: ({ row }) => (
                <div className="break-all">{row.original?.category_name || "-"}</div>
            ),
        },
        {
            accessorKey: "total",
            header: "Total",
            cell: ({ row }) => (
                <div className="break-all">{row.original?.total ?? 0}</div>
            ),
        },
    ];

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
                <div className="flex justify-center">
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
                                "border-sky-400 text-sky-500",
                                "hover:bg-red-500 hover:text-white hover:border-red-500",
                                "rounded-full transition-all duration-200",
                            )}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </TooltipProviderPage>
                </div>
            ),
        },
    ];

    // Info bag items
    const infoBag = [
        { label: "Barcode Bag", value: propData?.barcode ?? "1212313" },
        { label: "Name Bag", value: propData?.name_bag ?? "023184924192" },
    ];

    const infoBagDetail = [
        { label: "Status Bag", value: propData?.status ?? "Process" },
        { label: "Total Product", value: propData?.total_product ?? 1 },
        { label: "Price", value: formatRupiah(propData?.price ?? 10000) },
        { label: "Category Bag", value: propData?.category ?? "Toys" },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl">
                <DialogHeader>
                    <DialogTitle>Detail Cargo</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 w-full">
                    {/* Info Bag - 2 kolom atas */}
                    <div className="grid grid-cols-2 gap-3">
                        {infoBag.map((item) => (
                            <div
                                key={item.label}
                                className="rounded-md overflow-hidden border border-gray-200"
                            >
                                <div className="bg-sky-500 text-white text-xs font-medium px-3 py-2 text-center">
                                    {item.label}
                                </div>
                                <div className="bg-white text-sm text-gray-800 px-3 py-2 text-center">
                                    {item.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Info Bag Detail - 4 kolom */}
                    <div className="grid grid-cols-4 gap-3">
                        {infoBagDetail.map((item) => (
                            <div
                                key={item.label}
                                className="rounded-md overflow-hidden border border-gray-200"
                            >
                                <div className="bg-sky-500 text-white text-xs font-medium px-3 py-2 text-center">
                                    {item.label}
                                </div>
                                <div className="bg-white text-sm text-gray-800 px-3 py-2 text-center">
                                    {item.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Category Table */}
                    <div className="flex flex-col gap-3 border border-gray-200 rounded-md px-4 py-4">
                        <div className="font-semibold text-sm">Category</div>
                        <DataTable
                            columns={columnCategory}
                            data={[...dummyDataCategory]}
                        />
                    </div>

                    {/* Product List Table */}
                    <div className="flex flex-col gap-3 border border-gray-200 rounded-md px-4 py-4">
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
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DialogDetailCargo;