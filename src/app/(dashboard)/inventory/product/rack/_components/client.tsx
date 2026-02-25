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
import { FileDown, RefreshCw, Server } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/data-table";
import { AxiosError } from "axios";
import Forbidden from "@/components/403";
import Loading from "@/app/(dashboard)/loading";
import { Button } from "@/components/ui/button";
import { useSearchQuery } from "@/lib/search";
import { usePagination } from "@/lib/pagination";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/hooks/use-confirm";
import Pagination from "@/components/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetListRacks } from "../_api/use-get-list-racks";
import { useDeleteRack } from "../_api/use-delete-rack";
import { useGetListProduct } from "../_api/use-get-list-product";
import DialogBarcode from "./dialog-barcode";
import { columnProductDisplay, columnRackDisplay } from "./columns";
import { parseAsString, useQueryState } from "nuqs";
import { DialogDetail } from "./dialog-detail";
import { useToDamaged } from "../_api/use-to-damaged";
import { DialogDamaged } from "./dialog-damaged";

type ViewMode = "rack" | "product";

export const Client = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("rack");
  const [isOpen, setIsOpen] = useQueryState(
    "dialog",
    parseAsString.withDefault(""),
  );
  const [productId, setProductId] = useQueryState(
    "id",
    parseAsString.withDefault(""),
  );
  const [isMounted, setIsMounted] = useState(false);
  const [barcodeOpen, setBarcodeOpen] = useState(false);
  const [selectedNameRack, setSelectedNameRack] = useState("");
  const [selectedBarcode, setSelectedBarcode] = useState("");
  const [selectedTotalProduct, setSelectedTotalProduct] = useState("");
  const [isOpenDamaged, setIsOpenDamaged] = useState(false);
  const [damagedDescription, setDamagedDescription] = useState("");
  const [damagedProductId, setDamagedProductId] = useState("");
  const [damagedBarcode, setDamagedBarcode] = useState("");

  // separate search states for rack and product so values don't collide
  const {
    search: searchRack,
    searchValue: searchValueRack,
    setSearch: setSearchRack,
  } = useSearchQuery("qRack");

  const {
    search: searchProduct,
    searchValue: searchValueProduct,
    setSearch: setSearchProduct,
  } = useSearchQuery("qProduct");

  // local input state stored at parent level so values survive tab unmounts
  const [searchRackInput, setSearchRackInput] = useState<string>(
    (searchRack as string) ?? "",
  );
  const [searchProductInput, setSearchProductInput] = useState<string>(
    (searchProduct as string) ?? "",
  );

  // keep local input in sync when query state changes externally
  useEffect(() => {
    setSearchRackInput((searchRack as string) ?? "");
  }, [searchRack]);

  useEffect(() => {
    setSearchProductInput((searchProduct as string) ?? "");
  }, [searchProduct]);

  const { metaPage, page, setPage, setPagination } = usePagination("pRack");

  const {
    metaPage: metaPageProduct,
    page: pageProduct,
    setPage: setPageProduct,
    setPagination: setPaginationProduct,
  } = usePagination("pProduct");

  // confirm delete
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Rack Display",
    "This action cannot be undone",
    "destructive",
  );

  // mutate DELETE, UPDATE, CREATE
  const { mutate: mutateDelete } = useDeleteRack();
  const { mutate: mutateDamaged, isPending: isPendingDamaged } = useToDamaged();

  const {
    data: dataRacks,
    refetch: refetchRacks,
    isLoading: isLoadingRacks,
    isRefetching: isRefetchingRack,
    isError: isErrorRacks,
    error: errorRacks,
  } = useGetListRacks({ p: page, q: searchValueRack });

  const {
    data: dataProducts,
    refetch: refetchProducts,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: errorProducts,
  } = useGetListProduct({
    p: pageProduct,
    q: searchValueProduct,
  });

  const rackData = dataRacks?.data.data.resource;
  const racksData = rackData?.data;
  const totalRacks = rackData?.total_rack ?? 0;
  const totalProductRack = rackData?.total_products_in_rack ?? 0;

  const productData = dataProducts?.data?.resource?.data;
  const loadingRack = isLoadingRacks || isRefetchingRack;

  // handle to damaged
  const handleSubmitDamaged = () => {
    mutateDamaged(
      {
        id: damagedBarcode,
        body: {
          description: damagedDescription,
          quality: "damaged",
        },
      },

      {
        onSuccess: () => {
          setIsOpenDamaged(false);
          setDamagedDescription("");
        },
      },
    );
  };

  useEffect(() => {
    if (dataRacks) setPagination(dataRacks.data.data.resource);
  }, [dataRacks]);

  useEffect(() => {
    if (dataProducts) setPaginationProduct(dataProducts.data.resource);
  }, [dataProducts]);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return <Loading />;

  if (
    (isErrorRacks && (errorRacks as AxiosError).status === 403) ||
    (isErrorProducts && (errorProducts as AxiosError).status === 403)
  ) {
    return <Forbidden />;
  }

  return (
    <div className="flex flex-col bg-gray-100 w-full px-4 py-4 gap-4">
      <DeleteDialog />
      <DialogBarcode
        onCloseModal={() => {
          if (barcodeOpen) {
            setBarcodeOpen(false);
          }
        }}
        open={barcodeOpen}
        barcode={selectedBarcode}
        qty={selectedTotalProduct}
        name={selectedNameRack}
        handleCancel={() => {
          setBarcodeOpen(false);
        }}
      />
      <DialogDetail
        open={isOpen === "detail"}
        onOpenChange={() => {
          if (isOpen === "detail") {
            setIsOpen("");
            setProductId("");
          }
        }}
        productId={productId}
      />
      <DialogDamaged
        isOpen={isOpenDamaged}
        handleClose={() => setIsOpenDamaged(false)}
        barcode={damagedBarcode}
        description={damagedDescription}
        setDescription={setDamagedDescription}
        isLoading={isPendingDamaged}
        handleSubmit={handleSubmitDamaged}
        damagedProductId={damagedProductId}
      />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Display</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Rack</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-xl font-semibold">Rak Display</h2>

          <Select
            value={viewMode}
            onValueChange={(v) => setViewMode(v as ViewMode)}
          >
            <SelectTrigger
              className={`
        w-45
        text-white
        border
        transition-colors
        ${
          viewMode === "rack"
            ? "bg-[#16C8C7] border-[#16C8C7] hover:bg-[#14b4b3] focus:bg-[#16C8C7] data-[state=open]:bg-[#16C8C7]"
            : "bg-[#962DFF] border-[#962DFF] hover:bg-[#7f25d6] focus:bg-[#962DFF] data-[state=open]:bg-[#962DFF]"
        }
      `}
            >
              <SelectValue>
                {viewMode === "rack" ? "List Rak" : "List Product"}
              </SelectValue>
            </SelectTrigger>

            <SelectContent
              className="
        bg-white!
        opacity-100!
        backdrop-blur-0
        border
        border-gray-200
        shadow-lg
      "
            >
              <SelectItem value="rack">List Rak</SelectItem>
              <SelectItem value="product">List Product</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <hr className="border-gray-200" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4 mb-6">
          {/* Card: Total Rack */}
          <div className="bg-white shadow rounded-xl p-5 flex flex-col border border-gray-200">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-md bg-[#0B91FF] text-white">
                <Server className="w-4 h-4" />
              </div>
              <h4 className="text-sm text-gray-500">Total Rack</h4>
            </div>

            <p className="text-3xl font-bold mt-3">{totalRacks}</p>
          </div>

          {/* Card: Total Product */}
          <div className="bg-white shadow rounded-xl p-5 flex flex-col border border-gray-200">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-md bg-[#0B91FF] text-white">
                <Server className="w-4 h-4" />
              </div>
              <h4 className="text-sm text-gray-500">Total Product Rack</h4>
            </div>

            <p className="text-3xl font-bold mt-3">{totalProductRack}</p>
          </div>
        </div>
      </div>
      {/* CARD DROPDOWN */}
      <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {viewMode === "rack" ? "List Rak" : "List Product"}
          </h2>
        </div>
        <hr className="border-gray-200" />

        <div className="flex items-center justify-between gap-4">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            {viewMode === "rack" ? (
              <Input
                className="w-65"
                value={searchRackInput}
                onChange={(e) => {
                  setSearchRackInput(e.target.value);
                  setSearchRack(e.target.value);
                }}
                placeholder="Search Rack..."
              />
            ) : (
              <Input
                className="w-65"
                value={searchProductInput}
                onChange={(e) => {
                  setSearchProductInput(e.target.value);
                  setSearchProduct(e.target.value);
                }}
                placeholder="Search Product..."
              />
            )}

            <Button
              onClick={() =>
                viewMode === "rack" ? refetchRacks() : refetchProducts()
              }
              variant="outline"
              className="w-9 h-9 px-0"
            >
              <RefreshCw
                className={cn(
                  "w-4 h-4",
                  (viewMode === "rack" ? loadingRack : isLoadingProducts) &&
                    "animate-spin",
                )}
              />
            </Button>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {viewMode === "product" && (
              <>
                <Button
                  // onClick={handleExport}
                  variant="outline"
                  //   disabled={isPendingExport}
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </>
            )}
          </div>
        </div>

        {/* CONTENT */}
        {viewMode === "rack" ? (
          <>
            <DataTable
              columns={columnRackDisplay({
                metaPage,
                isLoadingRacks,
                handleDelete: (id: any) =>
                  confirmDelete().then((ok) => ok && mutateDelete({ id })),
                // handleSubmit: mutateSubmit,
                // handleSubmit,
                // handleUpdate,
                // setRackId,
                // setInput,
                // setIsOpen,
                setSelectedBarcode,
                setSelectedNameRack,
                setSelectedTotalProduct,
                setBarcodeOpen,
              })}
              data={racksData ?? []}
              isLoading={isLoadingRacks}
            />

            <Pagination
              pagination={{ ...metaPage, current: page }}
              setPagination={setPage}
            />
          </>
        ) : (
          <>
            <DataTable
              columns={columnProductDisplay({
                metaPageProduct,
                isLoadingProducts,
                setProductId,
                setIsOpen,
                setDamagedProductId,
                setDamagedBarcode,
                setIsOpenDamaged,
              })}
              data={productData ?? []}
              isLoading={isLoadingProducts}
            />

            <Pagination
              pagination={{ ...metaPageProduct, current: pageProduct }}
              setPagination={setPageProduct}
            />
          </>
        )}
      </div>
    </div>
  );
};
