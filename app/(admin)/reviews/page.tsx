// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
import type { Metadata } from "next";
import { requirePage } from "@/lib/auth";
import { reviews } from "@/lib/demo-data";
import { Card, Forbidden, PageHeader, Progress, Stars } from "@/components/ui";
import ReviewsClient from "./ReviewsClient";

export const metadata: Metadata = { title: "Reviews" };

export default async function ReviewsPage() {
  const { allowed } = await requirePage("reviews:manage");
  if (!allowed) return <Forbidden />;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  return (
    <>
      <PageHeader title="Reviews" subtitle="Approve, hide and answer product reviews." />
      <div className="grid gap-5 xl:grid-cols-3">
        <Card title="Average rating">
          <p className="text-4xl font-bold text-ink">{avg.toFixed(1)}<span className="text-lg text-slate-400"> / 5</span></p>
          <p className="mt-1 text-xl"><Stars rating={Math.round(avg)} /></p>
          <p className="mt-1 text-xs text-slate-400">{reviews.length} reviews · {reviews.filter((r) => r.status === "Pending").length} waiting for approval</p>
        </Card>
        <Card title="Rating breakdown" className="xl:col-span-2">
          <ul className="space-y-2.5">
            {[5, 4, 3, 2, 1].map((n) => {
              const c = reviews.filter((r) => r.rating === n).length;
              return (
                <li key={n} className="flex items-center gap-3 text-sm">
                  <span className="w-10 text-slate-500">{n} ★</span>
                  <div className="flex-1"><Progress value={(c / reviews.length) * 100} tone={n >= 4 ? "green" : n === 3 ? "amber" : "red"} /></div>
                  <span className="w-6 text-right font-semibold">{c}</span>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
      <div className="mt-5"><ReviewsClient rows={reviews} /></div>
    </>
  );
}
