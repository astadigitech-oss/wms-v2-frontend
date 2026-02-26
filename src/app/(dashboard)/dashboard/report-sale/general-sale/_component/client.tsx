/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
import { formatRupiah } from "@/lib/utils";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { ColumnDef } from "@tanstack/react-table";
import {
    Search,
    ChevronDown,
    LayoutGrid,
    List,
    ReceiptTextIcon,
    StickyNote,
    RefreshCw,
} from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

// ─── Dummy monthly chart data ─────────────────────────────────────────────────
const monthlyData = [
    { month: "JAN", value: 14000000 },
    { month: "FEB", value: 45000000 },
    { month: "MAR", value: 22000000 },
    { month: "APR", value: 36000000 },
    { month: "MAY", value: 16000000 },
    { month: "JUN", value: 28000000 },
    { month: "JUL", value: 20000000 },
    { month: "AUG", value: 30282000 },
    { month: "SEP", value: 35000000 },
    { month: "OCT", value: 38000000 },
    { month: "NOV", value: 40000000 },
    { month: "DEC", value: 50000000 },
];

// ─── Dummy Top 10 Buyers ──────────────────────────────────────────────────────
const top10Buyers = [
    { no: 1, name: "AFRA KHAERANI", point: 20834 },
    { no: 2, name: "APFIRDAUS", point: 18422 },
    { no: 3, name: "NENENG QURNIAWATI", point: 13658 },
    { no: 4, name: "NUR MAILINDA", point: 13125 },
    { no: 5, name: "FITRI YANI", point: 12884 },
    { no: 6, name: "SUMARSONO", point: 11628 },
    { no: 7, name: "VISCA NAVILLA", point: 11391 },
    { no: 8, name: "SHELY GUMAY", point: 10688 },
    { no: 9, name: "ELAH NURLELA", point: 9001 },
    { no: 10, name: "DINI ARYANTI", point: 7236 },
];

// ─── Dummy Sale List ──────────────────────────────────────────────────────────
const dummySales = [
    { no: 1, code: "LQQSLE01961", buyer: "RISKA OKTAVIA HIDAYAT", price: 36454036 },
    { no: 2, code: "LQQSLE01962", buyer: "DONI JAKA PERMANA", price: 37484440 },
    { no: 3, code: "LQQSLE01964", buyer: "NENENG QURNIAWATI", price: 11326239 },
    { no: 4, code: "LQQSLE01965", buyer: "WISESA", price: 80923775 },
    { no: 5, code: "LQQSLE01966", buyer: "SUMARSONG", price: 3746696 },
    { no: 6, code: "LQQSLE01967", buyer: "HERLIZA NOFRYANTI", price: 4278900 },
    { no: 7, code: "LQQSLE01969", buyer: "SITI WARYUNI", price: 30062852 },
    { no: 8, code: "LQQSLE01970", buyer: "JOE CAHYO", price: 9952196 },
    { no: 9, code: "LQQSLE01971", buyer: "DIMAS ANGGI", price: 12520983 },
    { no: 10, code: "LQQSLE01972", buyer: "SURYA ADITIA HASUDUNGAN", price: 90306081 },
];

// ─── Custom Tooltip Chart ─────────────────────────────────────────────────────
const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm">
                <p className="font-semibold text-gray-700 text-xs">{label}</p>
                <p className="font-medium text-xs text-gray-500">Sale Price</p>
                <p className="text-blue-600 font-bold text-sm">
                    {formatRupiah(payload[0].value)}
                </p>
            </div>
        );
    }
    return null;
};

