"use client";

import { useState } from "react";

/**
 * Small dependency-free charts for the admin. Each one has a hover/tap
 * readout and a visually hidden table, so the numbers are always reachable.
 */

/** How values are shown. Server pages pass one of these, not a function. */
export type ChartFormat = "count" | "percent" | `money:${string}`;

function fmt(format: ChartFormat | undefined, n: number): string {
  if (!format || format === "count") return new Intl.NumberFormat("en-GB").format(n);
  if (format === "percent") return `${Math.round(n * 100)}%`;
  const currency = format.slice(6);
  return new Intl.NumberFormat("en-GB", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
}

export const CHART_COLORS = ["#1E3A2F", "#C9A86A", "#7C8160", "#B5694A", "#5E8C99", "#D6C7A6", "#8FA89A", "#3F4A3C"];

export interface Point {
  label: string;
  /** Short axis label; defaults to `label`. */
  tick?: string;
  values: number[];
}

interface SeriesChartProps {
  data: Point[];
  series: Array<{ name: string; color?: string }>;
  format?: ChartFormat;
  height?: number;
  /** Fixed top of the y axis, e.g. 1 for percentages. */
  max?: number;
  /** Index to mark, e.g. today. */
  marker?: number;
  caption: string;
}

function niceMax(n: number) {
  if (n <= 0) return 1;
  const p = 10 ** Math.floor(Math.log10(n));
  return Math.ceil(n / p) * p;
}

function HiddenTable({ data, series, format, caption }: Pick<SeriesChartProps, "data" | "series" | "format" | "caption">) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead><tr><th>Date</th>{series.map((s) => <th key={s.name}>{s.name}</th>)}</tr></thead>
      <tbody>{data.map((d) => <tr key={d.label}><td>{d.label}</td>{d.values.map((v, i) => <td key={i}>{fmt(format, v)}</td>)}</tr>)}</tbody>
    </table>
  );
}

function Readout({ point, series, format }: { point: Point | null; series: SeriesChartProps["series"]; format?: ChartFormat }) {
  return (
    <div className="flex min-h-[22px] flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-charcoal-soft" aria-hidden="true">
      {point ? (
        <>
          <span className="font-medium text-charcoal">{point.label}</span>
          {series.map((s, i) => (
            <span key={s.name} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: s.color ?? CHART_COLORS[i] }} />
              {s.name}: <span className="tabular-nums text-charcoal">{fmt(format, point.values[i])}</span>
            </span>
          ))}
        </>
      ) : (
        series.map((s, i) => (
          <span key={s.name} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: s.color ?? CHART_COLORS[i] }} />
            {s.name}
          </span>
        ))
      )}
    </div>
  );
}

const W = 600;

/** Stacked bars, one per point. */
export function BarChart({ data, series, format, height = 180, max, marker, caption }: SeriesChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const top = max ?? niceMax(Math.max(0, ...data.map((d) => d.values.reduce((a, b) => a + b, 0))));
  const pad = { l: 0, r: 0, t: 8, b: 20 };
  const h = height - pad.t - pad.b;
  const bw = W / Math.max(1, data.length);
  const tickEvery = Math.ceil(data.length / 8);
  return (
    <figure>
      <Readout point={hover === null ? null : data[hover]} series={series} format={format} />
      <svg viewBox={`0 0 ${W} ${height}`} className="mt-2 block h-auto w-full" role="img" aria-label={caption} onMouseLeave={() => setHover(null)}>
        {[0.25, 0.5, 0.75, 1].map((f) => <line key={f} x1={0} x2={W} y1={pad.t + h * (1 - f)} y2={pad.t + h * (1 - f)} stroke="#E6E1D6" strokeWidth={1} />)}
        {data.map((d, i) => {
          let y = pad.t + h;
          return (
            <g key={d.label} onMouseEnter={() => setHover(i)} onClick={() => setHover(i)}>
              <rect x={i * bw} y={pad.t} width={bw} height={h} fill={hover === i ? "rgba(30,58,47,0.06)" : "transparent"} />
              {d.values.map((v, s) => {
                const bh = top ? (Math.min(v, top) / top) * h : 0;
                y -= bh;
                return <rect key={s} x={i * bw + bw * 0.18} y={y} width={bw * 0.64} height={Math.max(0, bh)} rx={1.5} fill={series[s].color ?? CHART_COLORS[s]} />;
              })}
              {marker === i && <line x1={i * bw + bw / 2} x2={i * bw + bw / 2} y1={pad.t} y2={pad.t + h} stroke="#B5694A" strokeDasharray="3 3" />}
              {i % tickEvery === 0 && <text x={i * bw + bw / 2} y={height - 5} textAnchor="middle" fontSize={11} fill="#7A776F">{d.tick ?? d.label}</text>}
            </g>
          );
        })}
      </svg>
      <HiddenTable data={data} series={series} format={format} caption={caption} />
    </figure>
  );
}

