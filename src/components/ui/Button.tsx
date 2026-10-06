import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'crimson' | 'outline' | 'ghost' | 'subtle'
type Size = 'sm' | 'md' | 'lg'

export const buttonBase =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-gold-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 disabled:opacity-40 disabled:cursor-not-allowed select-none'

export const variantClasses: Record<Variant, string> = {
  primary:
    'bg-linear-to-b/srgb from-gold-300 to-gold-500 text-ink-950 hover:from-gold-200 hover:to-gold-400 shadow-glow hover:-translate-y-0.5 active:translate-y-0',
  crimson:
    'bg-linear-to-b/srgb from-crimson-500 to-crimson-600 text-white hover:from-crimson-400 hover:to-crimson-500 shadow-glow-crimson hover:-translate-y-0.5 active:translate-y-0',
  outline:
    'border border-white/15 text-white hover:bg-white/6 hover:border-white/30',
  ghost: 'text-slate-300 hover:text-white hover:bg-white/5',
  subtle: 'bg-white/6 text-white hover:bg-white/12 border border-white/10',
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-xs px-3.5 py-2',
  md: 'text-sm px-5 py-2.5',
  lg: 'text-base px-7 py-3.5',
}

export function buttonClasses(
  variant: Variant = 'primary',
  size: Size = 'md',
  extra?: string,
) {
  return cn(buttonBase, variantClasses[variant], sizeClasses[size], extra)
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => (
    <button
      ref={ref}
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  ),
)
Button.displayName = 'Button'
