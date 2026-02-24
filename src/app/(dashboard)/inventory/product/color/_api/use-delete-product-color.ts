import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { baseUrl } from "@/lib/baseUrl";
import { getCookie } from "cookies-next/client";

type RequestType = {
  id: string;
};

type Error = AxiosError;

export const useDeleteProductColor = () => {
  const accessToken = getCookie("accessToken");

  const mutation = useMutation<AxiosResponse, Error, RequestType>({
    mutationFn: async ({ id }) => {
      const res = await axios.delete(
        `${baseUrl}/products/inventory/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: {
            source_type: "product",
          },
        }
      );

      return res;
    },
  });

  return mutation;
};