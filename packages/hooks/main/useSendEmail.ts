import {
  Notify,
  SendEmailInput,
  sendEmailSchema,
  zodErrorMessage,
} from "@repo/types/types";
import axios from "axios";
import { useState } from "react";

export const useSendEmail = ({
  notify,
  token,
  HTTP_URL,
}: {
  notify: Notify;
  token: string;
  HTTP_URL: string;
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendEmail = async ({
    input,
    handleSuccess,
  }: {
    handleSuccess: () => void;
    input: SendEmailInput;
  }) => {
    if (loading) return;

    const { data, error, success } = sendEmailSchema.safeParse(input);

    if (!success) {
      notify.error(zodErrorMessage({ error }));
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${HTTP_URL}/vendors/email/${data.type}`,
        { email: data.email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 201) {
        handleSuccess();
        return;
      }

      notify.error(res?.data?.message ?? "Internal server error");
      return;
    } catch (e: any) {
      console.log("error in useSendEmail ", e);
      notify.error(e?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleSendEmail };
};
