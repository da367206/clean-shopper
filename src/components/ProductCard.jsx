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
      {/* Product name */}
      <h3 className="text-h3 text-neutral-900 leading-snug">
        {name}
      </h3>

      {/* Safety badge + score */}
      <div className="flex items-center gap-space-sm">
        <SafetyBadge score={safetyScore} size="sm" />
        {score !== undefined && (
          <span className="text-small text-neutral-600 font-semibold">
            Score: {score}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-small text-neutral-600 leading-relaxed">
        {description}
      </p>

      {/* Category + save */}
      <div className="flex items-center justify-between pt-space-xs">
        <CategoryTag label={category} />
        {onSave && (
          <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); onSave() }}>
            {isSaved ? 'Saved' : 'Save to list'}
          </Button>
        )}
      </div>
    </div>
  )
}
