const CheckIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CautionIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6 1.5L11 10.5H1L6 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 5V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="6" cy="9" r="0.5" fill="currentColor" />
  </svg>
)

const SAFETY_CONFIG = {
  clean: {
    label: 'Clean',
    classes: 'bg-success/10 text-success',
    icon: CheckIcon,
    dot: null,
  },
  caution: {
    label: 'Caution',
    classes: 'bg-warning/10 text-warning',
    icon: CautionIcon,
    dot: null,
  },
  avoid: {
    label: 'Avoid',
    classes: 'bg-error/10 text-error',
    icon: null,
    dot: 'bg-error',
  },
}

const SIZE_CONFIG = {
  sm: {
    padding: 'px-space-sm py-[2px]',
    font: 'text-small',
    dot: 'w-[6px] h-[6px]',
    icon: 'w-[10px] h-[10px]',
    gap: 'gap-[6px]',
  },
  md: {
    padding: 'px-space-md py-space-xs',
    font: 'text-body',
    dot: 'w-[8px] h-[8px]',
    icon: 'w-[12px] h-[12px]',
    gap: 'gap-space-xs',
  },
}

export default function SafetyBadge({ score, size = 'md' }) {
  const safety = SAFETY_CONFIG[score] ?? SAFETY_CONFIG.caution
  const s = SIZE_CONFIG[size] ?? SIZE_CONFIG.md
  const Icon = safety.icon

  return (
    <span className={`
      inline-flex items-center
      ${s.gap}
      ${s.padding}
      ${s.font}
      font-medium
      rounded-radius-sm
      ${safety.classes}
    `}>
      {Icon
        ? <Icon className={s.icon} />
        : <span className={`${s.dot} rounded-radius-full ${safety.dot}`} />
      }
      {safety.label}
    </span>
  )
}
