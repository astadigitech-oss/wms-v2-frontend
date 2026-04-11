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
import { CheckSquare, RefreshCw } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Props = {
    open: boolean;
    onOpenChange: (val: boolean) => void;
    onSelect?: (row: any, type: "category" | "color") => void;
};

const DialogEditCargo = ({ open, onOpenChange, onSelect }: Props) => {
    const [activeTab, setActiveTab] = useState<"category" | "color">("category");
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

    const dummyDataCategory = [
        {
            category_name: "Touys",
            discount: 50,
            max_price: 10000,
        },
    ];

    const dummyDataColor = [
        {
            color_name: "Red",
            discount: 20,
            max_price: 5000,
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
            accessorKey: "discount",
            header: "Discount",
            cell: ({ row }) => (
                <div>{row.original?.discount ?? 0}</div>
            ),
        },
        {
            accessorKey: "max_price",
            header: "Max Price",
            cell: ({ row }) => (
                <div>{formatRupiah(row.original?.max_price ?? 0)}</div>
            ),
        },
        {
            accessorKey: "action",
            header: () => <div className="text-center">Action</div>,
            size: 80,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <TooltipProviderPage
                        side="bottom"
                        align="start"
                        sideOffset={6}
                        value={
                            <div className="flex items-center gap-2">
                                <CheckSquare className="w-4 h-4" />
                                <span>Select</span>
                            </div>
                        }
                    >
                        <Button
                            variant="outline"
                            className={cn(
                                "w-9 h-9 px-0 flex items-center justify-center",
                                "border-sky-400 text-sky-500",
                                "hover:bg-sky-500 hover:text-white hover:border-sky-500",
                                "rounded-md transition-all duration-200",
                            )}
                            onClick={() => onSelect?.(row.original, "category")}
                        >
                            <CheckSquare className="w-4 h-4" />
                        </Button>
                    </TooltipProviderPage>
                </div>
            ),
        },
    ];

    const columnColor: ColumnDef<any>[] = [
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
            accessorKey: "color_name",
            header: "Color Name",
            cell: ({ row }) => (
                <div className="break-all">{row.original?.color_name || "-"}</div>
            ),
        },
        {
            accessorKey: "discount",
            header: "Discount",
            cell: ({ row }) => (
                <div>{row.original?.discount ?? 0}</div>
            ),
        },
        {
            accessorKey: "max_price",
            header: "Max Price",
            cell: ({ row }) => (
                <div>{formatRupiah(row.original?.max_price ?? 0)}</div>
            ),
        },
        {
            accessorKey: "action",
            header: () => <div className="text-center">Action</div>,
            size: 80,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <TooltipProviderPage
                        side="bottom"
                        align="start"
                        sideOffset={6}
                        value={
                            <div className="flex items-center gap-2">
                                <CheckSquare className="w-4 h-4" />
                                <span>Select</span>
                            </div>
                        }
                    >
                        <Button
                            variant="outline"
                            className={cn(
                                "w-9 h-9 px-0 flex items-center justify-center",
                                "border-sky-400 text-sky-500",
                                "hover:bg-sky-500 hover:text-white hover:border-sky-500",
                                "rounded-md transition-all duration-200",
                            )}
                            onClick={() => onSelect?.(row.original, "color")}
                        >
                            <CheckSquare className="w-4 h-4" />
                        </Button>
                    </TooltipProviderPage>
                </div>
            ),
        },
    ];

    const activeData = activeTab === "category" ? dummyDataCategory : dummyDataColor;
    const activeColumns = activeTab === "category" ? columnCategory : columnColor;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Select Type</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 w-full">
                    {/* Search + Refresh + Tab Buttons */}
                    <div className="flex items-center gap-2 w-full">
                        <Input
                            className="w-2/5 border-gray-300 focus-visible:ring-sky-400"
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

                        <div className="flex ml-auto gap-2">
                            <Button
                                className={cn(
                                    "h-9 px-4 rounded-md font-medium transition-all duration-200",
                                    activeTab === "category"
                                        ? "bg-sky-500 text-white hover:bg-sky-600"
                                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                )}
                                onClick={() => setActiveTab("category")}
                            >
                                Category
                            </Button>
                            <Button
                                className={cn(
                                    "h-9 px-4 rounded-md font-medium transition-all duration-200",
                                    activeTab === "color"
                                        ? "bg-sky-500 text-white hover:bg-sky-600"
                                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                )}
                                onClick={() => setActiveTab("color")}
                            >
                                Color
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <DataTable
                        columns={activeColumns}
                        data={[...activeData]}
                    />

                    <Pagination
                        pagination={{ ...metaPage, current: page }}
                        setPagination={setPage}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DialogEditCargo;