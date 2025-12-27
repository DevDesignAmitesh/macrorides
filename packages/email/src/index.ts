import "dotenv/config";
import { Resend } from "resend";
import { VendorAccountCreatedEmail } from "@repo/ui/VendorOnBoardEmail";

class EmailStore {
  private static instance: EmailStore;

  public static getInstance(): EmailStore {
    if (!EmailStore.instance) {
      EmailStore.instance = new EmailStore();
    }
    return EmailStore.instance;
  }

  public async sendEmail({
    email,
    name,
  }: {
    email: string;
    name: string;
  }): Promise<{ success: boolean }> {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      const info = await resend.emails.send({
        from: "vendor@macrorides.com",
        to: email,
        subject: "Your Macro Rides Vendor Account Has Been Created ✅",
        text: `Hi ${name}, your vendor account has been created. Verification may take 24–48 hours.`,

        // TODO: FIND OUT THAT can we use this component some where else with the exact same syntax
        react: VendorAccountCreatedEmail({ name }),
      });

      console.log("Message sent:", info.data);
      return { success: true };
    } catch (e) {
      console.error("error in send email", e);
      return { success: false };
    }
  }
}

export const emailStore = EmailStore.getInstance();
