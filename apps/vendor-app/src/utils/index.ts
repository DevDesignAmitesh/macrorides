import {
  HTTP_BACKEND_DEV_URL,
  HTTP_BACKEND_PROD_URL,
  Notify,
} from "@repo/types/types";
import {
  Store,
  BarChart3,
  Shield,
  Settings,
  CreditCard,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

export const features = [
  {
    icon: BarChart3,
    title: "Vendor Dashboard",
    description: "Complete overview of your business performance",
  },
  {
    icon: Store,
    title: "Item Management",
    description: "Easy product listing and inventory control",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Safe and reliable payment processing",
  },
  {
    icon: Settings,
    title: "Role-based Setup",
    description: "Customized experience for your business type",
  },
  {
    icon: CreditCard,
    title: "Smart Analytics",
    description: "Data-driven insights for growth",
  },
  {
    icon: UserCheck,
    title: "Simple Registration",
    description: "Quick and easy account setup process",
  },
];

export const notify: Notify = {
  error: (msg) => {
    toast.error(msg);
  },
  success: (msg) => {
    toast.success(msg);
  },
};

export const HTTP_URL = 
  process.env.NEXT_PUBLIC_NODE_ENV === "production"
    ? HTTP_BACKEND_PROD_URL
    : HTTP_BACKEND_DEV_URL;
