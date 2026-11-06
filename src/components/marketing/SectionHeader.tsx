import { Reveal } from "./Reveal";

// The site's section heading: mono eyebrow with a square dot, two-tone
// Michroma title, optional subtitle. Matches the portfolio header.
export function SectionHeader({
  eyebrow,
  title1,
  title2,
  subtitle,
  align = "left",
  as: Tag = "h2",
}: {
  eyebrow: string;
  title1: string;
  title2: string;
  subtitle?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
}) {
  const center = align === "center";
  return (
    <Reveal className={`mb-12 md:mb-16 ${center ? "text-center flex flex-col items-center" : ""}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1.5 h-1.5 bg-primary" aria-hidden="true" />
        <div className="font-mono text-xs tracking-[0.2em] text-primary uppercase">{eyebrow}</div>
      </div>
      <Tag className="font-logo text-3xl md:text-5xl text-neutral-50 uppercase tracking-tighter">
        {title1} <span className="text-primary">{title2}</span>
      </Tag>
      {subtitle && <p className="mt-4 max-w-2xl text-neutral-400 leading-relaxed">{subtitle}</p>}
    </Reveal>
  );
}
