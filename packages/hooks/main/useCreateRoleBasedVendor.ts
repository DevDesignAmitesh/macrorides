import {
  clothVendorCreateOrUpdateSchema,
  foodVendorCreateOrUpdateSchema,
  Notify,
  useCreateRoleBasedVendorProps,
  zodErrorMessage,
} from "@repo/types/types";
import axios from "axios";
import { useState } from "react";

export const useCreateRoleBasedVendor = ({
  notify,
  vendorId,
  HTTP_URL,
  token
}: {
  notify: Notify;
  vendorId: string;
  token: string;
  HTTP_URL: string;
}) => {
  const [loading, setloading] = useState<boolean>(false);

  const handleCreateRoleBasedVendor = async ({
    handleSuccess,
    main,
  }: {
    handleSuccess: () => void;
    main: useCreateRoleBasedVendorProps;
  }) => {
    console.log("this is the incoming data");
    console.log(main);
    if (loading) return;
    const { data, error, success } = (
      main.type === "CLOTHING"
        ? clothVendorCreateOrUpdateSchema
        : foodVendorCreateOrUpdateSchema
    ).safeParse({
      ...main.input,
      vendorId,
    });

    if (!success) {
      notify.error(zodErrorMessage({ error }));
      return;
    }

    try {
      const res = await axios.post(
        `${HTTP_URL}/vendors/${vendorId}/${main.type === "CLOTHING" ? "clothing" : "food"}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,

          },
        }
      );

      console.log("response while creating vendor");
      console.log(res);

      if (res.status === 201) {
        handleSuccess();
        return;
      }

      notify.error(res?.data?.message ?? "Internal server error");
      return;
    } catch (e: any) {
      console.log("error in useCreateRoleBasedVendor ", e);
      notify.error(e?.response?.data?.message ?? "Internal server error");
    } finally {
      setloading(false);
    }
  };

  return { loading, handleCreateRoleBasedVendor };
};
