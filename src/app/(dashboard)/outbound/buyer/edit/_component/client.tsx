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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "@/hooks/use-debounce";
import { cn, formatRupiah, setPaginate } from "@/lib/utils";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowLeft, ClipboardList, Pencil, RefreshCw, UserCircle2 } from "lucide-react";
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
            code_document: "GRO25081800030",
            qty_product: 12,
            total_purchase: 10000,
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
            accessorKey: "code_document",
            header: "Code Document",
            cell: ({ row }) => (
                <div className="break-all">{row.original?.code_document || "-"}</div>
            ),
        },
        {
            accessorKey: "qty_product",
            header: () => <div className="text-center">Qty Product</div>,
            cell: ({ row }) => (
                <div className="text-center">{row.original?.qty_product ?? 0}</div>
            ),
        },
        {
            accessorKey: "total_purchase",
            header: () => <div className="text-center">Total Purchase</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    {formatRupiah(row.original?.total_purchase ?? 0)}
                </div>
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
                                <span>Delete</span>
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
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>Outbound</BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/outbound/buyer">Buyer</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>Edit Buyer</BreadcrumbItem>
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
                        <UserCircle2 className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-lg">Edit Buyer</span>
                </div>
            </div>

            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-5 flex-col gap-4">
                <h3 className="text-base font-semibold">Data Buyer</h3>

                <div className="grid grid-cols-2 gap-x-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5 mr-2">
                            <Label className="text-sm font-medium text-gray-700">Nama</Label>
                            <Input
                                className="border-gray-300 focus-visible:ring-sky-400"
                                defaultValue="Dono"
                                placeholder="Nama"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5 mr-2">
                            <Label className="text-sm font-medium text-gray-700">Email</Label>
                            <Input
                                className="border-gray-300 focus-visible:ring-sky-400"
                                placeholder="Email"
                                type="email"
                            />
                        </div>
                    </div>

                    {/* Right: Alamat textarea — stretches to match height of left column */}
                    <div className="flex flex-col gap-1.5 ml-2">
                        <Label className="text-sm font-medium text-gray-700">Alamat</Label>
                        <Textarea
                            className="border-gray-300 focus-visible:ring-sky-400 resize-none"
                            style={{ minHeight: "96px", height: "100%" }}
                            placeholder="Alamat"
                        />
                    </div>
                </div>

                {/* Bottom section: No Hp (left) | Rank (right) */}
                <div className="grid grid-cols-2 gap-x-6">
                    <div className="flex flex-col gap-1.5 mr-2">
                        <Label className="text-sm font-medium text-gray-700">No Hp</Label>
                        <Input
                            className="border-gray-300 focus-visible:ring-sky-400"
                            defaultValue="082312312"
                            placeholder="No Hp"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5 ml-2">
                        <Label className="text-sm font-medium text-gray-700">Rank</Label>
                        <Input
                            className="border-gray-300 focus-visible:ring-sky-400"
                            defaultValue="New"
                            placeholder="Rank"
                            readOnly
                        />
                    </div>
                </div>

                {/* Edit Button */}
                <Button className="w-full h-10 bg-sky-500 hover:bg-sky-600 text-white font-semibold">
                    <Pencil className="w-4 h-4" />
                    Edit
                </Button>
            </div>

            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-6 flex-col">
                {/* Add Product Section */}
                <div className="flex flex-col w-full gap-3">
                    <h3 className="text-base font-semibold">List Product Filtered</h3>
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