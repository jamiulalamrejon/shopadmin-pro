// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
// Demo data for the admin dashboard. Generated with a seeded random function so it
// looks the same on every run. Replace these exports with database queries later.
import type { Role } from "./rbac";

// ---------- Types ----------
export type StaffMember = {
  id: string; name: string; email: string; phone: string; role: Role;
  status: "Active" | "Suspended"; lastLogin: string; twoFactor: boolean; passwordHash?: string;
};
export type Customer = {
  id: string; name: string; email: string; phone: string; city: string;
  orders: number; spent: number; status: "Active" | "VIP" | "Blocked"; joined: string;
};
export type Product = {
  id: string; name: string; sku: string; category: string; price: number; stock: number;
  sold: number; status: "Published" | "Draft" | "Archived"; description: string; cost: number;
};
export type PaymentMethod = "Card" | "PayPal" | "Bank transfer" | "COD";
export const PAYMENT_METHODS: PaymentMethod[] = ["Card", "PayPal", "Bank transfer", "COD"];
export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Returned";
export type Order = {
  id: string; number: string; customer: string; phone: string; city: string; items: number;
  total: number; payment: PaymentMethod; status: OrderStatus; date: string;
};
export type BlogPost = {
  id: string; title: string; slug: string; category: string; author: string;
  status: "Published" | "Draft" | "Scheduled"; views: number; date: string; content: string;
};
export type Coupon = {
  id: string; code: string; type: "Percent" | "Fixed"; value: number; minOrder: number;
  used: number; limit: number; expires: string; status: "Active" | "Expired" | "Paused";
};
export type SmsLog = { id: string; to: string; message: string; status: "Delivered" | "Failed" | "Queued"; provider: string; at: string };
export type SmsTemplate = { id: string; name: string; body: string };
export type SmsCampaign = { id: string; name: string; audience: string; recipients: number; delivered: number; status: "Sent" | "Scheduled" | "Draft"; date: string };
export type AuditEntry = { id: string; at: string; actor: string; action: string; target: string; ip: string; level: "info" | "warning" | "danger" };

// ---------- Seeded random helpers ----------
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261121);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)];
const between = (a: number, b: number) => Math.floor(a + rand() * (b - a + 1));
const now = Date.now();
const daysAgo = (d: number, h = between(8, 22)) => new Date(now - d * 86_400_000 - h * 3_600_000).toISOString();
const phone = () => pick(["+1415", "+1646", "+4420", "+97150", "+8801", "+6141"]) + String(between(1_000_000, 9_999_999));

const FIRST = ["Olivia", "Liam", "Nusrat", "Emma", "Tanvir", "Sophia", "Arif", "Mia", "Noah", "Amelia", "Imran", "Ava", "Lucas", "Sara", "Ethan", "Nabila", "James", "Riya", "Daniel", "Anika"];
const LAST = ["Smith", "Hasan", "Johnson", "Ahmed", "Brown", "Islam", "Garcia", "Rahman", "Miller", "Khan", "Wilson", "Lee"];
export const CITIES = ["New York", "London", "Dubai", "Toronto", "Sydney", "Dhaka", "Berlin", "Singapore", "Los Angeles", "Paris"];

