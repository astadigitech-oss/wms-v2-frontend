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
import { formatRupiah, cn, setPaginate } from "@/lib/utils";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { ColumnDef } from "@tanstack/react-table";
// import { format } from "date-fns";
import { Box, Calendar, ChevronDown, RefreshCw, CircleDollarSign, List, LayoutGrid, StickyNote } from "lucide-react";

import {
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Bar,
} from "recharts";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";
// import { Separator } from "@/components/ui/separator";



// Example data for 35 products (P1-P35)
const productChartData = [
    { code: 'P1', qty: 56, value: 120023448 },
    { code: 'P2', qty: 70, value: 100000000 },
    { code: 'P3', qty: 12, value: 20000000 },
    { code: 'P4', qty: 2, value: 5000000 },
    { code: 'P5', qty: 14, value: 8000000 },
    { code: 'P6', qty: 10, value: 4000000 },
    { code: 'P7', qty: 68, value: 90000000 },
    { code: 'P8', qty: 80, value: 110000000 },
    { code: 'P9', qty: 2, value: 3000000 },
    { code: 'P10', qty: 3, value: 2000000 },
    { code: 'P11', qty: 40, value: 35000000 },
    { code: 'P12', qty: 120, value: 120023448 },
    { code: 'P13', qty: 90, value: 90000000 },
    { code: 'P14', qty: 35, value: 20000000 },
    { code: 'P15', qty: 40, value: 35000000 },
    { code: 'P16', qty: 3, value: 2000000 },
    { code: 'P17', qty: 1, value: 1000000 },
    { code: 'P18', qty: 1, value: 1000000 },
    { code: 'P19', qty: 53, value: 40000000 },
    { code: 'P20', qty: 39, value: 30000000 },
    { code: 'P21', qty: 60, value: 50000000 },
    { code: 'P22', qty: 12, value: 8000000 },
    { code: 'P23', qty: 3, value: 2000000 },
    { code: 'P24', qty: 20, value: 10000000 },
    { code: 'P25', qty: 14, value: 8000000 },
    { code: 'P26', qty: 2, value: 3000000 },
    { code: 'P27', qty: 80, value: 110000000 },
    { code: 'P28', qty: 68, value: 90000000 },
    { code: 'P29', qty: 2, value: 3000000 },
    { code: 'P30', qty: 3, value: 2000000 },
    { code: 'P31', qty: 40, value: 35000000 },
    { code: 'P32', qty: 120, value: 120023448 },
    { code: 'P33', qty: 90, value: 90000000 },
    { code: 'P34', qty: 35, value: 20000000 },
    { code: 'P35', qty: 3, value: 2000000 },
];


// Custom Tooltip for Product Chart
const CustomChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const p = payload[0]?.payload;
        return (
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-xs min-w-45">
                <div className="flex justify-between mb-1">
                    <span className="text-gray-500">Detail</span>
                    <span className="font-semibold text-gray-700">{p.code}</span>
                </div>
                <div className="flex justify-between mb-1">
                    <span className="text-gray-500">Qty :</span>
                    <span className="font-semibold text-gray-700">{p.qty}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Value :</span>
                    <span className="font-semibold text-gray-700">{formatRupiah(p.value)}</span>
                </div>
            </div>
        );
    }
    return null;
};

const DATE_RANGES = [
    { range: "Maret 2026" },
    { range: "April 2026" },
];

interface ProgressProps {
    value: number;
    color?: string;
}

interface DateRangeDropdownProps {
    value: string;
    onChange: (val: string) => void;
}

const ProgressBar = ({ value, color = "bg-teal-400" }: ProgressProps) => {
    return (
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
                className={cn("h-full rounded-full", color)}
                style={{ width: `${value}%` }}
            />
        </div>
    );
};

interface ColorCardProps {
    name: string;
    color: string;
    qty: number;
    qtyPercent: number;
    price: number;
    pricePercent: number;
}

