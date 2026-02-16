/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetListBundle } from "@/app/(dashboard)/inventory/moving-product/bundle/_api/use-get-list-bundle";
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
import { formatRupiah } from "@/lib/utils";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { PenIcon, PlusCircle, RefreshCw, Trash2 } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect, useState } from "react";



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
            barcode: "LQMGT0011",
            buyer: "Tarnished",
            qty: 5,
            price: 500000,
            date: "28-11-2025",
            status: "done",
        },
        {
            barcode: "LQMGT0012",
            buyer: "John Kaisen",
            qty: 8,
            price: 350000,
            date: "29-11-2025",
            status: "pending",
        },
    ];

    const [dateRange] = useState<{
        from: Date;
        to: Date;
    }>({
        from: new Date(2025, 10, 10), // 10 November 2025 (bulan dimulai dari 0)
        to: new Date(2025, 11, 15),   // 15 Desember 2025
    });

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
            size: 150,
            cell: ({ row }) => (
                <div className="break-all">{row.original?.barcode || '-'}</div>
            ),
        },
        {
            accessorKey: "buyer",
            header: "Buyer",
            size: 150,
            cell: ({ row }) => (
                <div className="break-all">{row.original?.buyer || '-'}</div>
            ),
        },
        {
            accessorKey: "qty",
            header: () => <div className="text-center">QTY</div>,
            size: 80,
            cell: ({ row }) => (
                <div className="break-all text-center">{row.original?.qty || 0}</div>
            ),
        },
        {
            accessorKey: "price",
            header: "Price",
            size: 130,
            cell: ({ row }) => (
                <div className="break-all">{formatRupiah(row.original?.price || 0)}</div>
            ),
        },
        {
            accessorKey: "date",
            header: "Date",
            size: 120,
            cell: ({ row }) => (
                <div className="break-all">{row.original?.date || '-'}</div>
            ),
        },
        {
            accessorKey: "status",
            header: () => <div className="text-center">Approve</div>,
            size: 120,
            cell: ({ row }) => (
                <div className="flex gap-4 justify-center">
                    <Badge
                        className={cn(
                            "rounded justify-center text-white font-normal capitalize",
                            row.original?.status === "done"
                                ? "bg-green-400 hover:bg-green-400"
                                : "bg-yellow-400 hover:bg-yellow-400"
                        )}
                    >
                        {row.original?.status === "done" ? "Done" : "Pending"}
                    </Badge>
                </div>
            ),
        },
        {
            accessorKey: "action",
            header: () => <div className="text-center">Action</div>,
            size: 100,
            cell: () => (
                <div className="flex gap-4 justify-center items-center">
                    <TooltipProviderPage value={<p>Detail</p>}>
                        <Button
                            className="items-center w-9 px-0 flex-none h-9 border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                            variant={"outline"}
                        >
                            <PenIcon className="w-4 h-4" />
                        </Button>
                    </TooltipProviderPage>
                    <TooltipProviderPage value={<p>Delete</p>}>
                        <Button
                            className="items-center w-9 px-0 flex-none h-9 border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                            variant={"outline"}
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
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>Outbound</BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>Sale</BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>List Sale</BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
                <h2 className="text-xl font-bold">List Sale</h2>
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
                            <Input
                                className="font w-2/8 border-sky-400/80 focus-visible:ring-sky-400"
                                defaultValue={dateRange?.from ? format(dateRange.from, "dd MMMM yyyy") : ""}
                            />
                            <span> s.d </span>
                            <Input
                                className="w-2/8 border-sky-400/80 focus-visible:ring-sky-400"
                            defaultValue={dateRange?.to ? format(dateRange.to, "dd MMMM yyyy") : ""}
                            />
                            <Button
                                onClick={(e) => {
                                    e.preventDefault();
                                }}
                                className="items-center flex-none h-9 w-24 blue border-sky-400/80 text-white hover:text-white disabled:opacity-100 disabled:border-sky-400/80 disabled:pointer-events-auto disabled:cursor-not-allowed"
                                variant={"outline"}
                            >
                                <PlusCircle className={"w-4 h-4"} />
                                Cashier
                            </Button></div>
                    </div>
                    <DataTable
                        columns={columnListSale}
                        data={[...dummyData]}
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