// ---------- Staff (the first four can sign in) ----------
export const staff: StaffMember[] = [
  { id: "stf_1", name: "Admin User", email: "admin@demo.com", phone: "+14155550101", role: "super_admin", status: "Active", lastLogin: daysAgo(0, 1), twoFactor: true,
    passwordHash: "$2b$12$Hf8dImO.l2uZrnLA/aur0.CbnvaL1DWAbKCrzeVhpjp747QP4qV3u" }, // Admin@123
  { id: "stf_2", name: "Mahmud Manager", email: "manager@demo.com", phone: "+14155550102", role: "manager", status: "Active", lastLogin: daysAgo(0, 3), twoFactor: true,
    passwordHash: "$2b$12$RE7baVmqK.6dz9dozqJ6qOLTs03wV4GAbeNa/PA17O05pFdwCvDvC" }, // Manager@123
  { id: "stf_3", name: "Elora Editor", email: "editor@demo.com", phone: "+14155550103", role: "editor", status: "Active", lastLogin: daysAgo(1), twoFactor: false,
    passwordHash: "$2b$12$/PFtFUnNjlHHnG5dHayuS.nU.Gr3qzdYk7o5tcBYAjOKEb7s5B5Oe" }, // Editor@123
  { id: "stf_4", name: "Sohel Support", email: "support@demo.com", phone: "+14155550104", role: "support", status: "Active", lastLogin: daysAgo(2), twoFactor: false,
    passwordHash: "$2b$12$HdxO1Qr33QezWsG1oTTQBO30tXGph6R4qZ4.4iMB8IB6/ICXsQQW2" }, // Support@123
  { id: "stf_5", name: "Rumana Akter", email: "rumana@demo.com", phone: phone(), role: "support", status: "Active", lastLogin: daysAgo(3), twoFactor: false },
  { id: "stf_6", name: "Fahim Chowdhury", email: "fahim@demo.com", phone: phone(), role: "editor", status: "Suspended", lastLogin: daysAgo(40), twoFactor: false },
  { id: "stf_7", name: "Tasnim Rahman", email: "tasnim@demo.com", phone: phone(), role: "manager", status: "Active", lastLogin: daysAgo(5), twoFactor: true },
];

/** Staff list safe to send to the browser (password hashes removed). */
export function publicStaff(): Omit<StaffMember, "passwordHash">[] {
  return staff.map(({ passwordHash: _hidden, ...rest }) => rest);
}

// ---------- Products ----------
const PRODUCT_SEED: [string, string, number][] = [
  ["GPS Tracker V3", "Electronics", 49], ["Smart Watch S2", "Electronics", 129], ["Wireless Earbuds Pro", "Electronics", 89],
  ["Power Bank 20000mAh", "Electronics", 39], ["WiFi Security Camera 2K", "Electronics", 69], ["Matte Lipstick Ruby", "Beauty", 18],
  ["Vitamin C Face Serum", "Beauty", 32], ["Sunscreen SPF 50", "Beauty", 24], ["Herbal Hair Oil", "Beauty", 14],
  ["Linen Shirt", "Fashion", 45], ["Silk Saree", "Fashion", 189], ["Leather Wallet", "Fashion", 35],
  ["Running Sneakers", "Fashion", 99], ["Non-stick Fry Pan", "Home & Kitchen", 42], ["Electric Kettle 1.7L", "Home & Kitchen", 38],
  ["Blender 3-in-1", "Home & Kitchen", 79], ["Organic Honey 500g", "Grocery", 12], ["Ceramic Coffee Mug Set", "Home & Kitchen", 29],
];
export const products: Product[] = PRODUCT_SEED.map(([name, category, price], i) => ({
  id: `prd_${i + 1}`,
  name, category, price,
  sku: `${category.slice(0, 3).toUpperCase()}-${1000 + i * 7}`,
  stock: i % 6 === 0 ? between(0, 6) : between(12, 240),
  sold: between(20, 320),
  status: i === 16 ? "Draft" : i === 12 ? "Archived" : "Published",
  description: `${name} - quality ${category.toLowerCase()} product with fast tracked shipping.`,
  cost: Math.round(price * 0.55),
}));