/** Lines over time. */
export function LineChart({ data, series, format, height = 180, max, marker, caption }: SeriesChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const top = max ?? niceMax(Math.max(0, ...data.flatMap((d) => d.values)));
  const pad = { t: 8, b: 20 };
  const h = height - pad.t - pad.b;
  const step = data.length > 1 ? W / (data.length - 1) : W;
  const x = (i: number) => (data.length > 1 ? i * step : W / 2);
  const y = (v: number) => pad.t + h - (top ? (Math.min(v, top) / top) * h : 0);
  const tickEvery = Math.ceil(data.length / 8);
  return (
    <figure>
      <Readout point={hover === null ? null : data[hover]} series={series} format={format} />
      <svg viewBox={`0 0 ${W} ${height}`} className="mt-2 block h-auto w-full overflow-visible" role="img" aria-label={caption} onMouseLeave={() => setHover(null)}>
        {[0.25, 0.5, 0.75, 1].map((f) => <line key={f} x1={0} x2={W} y1={pad.t + h * (1 - f)} y2={pad.t + h * (1 - f)} stroke="#E6E1D6" strokeWidth={1} />)}
        {marker !== undefined && <line x1={x(marker)} x2={x(marker)} y1={pad.t} y2={pad.t + h} stroke="#B5694A" strokeDasharray="3 3" />}
        {series.map((s, si) => {
          const pts = data.map((d, i) => `${x(i)},${y(d.values[si])}`).join(" ");
          const color = s.color ?? CHART_COLORS[si];
          return (
            <g key={s.name}>
              {si === 0 && <polygon points={`0,${pad.t + h} ${pts} ${x(data.length - 1)},${pad.t + h}`} fill={color} opacity={0.08} />}
              <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            </g>
          );
        })}
        {hover !== null && (
          <>
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={pad.t + h} stroke="#1E3A2F" strokeOpacity={0.25} />
            {series.map((s, si) => <circle key={s.name} cx={x(hover)} cy={y(data[hover].values[si])} r={3.5} fill={s.color ?? CHART_COLORS[si]} />)}
          </>
        )}
        {data.map((d, i) => (
          <g key={d.label}>
            <rect x={x(i) - step / 2} y={0} width={step} height={height} fill="transparent" onMouseEnter={() => setHover(i)} onClick={() => setHover(i)} />
            {i % tickEvery === 0 && <text x={x(i)} y={height - 5} textAnchor={i === 0 ? "start" : "middle"} fontSize={11} fill="#7A776F">{d.tick ?? d.label}</text>}
          </g>
        ))}
      </svg>
      <HiddenTable data={data} series={series} format={format} caption={caption} />
    </figure>
  );
}

/** Share of a whole, with a legend that doubles as the readout. */
export function Donut({ items, format, caption, centre }: { items: Array<{ label: string; value: number; note?: string }>; format?: ChartFormat; caption: string; centre?: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const total = items.reduce((n, i) => n + i.value, 0);
  const r = 52;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <figure className="flex flex-wrap items-center gap-6">
      <svg viewBox="0 0 140 140" className="h-[140px] w-[140px] shrink-0 -rotate-90" role="img" aria-label={caption}>
        <circle cx={70} cy={70} r={r} fill="none" stroke="#EFEBE2" strokeWidth={18} />
        {total > 0 && items.map((it, i) => {
          const len = (it.value / total) * c;
          const el = (
            <circle key={it.label} cx={70} cy={70} r={r} fill="none" stroke={CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={hover === i ? 22 : 18}
              strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
          );
          offset += len;
          return el;
        })}
        <text x={70} y={70} transform="rotate(90 70 70)" textAnchor="middle" dominantBaseline="central" fontSize={15} fill="#1E3A2F" className="font-display">
          {hover !== null && total ? `${Math.round((items[hover].value / total) * 100)}%` : centre ?? fmt(format, total)}
        </text>
      </svg>
      <ul className="min-w-[12rem] flex-1 space-y-1.5 text-[13px]">
        {items.map((it, i) => (
          <li key={it.label} className={`flex items-center justify-between gap-3 rounded-[3px] px-1.5 py-0.5 ${hover === i ? "bg-ivory" : ""}`} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <span className="flex min-w-0 items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
              <span className="truncate text-charcoal">{it.label}</span>
            </span>
            <span className="shrink-0 tabular-nums text-charcoal-soft">{fmt(format, it.value)}{it.note && <span className="ml-2 text-charcoal-mute">{it.note}</span>}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

/** A thin bar showing a share, e.g. occupancy. */
export function Meter({ value, label }: { value: number; label: string }) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <div role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct * 100)} aria-label={label} className="h-1.5 w-full overflow-hidden rounded-full bg-[#EFEBE2]">
      <div className="h-full rounded-full bg-forest" style={{ width: `${pct * 100}%` }} />
    </div>
  );
}