interface StorageReportCardProps {
    title: string;
    qty: number;
    price: number;
    qtyPercent: number;
    pricePercent: number;
}

const StorageReportCard = ({
    title,
    qty,
    price,
    qtyPercent,
    pricePercent,
}: StorageReportCardProps) => {
    return (
        <div className="bg-white rounded-xl border p-4 shadow-sm flex flex-col gap-3">
            <h3 className="font-semibold text-sm text-gray-700">{title}</h3>

            {/* Quantity */}
            <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                    <div className="flex items-center gap-1">
                        <Box className="w-3 h-3" />
                        Quantity
                    </div>
                    <div className="flex items-center gap-2">
                        <span>{qty.toLocaleString("id-ID")}</span>
                        <span className="text-blue-500 text-[10px] border px-1.5 rounded-full">
                            {qtyPercent}%
                        </span>
                    </div>
                </div>
                <ProgressBar value={qtyPercent} color="bg-green-500" />
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                    <div className="flex items-center gap-1">
                        <CircleDollarSign className="w-3 h-3" />
                        Price
                    </div>
                    <div className="flex items-center gap-2">
                        <span>{formatRupiah(price)}</span>
                        <span className="text-blue-500 text-[10px] border px-1.5 rounded-full">
                            {pricePercent}%
                        </span>
                    </div>
                </div>
                <ProgressBar value={pricePercent} color="bg-blue-400" />
            </div>
        </div>
    );
};