// ---------- Customers ----------
export const customers: Customer[] = Array.from({ length: 42 }, (_, i) => {
  const name = `${pick(FIRST)} ${pick(LAST)}`;
  const orders = between(1, 28);
  return {
    id: `cus_${i + 1}`,
    name,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}${i}@mail.com`,
    phone: phone(),
    city: pick(CITIES),
    orders,
    spent: orders * between(25, 160),
    status: i % 13 === 5 ? "Blocked" : orders > 20 ? "VIP" : "Active",
    joined: daysAgo(between(10, 600)),
  };
});

// ---------- Orders ----------
const STATUS_POOL: OrderStatus[] = ["Delivered", "Delivered", "Delivered", "Shipped", "Processing", "Pending", "Pending", "Cancelled", "Returned"];
export const orders: Order[] = Array.from({ length: 64 }, (_, i) => {
  const c = pick(customers);
  return {
    id: `ord_${i + 1}`,
    number: `#${1064 - i}`,
    customer: c.name, phone: c.phone, city: c.city,
    items: between(1, 5),
    total: between(18, 420),
    payment: pick(["Card", "Card", "Card", "PayPal", "PayPal", "Bank transfer", "COD"] as const),
    status: i < 4 ? pick(["Pending", "Processing"] as const) : pick(STATUS_POOL),
    date: daysAgo(Math.floor(i / 2)),
  };
});

// ---------- Charts ----------
const MONTHS = ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
export const monthlyRevenue = MONTHS.map((month, i) => ({
  month,
  revenue: Math.round(38_000 + i * 2_600 + rand() * 9_000),
  orders: Math.round(620 + i * 52 + rand() * 140),
  visitors: Math.round(21_000 + i * 1_400 + rand() * 6_000),
})).map((m) => ({ ...m, profit: Math.round(m.revenue * (0.26 + rand() * 0.08)) }));
export const weeklyActiveUsers = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9"].map((label) => ({ label, value: between(380, 980) }));
export const funnel = [
  { label: "Visitors", value: 48_200 }, { label: "Product views", value: 21_900 }, { label: "Added to cart", value: 6_840 },
  { label: "Checkout started", value: 3_120 }, { label: "Purchased", value: 1_844 },
];
export const weekdayOrders = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => ({ day, orders: between(110, 260) }));
export const trafficSources = [
  { label: "Google", value: 38 }, { label: "Facebook / Instagram", value: 29 }, { label: "Direct", value: 19 }, { label: "SMS and email", value: 14 },
];

// ---------- Blog ----------
const BLOG_SEED: [string, string][] = [
  ["How to choose the right GPS tracker for your car", "Guides"], ["10 skincare tips for humid weather", "Beauty"],
  ["Holiday collection 2026 is live", "News"], ["Card vs PayPal: which checkout is faster?", "Shopping"],
  ["Keep your home safe with WiFi cameras", "Guides"], ["Our new 2-day express shipping", "News"],
  ["Best kitchen gadgets under $50", "Reviews"], ["Winter fashion trends for this season", "Fashion"],
];
export const blogPosts: BlogPost[] = BLOG_SEED.map(([title, category], i) => ({
  id: `post_${i + 1}`,
  title, category,
  slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  author: i % 2 ? "Elora Editor" : "Admin User",
  status: i === 2 ? "Scheduled" : i === 6 ? "Draft" : "Published",
  views: i === 6 ? 0 : between(300, 9800),
  date: daysAgo(i * 4 + 1),
  content: `${title}.\n\nThis is demo blog content. Write your article here or use the AI writer to draft it for you.\n\nTip: keep paragraphs short and add a clear call to action at the end.`,
}));

// ---------- Marketing ----------
export const coupons: Coupon[] = [
  { id: "cpn_1", code: "WELCOME10", type: "Percent", value: 10, minOrder: 25, used: 412, limit: 1000, expires: daysAgo(-60), status: "Active" },
  { id: "cpn_2", code: "SAVE20", type: "Fixed", value: 20, minOrder: 120, used: 188, limit: 300, expires: daysAgo(-12), status: "Active" },
  { id: "cpn_3", code: "FREESHIP", type: "Fixed", value: 8, minOrder: 50, used: 950, limit: 2000, expires: daysAgo(-30), status: "Active" },
  { id: "cpn_4", code: "WINTER15", type: "Percent", value: 15, minOrder: 60, used: 0, limit: 500, expires: daysAgo(-90), status: "Paused" },
  { id: "cpn_5", code: "BLACKFRI30", type: "Percent", value: 30, minOrder: 80, used: 300, limit: 300, expires: daysAgo(20), status: "Expired" },
];

