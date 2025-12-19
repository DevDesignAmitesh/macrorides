import { prisma } from "@repo/db/db";

const email = process.env.MC_EMAIL || "admin@macrorides.com";
const customerId = process.env.MC_CUSTOMER_ID || "C-83690DF4FB084F8";
const key = process.env.MC_KEY || "TWFjcm8yMEAyNg==";

class OtpStore {
  private static instance: OtpStore | null;
  public token: string | null;
  public verificationId: string | null;

  private constructor() {
    this.token = null;
    this.verificationId = null;
  }

  public static getInstance(): OtpStore {
    if (!OtpStore.instance) {
      OtpStore.instance = new OtpStore();
    }
    return OtpStore.instance;
  }

  public async generateToken(): Promise<{
    status: number;
    token: string | null;
  }> {
    try {
      if (
        typeof email === "undefined" ||
        typeof customerId === "undefined" ||
        typeof key === "undefined"
      ) {
        return { status: 500, token: null };
      }
      // for generating token before sending otp
      const res = await fetch(
        `https://cpaas.messagecentral.com/auth/v1/authentication/token?customerId=${customerId}&key=${key}&scope=NEW&country=91&email=${email}`,
        {
          credentials: "include",
          method: "GET",
        }
      );

      const data = (await res.json()) as { status: number; token: string };
      return data;
    } catch (error) {
      console.log(error);
      return { status: 500, token: null };
    }
  }

  public async verifyAndDeletePhoneOtp(
    otp: string
  ): Promise<{ success: boolean; message?: string }> {
    if (!this.token || !this.verificationId) {
      return { success: false };
    }

    console.log(this.token, this.verificationId);

    const res = await fetch(
      `https://cpaas.messagecentral.com/verification/v3/validateOtp?&verificationId=${this.verificationId}&code=${otp}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          authToken: this.token,
        },
      }
    );

    const data = (await res.json()) as {
      responseCode: number;
      message: string;
      data: {
        verificationId: string;
        mobileNumber: string;
        responseCode: string;
        errorMessage?: null;
        verificationStatus: string;
        authToken: null;
        transactionId: string;
      };
    };

    console.log("this is the response from otp verify and delete");
    console.log(data);

    // have to add better error handling and messages

    if (data.message === "WRONG_OTP_PROVIDED") {
      return {
        success: false,
        message: "Invalid OTP",
      };
    }

    if (data.message === "VERIFICATION_EXPIRED") {
      return {
        success: false,
        message: "OTP Expired please resend the otp",
      };
    }

    if (data.responseCode !== 200) {
      return { success: false };
    }

    try {
      await prisma.account.update({
        where: {
          phone: data.data.mobileNumber,
        },
        data: {
          isVerified: true,
        },
      });

      return { success: true };
    } catch (e) {
      console.log("error is verifyAndDeletePhoneOtp ", e);
      return { success: false, message: "internal server error" };
    }
  }

  public async generateOtpForPhone(
    input: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const data = await this.generateToken();

      if (!data.token) {
        return { success: false };
      }

      console.log("this is the token generate data", data);

      this.token = data.token;

      // for sending otp to user's phone number
      const res2 = await fetch(
        `https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&flowType=SMS&mobileNumber=${input}&otpLength=6`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            authToken: data.token,
          },
        }
      );

      const data2 = (await res2.json()) as {
        responseCode: number;
        message: string;
        data: {
          verificationId: string;
          mobileNumber: string;
          responseCode: string;
          errorMessage?: null;
          timeout: string;
          smCLI?: null;
          transactionId: string;
        };
      };

      console.log("this is the response from generate otp for phone number");
      console.log(data2);

      if (data2.message === "REQUEST_ALREADY_EXISTS") {
        return {
          success: false,
          message: "OTP has been already sent",
        };
      }

      if (data2.responseCode !== 200) {
        return { success: false };
      }

      this.verificationId = data2.data.verificationId;
      return { success: true };
    } catch (error) {
      console.log("error in generateOtpForPhone ", error);
      return { success: false };
    }
  }
}

export const otpStore = OtpStore.getInstance();
