/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetListBundle } from "@/app/(dashboard)/inventory/moving-product/bundle/_api/use-get-list-bundle";
import { DataTable } from "@/components/data-table";
import Pagination from "@/components/pagination";
// import { Badge } from "@/components/ui/badge";
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
import { formatRupiah, setPaginate } from "@/lib/utils";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { ColumnDef } from "@tanstack/react-table";
// import { format } from "date-fns";
import Link from "next/link";
import { MoreHorizontal, Pencil, PlusCircle, ReceiptText, RefreshCw, Settings2, ShoppingCart, Trash2 } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
// import { Separator } from "@/components/ui/separator";
import DialogConfirmDeleteBuyer from "../dialog/dialog-delete";

import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import React from "react";


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
    
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedBuyer, setSelectedBuyer] = useState<any>(null);

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

    const [open, setOpen] = React.useState(false);

    const handleOpenDelete = (buyer: any) => {
        setSelectedBuyer(buyer);
        setOpenDeleteDialog(true);
    };

    const handleDelete = () => {
        console.log("Delete buyer:", selectedBuyer);
        setOpenDeleteDialog(false);
        setSelectedBuyer(null);
    };

    const dummyData = [
        {
            code_document: "DO-001121342",
            nama: "Don",
            qty: 1212,
            old_price: 5000000,
            total_purchase: 6000000,
            type: "online",
            status: "Process",
            status_sale: "Not Sale",
        },
    ];

    const columnListBuyer: ColumnDef<any>[] = [
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
            accessorKey: "code_document",
            header: "Code Document",
            size: 150,
            cell: ({ row }) => (
                <div className="break-all">{row.original?.code_document || '-'}</div>
            ),
        },
        {
            accessorKey: "nama",
            header: "Nama",
            size: 100,
            cell: ({ row }) => (
                <div className="break-all">{row.original?.nama || '-'}</div>
            ),
        },
        {
            accessorKey: "qty",
            header: "QTY",
            size: 100,
            cell: ({ row }) => (
                <div className="break-all">{row.original?.qty || '-'}</div>
            ),
        },
        {
            accessorKey: "old_price",
            header: () => <div className="text-center">Monthly Transaction</div>,
            size: 80,
            cell: ({ row }) => (
                <div className="break-all text-center">{formatRupiah(row.original?.old_price || 0)}</div>
            ),
        },
        {
            accessorKey: "total_purchase",
            header: () => <div className="text-center">Total Purchase</div>,
            size: 80,
            cell: ({ row }) => (
                <div className="break-all text-center">{formatRupiah(row.original?.total_purchase || 0)}</div>
            ),
        },
        {
            accessorKey: "type",
            header: () => <div className="text-center">Type</div>,
            size: 80,
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center">
                        <span
                            style={{
                                backgroundColor: row.original?.type === "online" ? "#dcfce7" : "#fef9c3",
                                color: row.original?.type === "online" ? "#16a34a" : "#ca8a04",
                                border: `1.5px solid ${row.original?.type === "online" ? "#4ade80" : "#facc15"}`,
                                borderRadius: "999px",
                                padding: "3px 14px",
                                fontSize: "13px",
                                fontWeight: 400,
                                display: "inline-block",
                            }}
                        >
                            {row.original?.type === "online" ? "Online" : "Offline"}
                        </span>
                    </div>
                );
            },
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
            accessorKey: "status_sale",
            header: () => <div className="text-center">Status Sale</div>,
            size: 80,
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center">
                        <span
                            style={{
                                backgroundColor: row.original?.status_sale === "Not Sale" ? "#fefefe" : "#0B91FF",
                                color: row.original?.status_sale === "Not Sale" ? "#0B91FF" : "#16a34a",
                                border: `1.5px solid ${row.original?.status_sale === "Not Sale" ? "#0B91FF" : "#4ade80"}`,
                                borderRadius: "999px",
                                padding: "3px 14px",
                                fontSize: "13px",
                                fontWeight: 400,
                                display: "inline-block",
                            }}
                        >
                            {row.original?.status_sale === "Not Sale" ? "Not Sale" : "Sale"}
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
                                    <MoreHorizontal className="size-5" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="center" className="w-40">
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={`/outbound/cargo/edit`}
                                        className="flex items-center gap-2 text-gray-500"
                                    >
                                        <Pencil className="size-4" />
                                        Edit
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={`/outbound/cargo/detail`}
                                        className="flex items-center gap-2 text-gray-500"
                                    >
                                        <ReceiptText className="size-4" />
                                        Detail
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.preventDefault();
                                        console.log("Sale:", row.original);
                                    }}
                                    className="flex items-center gap-2 text-gray-500 focus:text-gray-500"
                                >
                                    <ShoppingCart className="size-4" />
                                    Sale
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleOpenDelete(row.original);
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
                    <BreadcrumbItem>Cargo</BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
                <div>
                    <h2 className="text-xl font-bold">Detail Sale</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {/* Sale Offline */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5">
                        <span className="text-md text-gray-400">Sale Offline</span>
                        <div className="mt-3 space-y-1.5 text-sm">
                            <div className="flex gap-2">
                                <span className=" font-semibold w-24">Old Price</span>
                                <span className="">:</span>
                                <span className="">Rp 5.000.000</span>
                            </div>
                            <div className="flex gap-2">
                                <span className=" font-semibold w-24">New Price</span>
                                <span>:</span>
                                <span className="text-green-500 font-medium">Rp 6.000.000</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-semibold w-24">Qty</span>
                                <span >:</span>
                                <span >1212</span>
                            </div>
                        </div>
                    </div>

                    {/* Sale Online */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5">
                        <span className="text-md text-gray-400">Sale Online</span>
                        <div className="mt-3 space-y-1.5 text-sm">
                            <div className="flex gap-2">
                                <span className="font-semibold w-24">Old Price</span>
                                <span >:</span>
                                <span >Rp 0</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-semibold w-24">New Price</span>
                                <span >:</span>
                                <span className="text-green-500 font-medium">Rp 0</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-semibold w-24">Qty</span>
                                <span >:</span>
                                <span >0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
                <h2 className="text-xl font-bold">List Cargo</h2>
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
                        <div className="flex items-center gap-3 w-full justify-end">
                            <Button
                                className="items-center flex-none h-9 w-48 blue text-white border-sky-400/80  hover:text-white disabled:opacity-100 disabled:border-sky-400/80 disabled:pointer-events-auto disabled:cursor-not-allowed"
                                variant={"outline"}
                            >
                                <Settings2 className={"w-4 h-4"} />
                                Filtered
                            </Button>
                            <Button
                                asChild
                                className="items-center flex-none h-9 w-48 blue border-sky-400/80 text-white hover:text-white disabled:opacity-100 disabled:border-sky-400/80 disabled:pointer-events-auto disabled:cursor-not-allowed"
                                variant={"outline"}
                            >
                                <Link href="/outbound/cargo/create">
                                    <PlusCircle className={"w-4 h-4"} />
                                    Create Cargo
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <DataTable
                        columns={columnListBuyer}
                        data={[...dummyData]}
                    // isLoading={loadingAPK}
                    />
                    <Pagination
                        pagination={{ ...metaPage, current: page }}
                        setPagination={setPage}
                    />
                </div>
            </div>{" "}
            <DialogConfirmDeleteBuyer
                open={openDeleteDialog}
                onOpenChange={() => setOpenDeleteDialog(false)}
                onClose={() => setOpenDeleteDialog(false)}
                onConfirm={handleDelete}
                isPendingDelete={false}
            />
        </div >
    );
};
