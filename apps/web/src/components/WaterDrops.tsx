export function WaterDrops({ value, max, label }: { value: number; max: number; label: string }) {
  const slots = Array.from({ length: max }, (_, index) => index < value);
  return (
    <div className="drops" role="img" aria-label={label}>
      {slots.map((filled, index) => (
        <span
          // eslint-disable-next-line react/no-array-index-key -- fixed-length display slots
          key={index}
          className={`drop${filled ? ' is-filled' : ''}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
