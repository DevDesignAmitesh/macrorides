import { roles } from "@repo/types/types";

declare global {
  namespace Express {
    interface Request {
      user: {
        role: roles;
        userId: string;
      };
    }
  }
}
