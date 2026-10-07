import { Link } from '../router';

export function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Nurture"
      className="brand-mark"
    >
      <rect width="64" height="64" rx="16" className="brand-mark__plate" />
      <path d="M32 14c-7 6-12 12-12 20a12 12 0 0 0 24 0c0-8-5-14-12-20Z" className="brand-mark__leaf" />
      <path d="M32 24v26" className="brand-mark__stem" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M32 34c-4-1-6-3-7-6 4 0 6 2 7 6Z" className="brand-mark__vein" />
      <path d="M32 40c4-1 6-3 7-6-4 0-6 2-7 6Z" className="brand-mark__vein" />
    </svg>
  );
}

export function Brand({ to = '/', showWord = true }: { to?: string; showWord?: boolean }) {
  return (
    <Link to={to} className="brand" aria-label="Nurture home">
      <BrandMark />
      {showWord ? <span className="brand__word">Nurture</span> : null}
    </Link>
  );
}

export function DemoBadge({ label = 'Local demo' }: { label?: string }) {
  return <span className="demo-badge">{label}</span>;
}
