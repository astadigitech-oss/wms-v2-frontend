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
// import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const DialogCreateDestination = ({
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

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{"Created Destination"}</DialogTitle>
          </DialogHeader>

          <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-6 flex-col">
            <div className="flex flex-col w-full gap-4 p-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-bold">Name</Label>
                  <Input
                    className="border-sky-400/80 focus-visible:ring-sky-400"
                    placeholder="Name..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-bold">No. Hp</Label>
                  <Input
                    className="border-sky-400/80 focus-visible:ring-sky-400"
                    placeholder="No HP..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-bold">Address</Label>
                  <Input
                    className="border-sky-400/80 focus-visible:ring-sky-400"
                    placeholder="Address..."
                  />
                </div>
              </div>
              {/* Row 2: 3 columns */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-bold">Kec</Label>
                  <Input
                    className="border-sky-400/80 focus-visible:ring-sky-400"
                    placeholder="Kecamatan..."
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-bold">Kab</Label>
                  <Input
                    className="border-sky-400/80 focus-visible:ring-sky-400"
                    placeholder="Kabupaten..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-bold">Provinsi</Label>
                  <Input
                    className="border-sky-400/80 focus-visible:ring-sky-400"
                    placeholder="Provinsi..."
                  />
                </div>
                {/* Row 2: 3 columns */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-bold">Lat</Label>
                    <Input
                      className="border-sky-400/80 focus-visible:ring-sky-400"
                      placeholder=""
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-bold">Lang</Label>
                    <Input
                      className="border-sky-400/80 focus-visible:ring-sky-400"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <Button onClick={onClose}
              className="items-center h-10 px-6 bg-gray-500 hover:bg-sky-600 text-white mr-2">
              Cancel
            </Button>
            <Button className="items-center h-10 px-6 bg-sky-500 hover:bg-sky-600 text-white ml-2">
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogCreateDestination;
