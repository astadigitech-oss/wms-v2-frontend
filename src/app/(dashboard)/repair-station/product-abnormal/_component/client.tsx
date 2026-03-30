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
import { cn, formatRupiah, setPaginate } from "@/lib/utils";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { ColumnDef } from "@tanstack/react-table";
// import { format } from "date-fns";
// import Link from "next/link";
import { NotebookTextIcon, RefreshCw, ShoppingBag, } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import DialogCreateDestination from "../dialog/dialog-create-product-abnormal";



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

    const [openDialog, setOpenDialog] = useState(false);

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

    const handleOpenCreate = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const dummyData = [
        {
            barcode: "LQMGT0011",
            product_name: "LQMGT0011",
            category: "Brown",
            source: "display",
            price: 20000,
            date: "Fri, 20 jan 2026",
            status: "display"
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
            size: 100,
            cell: ({ row }) => (
                <div className="break-all">{row.original?.product_name || '-'}</div>
            ),
        },
        {
            accessorKey: "category",
            header: "Category",
            size: 150,
            cell: ({ row }) => (
                <div className="break-all">{row.original?.category || '-'}</div>
            ),
        },
        {
            accessorKey: "source",
            header: "Source",
            size: 150,
            cell: ({ row }) => (
                <div className="break-all">{row.original?.source || '-'}</div>
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
            size: 100,
            cell: ({ row }) => (
                <div className="break-all">{row.original?.date || '-'}</div>
            ),
        },
        {
            accessorKey: "status",
            header: () => <div className="text-center"></div>,
            size: 80,
            maxSize: 80,
            cell: ({ row }) => (
                <div className="flex gap-4 justify-center">
                    <span
                        style={{
                            backgroundColor: row.original?.status === "display" ? "#dcfce7" : "#fef9c3",
                            color: row.original?.status === "display" ? "#16a34a" : "#ca8a04",
                            border: `1.5px solid ${row.original?.status === "display" ? "#4ade80" : "#facc15"}`,
                            borderRadius: "999px",
                            padding: "3px 14px",
                            fontSize: "13px",
                            fontWeight: 400,
                            display: "inline-block",
                        }}
                    >
                        {row.original?.status === "display" ? "Display" : "Pending"}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "action",
            header: () => <div className="text-center">Action</div>,
            size: 100,
            cell: () => (
                <div className="flex gap-4 justify-center items-center">
                    <TooltipProviderPage
                        side="bottom"
                        align="start"
                        sideOffset={6}
                        value={
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4" />
                                <span>Display</span>
                            </div>
                        }
                    >
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
                            <ShoppingBag className="w-4 h-4" />
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
                    <BreadcrumbItem>List Product Abnormal</BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
                <h2 className="text-xl font-bold">List Product Abnormal</h2>
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
                                onClick={handleOpenCreate}
                                className="items-center flex-none h-9 w-40 blue border-sky-400/80 text-white hover:text-white"
                                variant={"outline"}
                            >
                                {/* <Link href="/repair-station/migrate-color/destination/dialog"> */}
                                <NotebookTextIcon className={"w-4 h-4"} />
                                Export Data
                                {/* </Link> */}
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
            <DialogCreateDestination
                open={openDialog}
                onClose={handleCloseDialog}
                onOpenChange={handleCloseDialog}
            />
        </div>
    );
};