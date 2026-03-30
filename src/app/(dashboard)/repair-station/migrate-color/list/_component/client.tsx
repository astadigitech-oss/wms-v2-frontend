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
import { PlusCircle, RefreshCw, Tv2 } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";



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
            migrate_document: "LQMGT0011",
            date: "28-11-2025",
            qty: 2,
            destination: "Jakarta",
        },
    ];

    const columnListMigrateColor: ColumnDef<any>[] = [
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
            accessorKey: "migrate-document",
            header: "Migrate Document",
            size: 150,
            cell: ({ row }) => (
                <div className="break-all">{row.original?.migrate_document || '-'}</div>
            ),
        },
        {
            accessorKey: "date",
            header: "Date",
            size: 100,
            cell: ({ row }) => (
                <div className="break-all">{row.original?.date || '-'}</div>
            ),
        },
        {
            accessorKey: "qty",
            header: () => <div className="text-center">Qty</div>,
            size: 80,
            cell: ({ row }) => (
                <div className="break-all text-center">{row.original?.qty || 0}</div>
            ),
        },
        {
            accessorKey: "destination",
            header: "destination",
            size: 150,
            cell: ({ row }) => (
                <div className="break-all">{row.original?.destination || '-'}</div>
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
                            <Tv2 className="w-4 h-4" />
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
                    <BreadcrumbItem>Repair Station</BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>List Migrate Color</BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
                <h2 className="text-xl font-bold">Statistic Stock</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">Product Sticker</h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 justify-around mb-2">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-gray-400 tracking-wide font-medium">Total Quantity</p>
                                <p className="text-lg font-bold">22</p>
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                                <p className="text-sm text-gray-400 tracking-wide font-medium">Total Value</p>
                                <p className="text-lg font-bold">{formatRupiah(20000)}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4 justify-around mt-4">
                            <div className="h-8 px-2 flex-none flex items-center text-sm rounded-md justify-center border gap-1 border-sky-500 bg-sky-500">
                                <span className="font-sans font-semibold text-white"> Biru </span>
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                                <p className="text-xs tracking-wide font-medium">2</p>
                                <p className="text-sm text-gray-400">{formatRupiah(2000)}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4 justify-around mt-4">
                            <div className="h-8 px-2 flex-none flex items-center text-sm rounded-md justify-center border gap-1 border-red-500 bg-red-500">
                                <span className="font-sans font-semibold text-white"> Merah </span>
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                                <p className="text-xs  tracking-wide font-medium">20</p>
                                <p className="text-sm text-gray-400">{formatRupiah(18000)}</p>
                            </div>
                        </div>
                        <Separator />
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">BKL Products</h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 justify-around mb-2">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-gray-400 tracking-wide font-medium">Total Quantity</p>
                                <p className="text-lg font-bold">1.700</p>
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                                <p className="text-sm text-gray-400 tracking-wide font-medium">Total Value</p>
                                <p className="text-lg font-bold">{formatRupiah(31032000)}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4 justify-around mt-4">
                            <div className="h-8 px-2 flex-none flex items-center text-sm rounded-md justify-center border gap-1 border-green-500 bg-green-500">
                                <span className="font-sans font-semibold text-white"> Big </span>
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                                <p className="text-xs tracking-wide font-medium">798</p>
                                <p className="text-sm text-gray-400">{formatRupiah(19152000)}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4 justify-around mt-4">
                            <div className="h-8 px-2 flex-none flex items-center text-sm rounded-md justify-center border gap-1 border-yellow-500 bg-yellow-400">
                                <span className="font-sans font-semibold text-white"> Kuning </span>
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                                <p className="text-xs tracking-wide font-medium">8</p>
                                <p className="text-sm text-gray-400">{formatRupiah(96000)}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4 justify-around mt-4">
                            <div className="h-8 px-2 flex-none flex items-center text-sm rounded-md justify-center border gap-1 border-red-500 bg-red-500">
                                <span className="font-sans font-semibold text-white"> Merah </span>
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                                <p className="text-xs tracking-wide font-medium">88</p>
                                <p className="text-sm text-gray-400">{formatRupiah(2112000)}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4 justify-around mt-4">
                            <div className="h-8 px-2 flex-none flex items-center text-sm rounded-md justify-center border gap-1 border-sky-900 bg-sky-500">
                                <span className="font-sans font-semibold text-white"> Small </span>
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                                <p className="text-xs uppercase tracking-wide font-medium">806</p>
                                <p className="text-sm text-gray-400">{formatRupiah(9672000)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">Olsera Stocks</h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 justify-around mb-2">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-gray-400 tracking-wide font-medium">Total Quantity</p>
                                <p className="text-lg font-bold">0</p>
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                                <p className="text-sm text-gray-400 tracking-wide font-medium">Total Value</p>
                                <p className="text-lg font-bold">{formatRupiah(0)}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4 justify-around mt-4">
                            <div className="flex flex-col gap-2">
                                <p className="text-xs tracking-wide font-medium">24K</p>
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                                <p className="text-xs tracking-wide font-medium">0</p>
                                <p className="text-sm text-gray-400">{formatRupiah(0)}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4 justify-around mt-4">
                            <div className="flex flex-col gap-2">
                                <p className="text-xs tracking-wide font-medium">12K</p>
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                                <p className="text-xs tracking-wide font-medium">0</p>
                                <p className="text-sm text-gray-400">{formatRupiah(0)}</p>
                            </div>
                        </div>
                        <Separator/>
                        <div className="grid grid-cols-2 gap-4 justify-around mt-4">
                            <div className="flex flex-col gap-2">
                                <p className="text-xs tracking-wide font-medium">Lainnya</p>
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                                <p className="text-xs tracking-wide font-medium">0</p>
                                <p className="text-sm text-gray-400">{formatRupiah(0)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
                <h2 className="text-xl font-bold">List Migrate Color</h2>
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
                                asChild
                                className="items-center flex-none h-9 w-60 blue border-sky-400/80 text-white hover:text-white disabled:opacity-100 disabled:border-sky-400/80 disabled:pointer-events-auto disabled:cursor-not-allowed"
                                variant={"outline"}
                            >
                                <Link href="/repair-station/migrate-color/list/create">
                                    <PlusCircle className={"w-4 h-4"} />
                                    Add Migrate Color
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <DataTable
                        columns={columnListMigrateColor}
                        data={[...dummyData]}
                    // isLoading={loadingAPK}
                    />
                    <Pagination
                        pagination={{ ...metaPage, current: page }}
                        setPagination={setPage}
                    />
                </div>
            </div>{" "}
        </div >
    );
};
