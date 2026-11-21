// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
// Role-based access control: every page and API route checks a permission.

export const PERMISSIONS = [
  "dashboard:view",
  "orders:view", "orders:manage",
  "products:view", "products:manage",
  "customers:view", "customers:manage",
  "staff:manage",
  "blog:view", "blog:manage",
  "sms:send",
  "ai:use",
  "marketing:manage",
  "reports:view",
  "activity:view",
  "settings:manage",
  "inventory:manage",
  "purchasing:manage",
  "invoices:manage",
  "finance:view",
  "shipping:manage",
  "support:manage",
  "reviews:manage",
  "projects:view",
] as const;

export type Permission = (typeof PERMISSIONS)[number];
export type Role = "super_admin" | "manager" | "editor" | "support";

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super admin",
  manager: "Manager",
  editor: "Content editor",
  support: "Customer support",
};

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  super_admin: PERMISSIONS,
  manager: [
    "dashboard:view", "orders:view", "orders:manage", "products:view", "products:manage",
    "customers:view", "customers:manage", "blog:view", "blog:manage", "sms:send", "ai:use",
    "marketing:manage", "reports:view", "activity:view", "inventory:manage", "purchasing:manage",
    "invoices:manage", "finance:view", "shipping:manage", "support:manage", "reviews:manage", "projects:view",
  ],
  editor: ["dashboard:view", "products:view", "products:manage", "blog:view", "blog:manage", "ai:use", "reviews:manage", "projects:view"],
  support: [
    "dashboard:view", "orders:view", "orders:manage", "customers:view", "sms:send", "ai:use",
    "shipping:manage", "support:manage", "reviews:manage", "projects:view",
  ],
};

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && value in ROLE_PERMISSIONS;
}

export function can(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

// Which permission each route needs (used by the proxy and the sidebar).
export const ROUTE_PERMISSIONS: { prefix: string; permission: Permission }[] = [
  { prefix: "/dashboard", permission: "dashboard:view" },
  { prefix: "/orders", permission: "orders:view" },
  { prefix: "/products", permission: "products:view" },
  { prefix: "/customers", permission: "customers:view" },
  { prefix: "/staff", permission: "staff:manage" },
  { prefix: "/blog", permission: "blog:view" },
  { prefix: "/sms", permission: "sms:send" },
  { prefix: "/ai", permission: "ai:use" },
  { prefix: "/marketing", permission: "marketing:manage" },
  { prefix: "/reports", permission: "reports:view" },
  { prefix: "/activity", permission: "activity:view" },
  { prefix: "/settings", permission: "settings:manage" },
  { prefix: "/inventory", permission: "inventory:manage" },
  { prefix: "/purchasing", permission: "purchasing:manage" },
  { prefix: "/invoices", permission: "invoices:manage" },
  { prefix: "/finance", permission: "finance:view" },
  { prefix: "/shipping", permission: "shipping:manage" },
  { prefix: "/support", permission: "support:manage" },
  { prefix: "/reviews", permission: "reviews:manage" },
  { prefix: "/projects", permission: "projects:view" },
];
