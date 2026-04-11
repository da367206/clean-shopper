const CheckIcon = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const CautionIcon = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const AvoidIcon = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
)

const SAFETY_CONFIG = {
  clean: {
    label: 'Clean',
    classes: 'bg-success/10 text-success',
    Icon: CheckIcon,
  },
  caution: {
    label: 'Caution',
    classes: 'bg-warning/10 text-warning',
    Icon: CautionIcon,
  },
  avoid: {
    label: 'Avoid',
    classes: 'bg-error/10 text-error',
    Icon: AvoidIcon,
  },
}

const SIZE_CONFIG = {
  sm: { padding: 'px-space-sm py-[2px]', font: 'text-small', iconSize: 12, gap: 'gap-[5px]' },
  md: { padding: 'px-space-md py-space-xs', font: 'text-body', iconSize: 14, gap: 'gap-space-xs' },
}

export default function SafetyBadge({ score, size = 'md' }) {
  const safety = SAFETY_CONFIG[score] ?? SAFETY_CONFIG.caution
  const s = SIZE_CONFIG[size] ?? SIZE_CONFIG.md

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
      <safety.Icon size={s.iconSize} />
      {safety.label}
    </span>
  )
}
