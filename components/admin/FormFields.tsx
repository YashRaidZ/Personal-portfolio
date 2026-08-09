"use client";

import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-lg border border-white/10 bg-bg-elevated/60 px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent-primary/50";

export function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-text-light">
      {children}
    </label>
  );
}

export function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="mt-1 text-xs text-red-400">{children}</p>;
}

export function TextField({
  label,
  error,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <div>
      <FieldLabel htmlFor={props.id}>{label}</FieldLabel>
      <input {...props} className={cn(fieldClass, className)} />
      <FieldError>{error}</FieldError>
    </div>
  );
}

export function TextAreaField({
  label,
  error,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }) {
  return (
    <div>
      <FieldLabel htmlFor={props.id}>{label}</FieldLabel>
      <textarea {...props} className={cn(fieldClass, "resize-none", className)} />
      <FieldError>{error}</FieldError>
    </div>
  );
}

export function SelectField({
  label,
  error,
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string }) {
  return (
    <div>
      <FieldLabel htmlFor={props.id}>{label}</FieldLabel>
      <select {...props} className={cn(fieldClass, className)}>
        {children}
      </select>
      <FieldError>{error}</FieldError>
    </div>
  );
}

export function ToggleField({
  label,
  checked,
  onChange,
  description,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <span
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            onChange(!checked);
          }
        }}
        className={cn(
          "relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-accent-primary" : "bg-white/10"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-bg-primary transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          )}
        />
      </span>
      <span>
        <span className="block text-sm font-medium text-text-primary">{label}</span>
        {description && <span className="block text-xs text-text-muted">{description}</span>}
      </span>
    </label>
  );
}

/** Editable list of short strings -- used for features[], technologies[], body paragraphs, etc. */
export function StringListField({
  label,
  values,
  onChange,
  placeholder,
  multiline = false,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  function update(index: number, value: string) {
    const next = [...values];
    next[index] = value;
    onChange(next);
  }
  function remove(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }
  function add() {
    onChange([...values, ""]);
  }

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="space-y-2">
        {values.map((value, i) =>
          multiline ? (
            <div key={i} className="flex gap-2">
              <textarea
                value={value}
                onChange={(e) => update(i, e.target.value)}
                placeholder={placeholder}
                rows={2}
                className={cn(fieldClass, "resize-none flex-1")}
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="shrink-0 rounded-lg border border-white/10 px-3 text-xs text-text-muted transition-colors hover:border-red-400/40 hover:text-red-400"
              >
                Remove
              </button>
            </div>
          ) : (
            <div key={i} className="flex gap-2">
              <input
                value={value}
                onChange={(e) => update(i, e.target.value)}
                placeholder={placeholder}
                className={cn(fieldClass, "flex-1")}
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="shrink-0 rounded-lg border border-white/10 px-3 text-xs text-text-muted transition-colors hover:border-red-400/40 hover:text-red-400"
              >
                Remove
              </button>
            </div>
          )
        )}
        <button
          type="button"
          onClick={add}
          className="rounded-lg border border-dashed border-white/15 px-4 py-2 text-xs font-medium text-text-muted transition-colors hover:border-accent-primary/40 hover:text-accent-primary"
        >
          + Add
        </button>
      </div>
    </div>
  );
}

export function SaveButton({ pending, label = "Save changes" }: { pending: boolean; label?: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-full bg-accent-primary px-6 py-2.5 text-sm font-semibold text-bg-primary transition-opacity disabled:opacity-60"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

export function StatusBanner({ error, success }: { error?: string | null; success?: boolean }) {
  if (error) {
    return (
      <p role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-sm text-red-300">
        {error}
      </p>
    );
  }
  if (success) {
    return (
      <p className="rounded-lg border border-accent-primary/30 bg-accent-primary/10 px-4 py-2.5 text-sm text-accent-primary">
        Saved.
      </p>
    );
  }
  return null;
}