// ---------- SMS ----------
export const smsTemplates: SmsTemplate[] = [
  { id: "tpl_1", name: "Order confirmed", body: "Dear {name}, your order {order} is confirmed. Total ${amount}. Thank you for shopping with us!" },
  { id: "tpl_2", name: "Order shipped", body: "Hi {name}, your order {order} has been shipped. Track: {link}" },
  { id: "tpl_3", name: "OTP", body: "Your verification code is {code}. It expires in 5 minutes. Never share it with anyone." },
  { id: "tpl_4", name: "Offer", body: "Flash sale! Get 15% off with code WINTER15 till Friday. Shop now: {link}" },
];
export const smsCampaigns: SmsCampaign[] = [
  { id: "cmp_1", name: "Black Friday flash sale", audience: "All customers", recipients: 3912, delivered: 3804, status: "Sent", date: daysAgo(9) },
  { id: "cmp_2", name: "VIP early access", audience: "VIP customers", recipients: 214, delivered: 211, status: "Sent", date: daysAgo(4) },
  { id: "cmp_3", name: "Winter collection", audience: "New York customers", recipients: 1630, delivered: 0, status: "Scheduled", date: daysAgo(-2) },
];
export const smsLogs: SmsLog[] = orders.slice(0, 18).map((o, i) => ({
  id: `sms_${i + 1}`,
  to: o.phone,
  message: i % 3 === 0 ? `Your order ${o.number} has been shipped.` : `Dear ${o.customer.split(" ")[0]}, your order ${o.number} is confirmed.`,
  status: i % 7 === 3 ? "Failed" : i < 2 ? "Queued" : "Delivered",
  provider: "Twilio",
  at: o.date,
}));

// ---------- Audit log ----------
export const demoAudit: AuditEntry[] = [
  { id: "aud_1", at: daysAgo(0, 2), actor: "admin@demo.com", action: "login.success", target: "session", ip: "103.4.145.10", level: "info" },
  { id: "aud_2", at: daysAgo(0, 4), actor: "unknown", action: "login.failed", target: "admin@demo.com", ip: "45.12.88.201", level: "warning" },
  { id: "aud_3", at: daysAgo(0, 5), actor: "manager@demo.com", action: "product.update", target: "GPS Tracker V3", ip: "103.4.145.22", level: "info" },
  { id: "aud_4", at: daysAgo(1), actor: "support@demo.com", action: "sms.send", target: "+1415xxxxxxx", ip: "103.4.145.31", level: "info" },
  { id: "aud_5", at: daysAgo(1), actor: "unknown", action: "login.rate_limited", target: "admin@demo.com", ip: "45.12.88.201", level: "danger" },
  { id: "aud_6", at: daysAgo(2), actor: "admin@demo.com", action: "staff.suspend", target: "fahim@demo.com", ip: "103.4.145.10", level: "warning" },
  { id: "aud_7", at: daysAgo(3), actor: "editor@demo.com", action: "blog.publish", target: "Holiday collection 2026 is live", ip: "103.4.145.40", level: "info" },
];

