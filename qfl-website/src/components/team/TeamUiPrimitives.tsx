'use client';

import { cn } from '@/lib/utils/cn';

export function SectionCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-surface text-slate-900 dark:text-white shadow-lg dark:shadow-[0_20px_40px_rgba(3,10,25,0.5)]',
        className
      )}
    >
      {children}
    </section>
  );
}

export function SectionHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      <div>
        <h3 className="text-sm md:text-base font-black text-slate-900 dark:text-white">{title}</h3>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-slate-500 dark:text-white/60">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

type StatTone = 'neutral' | 'primary' | 'positive' | 'warning' | 'danger';

const valueColor: Record<StatTone, string> = {
  neutral: 'text-slate-900 dark:text-white',
  primary: 'text-[#1E4D8C] dark:text-cyan-300',
  positive: 'text-emerald-600 dark:text-emerald-300',
  warning: 'text-amber-600 dark:text-amber-300',
  danger: 'text-rose-600 dark:text-rose-300',
};

export function StatPill({
  label,
  value,
  tone = 'neutral',
  className,
}: {
  label: string;
  value: string | number;
  tone?: StatTone;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-white/10 px-3 py-2.5',
        className
      )}
    >
      <div className={cn('text-lg font-black leading-none', valueColor[tone])}>{value}</div>
      <div className="mt-1 text-[11px] font-medium text-slate-500 dark:text-white/70">{label}</div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title?: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <SectionCard className={cn('p-6 md:p-8 text-center', className)}>
      {title ? (
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h4>
      ) : null}
      <p className="mt-2 text-sm text-slate-500 dark:text-white/60">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </SectionCard>
  );
}

export function DataTableShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <SectionCard className={cn('overflow-hidden', className)}>
      <div className="overflow-x-auto">{children}</div>
    </SectionCard>
  );
}
