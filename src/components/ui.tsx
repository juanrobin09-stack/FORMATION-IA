"use client";

import { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-zinc-400">{hint}</p>}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
      {icon && <div className="mb-3 text-zinc-300">{icon}</div>}
      <p className="font-medium text-zinc-700">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-zinc-400">{description}</p>}
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-zinc-500">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-brand-600" />
      {label}
    </div>
  );
}

export function ProviderBadge({ provider }: { provider?: string }) {
  if (!provider) return null;
  const demo = provider === "mock";
  return (
    <span
      className={`badge ${demo ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}
    >
      {demo ? "Mode demo (sans cle IA)" : `Genere par ${provider}`}
    </span>
  );
}
