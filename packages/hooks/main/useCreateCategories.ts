import {
  createCategoriesSchema,
  CreateCategoryInput,
  HTTP_URL,
  Notify,
  zodErrorMessage,
} from "@repo/types/types";
import axios from "axios";
import { useState } from "react";

export const useCreateCategories = ({
  notify,
  vendorId,
  token
}: {
  notify: Notify;
  vendorId: string;
  token: string;
}) => {
  const [loading, setloading] = useState<boolean>(false);

  const handleCreateCategories = async ({
    handleSuccess,
    input,
  }: {
    handleSuccess: () => void;
    input: CreateCategoryInput;
  }) => {
    if (loading) return;
    const { data, error, success } = createCategoriesSchema.safeParse({
      ...input,
      vendorId,
    });

    if (!success) {
      notify.error(zodErrorMessage({ error }));
      return;
    }

    try {
      const res = await axios.post(
        `${HTTP_URL}/vendors/${vendorId}/categories`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("response while creating categories");
      console.log(res);

      if (res.status === 201) {
        handleSuccess();
        return;
      }

      notify.error(res?.data?.message ?? "Internal server error");
      return;
    } catch (e: any) {
      console.log("error in useCreateCategories ", e);
      notify.error(e?.response?.data?.message ?? "Internal server error");
    } finally {
      setloading(false);
    }
  };

  return { loading, handleCreateCategories };
};
