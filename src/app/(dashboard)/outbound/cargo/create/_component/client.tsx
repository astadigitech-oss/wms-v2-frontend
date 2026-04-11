/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    ArrowLeft,
    Calendar,
    ChevronDown,
    Save,
    Box,
    ScanLine,
    Truck,
    Ticket,
    CircleDollarSign,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const STATUS = ["Online", "Offline"];

interface DropdownSelectProps {
    icon?: React.ReactNode;
    value: string | number;
    options: (string | number)[];
    onChange: (val: string | number) => void;
}

function DropdownSelect({
    icon,
    value,
    options,
    onChange,
}: DropdownSelectProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node))
                setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative inline-block">
            <Button
                variant="outline"
                className="h-9 text-sm border-gray-300 text-gray-700 gap-2"
                onClick={() => setOpen(!open)}
            >
                {icon}
                {value}
                <ChevronDown className="w-3.5 h-3.5" />
            </Button>

            {open && (
                <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-white border rounded-xl shadow z-50 text-center py-1">
                    {options.map((opt) => (
                        <div
                            key={opt}
                            onClick={() => {
                                onChange(opt);
                                setOpen(false);
                            }}
                            className={cn(
                                "px-3 py-2 text-sm cursor-pointer",
                                opt === value
                                    ? "bg-sky-50 text-sky-500 font-semibold"
                                    : "hover:bg-gray-50"
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
    const [selectedStatus, setSelectedStatus] = useState("Offline");

    return (
        <div className="flex flex-col bg-gray-100 w-full px-4 py-4 gap-4">
            {/* Breadcrumb */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>Outbound</BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/outbound/cargo">
                            Cargo
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>Create Cargo</BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center justify-between bg-white rounded-md shadow px-5 py-3">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center bg-sky-500 text-white w-9 h-9 rounded-full">
                            <Truck className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-lg">
                            Create Cargo
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 border rounded-md text-sm text-gray-600">
                        <Box className="w-4 h-4" /> 0
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 border rounded-md text-sm text-gray-600">
                        <Ticket className="w-4 h-4" /> Rp 0
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 border rounded-md text-sm text-gray-600">
                        <CircleDollarSign className="w-4 h-4" /> Rp 0
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="flex flex-col bg-white rounded-md shadow px-5 py-5 gap-4">
                <div className="flex items-center gap-2">
                    <DropdownSelect
                        icon={<Calendar className="w-4 h-4" />}
                        value={selectedStatus}
                        options={STATUS}
                        onChange={(v) => setSelectedStatus(v as string)}
                    />

                    {/* <Button variant="outline" className="h-9 px-3"> */}
                        <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 bg-white">
                            <ScanLine className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300">|</span>
                            <span>-</span>
                        </div>
                    {/* </Button> */}
                </div>

                <Button className="w-full h-11 bg-sky-500 hover:bg-sky-600 text-white font-semibold">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                </Button>
            </div>
        </div>
    );
};