// ======================================================================
// Advanced business modules
// ======================================================================
export type Warehouse = { id: string; name: string; location: string; capacity: number; used: number; manager: string };
export type StockMovement = { id: string; product: string; sku: string; type: "Stock in" | "Stock out" | "Transfer" | "Adjustment"; qty: number; warehouse: string; ref: string; date: string };
export type Supplier = { id: string; name: string; contact: string; email: string; phone: string; country: string; leadTime: number; rating: number; balance: number; status: "Active" | "On hold" };
export type PurchaseOrder = { id: string; number: string; supplier: string; items: number; total: number; status: "Draft" | "Ordered" | "Received" | "Cancelled"; expected: string; created: string };
export type Invoice = { id: string; number: string; customer: string; amount: number; tax: number; status: "Paid" | "Unpaid" | "Overdue" | "Refunded"; issued: string; due: string; method: PaymentMethod };
export type Expense = { id: string; title: string; category: string; vendor: string; amount: number; status: "Paid" | "Pending"; date: string };
export type Shipment = { id: string; tracking: string; order: string; customer: string; carrier: string; destination: string; status: "Label created" | "In transit" | "Out for delivery" | "Delivered" | "Exception"; eta: string; cost: number };
export type Ticket = { id: string; number: string; subject: string; customer: string; channel: "Email" | "Chat" | "Phone" | "SMS"; priority: "Low" | "Medium" | "High" | "Urgent"; status: "Open" | "Pending" | "Resolved" | "Closed"; assignee: string; updated: string; reply: string };
export type Review = { id: string; product: string; customer: string; rating: number; comment: string; status: "Approved" | "Pending" | "Hidden"; date: string };
export type Project = { id: string; name: string; owner: string; members: string; budget: number; completion: number; status: "Planning" | "In progress" | "Completed" | "On hold"; due: string };
export type AbandonedCart = { id: string; customer: string; email: string; items: number; value: number; lastSeen: string; status: "Not contacted" | "Reminder sent" | "Recovered" };
export type TimelineItem = { id: string; title: string; at: string; tone: "green" | "blue" | "amber" | "red" | "violet" };

export const warehouses: Warehouse[] = [
  { id: "wh_1", name: "Main warehouse", location: "New Jersey, US", capacity: 12000, used: 8740, manager: "Mahmud Manager" },
  { id: "wh_2", name: "EU fulfilment", location: "Berlin, DE", capacity: 6000, used: 3310, manager: "Tasnim Rahman" },
  { id: "wh_3", name: "Asia hub", location: "Dhaka, BD", capacity: 8000, used: 6920, manager: "Rumana Akter" },
];

const WH = warehouses.map((w) => w.name);
export const stockMovements: StockMovement[] = Array.from({ length: 30 }, (_, i) => {
  const p = pick(products);
  const type = pick(["Stock in", "Stock out", "Stock out", "Transfer", "Adjustment"] as const);
  return {
    id: `mov_${i + 1}`, product: p.name, sku: p.sku, type,
    qty: type === "Stock in" ? between(40, 300) : type === "Adjustment" ? -between(1, 6) : between(2, 40),
    warehouse: pick(WH), ref: type === "Stock in" ? `PO-${2040 + i}` : type === "Stock out" ? `#${1064 - i}` : `TR-${300 + i}`,
    date: daysAgo(Math.floor(i / 2)),
  };
});

export const suppliers: Supplier[] = [
  { id: "sup_1", name: "Shenzhen Tech Supply", contact: "Li Wei", email: "sales@sztech.example", phone: "+8675512345678", country: "China", leadTime: 14, rating: 4.6, balance: 12400, status: "Active" },
  { id: "sup_2", name: "Glow Labs Cosmetics", contact: "Emma Brown", email: "orders@glowlabs.example", phone: "+14155550190", country: "USA", leadTime: 7, rating: 4.8, balance: 3200, status: "Active" },
  { id: "sup_3", name: "Dhaka Textile Co.", contact: "Arif Hasan", email: "export@dhakatex.example", phone: "+8801711223344", country: "Bangladesh", leadTime: 21, rating: 4.4, balance: 8900, status: "Active" },
  { id: "sup_4", name: "HomeWare GmbH", contact: "Lukas Meyer", email: "b2b@homeware.example", phone: "+49301234567", country: "Germany", leadTime: 10, rating: 4.1, balance: 0, status: "On hold" },
  { id: "sup_5", name: "Pure Organic Farms", contact: "Sara Khan", email: "hello@pureorganic.example", phone: "+97150123456", country: "UAE", leadTime: 5, rating: 4.7, balance: 1150, status: "Active" },
];

