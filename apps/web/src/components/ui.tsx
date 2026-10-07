import type { ReactNode } from 'react';

/**
 * The shared UI kit.
 *
 * Every screen is built from these pieces so the product reads as one thing.
 * Keep new primitives here rather than styling one-off markup in a feature file.
 */

export function PageHeader({
  kicker,
  title,
  blurb,
  actions,
  children,
}: {
  kicker: string;
  title: string;
  blurb?: string;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="page-head">
      <div className="page-head__text">
        <p className="kicker">{kicker}</p>
        <h1 className="page-head__title">{title}</h1>
        {blurb ? <p className="page-head__blurb">{blurb}</p> : null}
        {children}
      </div>
      {actions ? <div className="page-head__actions">{actions}</div> : null}
    </header>
  );
}

export function Panel({
  title,
  subtitle,
  actions,
  children,
  className = '',
  as: Tag = 'section',
}: {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  as?: 'section' | 'div' | 'article' | 'aside';
}) {
  return (
    <Tag className={`panel ${className}`.trim()}>
      {title || actions ? (
        <div className="panel__head">
          <div>
            {title ? <h2 className="panel__title">{title}</h2> : null}
            {subtitle ? <p className="panel__subtitle">{subtitle}</p> : null}
          </div>
          {actions ? <div className="panel__actions">{actions}</div> : null}
        </div>
      ) : null}
      <div className="panel__body">{children}</div>
    </Tag>
  );
}

export function Stat({ label, value, unit, hint }: { label: string; value: ReactNode; unit?: string; hint?: string }) {
  return (
    <div className="stat">
      <p className="stat__label">{label}</p>
      <p className="stat__value">
        {value}
        {unit ? <span className="stat__unit"> {unit}</span> : null}
      </p>
      {hint ? <p className="stat__hint">{hint}</p> : null}
    </div>
  );
}

export function StatGrid({ children }: { children: ReactNode }) {
  return <div className="stat-grid">{children}</div>;
}

export function Chip({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'good' | 'warn' | 'info' | 'quiet' }) {
  return <span className={`chip chip--${tone}`}>{children}</span>;
}

export function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="toggle">
      <span className="toggle__text">
        <span className="toggle__label">{label}</span>
        {hint ? <span className="toggle__hint">{hint}</span> : null}
      </span>
      <input
        type="checkbox"
        className="toggle__input"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="toggle__track" aria-hidden="true">
        <span className="toggle__knob" />
      </span>
    </label>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      {hint ? <span className="field__hint">{hint}</span> : null}
      {children}
    </label>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="empty">
      <p className="empty__title">{title}</p>
      <p className="empty__body">{body}</p>
      {action ? <div className="empty__action">{action}</div> : null}
    </div>
  );
}

export function Note({ tone = 'info', children }: { tone?: 'info' | 'warn' | 'quiet' | 'good'; children: ReactNode }) {
  return <p className={`note note--${tone}`}>{children}</p>;
}

export function Meter({ value, max, label }: { value: number; max: number; label?: string }) {
  const safeMax = max > 0 ? max : 1;
  const percent = Math.max(0, Math.min(100, Math.round((value / safeMax) * 100)));
  return (
    <div className="meter" role="img" aria-label={label ? `${label}: ${percent}%` : `${percent}%`}>
      <span className="meter__fill" style={{ width: `${percent}%` }} />
    </div>
  );
}

export function DayStrip({
  days,
  active,
  onSelect,
  renderLabel,
}: {
  days: string[];
  active?: string;
  onSelect?: (day: string) => void;
  renderLabel: (day: string) => string;
}) {
  return (
    <div className="day-strip" role="tablist" aria-label="Choose a day">
      {days.map((day) => {
        const isActive = day === active;
        const className = `day-strip__day${isActive ? ' is-active' : ''}`;
        if (!onSelect) {
          return (
            <span key={day} className={className} aria-current={isActive ? 'true' : undefined}>
              {renderLabel(day)}
            </span>
          );
        }
        return (
          <button
            key={day}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={className}
            onClick={() => onSelect(day)}
          >
            {renderLabel(day)}
          </button>
        );
      })}
    </div>
  );
}

export function BarChart({ data, unit }: { data: { label: string; value: number }[]; unit?: string }) {
  const max = Math.max(1, ...data.map((point) => point.value));
  return (
    <div className="bars" role="img" aria-label={`Bar chart with ${data.length} points`}>
      {data.map((point, index) => (
        // Labels can legitimately repeat (weekday letters), so the index is the stable key.
        <div key={`${point.label}-${index}`} className="bars__item">
          <div className="bars__track">
            <span className="bars__fill" style={{ height: `${Math.round((point.value / max) * 100)}%` }} />
          </div>
          <span className="bars__label">{point.label}</span>
          <span className="bars__value">
            {point.value}
            {unit ?? ''}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Sparkline({ values, label }: { values: number[]; label: string }) {
  if (values.length === 0) return <p className="muted">Nothing recorded yet.</p>;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = values.length === 1 ? 50 : (index / (values.length - 1)) * 100;
      const y = 100 - ((value - min) / span) * 100;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg className="spark" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={label}>
      <polyline points={points} fill="none" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function Ring({ value, max, caption }: { value: number; max: number; caption: string }) {
  const safeMax = max > 0 ? max : 1;
  const percent = Math.max(0, Math.min(1, value / safeMax));
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="ring">
      <svg viewBox="0 0 100 100" role="img" aria-label={`${caption}: ${Math.round(percent * 100)}%`}>
        <circle className="ring__track" cx="50" cy="50" r={radius} />
        <circle
          className="ring__value"
          cx="50"
          cy="50"
          r={radius}
          strokeDasharray={`${circumference * percent} ${circumference}`}
        />
      </svg>
      <div className="ring__caption">
        <strong>
          {value}
          <span className="muted">/{max}</span>
        </strong>
        <span>{caption}</span>
      </div>
    </div>
  );
}

export function Row({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`row ${className}`.trim()}>{children}</div>;
}

export function Muted({ children }: { children: ReactNode }) {
  return <p className="muted">{children}</p>;
}
