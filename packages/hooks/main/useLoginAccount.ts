import { useState } from "react";
import {
  accountSigninSchema,
  AccountSigninInput,
  zodErrorMessage,
  Notify,
} from "@repo/types/types";
import axios from "axios";

export const useLoginAccount = ({
  notify,
  HTTP_URL,
}: {
  notify: Notify;
  HTTP_URL: string;
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleLoginAccount = async ({
    input,
    handleSuccess,
  }: {
    input: AccountSigninInput;
    handleSuccess: () => void;
  }) => {
    if (loading) return;
    const { success, error, data } = accountSigninSchema.safeParse(input);

    if (!success) {
      return notify.error(zodErrorMessage({ error }));
    }

    try {
      setLoading(true);
      const res = await axios.post(`${HTTP_URL}/auth/login`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("POST status:", res.status, res.data);

      if (res.status === 200) {
        notify.success(res?.data?.message ?? `OTP sent on ${input.phone}`);
        handleSuccess();
        return;
      }

      notify.error(res?.data?.message ?? "Internal Server Error");
      return;
    } catch (e: any) {
      console.log("error in useLoginAccount ", e);
      notify.error(e?.response?.data?.message ?? "Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleLoginAccount };
};
