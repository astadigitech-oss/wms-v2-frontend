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
import { setPaginate } from "@/lib/utils";
import { formatRupiah } from "@/lib/utils";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { ColumnDef } from "@tanstack/react-table";
// import { ca } from "date-fns/locale";
// import { format } from "date-fns";
import { BadgePercent, Box, CircleDollarSign, Package, PlusCircle, RefreshCw, ScanLine, Trash2 } from "lucide-react";
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
            barcode: "LQMGT0012",
            product_name: "Kaos Polos Putih",
            category: "Pakaian",
            qty: 5,
            price: 500000,
        },
    ];

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
            accessorKey: "product_name",
            header: "Product Name",
            size: 200,
            cell: ({ row }) => (
                <div className="break-all">{row.original?.product_name || '-'}</div>
            ),
        },
        {
            accessorKey: "Category",
            header: "Category",
            size: 200,
            cell: ({ row }) => (
                <div className="break-all">{row.original?.category || '-'}</div>
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
            accessorKey: "price",
            header: "Price",
            size: 130,
            cell: ({ row }) => (
                <div className="break-all">{formatRupiah(row.original?.price || 0)}</div>
            ),
        },

        {
            accessorKey: "action",
            header: () => <div className="text-center">Action</div>,
            size: 80,
            cell: () => (
                <div className="flex gap-2 justify-center items-center">
                    <TooltipProviderPage value={<p>Delete</p>}>
                        <Button
                            className="items-center w-8 px-0 flex-none h-8 border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                            variant={"outline"}
                            size="sm"
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
                    <BreadcrumbItem>B2B</BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>Create B2B</BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-6 flex-col">
                <div className="flex flex-col w-full gap-4 p-2">
                    <div className="flex items-center justify-start gap-3">
                        <div className="flex items-center gap-2 bg-sky-500 text-sky-100 px-3 py-2.5 rounded-full border border-sky-300">
                            <ScanLine className="w-5 h-6" />
                        </div>
                        <span className="font-semibold text-xl">bag-14-6BC12</span>
                    </div>
                </div>
            </div>

            {/* Card 2: Bag Row — inputs + Add Bag & Delete Bag */}
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3">
                <div className="flex items-center gap-3 w-full p-2 flex-wrap">
                    {/* Input Qty */}
                    <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 h-10 focus-within:border-sky-400 focus-within:ring-1 focus-within:ring-sky-300 transition-all bg-white">
                        <Package className="w-6 h-6 text-white fill-sky-500 shrink-0" />
                        <input
                            type="number"
                            defaultValue={1}
                            className="w-12 text-sm outline-none text-gray-700 bg-transparent"
                            placeholder="Qty"
                        />
                    </div>

                    {/* Input Harga Diskon */}
                    <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 h-10 focus-within:border-sky-400 focus-within:ring-1 focus-within:ring-sky-300 transition-all bg-white">
                        <BadgePercent className="w-6 h-6 text-white fill-rose-500 shrink-0" />
                        <span className="text-xs text-gray-400 shrink-0">Rp</span>
                        <input
                            type="text"
                            defaultValue="1.000.000"
                            className="w-28 text-sm outline-none text-gray-700 bg-transparent"
                            placeholder="Harga"
                        />
                    </div>

                    {/* Input Harga */}
                    <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 h-10 focus-within:border-sky-400 focus-within:ring-1 focus-within:ring-sky-300 transition-all bg-white">
                        <CircleDollarSign className="w-6 h-6 text-white fill-yellow-500 shrink-0" />
                        <span className="text-xs text-gray-400 shrink-0">Rp</span>
                        <input
                            type="text"
                            defaultValue="900.000"
                            className="w-28 text-sm outline-none text-gray-700 bg-transparent"
                            placeholder="Harga Diskon"
                        />
                    </div>

                    {/* Input Nama Bag */}
                    <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 h-10 focus-within:border-sky-400 focus-within:ring-1 focus-within:ring-sky-300 transition-all bg-white">
                        <Box className="w-6 h-6 text-white fill-emerald-500 shrink-0" />
                        <input
                            type="text"
                            defaultValue="Bag"
                            className="w-20 text-sm outline-none text-gray-700 bg-transparent"
                            placeholder="Nama Bag"
                        />
                    </div>

                    {/* Buttons */}
                    <Button
                        className="items-center h-10 px-5 bg-sky-500 hover:bg-sky-600 text-white"
                    >
                        <Box className="w-4 h-4 mr-2" />
                        Add Bag
                    </Button>
                    <Button
                        className="items-center h-10 px-5 bg-red-500 hover:bg-red-600 text-white"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Bag
                    </Button>
                </div>
            </div>

            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-6 flex-col">
                {/* Add Product Section */}
                <div className="flex flex-col w-full gap-3">
                    <h3 className="text-base font-semibold">Add Product</h3>
                    <div className="flex gap-2 items-end w-full">
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
                        <Button
                            className="items-center h-10 px-6 bg-sky-500 hover:bg-sky-600 text-white"
                        >
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Product
                        </Button>
                    </div>
                </div>
                {/* Table Section */}
                <div className="flex flex-col w-full gap-4">
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
        </div>
    );
};