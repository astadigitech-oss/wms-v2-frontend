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
import { Calendar, ChevronDown, NotepadText, RefreshCw } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";
// import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";

const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const DATE_RANGES = [
    { range: "18 Mar 2026 – 24 Mar 2026" },
    { range: "11 Mar 2026 – 17 Mar 2026" },
];

interface DateRangeDropdownProps {
    value: string;
    onChange: (val: string) => void;
}

interface DropdownSelectProps {
    icon?: React.ReactNode;
    value: string | number;
    options: (string | number)[];
    onChange: (val: string | number) => void;
}

function DateRangeDropdown({ value, onChange }: DateRangeDropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selected = DATE_RANGES.find((d) => d.range === value) ?? DATE_RANGES[0];

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative inline-block">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1.5 h-9 px-3 border border-gray-300 rounded-md bg-white text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
                <Calendar className="w-3.5 h-3.5 opacity-60" />
                <span>{selected.range}</span>
                <ChevronDown
                    className={cn("w-3 h-3 opacity-50 transition-transform", open && "rotate-180")}
                />
            </button>

            {open && (
                <div className="absolute top-[calc(100%+6px)] w-full left-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-55 p-1.5">
                    {DATE_RANGES.map((item) => (
                        <div
                            key={item.range}
                            onClick={() => { onChange(item.range); setOpen(false); }}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors",
                                item.range === value
                                    ? "bg-blue-50 text-blue-600 font-medium"
                                    : "text-gray-700 hover:bg-gray-50"
                            )}
                        >
                            <span className={cn(
                                "text-xs",
                                item.range === value ? "text-blue-400" : "text-gray-400"
                            )}>
                                {item.range}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
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

    const searchValue = useDebounce(dataSearch);
    const [page, setPage] = useQueryState("p", parseAsInteger.withDefault(1));
    const [metaPage, setMetaPage] = useState({
        last: 1, //page terakhir
        from: 1, //data dimulai dari (untuk memulai penomoran tabel)
        total: 1, //total data
        to: 1, //data sampai
        perPage: 1,
    });

    const [selectedRange, setSelectedRange] = useState("Minggu ini");

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
            date: "Minggu, 12 Maret 2025",
            qty_in: 58,
            qty_out: 58,
            old_price_in: 36454036,
            old_price_out: 36454036,
            new_price_out: 36454036,
            new_price_in: 36454036,
        },
    ];

    const columnListSummaryReport: ColumnDef<any>[] = [
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
            accessorKey: "date",
            header: "Date",
            size: 150,
            cell: ({ row }) => (
                <div className="break-all">{row.original?.date || '-'}</div>
            ),
        },
        {
            accessorKey: "qty_in",
            header: "Qty In",
            size: 100,
            cell: ({ row }) => (
                <div className="break-all">{row.original?.qty_in || 0}</div>
            ),
        },
        {
            accessorKey: "qty_out",
            header: "Qty Out",
            size: 100,
            cell: ({ row }) => (
                <div className="break-all">{row.original?.qty_out || 0}</div>
            ),
        },
        {
            accessorKey: "old_price_in",
            header: () => <div className="text-center">Old Price In</div>,
            size: 80,
            cell: ({ row }) => (
                <div className="break-all text-center">{formatRupiah(row.original?.old_price_in || 0)}</div>
            ),
        },
        {
            accessorKey: "new_price_in",
            header: () => <div className="text-center">New Price In</div>,
            size: 80,
            cell: ({ row }) => (
                <div className="break-all text-center">{formatRupiah(row.original?.new_price_in || 0)}</div>
            ),
        },
        {
            accessorKey: "old_price_out",
            header: () => <div className="text-center">Old Price Out</div>,
            size: 80,
            cell: ({ row }) => (
                <div className="break-all text-center">{formatRupiah(row.original?.old_price_out || 0)}</div>
            ),
        },
        {
            accessorKey: "new_price_out",
            header: () => <div className="text-center">New Price Out</div>,
            size: 80,
            cell: ({ row }) => (
                <div className="break-all text-center">{formatRupiah(row.original?.new_price_out || 0)}</div>
            ),
        },
        {
            accessorKey: "action",
            header: () => <div className="text-center">Action</div>,
            size: 100,
            cell: ({ }) => (
                <div className="flex gap-4 justify-center items-center">
                    <TooltipProviderPage
                        side="bottom"
                        align="start"
                        sideOffset={6}
                        value={
                            <div className="flex items-center gap-2">
                                <NotepadText className="w-4 h-4" />
                                <span>Export</span>
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
                            <NotepadText className="w-4 h-4" />
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
                    <BreadcrumbItem>Dashboard</BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>Summary Report</BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
                <div>
                    <h2 className="text-xl font-bold">Summary Report</h2>
                    <div className="flex items-center justify-end mb-4 flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                            <DropdownSelect
                                icon={<Calendar className="w-3.5 h-3.5" />}
                                value={selectedMonth}
                                options={MONTHS}
                                onChange={(v) => setSelectedMonth(v as string)}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-sky-500 rounded-xl shadow-sm border border-gray-100 px-4 py-4">
                        <div className="flex text-white flex-col gap-0.5 py-2">
                            <span className="text-sm">Saldo New Price Awal</span>
                            <span className="text-xl font-bold">{formatRupiah(0)}</span>
                        </div>
                        <div className="flex gap-2 text-white">
                            <span className="text-xs  w-2">Qty</span>
                            <span className="text-xs">:</span>
                            <span className="text-xs">0</span>
                        </div>
                    </div>
                    <div className="bg-sky-500 rounded-xl shadow-sm border border-gray-100 px-4 py-4">
                        <div className="flex text-white flex-col gap-0.5 py-2">
                            <span className="text-sm">Saldo New Price Akhir</span>
                            <span className="text-xl font-bold">{formatRupiah(11123000)}</span>
                        </div>
                        <div className="flex gap-2 text-white">
                            <span className="text-xs w-2">Qty</span>
                            <span className="text-xs">:</span>
                            <span className="text-xs">6451</span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-5">
                        <div className="flex flex-col gap-0.5 py-2">
                            <span className="text-sm">Qty Masuk</span>
                            <span className="text-xl font-bold text-gray-900">{formatRupiah(0)}</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-5">
                        <div className="flex flex-col gap-0.5 py-2">
                            <span className="text-sm">Qty Keluar</span>
                            <span className="text-xl font-bold text-gray-900">{formatRupiah(0)}</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-5">
                        <div className="flex flex-col gap-0.5 py-2">
                            <span className="text-sm">Price Masuk (New Price)</span>
                            <span className="text-xl font-bold text-gray-900">{formatRupiah(0)}</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-5">
                        <div className="flex flex-col gap-0.5 py-2">
                            <span className="text-sm">Price Keluar (Display Price)</span>
                            <span className="text-xl font-bold text-gray-900">{formatRupiah(0)}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
                <h2 className="text-xl font-bold">List Summary Report</h2>
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
                            <DateRangeDropdown
                                value={selectedRange}
                                onChange={(v) => setSelectedRange(v)}
                            />
                            <Button
                                className="items-center flex-none h-9 w-48 blue text-white border-sky-400/80  hover:text-white disabled:opacity-100 disabled:border-sky-400/80 disabled:pointer-events-auto disabled:cursor-not-allowed"
                                variant={"outline"}
                            >

                                <NotepadText className={"w-4 h-4"} />
                                Export Inbound
                            </Button>
                            <Button
                                className="items-center flex-none h-9 w-48 blue border-sky-400/80 text-white hover:text-white disabled:opacity-100 disabled:border-sky-400/80 disabled:pointer-events-auto disabled:cursor-not-allowed"
                                variant={"outline"}
                            >
                                {/* <Link href="/repair-station/migrate-color/list/create"> */}
                                <NotepadText className={"w-4 h-4"} />
                                Export Outbound
                                {/* </Link> */}
                            </Button>
                        </div>
                    </div>
                    <DataTable
                        columns={columnListSummaryReport}
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