export const purchaseOrders: PurchaseOrder[] = Array.from({ length: 14 }, (_, i) => ({
  id: `po_${i + 1}`, number: `PO-${2054 - i}`, supplier: pick(suppliers).name, items: between(3, 18),
  total: between(900, 18000), status: i < 2 ? "Draft" : i < 6 ? "Ordered" : i === 9 ? "Cancelled" : "Received",
  expected: daysAgo(-between(2, 20)), created: daysAgo(i * 3 + 1),
}));

export const invoices: Invoice[] = orders.slice(0, 40).map((o, i) => {
  const status: Invoice["status"] = o.status === "Returned" ? "Refunded" : i % 9 === 4 ? "Overdue" : i < 5 ? "Unpaid" : "Paid";
  return {
    id: `inv_${i + 1}`, number: `INV-${5200 - i}`, customer: o.customer, amount: o.total,
    tax: Math.round(o.total * 0.08 * 100) / 100, status, issued: o.date,
    due: new Date(new Date(o.date).getTime() + 14 * 86_400_000).toISOString(), method: o.payment,
  };
});

const EXPENSE_SEED: [string, string, string, number][] = [
  ["Google Ads - November", "Marketing", "Google", 4200], ["Meta ads campaign", "Marketing", "Meta", 3100],
  ["Carrier invoice", "Shipping", "DHL", 2650], ["Carrier invoice", "Shipping", "FedEx", 1980],
  ["Staff salaries", "Salaries", "Payroll", 8800], ["Warehouse rent", "Rent", "Prologis", 3200],
  ["Hosting and VPS", "Software", "Hostinger", 89], ["Email and SMS credits", "Software", "Twilio", 420],
  ["Packaging materials", "Operations", "Uline", 760], ["Electricity", "Utilities", "Con Edison", 610],
  ["Product photography", "Marketing", "Studio 9", 900], ["Accounting software", "Software", "Xero", 70],
];
export const expenses: Expense[] = EXPENSE_SEED.map(([title, category, vendor, amount], i) => ({
  id: `exp_${i + 1}`, title, category, vendor, amount, status: i % 5 === 2 ? "Pending" : "Paid", date: daysAgo(i * 2 + 1),
}));

const CARRIERS = ["DHL", "FedEx", "UPS", "Local courier"];
export const shipments: Shipment[] = orders.filter((o) => o.status !== "Cancelled").slice(0, 26).map((o, i) => ({
  id: `shp_${i + 1}`, tracking: `${pick(["DH", "FX", "UP", "LC"])}${between(100000000, 999999999)}`, order: o.number, customer: o.customer,
  carrier: pick(CARRIERS), destination: o.city,
  status: o.status === "Delivered" ? "Delivered" : o.status === "Shipped" ? pick(["In transit", "Out for delivery"] as const) : i % 11 === 7 ? "Exception" : "Label created",
  eta: daysAgo(-between(0, 6)), cost: between(4, 28),
}));

const TICKET_SEED: [string, Ticket["priority"]][] = [
  ["Order arrived damaged", "High"], ["Where is my package?", "Medium"], ["Refund not received yet", "Urgent"],
  ["Change delivery address", "Medium"], ["Coupon code not working", "Low"], ["Wrong size delivered", "High"],
  ["Payment charged twice", "Urgent"], ["Product question: battery life", "Low"], ["Cancel my order", "Medium"],
  ["Invoice copy needed", "Low"], ["Login problem on website", "Medium"], ["Bulk order discount", "Low"],
];
export const tickets: Ticket[] = TICKET_SEED.map(([subject, priority], i) => ({
  id: `tkt_${i + 1}`, number: `T-${880 - i}`, subject, priority, customer: pick(customers).name,
  channel: pick(["Email", "Chat", "Chat", "Phone", "SMS"] as const),
  status: i < 4 ? "Open" : i < 7 ? "Pending" : i < 10 ? "Resolved" : "Closed",
  assignee: pick(["Sohel Support", "Rumana Akter", "Unassigned"]), updated: daysAgo(Math.floor(i / 2), between(1, 12)), reply: "",
}));

