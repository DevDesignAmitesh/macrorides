import "dotenv/config";
import { sendEmailType } from "@repo/types/types";
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { getEnv } from "./env.js";

const ADMIN_MAIL = getEnv().ADMIN_MAIL
const ADMIN_MAIL_PASS = getEnv().ADMIN_MAIL_PASS

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      // nodemailer code
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: ADMIN_MAIL,
          pass: ADMIN_MAIL_PASS,
        },
      });

      const templatePath =
        type === "VENDOR_ONBOARDING_CONFIRMATION"
          ? path.join(__dirname, "vendor-onboarding.html")
          : "";

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

          const info = await transporter.sendMail({
            from: `"Macro Rides" <${ADMIN_MAIL}>`,
            to: email,
            subject: "Your Macro Rides Vendor Account Has Been Created ✅",
            text: `Hi ${name}, your vendor account has been created. Verification may take 24–48 hours.`,
            html: htmlToSend,
          });

          console.log("Message sent:", info.messageId);
          return true;
        }
      );
      return { success: finalRes };
    } catch (emailError) {
      console.log(emailError);
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
          resolve(await callback(err));
        }
        resolve(await callback(null, html));
      });
    });
  };
}

export const emailStore = EmailStore.getInstance();
