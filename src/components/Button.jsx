const VARIANT_CLASSES = {
  primary: `
    bg-primary text-white
    hover:bg-primary-dark active:bg-primary-dark
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  secondary: `
    bg-transparent text-primary
    border border-primary
    hover:bg-primary/10 active:bg-primary/20
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  ghost: `
    bg-transparent text-neutral-600
    hover:bg-neutral-100 active:bg-neutral-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
}

const SIZE_CLASSES = {
  sm: 'px-space-md py-[6px] text-small',
  md: 'px-space-lg py-space-sm text-body',
  lg: 'px-space-xl py-space-md text-body font-semibold',
}

const Spinner = () => (
  <svg
    className="animate-spin w-[18px] h-[18px]"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
)

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  children,
}) {
  const variantClasses = VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.primary
  const sizeClasses = SIZE_CLASSES[size] ?? SIZE_CLASSES.md

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center gap-space-xs
        font-medium rounded-radius-md whitespace-nowrap shrink-0
        transition-colors duration-150
        ${variantClasses}
        ${sizeClasses}
      `}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  )
}
