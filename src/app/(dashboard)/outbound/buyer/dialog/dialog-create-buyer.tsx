/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import { Plus, Minus } from "lucide-react";

const DialogCreateBuyer = ({
  open,
  onOpenChange,
  onClose,
}: {
  open: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  handleCreate: any;
  isPendingCreate: boolean;
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl">
          <DialogHeader>
            <DialogTitle>{"Created Buyer"}</DialogTitle>
          </DialogHeader>

          <div className="flex gap-0 p-0 h-120">
            {/* Left — Map Placeholder */}
            <div className="w-[46%] flex flex-col gap-2 p-4 border-r border-gray-100 bg-white">

              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  {/* <Search className="w-4 h-4 text-gray-400" /> */}
                </div>

                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search location..."
                  className="pl-9 h-10"
                />
              </div>

              {/* Map Image + Zoom Controls */}
              <div className="flex-1 min-h-0 rounded-lg overflow-hidden border border-dashed border-gray-300 relative">
                <Image
                  src="/images/map_picker_example.webp"
                  alt="map preview"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right — Form */}
            <div className="flex-1 flex flex-col px-6 py-5 border rounded-md gap-4 overflow-y-auto bg-white">
              {/* Nama */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-gray-700">Name</Label>
                <Input
                  className="border-gray-300 focus-visible:ring-sky-400 focus-visible:border-sky-400 rounded-lg"
                  placeholder="Name..."
                />
              </div>

              {/* No. Hp */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-gray-700">No. Hp</Label>
                <Input
                  type="tel"
                  className="border-gray-300 focus-visible:ring-sky-400 focus-visible:border-sky-400 rounded-lg"
                  placeholder="No HP..."
                />
              </div>

              {/* Address */}
              <div className="flex flex-col gap-1.5 flex-1">
                <Label className="text-sm font-medium text-gray-700">Address</Label>
                <Textarea
                  className="border-gray-300 focus-visible:ring-sky-400 focus-visible:border-sky-400 rounded-lg resize-none flex-1 min-h-30"
                  placeholder="Address..."
                />


                {/* No. Hp */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium text-gray-700">Total Point</Label>
                  <Input
                    type="tel"
                    className="border-gray-300 focus-visible:ring-sky-400 focus-visible:border-sky-400 rounded-lg"
                    placeholder="Total Point..."
                  />
                </div>

                {/* No. Hp */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium text-gray-700">Change Points</Label>
                  <div className="flex items-center gap-3 w-full justify-end">
                    <Input
                      type="number"
                      defaultValue={0}
                      className="border-gray-300 w-24 text-center focus-visible:ring-sky-400 focus-visible:border-sky-400 rounded-lg"
                    />
                    <Button className="items-center h-10 px-6 w-full bg-green-500 hover:bg-green-400 text-white ">
                      Add Point
                    </Button>
                    <Button className="items-center h-10 px-6 w-full bg-red-500 hover:bg-red-600 text-white ">
                      Reduce Points
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full justify-end">
            <Button
              onClick={onClose}
              className="items-center h-10 px-6 w-full bg-gray-500 hover:bg-gray-600 text-white mr-2"
            >
              Cancel
            </Button>
            <Button className="items-center h-10 w-full px-6 bg-sky-500 hover:bg-sky-600 text-white ml-2">
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogCreateBuyer;