import { useState } from "react";
import {
  accountOTPVerifySchema,
  AccountOTPVerifyInput,
  zodErrorMessage,
  Notify,
} from "@repo/types/types";
import axios from "axios";

export const useOTPVerifyAccount = ({
  notify,
  HTTP_URL,
}: {
  notify: Notify;
  HTTP_URL: string;
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleOTPVerifyAccount = async ({
    input,
    handleSuccess,
  }: {
    input: AccountOTPVerifyInput;
    handleSuccess: (token: string) => void;
  }) => {
    if (loading) return;
    const { success, error, data } = accountOTPVerifySchema.safeParse(input);

    if (!success) {
      return notify.error(zodErrorMessage({ error }));
    }

    const { otp, phone } = data;

    try {
      setLoading(true);
      const res = await axios.post(
        `${HTTP_URL}/auth/verify-otp/${phone}`,
        {
          otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status !== 201) {
        notify.error(res?.data?.message ?? "Internal Server Error");
        return;
      }

      notify.success(res?.data?.message ?? `Successfull`);
      handleSuccess(res?.data?.data?.token);
    } catch (e: any) {
      console.log("error in useOTPVerifyAccount ", e);
      notify.error(e?.response?.data?.message ?? "Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleOTPVerifyAccount };
};
