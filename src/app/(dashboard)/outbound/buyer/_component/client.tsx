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
import { setPaginate } from "@/lib/utils";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { ColumnDef } from "@tanstack/react-table";
// import { format } from "date-fns";
import Link from "next/link";
import { Calendar, ChevronDown, Pencil, PlusCircle, RefreshCw, Settings2, Trash2 } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";
// import { Separator } from "@/components/ui/separator";
import DialogCreateBuyer from "../dialog/dialog-create-buyer"
import DialogExportBuyer from "../dialog/dialog-export-buyer"
import DialogConfirmDeleteBuyer from "../dialog/dialog-delete";

import { cn } from "@/lib/utils";

const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

interface DropdownSelectProps {
    icon?: React.ReactNode;
    value: string | number;
    options: (string | number)[];
    onChange: (val: string | number) => void;
}

function DropdownSelect({ icon, value, options, onChange }: DropdownSelectProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative inline-block">
            <Button
                variant="outline"
                className="h-8 text-sm border-gray-300 text-gray-700 hover:bg-gray-50 gap-1.5"
                onClick={() => setOpen(!open)}
            >
                {icon}
                {value}
                <ChevronDown className="w-3.5 h-3.5" />
            </Button>
            {open && (
                <div className="absolute top-[calc(100%+6px)] left-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 text-center w-full py-1 overflow-hidden">
                    {options.map((opt) => (
                        <div
                            key={opt}
                            onClick={() => { onChange(opt); setOpen(false); }}
                            className={cn(
                                "px-3.5 py-2 text-sm cursor-pointer transition-colors",
                                opt === value
                                    ? "bg-sky-50 text-sky-500 font-semibold"
                                    : "text-gray-700 hover:bg-gray-50"
                            )}
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export const Client = () => {
    const [dataSearch] = useQueryState("q", { defaultValue: "" });
    const [selectedMonth, setSelectedMonth] = useState("Maret");
    const [selectedYear, setSelectedYear] = useState(2026);

    const years = Array.from({ length: 6 }, (_, i) => 2022 + i);
    const searchValue = useDebounce(dataSearch);
    const [page, setPage] = useQueryState("p", parseAsInteger.withDefault(1));
    const [metaPage, setMetaPage] = useState({
        last: 1, //page terakhir
        from: 1, //data dimulai dari (untuk memulai penomoran tabel)
        total: 1, //total data
        to: 1, //data sampai
        perPage: 1,
    });

    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openExportDialog, setOpenExportDialog] = useState(false);
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

    const handleOpenCreate = () => {
        setOpenCreateDialog(true);
    };
    const handleOpenExport = () => {
        setOpenExportDialog(true);
    }

    const handleCloseDialog = () => {
        setOpenCreateDialog(false);
        setOpenExportDialog(false);
    };

    const handleOpenDelete = (buyer: any) => {
        setSelectedBuyer(buyer);
        setOpenDeleteDialog(true);
    };

    const handleDelete = () => {
        console.log("Delete buyer:", selectedBuyer);
        setOpenDeleteDialog(false);
        setSelectedBuyer(null);
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Create:");
        handleCloseDialog();
    };

    const dummyData = [
        {
            nama_buyer: "Don",
            no_hp: "0812221234",
            address: "jl. Cempaka 123 RT 34 RW 12",
            monthly_transaction: 1,
            total_purchase: 1,
            point: 1,
            rank: "new",
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
            accessorKey: "nama_buyer",
            header: "Nama Buyer",
            size: 150,
            cell: ({ row }) => (
                <div className="break-all">{row.original?.nama_buyer || '-'}</div>
            ),
        },
        {
            accessorKey: "no_hp",
            header: "No Hp",
            size: 100,
            cell: ({ row }) => (
                <div className="break-all">{row.original?.no_hp || '-'}</div>
            ),
        },
        {
            accessorKey: "address",
            header: "Address",
            size: 150,
            cell: ({ row }) => (
                <div className="break-all">{row.original?.address || '-'}</div>
            ),
        },
        {
            accessorKey: "monthly_transaction",
            header: () => <div className="text-center">Monthly Transaction</div>,
            size: 80,
            cell: ({ row }) => (
                <div className="break-all text-center">{row.original?.monthly_transaction || 0}</div>
            ),
        },
        {
            accessorKey: "total_purchase",
            header: () => <div className="text-center">Total Purchase</div>,
            size: 80,
            cell: ({ row }) => (
                <div className="break-all text-center">{row.original?.total_purchase || 0}</div>
            ),
        },
        {
            accessorKey: "point",
            header: () => <div className="text-center">Point</div>,
            size: 80,
            cell: ({ row }) => (
                <div className="break-all text-center">{row.original?.point || 0}</div>
            ),
        },
        {
            accessorKey: "rank",
            header: () => <div className="text-center">Rank</div>,
            size: 80,
            cell: ({ row }) => (
                <div className="break-all text-center">{row.original?.rank || 0}</div>
            ),
        },
        {
            accessorKey: "action",
            header: () => <div className="text-center">Action</div>,
            size: 100,
            cell: ({ row }) => (
                <div className="flex gap-4 justify-center items-center">
                    <TooltipProviderPage
                        side="bottom"
                        align="start"
                        sideOffset={6}
                        value={
                            <div className="flex items-center gap-2">
                                <Pencil className="w-4 h-4" />
                                <span>Edit</span>
                            </div>
                        }
                    >
                        <Link href="/outbound/buyer/edit">
                            <Button
                                asChild
                                variant="outline"
                                className={cn(
                                    "w-9 h-9 px-0 flex items-center justify-center",
                                    "border-[#B0BAC9] text-[#B0BAC9]",
                                    "hover:bg-blue-600 hover:text-white hover:border-blue-600",
                                    "rounded-full transition-all duration-200",
                                    "disabled:hover:bg-transparent",
                                )}
                            >
                                <Pencil className="w-4 h-4" />
                            </Button>
                        </Link>
                    </TooltipProviderPage>

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
                            onClick={() => handleOpenDelete(row.original)}
                            className={cn(
                                "w-9 h-9 px-0 flex items-center justify-center",
                                "border-[#B0BAC9] text-[#B0BAC9]",
                                "hover:bg-[#FF4F52] hover:text-white hover:border-[#FF4F52]",
                                "rounded-full transition-all duration-200",
                            )}
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
                    <BreadcrumbItem>Buyer</BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
                <div>
                    <h2 className="text-xl font-bold">Detail Buyer</h2>
                    <div className="flex items-center justify-end mb-4 flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                            <DropdownSelect
                                icon={<Calendar className="w-3.5 h-3.5" />}
                                value={selectedMonth}
                                options={MONTHS}
                                onChange={(v) => setSelectedMonth(v as string)}
                            />
                            <DropdownSelect
                                icon={<Calendar className="w-3.5 h-3.5" />}
                                value={selectedYear}
                                options={years}
                                onChange={(v) => setSelectedYear(Number(v))}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-5">
                        <div className="flex flex-col gap-0.5 py-2">
                            <span className="text-xs">Total Buyer</span>
                            <span className="text-xl font-bold text-gray-900">20</span>
                        </div>
                        <div className="flex flex-col gap-0.5 py-2">
                            <span className="text-xs">Total Point</span>
                            <span className="text-xl font-bold text-gray-900">1120</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-5">
                        <div className="flex flex-col gap-0.5 py-2">
                            <span className="text-xs">Buyer Active</span>
                            <span className="text-xl font-bold text-gray-900">30</span>
                        </div>
                        <div className="flex flex-col gap-0.5 py-2">
                            <span className="text-xs">New Buyer</span>
                            <span className="text-xl font-bold text-gray-900">20</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-5">
                        <div className="flex flex-col gap-0.5 py-2">
                            <span className="text-xs">Buyer In-Active</span>
                            <span className="text-xl font-bold text-gray-900">10</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
                <h2 className="text-xl font-bold">List Buyer</h2>
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
                                onClick={handleOpenExport}
                                className="items-center w-38 px-0 flex-none h-9 border-sky-400 text-black hover:bg-sky-50"
                                variant={"outline"}
                            >
                                <PlusCircle className={"w-4 h-4"} />
                                Export Data
                            </Button>
                            <Button
                                className="items-center flex-none h-9 w-48 blue text-white border-sky-400/80  hover:text-white disabled:opacity-100 disabled:border-sky-400/80 disabled:pointer-events-auto disabled:cursor-not-allowed"
                                variant={"outline"}
                            >

                                <Settings2 className={"w-4 h-4"} />
                                Filtered
                            </Button>
                            <Button
                                onClick={handleOpenCreate}
                                className="items-center flex-none h-9 w-48 blue border-sky-400/80 text-white hover:text-white disabled:opacity-100 disabled:border-sky-400/80 disabled:pointer-events-auto disabled:cursor-not-allowed"
                                variant={"outline"}
                            >
                                {/* <Link href="/repair-station/migrate-color/list/create"> */}
                                <PlusCircle className={"w-4 h-4"} />
                                Add Buyer
                                {/* </Link> */}
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
            <DialogCreateBuyer
                open={openCreateDialog}
                onClose={() => setOpenCreateDialog(false)}
                onOpenChange={() => setOpenCreateDialog(false)}
                handleCreate={handleCreate}
                isPendingCreate={false}
            />
            <DialogExportBuyer
                open={openExportDialog}
                onClose={() => setOpenExportDialog(false)}
                onOpenChange={() => setOpenExportDialog(false)}
                isPendingCreate={false}
            />
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
