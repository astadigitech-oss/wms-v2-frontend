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
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/utils";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
// import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { ColumnDef } from "@tanstack/react-table";
import {
    Search,
    ChevronDown,
    LayoutGrid,
    List,
    BadgePercent,
    CircleCheck,
    RefreshCw,
} from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useState, useCallback } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

// ─── Dummy monthly chart data ─────────────────────────────────────────────────
const monthlyData = [
    { month: "JAN", acc: 50, art: 80, aksesori: 60, atk: 30, baby1: 40, baby2: 20, baby3: 15, baby4: 10 },
    { month: "FEB", acc: 80, art: 120, aksesori: 90, atk: 50, baby1: 60, baby2: 35, baby3: 25, baby4: 15 },
    { month: "MAR", acc: 70, art: 100, aksesori: 75, atk: 40, baby1: 50, baby2: 28, baby3: 20, baby4: 12 },
    { month: "APR", acc: 120, art: 180, aksesori: 140, atk: 70, baby1: 90, baby2: 55, baby3: 40, baby4: 25 },
    { month: "MAY", acc: 150, art: 220, aksesori: 170, atk: 85, baby1: 110, baby2: 65, baby3: 50, baby4: 30 },
    { month: "JUN", acc: 130, art: 190, aksesori: 150, atk: 75, baby1: 95, baby2: 58, baby3: 42, baby4: 28 },
    { month: "JUL", acc: 110, art: 160, aksesori: 125, atk: 62, baby1: 80, baby2: 48, baby3: 35, baby4: 22 },
    { month: "AUG", acc: 140, art: 200, aksesori: 155, atk: 78, baby1: 100, baby2: 60, baby3: 45, baby4: 27 },
    { month: "SEP", acc: 160, art: 230, aksesori: 180, atk: 90, baby1: 115, baby2: 68, baby3: 52, baby4: 32 },
    { month: "OCT", acc: 175, art: 250, aksesori: 195, atk: 98, baby1: 125, baby2: 74, baby3: 56, baby4: 35 },
    { month: "NOV", acc: 190, art: 270, aksesori: 210, atk: 105, baby1: 135, baby2: 80, baby3: 60, baby4: 38 },
    { month: "DEC", acc: 200, art: 285, aksesori: 220, atk: 110, baby1: 140, baby2: 85, baby3: 65, baby4: 40 },
];

const CATEGORY_COLORS = [
    "#3b82f6",
    "#93c5fd",
    "#60a5fa",
    "#a78bfa",
    "#c4b5fd",
    "#ddd6fe",
    "#bfdbfe",
    "#e0f2fe",
];

const CATEGORIES = [
    { key: "acc", label: "Acc" },
    { key: "art", label: "Art" },
    { key: "aksesori", label: "Aksesori" },
    { key: "atk", label: "Atk" },
    { key: "baby1", label: "Baby Product" },
    { key: "baby2", label: "Baby Product" },
    { key: "baby3", label: "Baby Product" },
    { key: "baby4", label: "Baby Product" },
];

const ALL_KEYS = new Set(CATEGORIES.map((c) => c.key));