const REVIEW_TEXT = [
  "Great quality, fast shipping. Would buy again.", "Works as described. Packaging could be better.", "Absolutely love it!",
  "Took longer than expected to arrive.", "Good value for the price.", "Not what I expected, colour was different.",
  "Customer support helped me quickly. 5 stars.", "Battery lasts all day, very happy.",
];
export const reviews: Review[] = Array.from({ length: 20 }, (_, i) => {
  const rating = pick([5, 5, 5, 4, 4, 3, 2]);
  return {
    id: `rev_${i + 1}`, product: pick(products).name, customer: pick(customers).name, rating,
    comment: pick(REVIEW_TEXT), status: i < 4 ? "Pending" : rating <= 2 && i % 2 ? "Hidden" : "Approved", date: daysAgo(i),
  };
});

export const projects: Project[] = [
  { id: "prj_1", name: "Holiday season campaign", owner: "Mahmud Manager", members: "Mahmud Manager, Elora Editor, Tasnim Rahman", budget: 14000, completion: 72, status: "In progress", due: daysAgo(-12) },
  { id: "prj_2", name: "Mobile app checkout redesign", owner: "Admin User", members: "Admin User, Fahim Chowdhury", budget: 9000, completion: 38, status: "In progress", due: daysAgo(-30) },
  { id: "prj_3", name: "New EU warehouse setup", owner: "Tasnim Rahman", members: "Tasnim Rahman, Rumana Akter, Mahmud Manager, Sohel Support", budget: 32000, completion: 90, status: "In progress", due: daysAgo(-4) },
  { id: "prj_4", name: "Product photography refresh", owner: "Elora Editor", members: "Elora Editor", budget: 2500, completion: 100, status: "Completed", due: daysAgo(6) },
  { id: "prj_5", name: "Loyalty points programme", owner: "Admin User", members: "Admin User, Mahmud Manager", budget: 6000, completion: 10, status: "Planning", due: daysAgo(-45) },
  { id: "prj_6", name: "Supplier contract renewals", owner: "Mahmud Manager", members: "Mahmud Manager, Rumana Akter", budget: 0, completion: 55, status: "On hold", due: daysAgo(-20) },
];

export const abandonedCarts: AbandonedCart[] = customers.slice(0, 14).map((c, i) => ({
  id: `cart_${i + 1}`, customer: c.name, email: c.email, items: between(1, 5), value: between(25, 380),
  lastSeen: daysAgo(Math.floor(i / 3), between(1, 20)), status: i < 6 ? "Not contacted" : i < 11 ? "Reminder sent" : "Recovered",
}));

export const orderTimeline: TimelineItem[] = [
  { id: "tl_1", title: `$${orders[0].total} - new order ${orders[0].number}`, at: daysAgo(0, 1), tone: "green" },
  { id: "tl_2", title: "Purchase order PO-2052 received (240 units)", at: daysAgo(0, 3), tone: "blue" },
  { id: "tl_3", title: `Payment received for INV-5196`, at: daysAgo(0, 5), tone: "violet" },
  { id: "tl_4", title: "Refund issued for order #1041", at: daysAgo(1, 2), tone: "red" },
  { id: "tl_5", title: "Low stock alert: GPS Tracker V3", at: daysAgo(1, 6), tone: "amber" },
  { id: "tl_6", title: "Black Friday SMS campaign sent to 3,912 customers", at: daysAgo(2, 4), tone: "blue" },
];

/** Monthly goal used on the dashboard. */
export const monthlyTarget = 75_000;
