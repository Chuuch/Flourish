import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ type = 'button', disabled, children, ...props }: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className="rounded border px-3 py-1.5 disabled:opacity-50"
      {...props}
    >
      {children}
    </button>
  );
}
