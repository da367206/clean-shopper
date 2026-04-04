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

export default function ProductCard({ name, safetyScore, category, description }) {
  const safety = SAFETY_CONFIG[safetyScore] ?? SAFETY_CONFIG.caution

  return (
    <div className="
      bg-white
      border border-neutral-200
      rounded-radius-lg
      shadow-shadow-sm
      hover:shadow-shadow-md
      transition-shadow duration-200
      p-space-lg
      flex flex-col gap-space-sm
    ">

      {/* Top row — category tag + safety badge */}
      <div className="flex items-center justify-between gap-space-sm">
        <span className="
          text-small font-medium
          text-neutral-600
          bg-neutral-100
          rounded-radius-sm
          px-space-sm py-[2px]
        ">
          {category}
        </span>

        <span className={`
          flex items-center gap-[6px]
          text-small font-medium
          rounded-radius-sm
          px-space-sm py-[2px]
          ${safety.classes}
        `}>
          <span className={`w-[6px] h-[6px] rounded-radius-full ${safety.dot}`} />
          {safety.label}
        </span>
      </div>

      {/* Product name */}
      <h3 className="text-h3 text-neutral-900 leading-snug">
        {name}
      </h3>

      {/* Description */}
      <p className="text-small text-neutral-600 leading-relaxed">
        {description}
      </p>

    </div>
  )
}
