import {
  createLocationSchema,
  CreateVendorLocationInput,
  Notify,
  zodErrorMessage,
} from "@repo/types/types";
import axios from "axios";
import { useState } from "react";

export const useCreateLocation = ({
  notify,
  token,
  vendorId,
  HTTP_URL
}: {
  notify: Notify;
  token: string;
  vendorId: string;
  HTTP_URL: string;
}) => {
  const [loading, setloading] = useState<boolean>(false);

  const handleCreateLocation = async ({
    handleSuccess,
    input,
  }: {
    handleSuccess: () => void;
    input: CreateVendorLocationInput[];
  }) => {
    console.log("this is the incmiing data in create lcatipn");
    console.log(input)
    if (loading) return;
    const { data, error, success } = createLocationSchema.safeParse(input);

    if (!success) {
      notify.error(zodErrorMessage({ error }));
      return;
    }

    try {
      const res = await axios.post(
        `${HTTP_URL}/vendors/${vendorId}/locations`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("response while creating location");
      console.log(res);

      if (res.status === 201) {
        handleSuccess();
        return;
      }

      notify.error(res?.data?.message ?? "Internal server error");
      return;
    } catch (e: any) {
      console.log("error in useCreateLocation ", e);
      notify.error(e?.response?.data?.message ?? "Internal server error");
    } finally {
      setloading(false);
    }
  };

  return { loading, handleCreateLocation };
};
