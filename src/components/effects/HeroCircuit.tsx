import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { Link } from "../../i18n/routing";
import { VERTICALS, type Vertical } from "../../data/verticals";

// Home hero visual: a beam runs along the 60px blueprint grid and "switches
// on" eight businesses, one per industry page. Everything is laid out at
// render time and animated with plain CSS (see .hc-* in globals.css), so it
// starts on first paint and needs no JavaScript. Each tile links to its
// /for/[slug] page.
//
// Desktop: two columns of tiles with the beam zigzagging down the channel
// between them. Tiles are 1 / 2 / 3 grid cells wide at lg / xl / 2xl; one
// scene per width is rendered and CSS shows the one that fits.
// Phones: a 4 x 2 strip under the CTAs (HeroCircuitStrip).

const G = 60; // must match .lucien-blueprint background-size
const LEAD = 1800; // px the beam travels in from the left before the circuit
const EXIT = 900; // px it runs on to the right after the last tile
const T0 = 0.8; // s: beam starts
const LEAD_DUR = 0.9;
const TC = T0 + LEAD_DUR; // s: beam reaches the first tile
const RUN = 3; // s: first tile to last tile
// The closing pulse fires at --hc-p in globals.css (TC + RUN + 0.7).
const AMBIENT_AT = TC + RUN + 3.2;

type P = readonly [number, number];

const TILES = VERTICALS.filter((v) => v.ready).slice(0, 8);