// ─── Dummy Sale List ──────────────────────────────────────────────────────────
const dummySales = [
    { no: 1, categoryName: "ACC (>500)", quantity: 56, displayPrice: 36454036, salePrice: 36454036 },
    { no: 2, categoryName: "ACC (0-499)", quantity: 409, displayPrice: 37484440, salePrice: 37484440 },
    { no: 3, categoryName: "ALAT KESEHATAN", quantity: 55, displayPrice: 11326239, salePrice: 11326239 },
    { no: 4, categoryName: "ART", quantity: 699, displayPrice: 80923775, salePrice: 80923775 },
    { no: 5, categoryName: "ART HV (1000+)", quantity: 9, displayPrice: 3746696, salePrice: 3746696 },
    { no: 6, categoryName: "ASESORIS GADGET (500-999)", quantity: 11, displayPrice: 4278900, salePrice: 4278900 },
    { no: 7, categoryName: "ASESORIS GADGET HV (1000+)", quantity: 14, displayPrice: 30062852, salePrice: 30062852 },
    { no: 8, categoryName: "ASESORIS GADGET LV (1-499)", quantity: 89, displayPrice: 9952196, salePrice: 9952196 },
    { no: 9, categoryName: "ATK", quantity: 167, displayPrice: 12520983, salePrice: 12520983 },
    { no: 10, categoryName: "BABY PRODUCT", quantity: 687, displayPrice: 90306081, salePrice: 90306081 },
];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-xs">
                <p className="font-semibold text-gray-700 mb-1">{label}</p>
                {payload.map((p: any, i: number) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full flex-none" style={{ background: p.fill }} />
                        <span className="text-gray-500">{p.name}:</span>
                        <span className="font-semibold text-gray-700">{p.value}k</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

// ─── Summary Card ─────────────────────────────────────────────────────────────
const SummaryCard = ({
    icon: Icon,
    iconBg,
    iconColor,
    label,
    value,
}: {
    icon: any;
    iconBg: string;
    iconColor: string;
    label: string;
    value: string;
}) => (
    <Card className="flex-1 px-5 py-4 flex items-center gap-4 shadow-none border border-gray-100">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
            <p className="text-xs text-gray-400 font-medium">{label}</p>
            <p className="text-base font-bold text-gray-800 leading-tight">{value}</p>
        </div>
    </Card>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const Client = () => {
    const [page, setPage] = useQueryState("p", parseAsInteger.withDefault(1));
    const [metaPage] = useState({
        last: 5,
        from: 1,
        total: 5,
        to: 5,
        perPage: 3,
    });

    const [searchSale, setSearchSale] = useState("");
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");

    // ── Legend filter state ───────────────────────────────────────────────────
    const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set(ALL_KEYS));

    const isAllActive = activeCategories.size === CATEGORIES.length;

    const toggleCategory = useCallback((key: string) => {
        setActiveCategories((prev) => {
            const next = new Set(prev);
            if (next.has(key)) {
                if (next.size === 1) return prev; // keep at least one
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    }, []);

    const handleSeeAll = useCallback(() => {
        setActiveCategories(new Set(ALL_KEYS));
    }, []);

    // Last visible bar key (for rounded top)
    const lastVisibleKey = [...CATEGORIES].reverse().find((c) =>
        activeCategories.has(c.key)
    )?.key;

    // ── Columns ───────────────────────────────────────────────────────────────
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
            accessorKey: "categoryName",
            header: "Category Name",
            cell: ({ row }) => (
                <div className="font-medium text-gray-700">
                    {row.original?.categoryName || "-"}
                </div>
            ),
        },
        {
            accessorKey: "quantity",
            header: () => <div className="text-center">Quantity</div>,
            size: 110,
            cell: ({ row }) => (
                <div className="text-center tabular-nums text-gray-700">
                    {row.original?.quantity?.toLocaleString("id-ID") || 0}
                </div>
            ),
        },
        {
            accessorKey: "displayPrice",
            header: "Display Price",
            size: 160,
            cell: ({ row }) => (
                <div className="tabular-nums text-gray-700">
                    {formatRupiah(row.original?.displayPrice || 0)}
                </div>
            ),
        },
        {
            accessorKey: "salePrice",
            header: "Sale Price",
            size: 160,
            cell: ({ row }) => (
                <div className="tabular-nums text-gray-700">
                    {formatRupiah(row.original?.salePrice || 0)}
                </div>
            ),
        },
    ];

    const filteredSales = dummySales.filter((s) =>
        s.categoryName.toLowerCase().includes(searchSale.toLowerCase())
    );

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
                    <BreadcrumbItem>Analytic Sale Annual</BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* ── SUMMARY CARDS ───────────────────────────────────────────────── */}
            <div className="flex gap-4 flex-col md:flex-row">
                <SummaryCard
                    icon={LayoutGrid}
                    iconBg="bg-blue-500"
                    iconColor="text-white"
                    label="Total Category"
                    value="2,540"
                />
                <SummaryCard
                    icon={BadgePercent}
                    iconBg="bg-blue-500"
                    iconColor="text-white"
                    label="Display Price"
                    value="Rp 565.123.213"
                />
                <SummaryCard
                    icon={CircleCheck}
                    iconBg="bg-blue-500"
                    iconColor="text-white"
                    label="Sale Price"
                    value="Rp 278.829.123"
                />
            </div>

            {/* ── CHART CARD ─────────────────────────────────────────────────── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-5">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <Button
                        variant="outline"
                        className="items-center flex-none purple text-white hover:text-white disabled:opacity-100 gap-1.5"
                    >
                        Analytic Sale Annualy
                        <ChevronDown className="w-3.5 h-3.5" />
                    </Button>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            className="items-center flex-none blue border-sky-400/80 text-white hover:text-white disabled:opacity-100 gap-1.5"
                        >
                            Tahun 2025
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

                {/* ── Interactive Legend ─────────────────────────────────────── */}
                <div className="flex flex-wrap items-center gap-1.5 mb-4 justify-end">
                    {CATEGORIES.map((cat, i) => {
                        const isActive = activeCategories.has(cat.key);
                        return (
                            <button
                                key={`${cat.key}-${i}`}
                                onClick={() => toggleCategory(cat.key)}
                                title={`Toggle ${cat.label}`}
                                className={`
                                    flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                                    border transition-all duration-150 cursor-pointer select-none
                                    ${isActive
                                        ? "border-blue-300 bg-blue-50 text-blue-700 shadow-sm"
                                        : "border-gray-200 bg-white text-gray-400 hover:border-blue-200 hover:bg-blue-50/40 hover:text-blue-400"
                                    }
                                `}
                            >
                                <span
                                    className="w-2 h-2 rounded-full flex-none transition-all duration-150"
                                    style={{
                                        background: isActive ? CATEGORY_COLORS[i] : "#d1d5db",
                                    }}
                                />
                                {cat.label}
                            </button>
                        );
                    })}

                    {/* See All button */}
                    <button
                        onClick={handleSeeAll}
                        className={`
                            text-xs px-2.5 py-1 rounded-full border font-medium
                            transition-all duration-150 cursor-pointer select-none
                            ${isAllActive
                                ? "border-blue-300 bg-blue-50 text-blue-600 shadow-sm"
                                : "border-gray-200 bg-white text-gray-400 hover:border-blue-200 hover:bg-blue-50/40 hover:text-blue-400"
                            }
                        `}
                    >
                        See All
                    </button>
                </div>

                {/* Chart */}
                <div className="w-full h-60">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={monthlyData}
                            margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
                            barCategoryGap="30%"
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 11, fill: "#9ca3af" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tickFormatter={(v) => `${v}k`}
                                tick={{ fontSize: 11, fill: "#9ca3af" }}
                                axisLine={false}
                                tickLine={false}
                                width={34}
                            />
                            <Tooltip
                                content={<CustomChartTooltip />}
                                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                            />
                            {CATEGORIES.map((cat, i) =>
                                activeCategories.has(cat.key) ? (
                                    <Bar
                                        key={cat.key}
                                        dataKey={cat.key}
                                        name={cat.label}
                                        stackId="a"
                                        fill={CATEGORY_COLORS[i]}
                                        radius={
                                            cat.key === lastVisibleKey
                                                ? [3, 3, 0, 0]
                                                : [0, 0, 0, 0]
                                        }
                                    />
                                ) : null
                            )}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ── LIST PRODUCT PER-CATEGORY ──────────────────────────────────── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-5">
                <h3 className="text-base font-bold text-gray-800 mb-4">List Product Per-Category</h3>

                {/* Toolbar */}
                <div className="flex items-center justify-left mb-4 gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-40 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <Input
                            className="pl-8 h-9 text-sm border-gray-200 focus-visible:ring-sky-400"
                            placeholder="Search..."
                            value={searchSale}
                            onChange={(e) => setSearchSale(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center border border-sky-400/80 rounded-md overflow-hidden">
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
                    </div>
                </div>

                {/* Table */}
                <div className="flex flex-col w-full gap-4">
                    <DataTable columns={columnSaleList} data={[...filteredSales]} />
                    <Pagination
                        pagination={{ ...metaPage, current: page }}
                        setPagination={setPage}
                    />
                </div>
            </div>
        </div>
    );
};