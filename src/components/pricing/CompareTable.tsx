"use client";

import { useState } from "react";
import { Check, Minus } from "lucide-react";

export type ResolvedCell = boolean | string;

type Props = {
  columns: { name: string; featured?: boolean }[];
  rows: { label: string; cells: ResolvedCell[] }[];
  labels: { feature: string; included: string; notIncluded: string };
};

function CellValue({ value, labels, featured }: { value: ResolvedCell; labels: Props["labels"]; featured?: boolean }) {
  if (value === true) {
    return (
      <span className={`inline-flex w-6 h-6 items-center justify-center border ${featured ? "border-primary bg-primary/15 text-primary" : "border-primary/40 bg-primary/5 text-primary"}`}>
        <Check className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="sr-only">{labels.included}</span>
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex w-6 h-6 items-center justify-center text-neutral-600">
        <Minus className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="sr-only">{labels.notIncluded}</span>
      </span>
    );
  }
  return <span className="font-mono text-xs md:text-sm text-neutral-200">{value}</span>;
}

// Desktop: a full table with the featured column highlighted.
// Mobile: three columns don't fit, so a square tab bar picks one column and
// the rows show as label → value.
export function CompareTable({ columns, rows, labels }: Props) {
  const featuredIndex = Math.max(columns.findIndex((c) => c.featured), 0);
  const [mobileCol, setMobileCol] = useState(featuredIndex);

  return (
    <div className="border border-white/10 bg-background-deep/80 backdrop-blur-sm">
      {/* Desktop table */}
      <table className="hidden md:table w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-white/10">
            <th scope="col" className="p-5 font-mono text-xs uppercase tracking-[0.2em] text-neutral-500 font-normal">
              {labels.feature}
            </th>
            {columns.map((c) => (
              <th
                key={c.name}
                scope="col"
                className={`p-5 w-[18%] text-center font-logo text-sm uppercase tracking-tighter font-normal ${
                  c.featured ? "text-primary bg-primary/[0.06] border-x border-primary/30" : "text-neutral-50"
                }`}
              >
                {c.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors">
              <th scope="row" className="p-4 pl-5 font-inter text-sm text-neutral-400 font-normal">
                {r.label}
              </th>
              {r.cells.map((v, i) => (
                <td
                  key={i}
                  className={`p-4 text-center ${columns[i]?.featured ? "bg-primary/[0.06] border-x border-primary/30" : ""}`}
                >
                  <CellValue value={v} labels={labels} featured={columns[i]?.featured} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile: pick a column */}
      <div className="md:hidden">
        <div role="tablist" className="grid border-b border-white/10" style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
          {columns.map((c, i) => {
            const active = i === mobileCol;
            return (
              <button
                key={c.name}
                role="tab"
                aria-selected={active}
                onClick={() => setMobileCol(i)}
                className={`py-3 font-logo text-xs uppercase tracking-tighter transition-colors border-b-2 -mb-px ${
                  active ? "text-primary border-primary bg-primary/[0.06]" : "text-neutral-400 border-transparent"
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
        <ul role="tabpanel">
          {rows.map((r) => (
            <li key={r.label} className="flex items-center justify-between gap-4 px-4 py-3 border-b border-white/5 last:border-b-0">
              <span className="font-inter text-sm text-neutral-400">{r.label}</span>
              <span className="shrink-0 text-right">
                <CellValue value={r.cells[mobileCol]} labels={labels} featured={columns[mobileCol]?.featured} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
