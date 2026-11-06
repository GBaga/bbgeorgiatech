// Hero backdrop: construction lines that draw themselves across the grid and
// technical-drawing corner marks, so the page "is drafted" as it opens.
// Pure CSS (see .draw-line / .corner-mark), so it costs no JavaScript.
export function HeroBlueprint({ color = "#5c9cff" }: { color?: string }) {
  const lines = [
    { d: "M0 0.72 H1", delay: "0.1s", o: 0.35 },
    { d: "M0.08 0 V1", delay: "0.25s", o: 0.25 },
    { d: "M0.92 0 V1", delay: "0.4s", o: 0.25 },
    { d: "M0 0.18 H1", delay: "0.55s", o: 0.18 },
    { d: "M0.62 0 V1", delay: "0.7s", o: 0.12 },
  ];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1 1" preserveAspectRatio="none">
        {lines.map((l) => (
          <path
            key={l.d}
            d={l.d}
            pathLength={1}
            className="draw-line"
            style={{ ["--d" as string]: l.delay }}
            stroke={color}
            strokeOpacity={l.o}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
            fill="none"
          />
        ))}
      </svg>
      <div className="absolute inset-x-6 top-28 bottom-8 max-w-6xl mx-auto">
        <span className="corner-mark left-0 top-0 border-l border-t" style={{ ["--d" as string]: "0.5s", borderColor: color }} />
        <span className="corner-mark right-0 top-0 border-r border-t" style={{ ["--d" as string]: "0.6s", borderColor: color }} />
        <span className="corner-mark left-0 bottom-0 border-l border-b" style={{ ["--d" as string]: "0.7s", borderColor: color }} />
        <span className="corner-mark right-0 bottom-0 border-r border-b" style={{ ["--d" as string]: "0.8s", borderColor: color }} />
      </div>
    </div>
  );
}
