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
      <div className="self-start flex items-center gap-space-sm">
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

      {/* Category label */}
      <div className="self-start">
        <CategoryTag label={category} />
      </div>

      {/* Save to list */}
      {onSave && (
        <div className="pt-space-xs">
          <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); onSave() }}>
            <span className="inline-flex items-center gap-[6px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              {isSaved ? 'Saved' : 'Save to list'}
            </span>
          </Button>
        </div>
      )}
    </div>
  )
}
