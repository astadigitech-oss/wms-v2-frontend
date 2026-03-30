/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Printer, Monitor } from "lucide-react";

// Simple inline barcode SVG renderer
const BarcodeDisplay = ({ value = "ABC-abc-1234" }: { value?: string }) => {
  // Generate bars once — useMemo prevents calling Math.random on every re-render
  const bars = useMemo(() => {
    const result: { width: number; x: number }[] = [];
    let x = 0;
    for (let i = 0; i < 60; i++) {
      const w = Math.random() > 0.5 ? 2 : 1;
      result.push({ width: w, x });
      x += w + (Math.random() > 0.7 ? 2 : 1);
    }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center gap-1 w-full">
      <svg viewBox={`0 0 120 60`} className="w-full h-16" xmlns="http://www.w3.org/2000/svg">
        {bars.map((bar, i) => (
          <rect
            key={i}
            x={bar.x}
            y={0}
            width={bar.width}
            height={56}
            fill="#111"
          />
        ))}
      </svg>
      <span className="text-xs font-mono tracking-wider text-gray-700 font-medium">
        {value}
      </span>
    </div>
  );
};

interface DialogToDisplayProductProps {
  open: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  onPrint?: () => void;
  isPending?: boolean;
}

const DialogToDisplayProduct = ({
  open,
  onOpenChange,
  onSubmit,
  onPrint,
  isPending = false,
}: DialogToDisplayProductProps) => {
  const [oldData, setOldData] = useState({
    barcode: "",
    nameProduct: "",
    qty: "",
    price: "",
  });

  const [newData, setNewData] = useState({
    barcode: "",
    nameProduct: "",
    qty: "",
    price: "",
    category: "",
  });

  const hargaRetail = 160000;
  const hargaDiscount = 0;

  const formatRp = (val: number) =>
    `Rp ${val.toLocaleString("id-ID")}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-6xl p-0 overflow-hidden rounded-2xl border border-blue-200 shadow-2xl"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        

        {/* Header */}
        <DialogHeader className="px-6 py-4 pt-5 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <DialogTitle className="text-lg font-semibold text-gray-800">
              To Display Product
            </DialogTitle>
            <div className="flex items-center gap-2">
              <span
                style={{
                  backgroundColor: "#FEE2E2",
                  color: "#F25F5F",
                  border: `1.5px solid`,
                  borderRadius: "999px",
                  padding: "3px 14px",
                  fontSize: "13px",
                  fontWeight: 400,
                  display: "inline-block",
                }}
              >
                Abnormal
              </span>
              <span className="text-gray-400">→</span>
              <span
                style={{
                  backgroundColor: "#dcfce7",
                  color: "#16a34a",
                  border: `1.5px solid`,
                  borderRadius: "999px",
                  padding: "3px 14px",
                  fontSize: "13px",
                  fontWeight: 400,
                  display: "inline-block",
                }}
              >
                Lolos
              </span>
            </div>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="flex gap-0 px-6 py-4">
          {/* Old Data Column */}
          <div className="flex-1 pr-4">
            <div className="rounded-xl overflow-hidden border border-gray-200">
              {/* Column Header */}
              <div className="bg-sky-100 px-4 py-3 text-center">
                <span className="text-sm font-bold text-sky-800 tracking-wide">
                  Old Data
                </span>
              </div>

              {/* Fields */}
              <div className="p-4 flex flex-col gap-3 bg-white">
                {/* Barcode */}
                <div className="flex flex-col gap-1">
                  <Label className="text-xs font-medium text-gray-600">Barcode</Label>
                  <Input
                    value={oldData.barcode}
                    onChange={(e) =>
                      setOldData((p) => ({ ...p, barcode: e.target.value }))
                    }
                    className="h-9 text-sm border-gray-200 rounded-lg focus-visible:ring-sky-400 focus-visible:border-sky-400"
                    placeholder=""
                  />
                </div>

                {/* Name Product */}
                <div className="flex flex-col gap-1">
                  <Label className="text-xs font-medium text-gray-600">Name Product</Label>
                  <Input
                    value={oldData.nameProduct}
                    onChange={(e) =>
                      setOldData((p) => ({ ...p, nameProduct: e.target.value }))
                    }
                    className="h-9 text-sm border-gray-200 rounded-lg focus-visible:ring-sky-400 focus-visible:border-sky-400"
                    placeholder=""
                  />
                </div>

                {/* Qty */}
                <div className="flex flex-col gap-1">
                  <Label className="text-xs font-medium text-gray-600">Qty</Label>
                  <Input
                    value={oldData.qty}
                    onChange={(e) =>
                      setOldData((p) => ({ ...p, qty: e.target.value }))
                    }
                    className="h-9 text-sm border-gray-200 rounded-lg focus-visible:ring-sky-400 focus-visible:border-sky-400"
                    placeholder=""
                  />
                </div>

                {/* Price */}
                <div className="flex flex-col gap-1">
                  <Label className="text-xs font-medium text-gray-600">Price</Label>
                  <Input
                    value={oldData.price}
                    onChange={(e) =>
                      setOldData((p) => ({ ...p, price: e.target.value }))
                    }
                    className="h-9 text-sm border-gray-200 rounded-lg focus-visible:ring-sky-400 focus-visible:border-sky-400"
                    placeholder=""
                  />
                </div>
              </div>
            </div>
          </div>

          {/* New Data Column */}
          <div className="flex-1 px-2">
            <div className="rounded-xl overflow-hidden border">
              {/* Column Header */}
              <div className="bg-sky-500 px-4 py-3 text-center">
                <span className="text-sm font-bold text-white tracking-wide">
                  New Data
                </span>
              </div>

              {/* Fields */}
              <div className="p-4 flex flex-col gap-3 bg-white">
                {/* Barcode */}
                <div className="flex flex-col gap-1">
                  <Label className="text-xs font-medium text-gray-600">Barcode</Label>
                  <Input
                    value={newData.barcode}
                    onChange={(e) =>
                      setNewData((p) => ({ ...p, barcode: e.target.value }))
                    }
                    className="h-9 text-sm border-gray-200 rounded-lg focus-visible:ring-teal-400 focus-visible:border-teal-400"
                    placeholder=""
                  />
                </div>

                {/* Name Product */}
                <div className="flex flex-col gap-1">
                  <Label className="text-xs font-medium text-gray-600">Name Product</Label>
                  <Input
                    value={newData.nameProduct}
                    onChange={(e) =>
                      setNewData((p) => ({ ...p, nameProduct: e.target.value }))
                    }
                    className="h-9 text-sm border-gray-200 rounded-lg focus-visible:ring-teal-400 focus-visible:border-teal-400"
                    placeholder=""
                  />
                </div>

                {/* Qty + Price side by side */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs font-medium text-gray-600">Qty</Label>
                    <Input
                      value={newData.qty}
                      onChange={(e) =>
                        setNewData((p) => ({ ...p, qty: e.target.value }))
                      }
                      className="h-9 text-sm border-gray-200 rounded-lg focus-visible:ring-teal-400 focus-visible:border-teal-400"
                      placeholder=""
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs font-medium text-gray-600">Price</Label>
                    <Input
                      value={newData.price}
                      onChange={(e) =>
                        setNewData((p) => ({ ...p, price: e.target.value }))
                      }
                      className="h-9 text-sm border-gray-200 rounded-lg focus-visible:ring-teal-400 focus-visible:border-teal-400"
                      placeholder=""
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1">
                  <Label className="text-xs font-medium text-gray-600">Category</Label>
                  <Input
                    value={newData.category}
                    onChange={(e) =>
                      setNewData((p) => ({ ...p, category: e.target.value }))
                    }
                    className="h-9 text-sm border-gray-200 rounded-lg focus-visible:ring-teal-400 focus-visible:border-teal-400"
                    placeholder=""
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right — Barcode Card */}
          <div className="w-48 pl-4 flex flex-col">
            <div className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col items-center gap-3 h-full">
              {/* Barcode */}
              <BarcodeDisplay value="ABC-abc-1234" />

              {/* Divider */}
              <div className="w-full border-t border-gray-100" />

              {/* Prices */}
              <div className="grid grid-cols-2 gap-4 justify-around mb-2">
                <div className="flex flex-col gap-2">
                  <span className="text-gray-500">Harga Retail</span>
                  <span className="text-gray-500">Harga Discount</span>
                  
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <span className="text-gray-800 font-medium">{formatRp(hargaRetail)}</span>
                  <span className="font-bold text-gray-800">{formatRp(hargaDiscount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 px-6 pb-5">
          <Button
            onClick={() => onSubmit?.({ oldData, newData })}
            disabled={isPending}
            className="flex-1 h-11 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl text-sm gap-2 transition-all"
          >
            <Monitor className="w-4 h-4" />
            To Display
          </Button>
          <Button
            onClick={onPrint}
            className="w-36 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm gap-2 transition-all"
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogToDisplayProduct;