import { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'solid' | 'ghost' | 'outline';
}

export default function Button({ children, variant = 'solid', className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-3xl px-5 py-3 text-sm font-semibold transition-all duration-300',
        variant === 'solid' && 'bg-gradient-to-r from-violet-500 to-cyan-400 text-slate-950 shadow-glow hover:scale-[1.01]',
        variant === 'ghost' && 'bg-white/5 text-white border border-white/10 hover:bg-white/10',
        variant === 'outline' && 'border border-white/15 bg-transparent text-white hover:bg-white/5',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