const CustomCursor = ({ points, height }: any) => {
    if (!points || points.length === 0) return null;
    const { x } = points[0];
    return (
        <line
            x1={x}
            y1={0}
            x2={x}
            y2={height}
            stroke="#3b82f6"
            strokeWidth={1.5}
            opacity={0.4}
        />
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const Client = () => {
    const [page, setPage] = useQueryState("p", parseAsInteger.withDefault(1));
    const [metaPage] = useState({
        last: 5,
        from: 1,
        total: 5,
        to: 5,
        perPage: 5,
    });

    const [selectedMonth] = useState("November 2025");
    const [searchSale, setSearchSale] = useState("");

    // ── Columns: Top 10 Buyer ─────────────────────────────────────────────────
    const columnTop10: ColumnDef<any>[] = [
        {
            header: () => <div className="text-center">No</div>,
            id: "no",
            size: 60,
            cell: ({ row }) => (
                <div className="text-center tabular-nums text-gray-500">
                    {row.original?.no}
                </div>
            ),
        },
        {
            accessorKey: "name",
            header: "Buyer Name",
            cell: ({ row }) => (
                <div className="font-medium text-gray-700">
                    {row.original?.name || "-"}
                </div>
            ),
        },
        {
            accessorKey: "point",
            header: () => <div className="text-center">Total Point</div>,
            size: 140,
            cell: ({ row }) => (
                <div className="text-center tabular-nums text-gray-700">
                    {row.original?.point?.toLocaleString("id-ID") || 0}
                </div>
            ),
        },
    ];

    // ── Columns: Sale List ────────────────────────────────────────────────────
    const columnSaleList: ColumnDef<any>[] = [
        {
            header: () => <div className="text-center">No</div>,
            id: "id",
            size: 60,
            cell: ({ row }) => (
                <div className="text-center tabular-nums text-gray-500">
                    {(metaPage.from + row.index).toLocaleString()}
                </div>
            ),
        },
        {
            accessorKey: "code",
            header: "Document Code",
            size: 160,
            cell: ({ row }) => (
                <div className="text-blue-600 font-medium break-all">
                    {row.original?.code || "-"}
                </div>
            ),
        },
        {
            accessorKey: "buyer",
            header: "Buyer Name",
            cell: ({ row }) => (
                <div className="break-all text-gray-700">
                    {row.original?.buyer || "-"}
                </div>
            ),
        },
        {
            accessorKey: "price",
            header: "Sale Price",
            size: 160,
            cell: ({ row }) => (
                <div className="tabular-nums text-gray-700">
                    {formatRupiah(row.original?.price || 0)}
                </div>
            ),
        },
        {
            accessorKey: "action",
            header: () => <div className="text-center">Action</div>,
            size: 120,
            cell: () => (
                <div className="flex gap-2 justify-center items-center">
                    <TooltipProviderPage value={<p>Detail</p>}>
                        <Button
                            className="items-center gap-1 px-2.5 flex-none h-7 text-xs border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                            variant={"outline"}
                        >
                            <ReceiptTextIcon className="w-3 h-3" />
                        </Button>
                    </TooltipProviderPage>
                </div>
            ),
        },
    ];

    const filteredSales = dummySales.filter(
        (s) =>
            s.buyer.toLowerCase().includes(searchSale.toLowerCase()) ||
            s.code.toLowerCase().includes(searchSale.toLowerCase())
    );

    const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

    return (
        <div className="flex flex-col bg-gray-50 w-full px-4 py-4 gap-4">
            {/* Breadcrumb */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>Dashboard</BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>Report Sale</BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>General Sale</BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* ── CHART CARD ─────────────────────────────────────────────────── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                            Report
                        </p>
                        <h2 className="text-lg font-bold text-gray-800">General Sale</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            className="h-8 text-sm border-gray-300 text-gray-700 hover:bg-gray-50 gap-1.5"
                        >
                            {selectedMonth}
                        </Button>
                        <Button
                            variant="outline"
                            className="items-center flex-none blue border-sky-400/80 text-white hover:text-white disabled:opacity-100 gap-1.5"
                        >
                            Change Date
                            <ChevronDown className="w-3.5 h-3.5" />
                        </Button>
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

                <div className="w-full h-64 mt-6 ml-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={monthlyData}
                            margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="saleGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                stroke="#d1d5db"
                                strokeWidth={0.5}
                                vertical={false}
                            />
                            <XAxis
                                dataKey="month"
                                padding={{ left: 20, right: 20 }}
                                tickMargin={10}
                                tick={{ fontSize: 11, fill: "#9ca3af" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                orientation="right"
                                width={55}
                                tickMargin={10}
                                tickFormatter={(v) => (`${v / 1000000}JT`)}
                                tick={{ fontSize: 11, fill: "#9ca3af" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip content={<CustomChartTooltip />} cursor={<CustomCursor />} />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#3b82f6"
                                strokeWidth={2.5}
                                fill="url(#saleGradient)"
                                dot={false}
                                activeDot={{
                                    r: 5,
                                    fill: "#3b82f6",
                                    strokeWidth: 2,
                                    stroke: "#fff",
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ── TOP 10 BUYER ───────────────────────────────────────────────── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-5">
                <h3 className="text-base font-bold text-gray-800 mb-4">Top 10 Buyer</h3>
                <DataTable columns={columnTop10} data={top10Buyers} />
            </div>

            {/* ── SALE LIST ──────────────────────────────────────────────────── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-5">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-40 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <Input
                            className="pl-8 h-9 text-sm border-sky-400/80 focus-visible:ring-sky-400"
                            placeholder="Search..."
                            value={searchSale}
                            onChange={(e) => setSearchSale(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center mr-4 border border-sky-400/80 rounded-md overflow-hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setViewMode("list")}
                                className={`h-9 w-9 rounded-none transition-colors ${viewMode === "list"
                                    ? "bg-sky-500 text-white hover:bg-sky-500 hover:text-white"
                                    : "bg-white text-gray-500 hover:bg-gray-50"
                                    }`}
                            >
                                <List className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setViewMode("grid")}
                                className={`h-9 w-9 rounded-none transition-colors ${viewMode === "grid"
                                    ? "bg-sky-500 text-white hover:bg-sky-500 hover:text-white"
                                    : "bg-white text-gray-500 hover:bg-gray-50"
                                    }`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </Button>
                        </div>
                        <Button
                            variant="outline"
                            className="items-center mr-4 flex-none h-9 w-38 blue border-sky-400/80 text-white hover:text-white disabled:opacity-100 disabled:border-sky-400/80 disabled:pointer-events-auto disabled:cursor-not-allowed"
                        >
                            <StickyNote className="w-3.5 h-3.5" />
                            Export Year Data
                        </Button>

                        <Button
                            variant="outline"
                            className="items-center flex-none h-9 w-32 blue border-sky-400/80 text-white hover:text-white disabled:opacity-100 disabled:border-sky-400/80 disabled:pointer-events-auto disabled:cursor-not-allowed"
                        >
                            <StickyNote className="w-3.5 h-3.5" />
                            Export Data
                        </Button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="flex flex-col w-full gap-4">
                    <DataTable
                        columns={columnSaleList}
                        data={[...filteredSales]}
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