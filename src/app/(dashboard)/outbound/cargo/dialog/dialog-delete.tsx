"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

const DialogConfirmDeleteBuyer = ({
    open,
    onOpenChange,
    onClose,
    onConfirm,
    isPendingDelete,
}: {
    open: boolean;
    onOpenChange: () => void;
    onClose: () => void;
    onConfirm: () => void;
    isPendingDelete: boolean;
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Confirm Delete</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center gap-3 py-4">
                    <Trash2 className="w-16 h-16 text-[#1e2a4a]" strokeWidth={1.5} />
                    <div className="text-center">
                        <p className="font-semibold text-base">Delete Buyer</p>
                        <p className="text-sm text-muted-foreground">
                            This action cannot be undone
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        className="flex-1 bg-red-500 hover:bg-red-300 text-white rounded-xl h-11"
                        onClick={onClose}
                        disabled={isPendingDelete}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="flex-1 bg-gray-500 hover:bg-gray-300 text-white rounded-xl h-11"
                        onClick={onConfirm}
                        disabled={isPendingDelete}
                    >
                        {isPendingDelete ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DialogConfirmDeleteBuyer;