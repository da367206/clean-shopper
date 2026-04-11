import SafetyBadge from './SafetyBadge'
import CategoryTag from './CategoryTag'
import Button from './Button'

export default function ProductCard({ name, safetyScore, score, category, description, onClick, onSave, isSaved }) {
  return (
    <div
      className="
        bg-white
        border border-neutral-200
        rounded-radius-lg
        shadow-shadow-sm
        hover:shadow-shadow-md
        transition-shadow duration-200
        p-space-lg
        flex flex-col gap-space-sm
      "
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {/* Top row — category tag + safety badge */}
      <div className="flex items-center justify-between gap-space-sm">
        <CategoryTag label={category} />

        <div className="flex items-center gap-space-sm">
          {score !== undefined && (
            <span className="text-micro text-neutral-400 font-medium">
              Score: {score}
            </span>
          )}
          <SafetyBadge score={safetyScore} size="sm" />
        </div>
      </div>

      {/* Product name */}
      <h3 className="text-h3 text-neutral-900 leading-snug">
        {name}
      </h3>

      {/* Description */}
      <p className="text-small text-neutral-600 leading-relaxed">
        {description}
      </p>

      {/* Save to list */}
      {onSave && (
        <div className="pt-space-xs">
          <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); onSave() }}>
            {isSaved ? 'Saved' : 'Save to list'}
          </Button>
        </div>
      )}
    </div>
  )
}