const ColorCard = ({ name, color, qty, qtyPercent, price, pricePercent }: ColorCardProps) => {
    return (
        <div className="flex flex-col gap-3 w-full min-w-0">
            {/* Label */}
            <span
                className="text-white text-xs px-3 py-1 rounded-md w-fit font-medium"
                style={{ backgroundColor: color }}
            >
                {name}
            </span>

            {/* Quantity */}
            <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-xs text-gray-600 min-w-0">
                    <div className="flex items-center gap-1">
                        <Box className="w-3 h-3" />
                        Quantity
                    </div>

                    <div className="flex items-center gap-2">
                        <span>{qty.toLocaleString("id-ID")}</span>
                        <span className="text-blue-500 text-[10px] border border-blue-400 px-1.5 rounded-full">
                            {qtyPercent}%
                        </span>
                    </div>
                </div>

                <div className=" h-1.5 bg-gray-200 rounded-full">
                    <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${qtyPercent}%` }}
                    />
                </div>
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-xs min-w-0">
                    <div className="flex items-center gap-1">
                        <CircleDollarSign className="w-3 h-3" />
                        Price
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="truncate">{formatRupiah(price)}</span>
                        <span className="text-blue-500 text-[10px] border border-blue-400 px-1.5 rounded-full">
                            {pricePercent}%
                        </span>
                    </div>
                </div>

                <div className=" h-1.5 bg-gray-200 rounded-full">
                    <div
                        className="h-full bg-blue-400 rounded-full"
                        style={{ width: `${pricePercent}%` }}
                    />
                </div>
            </div>
        </div>
    );
};


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



export const Client = () => {
    // Chart legend state and handlers
    // const lastVisibleKey = [...CATEGORIES].reverse().find((c) =>
    //     activeCategories.has(c.key)
    // )?.key;
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
            category_name: "ACC (>500)",
            total_product: 56,
            view_product: 338723,
        },
    ];

    const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

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
            accessorKey: "category_name",
            header: "Category Name",
            size: 150,
            cell: ({ row }) => (
                <div className="break-all">{row.original?.category_name || '-'}</div>
            ),
        },
        {
            accessorKey: "total_product",
            header: "Total Product",
            size: 100,
            cell: ({ row }) => (
                <div className="break-all">{row.original?.total_product || 0}</div>
            ),
        },
        {
            accessorKey: "view_product",
            header: () => <div className="text-center">View Product</div>,
            size: 80,
            cell: ({ row }) => (
                <div className="break-all text-center">{formatRupiah(row.original?.view_product || 0)}</div>
            ),
        },
    ];
    return (
        <div className="flex flex-col bg-gray-100 w-full">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>Dashboard</BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>Storage Report</BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="p-4 bg-gray-100 min-h-screen flex flex-col gap-4">
                {/* TOTAL */}
                <div className="bg-white p-4 rounded-xl shadow-sm border">
                    <h2 className="text-sm font-semibold mb-3">Total All Product</h2>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <Box className="w-5 h-5" />
                                    Quantity
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>{123.223}</span>
                                    <span className="text-blue-500 text-[10px] border px-1.5 rounded-full">
                                        {100}%
                                    </span>
                                </div>
                            </div>
                            <ProgressBar value={100} color="bg-green-500" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <CircleDollarSign className="w-5 h-5" />
                                    Saldo New Price
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>{formatRupiah(11123000)}</span>
                                    <span className="text-blue-500 text-[10px] border px-1.5 rounded-full">
                                        {100}%
                                    </span>
                                </div>
                            </div>
                            <ProgressBar value={100} color="bg-blue-500" />
                        </div>
                    </div>
                </div>

                {/* GRID 2 COL */}
                <div className="grid grid-cols-2 gap-4">
                    <StorageReportCard
                        title="Product Display"
                        qty={9123}
                        price={2432777123}
                        qtyPercent={100}
                        pricePercent={22}
                    />
                    <StorageReportCard
                        title="Product Staging"
                        qty={76453}
                        price={8124212144}
                        qtyPercent={100}
                        pricePercent={72}
                    />
                    <StorageReportCard
                        title="Product Dump"
                        qty={13}
                        price={432777123}
                        qtyPercent={20}
                        pricePercent={22}
                    />
                    <StorageReportCard
                        title="Product Scrap QCD"
                        qty={11}
                        price={124212144}
                        qtyPercent={19}
                        pricePercent={72}
                    />
                    <StorageReportCard
                        title="Product B2B"
                        qty={9123}
                        price={2432777123}
                        qtyPercent={100}
                        pricePercent={22}
                    />
                    <StorageReportCard
                        title="Product SKU"
                        qty={76453}
                        price={8124212144}
                        qtyPercent={100}
                        pricePercent={72}
                    />
                </div>

                {/* COLOR SECTION */}
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h2 className="text-sm font-semibold mb-4">Product Color</h2>

                    <div className="grid grid-cols-4 gap-6 items-start">
                        {[
                            { name: "Biru", color: "#3B82F6" },
                            { name: "Hijau", color: "#22C55E" },
                            { name: "Kuning", color: "#EAB308" },
                            { name: "Merah", color: "#EF4444" },
                        ].map((item, i) => (
                            <div key={i} className="min-w-0">
                                <ColorCard
                                    name={item.name}
                                    color={item.color}
                                    qty={9123}
                                    qtyPercent={100}
                                    price={2777123}
                                    pricePercent={22}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-5">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                        <div className="font-semibold text-lg mb-2">Tag Product SKU</div>
                        <div className="flex items-center gap-4">
                            <DateRangeDropdown
                                value={selectedRange}
                                onChange={(v) => setSelectedRange(v)}
                            />
                            <Button
                                variant="outline"
                                className="items-center flex-none blue border-sky-400/80 text-white hover:text-white disabled:opacity-100 gap-1.5"
                            >
                                Exort By Month & Year
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

                    {/* Chart */}
                    <div className="w-full h-80 bg-white rounded-xl p-6 flex flex-col">
                        <div className="font-semibold text-lg mb-2">Report Product Per-Category</div>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart
                                data={productChartData}
                                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                                barCategoryGap={0.3}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                <XAxis
                                    dataKey="code"
                                    tick={{ fontSize: 12, fill: "#6b7280" }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: "#6b7280" }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={32}
                                />
                                <Tooltip content={<CustomChartTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                                <Bar
                                    dataKey="qty"
                                    fill="#2196f3"
                                    radius={[12, 12, 0, 0]}
                                    maxBarSize={32}
                                    label={{
                                        position: "top",
                                        fill: "#222",
                                        fontSize: 12,
                                        formatter: (value: unknown) => {
                                            const num = Number(value);
                                            return num > 0 ? num : "";
                                        }
                                    }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="font-semibold text-lg mb-2">Report Product Per-Category (Stagging)</div>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart
                                data={productChartData}
                                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                                barCategoryGap={0.3}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                <XAxis
                                    dataKey="code"
                                    tick={{ fontSize: 12, fill: "#6b7280" }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: "#6b7280" }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={32}
                                />
                                <Tooltip content={<CustomChartTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                                <Bar
                                    dataKey="qty"
                                    fill="#2196f3"
                                    radius={[12, 12, 0, 0]}
                                    maxBarSize={32}
                                    label={{
                                        position: "top",
                                        fill: "#222",
                                        fontSize: 12,
                                        formatter: (value: unknown) => {
                                            const num = Number(value);
                                            return num > 0 ? num : "";
                                        }
                                    }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="font-semibold text-lg mb-2">Report Product Dump</div>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart
                                data={productChartData}
                                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                                barCategoryGap={0.3}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                <XAxis
                                    dataKey="code"
                                    tick={{ fontSize: 12, fill: "#6b7280" }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: "#6b7280" }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={32}
                                />
                                <Tooltip content={<CustomChartTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                                <Bar
                                    dataKey="qty"
                                    fill="#2196f3"
                                    radius={[12, 12, 0, 0]}
                                    maxBarSize={32}
                                    label={{
                                        position: "top",
                                        fill: "#222",
                                        fontSize: 12,
                                        formatter: (value: unknown) => {
                                            const num = Number(value);
                                            return num > 0 ? num : "";
                                        }
                                    }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="font-semibold text-lg mb-2">Report Product Srap QCD</div>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart
                                data={productChartData}
                                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                                barCategoryGap={0.3}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                <XAxis
                                    dataKey="code"
                                    tick={{ fontSize: 12, fill: "#6b7280" }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: "#6b7280" }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={32}
                                />
                                <Tooltip content={<CustomChartTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                                <Bar
                                    dataKey="qty"
                                    fill="#2196f3"
                                    radius={[12, 12, 0, 0]}
                                    maxBarSize={32}
                                    label={{
                                        position: "top",
                                        fill: "#222",
                                        fontSize: 12,
                                        formatter: (value: unknown) => {
                                            const num = Number(value);
                                            return num > 0 ? num : "";
                                        }
                                    }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="font-semibold text-lg mb-2">Report Product B2B</div>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart
                                data={productChartData}
                                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                                barCategoryGap={0.3}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                <XAxis
                                    dataKey="code"
                                    tick={{ fontSize: 12, fill: "#6b7280" }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: "#6b7280" }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={32}
                                />
                                <Tooltip content={<CustomChartTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                                <Bar
                                    dataKey="qty"
                                    fill="#2196f3"
                                    radius={[12, 12, 0, 0]}
                                    maxBarSize={32}
                                    label={{
                                        position: "top",
                                        fill: "#222",
                                        fontSize: 12,
                                        formatter: (value: unknown) => {
                                            const num = Number(value);
                                            return num > 0 ? num : "";
                                        }
                                    }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="flex w-full bg-white rounded-xl overflow-hidden shadow px-5 py-3 gap-10 flex-col">
                    <h2 className="text-xl font-bold">List Product Per Category</h2>
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
                                    className="items-center flex-none h-9 w-32 blue border-sky-400/80 text-white hover:text-white disabled:opacity-100 disabled:border-sky-400/80 disabled:pointer-events-auto disabled:cursor-not-allowed"
                                >
                                    <StickyNote className="w-3.5 h-3.5" />
                                    Export Data
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
            </div>
        </div >
    );
};
