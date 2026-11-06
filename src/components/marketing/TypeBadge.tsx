// A small, muted label in the top-right corner of a name ("Business [package]").
// It names what something is, so it's deliberately quieter than the blue
// status badges ("Most popular"). Real text, so search engines and screen
// readers still read "Business package".
export function TypeBadge({ children }: { children: string }) {
  return (
    <span className="ml-2 inline-block align-top mt-[0.15em] border border-white/15 px-1.5 py-0.5 font-mono text-[10px] font-normal leading-none tracking-[0.15em] text-neutral-500 uppercase">
      {children}
    </span>
  );
}
