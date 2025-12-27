import "dotenv/config";
import { sendEmailType } from "@repo/types/types";
import { Resend } from "resend";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";

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
    type,
  }: {
    email: string;
    name: string;
    type: sendEmailType;
  }): Promise<{ success: boolean }> {
    try {
      console.log(process.env.RESEND_API_KEY);
      const resend = new Resend(process.env.RESEND_API_KEY);

      const templatePath =
        type === "VENDOR_ONBOARDING_CONFIRMATION"
          ? path.join(__dirname, "vendor-onboarding.html")
          : "";
          
      console.log("__dirname:", __dirname);

      const finalRes = await this.readHTMLTemplate(
        templatePath,
        async (err, html) => {
          if (err) {
            console.error("Error reading HTML template:", err);
            return false;
          }

          const template = handlebars.compile(html);

          const replacements = {
            name,
            email,
          };

          const htmlToSend = template(replacements);

          const info = await resend.emails.send({
            from: `no-reply@macrorides.com`,
            to: email,
            subject: "Your Macro Rides Vendor Account Has Been Created ✅",
            text: `Hi ${name}, your vendor account has been created. Verification may take 24–48 hours.`,
            html: htmlToSend,
          });

          console.log("Message sent:", info.data);
          return true;
        }
      );
      return { success: finalRes };
    } catch (e) {
      console.log("error in send email", e);
      return { success: false };
    }
  }

  public readHTMLTemplate = async (
    path: string,
    callback: (err: any | null, html?: any) => Promise<boolean>
  ): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      fs.readFile(path, { encoding: "utf-8" }, async (err, html) => {
        if (err) {
          return resolve(await callback(err));
        }
        resolve(await callback(null, html));
      });
    });
  };
}

export const emailStore = EmailStore.getInstance();
