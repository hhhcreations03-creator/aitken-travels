import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

interface BaseProps {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

function Label({ id, label, required }: { id: string; label: string; required?: boolean }) {
  return (
    <label htmlFor={id} className="field-label">
      {label}
      {required ? <span aria-hidden="true" className="text-olive"> *</span> : <span className="text-charcoal-mute"> (optional)</span>}
    </label>
  );
}

function Messages({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  if (error) return <p id={`${id}-error`} className="field-error">{error}</p>;
  if (hint) return <p id={`${id}-hint`} className="field-hint">{hint}</p>;
  return null;
}

export function TextField({ label, id, error, hint, required, className = "", ...rest }: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <Label id={id} label={label} required={required} />
      <input
        id={id}
        name={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className="field"
        {...rest}
      />
      <Messages id={id} error={error} hint={hint} />
    </div>
  );
}

export function SelectField({ label, id, error, hint, required, className = "", children, ...rest }: BaseProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={className}>
      <Label id={id} label={label} required={required} />
      <select
        id={id}
        name={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className="field appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22><path d=%22M1 1l5 5 5-5%22 fill=%22none%22 stroke=%22%232A2A28%22 stroke-width=%221.5%22/></svg>')] bg-[length:12px_8px] bg-[right_1rem_center] bg-no-repeat pr-10"
        {...rest}
      >
        {children}
      </select>
      <Messages id={id} error={error} hint={hint} />
    </div>
  );
}

export function TextareaField({ label, id, error, hint, required, className = "", ...rest }: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={className}>
      <Label id={id} label={label} required={required} />
      <textarea
        id={id}
        name={id}
        required={required}
        rows={4}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className="field min-h-[120px] resize-y"
        {...rest}
      />
      <Messages id={id} error={error} hint={hint} />
    </div>
  );
}

export function Honeypot() {
  return (
    <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
      <label htmlFor="website">Leave this field empty</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export function FormNote() {
  return (
    <p className="small text-charcoal-mute">
      This is an enquiry, not a booking. The hotel team will confirm availability, rates and arrangements with you directly. No payment is taken on this site.
    </p>
  );
}
