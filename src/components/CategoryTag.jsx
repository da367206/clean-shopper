export default function CategoryTag({ label, isActive = false, onClick }) {
  const isInteractive = typeof onClick === 'function'

  const baseClasses = `
    text-small font-medium
    rounded-radius-sm
    px-space-sm py-[2px]
    whitespace-nowrap
    transition-colors duration-150
  `

  const stateClasses = isActive
    ? 'bg-primary text-white'
    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'

  if (isInteractive) {
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${stateClasses}`}
      >
        {label}
      </button>
    )
  }

  return (
    <span className={`inline-block ${baseClasses} bg-neutral-100 text-neutral-600`}>
      {label}
    </span>
  )
}
