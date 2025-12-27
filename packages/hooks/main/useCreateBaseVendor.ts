import {
  Notify,
  VendorCreateInput,
  vendorCreateSchema,
  zodErrorMessage,
} from "@repo/types/types";
import axios from "axios";
import { useState } from "react";

export const useCreateBaseVendor = ({
  notify,
  token,
  HTTP_URL
}: {
  notify: Notify;
  token: string;
  HTTP_URL: string;
}) => {
  const [loading, setloading] = useState<boolean>(false);

  const handleCreateBaseVendor = async ({
    handleSuccess,
    input,
  }: {
    handleSuccess: (vendorId: string) => void;
    input: VendorCreateInput;
  }) => {
    if (loading) return;
    const { data, error, success } = vendorCreateSchema.safeParse(input);

    if (!success) {
      notify.error(zodErrorMessage({ error }));
      return;
    }

    try {
      const res = await axios.post(`${HTTP_URL}/vendors`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("response while creating vendor");
      console.log(res);

      if (res.status >= 200 && res?.data?.data?.vendorId) {
        handleSuccess(res?.data?.data?.vendorId);
        return;
      }

      notify.error(res?.data?.message ?? "Internal server error");
      return;
    } catch (e: any) {
      console.log("error in useCreateBaseVendor ", e);
      notify.error(e?.response?.data?.message ?? "Internal server error");
    } finally {
      setloading(false);
    }
  };

  return { loading, handleCreateBaseVendor };
};
