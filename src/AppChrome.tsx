import { type ReactNode } from "react";

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

export function FormattedMetric({ value, label }: { value: number; label: string }) {
  return <Metric value={formatNumber(value)} label={label} />;
}

export function TabButton({
  active,
  children,
  icon,
  onClick,
}: {
  active: boolean;
  children: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button className={`tab ${active ? "active" : ""}`} type="button" onClick={onClick}>
      {icon}
      {children}
    </button>
  );
}

export function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function SliderField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <label className="slider-field">
      <span>
        {label}
        <strong>{value}</strong>
      </span>
      <input
        min={1}
        max={10}
        type="range"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export function Toggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  );
}
