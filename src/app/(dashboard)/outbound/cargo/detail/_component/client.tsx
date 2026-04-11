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
// import { Input } from "@/components/ui/input";

import { useDebounce } from "@/hooks/use-debounce";
import { cn, formatRupiah, setPaginate } from "@/lib/utils";
// import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowLeft, NotepadText, Printer, RefreshCw, Save, Trash2, Truck} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import React from "react";
import DialogDetailCargo from "../dialog/dialog-detail-cargo";

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

    const dummyData = [
        {
            barcode: "GRO25081800030",
            name_bag: "Contoh",
            total_product: 1,
            price: 6000000,
            status: "Process",
        },
    ];

    const [openDetail, setOpenDetail] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [open, setOpen] = React.useState(false);

    const columnListSale: ColumnDef<any>[] = [
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
            accessorKey: "name_bag",
            header: "Name Bag",
            cell: ({ row }) => (
                <div className="break-all">{row.original?.name_bag || "-"}</div>
            ),
        },
        {
            accessorKey: "total_product",
            header: () => <div className="text-center">Total Product</div>,
            cell: ({ row }) => (
                <div className="text-center">{row.original?.total_product ?? 0}</div>
            ),
        },
        {
            accessorKey: "price",
            header: () => <div className="text-center">Price</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    {formatRupiah(row.original?.price ?? 0)}
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: () => <div className="text-center">Status</div>,
            size: 80,
            cell: ({ row }) => {
                const status = row.original?.status;
                return (
                    <div className="flex justify-center">
                        <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium",
                            status === "Process"
                                ? "bg-sky-500 text-white"
                                : "bg-gray-200 text-gray-600"
                        )}>
                            {status}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: "action",
            header: () => <div className="text-center">Action</div>,
            size: 100,
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center">
                        <DropdownMenu open={open} onOpenChange={setOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-9 h-9 px-0 flex items-center justify-center",
                                        "border-[#B0BAC9] text-[#B0BAC9]",
                                        "hover:bg-blue-600 hover:text-white hover:border-blue-600",
                                        "rounded-full transition-all duration-200",
                                        "disabled:hover:bg-transparent",
                                    )}
                                >
                                    <NotepadText className="size-5" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="center" className="w-40">
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedRow(row.original);
                                        setOpenDetail(true);
                                    }}
                                    className="flex items-center gap-2 text-gray-500"
                                >
                                    <NotepadText className="size-4" />
                                    Detail
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.preventDefault();
                                        console.log("Sale:", row.original);
                                    }}
                                    className="flex items-center gap-2 text-gray-500 focus:text-gray-500"
                                >
                                    <Printer className="size-4" />
                                    Print
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.preventDefault();
                                        // handleOpenDelete(row.original);
                                    }}
                                    className="flex items-center gap-2 text-gray-500 focus:text-gray-500"
                                >
                                    <Trash2 className="size-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
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
                    <BreadcrumbItem>Outbound</BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/outbound/cargo">Cargo</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>Detail Cargo</BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-4 items-center">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => window.history.back()}
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center bg-sky-500 text-white w-9 h-9 rounded-full">
                        <Truck className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-lg">Detail Cargo</span>
                </div>
            </div>

            <div className="flex flex-col bg-white rounded-md shadow px-5 py-5 gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold">Detail Cargo</h3>

                    <Button variant="outline" size="icon">
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    {[
                        { label: "Name Buyer", value: "-" },
                        { label: "Type", value: "Cargo Offline" },
                        { label: "Document Code", value: "023184924192" },
                        { label: "Discount", value: "50%" },
                        { label: "Total Product", value: "1" },
                        { label: "Total Bag", value: "1" },
                        { label: "Total Old Price", value: "Rp 10.000" },
                        { label: "Total New Price", value: "Rp 10.000" },
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col rounded-md overflow-hidden border">
                            <div className="bg-sky-500 text-white text-xs font-semibold px-3 py-1 text-center">
                                {item.label}
                            </div>
                            <div className="text-sm text-center py-2 text-gray-700">
                                {item.value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-6 flex-col">
                {/* Add Product Section */}
                <div className="flex flex-col bg-white rounded-md shadow px-5 py-5 gap-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold">List</h3>

                        <div className="flex gap-2">
                            <Button
                                className="items-center flex-none h-9 w-48 blue text-white border-sky-400/80  hover:text-white disabled:opacity-100 disabled:border-sky-400/80 disabled:pointer-events-auto disabled:cursor-not-allowed"
                                variant={"outline"}
                            >
                                <NotepadText className={"w-4 h-4"} />
                                Export Data
                            </Button>
                            <Button
                                className="items-center flex-none h-9 w-48 blue text-white border-sky-400/80  hover:text-white disabled:opacity-100 disabled:border-sky-400/80 disabled:pointer-events-auto disabled:cursor-not-allowed"
                                variant={"outline"}
                            >
                                <Save className={"w-4 h-4"} />
                                Finish
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <DataTable
                        columns={columnListSale}
                        data={[...dummyData]}
                    />

                    <Pagination
                        pagination={{ ...metaPage, current: page }}
                        setPagination={setPage}
                    />
                </div>
            </div>
            <DialogDetailCargo
                open={openDetail}
                onOpenChange={setOpenDetail}
                data={selectedRow}
            />
        </div>
    );
};