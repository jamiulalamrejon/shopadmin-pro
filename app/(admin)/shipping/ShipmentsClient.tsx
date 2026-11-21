// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
"use client";
import ResourceManager, { type Column, type Field } from "@/components/ResourceManager";
import { Badge } from "@/components/ui";
import { shortDate } from "@/lib/format";
import type { Shipment } from "@/lib/demo-data";

const STATUS = ["Label created", "In transit", "Out for delivery", "Delivered", "Exception"];
const columns: Column<Shipment>[] = [
  { key: "tracking", label: "Tracking", render: (s) => <span className="font-mono text-xs font-semibold text-ink">{s.tracking}</span> },
  { key: "order", label: "Order" },
  { key: "customer", label: "Customer" },
  { key: "carrier", label: "Carrier" },
  { key: "destination", label: "Destination" },
  { key: "eta", label: "ETA", render: (s) => shortDate(s.eta) },
  { key: "cost", label: "Cost", align: "right", render: (s) => `$${s.cost}` },
  { key: "status", label: "Status", render: (s) => <Badge>{s.status}</Badge> },
];

export default function ShipmentsClient({ rows, carriers }: { rows: Shipment[]; carriers: string[] }) {
  const fields: Field[] = [
    { key: "tracking", label: "Tracking number", required: true },
    { key: "order", label: "Order number", required: true },
    { key: "customer", label: "Customer" },
    { key: "carrier", label: "Carrier", type: "select", options: carriers },
    { key: "destination", label: "Destination" },
    { key: "cost", label: "Shipping cost ($)", type: "number" },
    { key: "eta", label: "Estimated delivery", type: "date" },
    { key: "status", label: "Status", type: "select", options: STATUS },
  ];
  return (
    <ResourceManager entity="Shipment" rows={rows} columns={columns} fields={fields} canEdit
      searchKeys={["tracking", "order", "customer", "destination"]} filter={{ key: "status", label: "Status", options: STATUS }}
      defaults={{ status: "Label created", carrier: carriers[0], cost: 0 }} />
  );
}
