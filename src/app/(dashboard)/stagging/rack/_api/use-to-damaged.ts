import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { baseUrl } from "@/lib/baseUrl";
import { toast } from "sonner";
import { getCookie } from "cookies-next/client";

type RequestType = {
  id: string;
  body: {
    description: string;
    // source: string;
    quality: string;
  };
};

export const useToDamaged = () => {
  const accessToken = getCookie("accessToken");
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse, AxiosError, RequestType>({
    mutationFn: async ({ id, body }) => {
      const res = await axios.post(
        `${baseUrl}/products/${id}/to-damaged`,
        body,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return res;
    },

    onSuccess: (res) => {
      toast.success("Product to damaged successfully");

      queryClient.invalidateQueries({ queryKey: ["list-product-staging"] });
      queryClient.invalidateQueries({ queryKey: ["list-racks"] });

      // kalau perlu invalidasi detail product:
      queryClient.invalidateQueries({
        queryKey: ["product-detail", res?.data?.id],
      });
    },

    onError: (err) => {
      const status = err.response?.status;

      if (status === 403) {
        toast.error("Error 403: Restricted Access");
      } else {
        toast.error(`ERROR ${status}: Product failed to damaged`);
        console.log("ERROR_PRODUCT_TO_DAMAGED:", err);
      }
    },
  });
};