const vars = (v: Record<string, string | number>) => v as CSSProperties;
const r = (n: number) => Math.round(n * 1000) / 1000;
const toPath = (pts: readonly P[]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x + 0.5} ${y + 0.5}`).join(" ");
const dist = (pts: readonly P[]) =>
  pts.reduce((sum, p, i) => (i ? sum + Math.abs(p[0] - pts[i - 1][0]) + Math.abs(p[1] - pts[i - 1][1]) : 0), 0);

// The route for tiles `tw` cells wide, and the index of the point where the
// beam touches each tile (left column, right column, left, right …).
function circuit(tw: number) {
  const X1 = tw * G;
  const X2 = (tw + 1) * G;
  const pts: P[] = [[0, G], [X2, G]];
  const hits = [0, 1];
  for (let i = 0; i < 4; i++) {
    pts.push([X2, (2 * i + 2) * G]);
    if (i < 3) {
      pts.push([X1, (2 * i + 2) * G]);
      hits.push(pts.length - 1);
      pts.push([X1, (2 * i + 3) * G]);
      pts.push([X2, (2 * i + 3) * G]);
      hits.push(pts.length - 1);
    }
  }
  pts.push([X2 + EXIT, 8 * G]);
  return { pts, hits };
}

// One stretch of beam: a trace that stays behind plus a comet (tail + head).
function Beam({ points, start, dur, fade }: { points: readonly P[]; start: number; dur: number; fade?: boolean }) {
  const L = dist(points);
  const d = toPath(points);
  const tail = Math.min(0.5, 110 / L);
  const head = Math.min(0.2, 16 / L);
  return (
    <>
      <path d={d} pathLength={1} className={fade ? "hc-trace hc-trace-fade" : "hc-trace"} style={vars({ "--d": `${r(start)}s`, "--t": `${r(dur)}s` })} />
      <path d={d} pathLength={1} className="hc-comet" style={vars({ "--f": r(tail), "--d": `${r(start)}s`, "--t": `${r(dur * (1 + tail))}s` })} />
      <path d={d} pathLength={1} className="hc-comet hc-head" style={vars({ "--f": r(head), "--d": `${r(start)}s`, "--t": `${r(dur * (1 + head))}s` })} />
    </>
  );
}

// A faint pulse that repeats the route once the intro has played.
function Ambient({ points, start }: { points: readonly P[]; start: number }) {
  return <path d={toPath(points)} pathLength={1} className="hc-ambient" style={vars({ "--f": r(140 / dist(points)), "--d": `${start}s` })} />;
}

function useLabels() {
  const t = useTranslations("Hero");
  const tv = useTranslations("Verticals");
  return (v: Vertical) => ({ short: t(`sectors.${v.key}`), full: tv(`${v.key}.name`) });
}

function Scene({ tw }: { tw: 1 | 2 | 3 }) {
  const t = useTranslations("Hero");
  const labels = useLabels();
  const { pts, hits } = circuit(tw);
  const lead: P[] = [[-LEAD, G], [0, G]];
  const lastHit = dist(pts.slice(0, hits[hits.length - 1] + 1));
  const total = dist(pts);
  const circDur = (RUN * total) / lastHit;
  const w = tw * G;

  return (
    <div className={`hc-scene hc-w${tw}`}>
      <svg className="hc-wires" width={(2 * tw + 1) * G + 1} height={8 * G + 1} aria-hidden="true">
        <Beam points={lead} start={T0} dur={LEAD_DUR} fade />
        <Beam points={pts} start={TC} dur={circDur} />
        <Ambient points={[lead[0], ...pts]} start={AMBIENT_AT} />
        {TILES.map((v, n) => {
          const [x, y] = pts[hits[n]];
          const d = TC + (RUN * dist(pts.slice(0, hits[n] + 1))) / lastHit;
          return <rect key={v.slug} className="hc-pin" x={x - 2} y={y - 2} width={5} height={5} fill={v.accent} style={vars({ "--d": `${r(d)}s` })} />;
        })}
      </svg>

      {TILES.map((v, n) => {
        const right = n % 2;
        const d = TC + (RUN * dist(pts.slice(0, hits[n] + 1))) / lastHit;
        const { short, full } = labels(v);
        return (
          <Link
            key={v.slug}
            href={`/for/${v.slug}`}
            aria-label={full}
            title={full}
            className="hc-tile"
            style={{
              left: right ? (tw + 1) * G : 0,
              top: (2 * (n >> 1) + right) * G,
              width: w + 1,
              height: G + 1,
              ...vars({ "--w": `${w}px`, "--c": v.accent, "--d": `${r(d)}s`, "--a": `${r(0.5 + n * 0.05)}s` }),
            }}
          >
            <svg className="hc-frame" aria-hidden="true">
              <rect className="hc-off" x={0.5} y={0.5} width={w} height={G} />
              <rect className="hc-on" pathLength={1} x={0.5} y={0.5} width={w} height={G} />
            </svg>
            <span className="hc-wash" />
            <span className="hc-scan" />
            <v.icon className="hc-ico" strokeWidth={1.6} aria-hidden="true" />
            <span className="hc-meta" aria-hidden="true">
              <b>{short}</b>
              <span className="hc-st">
                <i className="hc-st-off">offline</i>
                <i className="hc-st-on">online</i>
              </span>
            </span>
          </Link>
        );
      })}

      <p className="hc-hint" style={{ top: 8 * G + 16 }}>
        <span aria-hidden="true">› </span>
        {t("circuitHint")}
      </p>
    </div>
  );
}

export function HeroCircuit() {
  return (
    <>
      <Scene tw={1} />
      <Scene tw={2} />
      <Scene tw={3} />
    </>
  );
}

// Phone version. The SVG is stretched to the strip's width (viewBox 400 wide,
// height in real pixels), so the timings below are in viewBox units.
const STRIP_T0 = 0.9;
const STRIP_DUR = 2.6;
const STRIP_H = 137; // 1px top + two 64px rows + 8px gap
const STRIP_MID = 69; // centre of the gap between the rows
const STRIP_ROUTE: P[] = [[0, 0], [399, 0], [399, STRIP_MID - 0.5], [0, STRIP_MID - 0.5]];

export function HeroCircuitStrip() {
  const labels = useLabels();
  const total = dist(STRIP_ROUTE);

  return (
    <div className="hc-strip">
      {TILES.map((v, n) => {
        const centre = (n % 4) * 100 + 50;
        // Top row lights left to right, bottom row right to left.
        const at = n < 4 ? centre : 400 + STRIP_MID + (400 - centre);
        const { short, full } = labels(v);
        return (
          <Link
            key={v.slug}
            href={`/for/${v.slug}`}
            aria-label={full}
            className="hc-stile"
            style={vars({ "--c": v.accent, "--d": `${r(STRIP_T0 + (STRIP_DUR * at) / total)}s`, "--a": `${r(0.5 + n * 0.04)}s` })}
          >
            <span className="hc-wash" />
            <v.icon className="hc-ico" strokeWidth={1.6} aria-hidden="true" />
            <b aria-hidden="true">{short}</b>
          </Link>
        );
      })}
      <svg className="hc-strip-wires" viewBox={`0 0 400 ${STRIP_H}`} preserveAspectRatio="none" aria-hidden="true">
        <Beam points={STRIP_ROUTE} start={STRIP_T0} dur={STRIP_DUR} />
        <Ambient points={STRIP_ROUTE} start={STRIP_T0 + STRIP_DUR + 2.8} />
      </svg>
    </div>
  );
}
