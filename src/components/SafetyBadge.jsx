const SAFETY_CONFIG = {
  clean: {
    label: 'Clean',
    classes: 'bg-success/10 text-success',
    dot: 'bg-success',
  },
  caution: {
    label: 'Caution',
    classes: 'bg-warning/10 text-warning',
    dot: 'bg-warning',
  },
  avoid: {
    label: 'Avoid',
    classes: 'bg-error/10 text-error',
    dot: 'bg-error',
  },
}

const SIZE_CONFIG = {
  sm: {
    padding: 'px-space-sm py-[2px]',
    font: 'text-small',
    dot: 'w-[6px] h-[6px]',
    gap: 'gap-[6px]',
  },
  md: {
    padding: 'px-space-md py-space-xs',
    font: 'text-body',
    dot: 'w-[8px] h-[8px]',
    gap: 'gap-space-xs',
  },
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
      <span className={`${s.dot} rounded-radius-full ${safety.dot}`} />
      {safety.label}
    </span>
  )
}
