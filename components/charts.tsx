// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
// Dependency-free SVG charts (work as server components; hover shows native tooltips).

type Point = { label: string; value: number };
const BLUE = "#1660f5";
const fmt = (n: number) => (n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + "M" : n >= 1000 ? (n / 1000).toFixed(n >= 10_000 ? 0 : 1) + "k" : String(Math.round(n)));

/** Catmull-Rom spline converted to cubic Bézier segments for smooth lines. */
function smoothPath(pts: [number, number][]) {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
  }
  return d;
}

export type Series = { name: string; color: string; values: number[] };

export function SmoothLineChart({ labels, series, height = 260, prefix = "" }: { labels: string[]; series: Series[]; height?: number; prefix?: string }) {
  const w = 680, h = height, pad = { l: 46, r: 12, t: 14, b: 30 };
  const max = Math.max(...series.flatMap((s) => s.values)) * 1.12;
  const x = (i: number) => pad.l + (i * (w - pad.l - pad.r)) / Math.max(1, labels.length - 1);
  const y = (v: number) => pad.t + (1 - v / max) * (h - pad.t - pad.b);
  return (
    <div className="chart-scroll">
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label="Line chart">
      <defs>
        {series.map((s, i) => (
          <linearGradient key={s.name} id={`fill-${i}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={s.color} stopOpacity={series.length > 2 ? 0.08 : 0.18} />
            <stop offset="100%" stopColor={s.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <g key={t}>
          <line x1={pad.l} x2={w - pad.r} y1={y(t * max)} y2={y(t * max)} stroke="#eef1f6" />
          <text x={pad.l - 10} y={y(t * max) + 4} textAnchor="end" fontSize="11" fill="#9aa3b5">{prefix}{fmt(t * max)}</text>
        </g>
      ))}
      {series.map((s, i) => {
        const pts = s.values.map((v, j) => [x(j), y(v)] as [number, number]);
        const line = smoothPath(pts);
        return (
          <g key={s.name}>
            <path d={`${line} L${x(pts.length - 1)},${h - pad.b} L${x(0)},${h - pad.b} Z`} fill={`url(#fill-${i})`} />
            <path d={line} fill="none" stroke={s.color} strokeWidth="3" strokeLinecap="round" />
            {s.values.map((v, j) => (
              <circle key={j} cx={x(j)} cy={y(v)} r="10" fill="transparent"><title>{`${s.name} · ${labels[j]}: ${prefix}${v.toLocaleString("en-US")}`}</title></circle>
            ))}
          </g>
        );
      })}
      {labels.map((l, i) => <text key={l} x={x(i)} y={h - 8} textAnchor="middle" fontSize="11" fill="#9aa3b5">{l}</text>)}
    </svg>
    </div>
  );
}

export function Legend({ series }: { series: { name: string; color: string }[] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
      {series.map((s) => (
        <span key={s.name} className="flex items-center gap-1.5"><span className="h-1 w-4 rounded-full" style={{ background: s.color }} />{s.name}</span>
      ))}
    </div>
  );
}

/** White rounded bars meant to sit on the blue gradient panel. */
export function GradientBars({ data, height = 200 }: { data: Point[]; height?: number }) {
  const w = 420, h = height, pad = { l: 40, r: 6, t: 10, b: 26 };
  const max = Math.ceil((Math.max(...data.map((d) => d.value)) * 1.1) / 100) * 100;
  const slot = (w - pad.l - pad.r) / data.length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label="Bar chart">
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const yy = pad.t + (1 - t) * (h - pad.t - pad.b);
        return <text key={t} x={pad.l - 10} y={yy + 4} textAnchor="end" fontSize="11" fill="rgba(255,255,255,.85)" fontWeight="600">{Math.round(t * max).toLocaleString("en-US")}</text>;
      })}
      {data.map((d, i) => {
        const bh = (d.value / max) * (h - pad.t - pad.b);
        const cx = pad.l + slot * i + slot / 2;
        return (
          <g key={d.label}>
            <rect x={cx - 5} y={h - pad.b - bh} width="10" height={bh} rx="5" fill="#fff"><title>{`${d.label}: ${d.value}`}</title></rect>
            <text x={cx} y={h - 6} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,.85)" fontWeight="600">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function AreaChart({ data, height = 220, prefix = "" }: { data: Point[]; height?: number; prefix?: string }) {
  return <SmoothLineChart labels={data.map((d) => d.label)} series={[{ name: "Value", color: BLUE, values: data.map((d) => d.value) }]} height={height} prefix={prefix} />;
}

export function BarChart({ data, height = 200, color = BLUE, width = 640, prefix = "" }: { data: Point[]; height?: number; color?: string; width?: number; prefix?: string }) {
  const w = width, h = height, pad = { l: 42, r: 8, t: 10, b: 26 };
  const max = Math.max(...data.map((d) => d.value)) * 1.1;
  const slot = (w - pad.l - pad.r) / data.length;
  const bw = Math.min(28, slot * 0.5);
  return (
    <div className="chart-scroll">
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label="Bar chart">
      {[0, 0.5, 1].map((t) => {
        const yy = pad.t + (1 - t) * (h - pad.t - pad.b);
        return (
          <g key={t}>
            <line x1={pad.l} x2={w - pad.r} y1={yy} y2={yy} stroke="#eef1f6" />
            <text x={pad.l - 8} y={yy + 4} textAnchor="end" fontSize="11" fill="#9aa3b5">{prefix}{fmt(t * max)}</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const bh = (d.value / max) * (h - pad.t - pad.b);
        const cx = pad.l + slot * i + slot / 2;
        return (
          <g key={d.label}>
            <rect x={cx - bw / 2} y={h - pad.b - bh} width={bw} height={bh} rx="6" fill={color}><title>{`${d.label}: ${prefix}${d.value.toLocaleString("en-US")}`}</title></rect>
            <text x={cx} y={h - 8} textAnchor="middle" fontSize="11" fill="#9aa3b5">{d.label}</text>
          </g>
        );
      })}
    </svg>
    </div>
  );
}

const DONUT_COLORS = ["#1660f5", "#22c55e", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4", "#ec4899", "#64748b"];

export function Donut({ data, centerLabel }: { data: Point[]; centerLabel?: string }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = 52, c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
      <svg viewBox="0 0 140 140" className="size-36 shrink-0 -rotate-90" role="img" aria-label="Donut chart">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#f1f4f9" strokeWidth="16" />
        {data.map((d, i) => {
          const len = (d.value / total) * c;
          const el = (
            <circle key={d.label} cx="70" cy="70" r={r} fill="none" stroke={DONUT_COLORS[i % DONUT_COLORS.length]} strokeWidth="16"
              strokeDasharray={`${Math.max(0, len - 2)} ${c - len + 2}`} strokeDashoffset={-offset} strokeLinecap="round"><title>{`${d.label}: ${d.value}`}</title></circle>
          );
          offset += len;
          return el;
        })}
        {centerLabel && <text x="70" y="76" textAnchor="middle" fontSize="18" fontWeight="700" fill="#141a2e" transform="rotate(90 70 70)">{centerLabel}</text>}
      </svg>
      <ul className="w-full flex-1 space-y-2.5 text-sm">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center gap-2">
            <span className="size-2.5 rounded-full" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
            <span className="text-slate-500">{d.label}</span>
            <span className="ml-auto pl-3 font-semibold text-ink">{Math.round((d.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Circular progress (e.g. monthly goal). */
export function Ring({ value, label, sub }: { value: number; label: string; sub?: string }) {
  const r = 54, c = 2 * Math.PI * r, v = Math.max(0, Math.min(100, value));
  return (
    <div className="relative mx-auto size-40">
      <svg viewBox="0 0 140 140" className="size-40 -rotate-90" role="img" aria-label={`${Math.round(v)}%`}>
        <circle cx="70" cy="70" r={r} fill="none" stroke="#eef1f6" strokeWidth="12" />
        <circle cx="70" cy="70" r={r} fill="none" stroke={BLUE} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(v / 100) * c} ${c}`} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div><p className="text-2xl font-bold text-ink">{label}</p>{sub && <p className="text-xs text-slate-400">{sub}</p>}</div>
      </div>
    </div>
  );
}

/** Horizontal conversion funnel. */
export function Funnel({ steps }: { steps: Point[] }) {
  const top = steps[0]?.value || 1;
  return (
    <ul className="space-y-3">
      {steps.map((s, i) => {
        const pctTop = (s.value / top) * 100;
        const conv = i ? Math.round((s.value / steps[i - 1].value) * 1000) / 10 : 100;
        return (
          <li key={s.label}>
            <div className="mb-1 flex justify-between text-xs"><span className="text-slate-500">{s.label}</span><span className="font-semibold text-ink">{s.value.toLocaleString("en-US")} <span className="font-normal text-slate-400">· {conv}%</span></span></div>
            <div className="h-2.5 rounded-full bg-slate-100"><div className="h-2.5 rounded-full bg-gradient-to-r from-brand-600 to-indigo-400" style={{ width: `${Math.max(3, pctTop)}%` }} /></div>
          </li>
        );
      })}
    </ul>
  );
}
