import SafetyBadge from './SafetyBadge'
import CategoryTag from './CategoryTag'
import Button from './Button'

const BookmarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
)

export default function ProductCard({ name, safetyScore, score, category, description, imageUrl, onClick, onSave, isSaved }) {
  return (
    <div
      className="
        bg-white
        border border-neutral-200
        rounded-radius-lg
        shadow-shadow-sm
        hover:shadow-shadow-md
        transition-shadow duration-200
        overflow-hidden
        flex flex-col
      "
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {/* Product image */}
      <div className="relative w-full h-img-card bg-neutral-50 flex items-center justify-center overflow-hidden flex-shrink-0">
        {imageUrl
          ? <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
          : <div className="flex flex-col items-center gap-space-xs text-primary opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <span className="text-micro font-medium tracking-wide uppercase">Clean Shopper</span>
            </div>
        }
        {/* Safety badge — top left */}
        <div className="absolute top-space-sm left-space-sm">
          <SafetyBadge score={safetyScore} size="sm" variant="solid" />
        </div>
        {/* Score badge — top right */}
        {score !== undefined && (
          <div className="absolute top-space-sm right-space-sm">
            <span className={`
              inline-flex flex-col items-center justify-center
              w-score-badge h-score-badge
              rounded-radius-md
              shadow-shadow-md
              ${safetyScore === 'clean'   ? 'bg-success'  :
                safetyScore === 'caution' ? 'bg-warning'  :
                                            'bg-error'}
            `}>
              <span className="text-h4 font-semibold text-white leading-none">{score}</span>
              <span className="text-micro text-white/80 leading-none mt-space-3xs">score</span>
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-space-sm p-space-lg flex-1">

      {/* Product name */}
      <h3 className="text-h3 text-neutral-900 leading-snug line-clamp-2">
        {name}
      </h3>

      {/* Category tag */}
      <div>
        <CategoryTag label={category} />
      </div>

      {/* Description */}
      <p className="text-small text-neutral-600 leading-relaxed">
        {description}
      </p>

      {/* Save to list */}
      {onSave && (
        <div className="mt-auto">
          <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); onSave() }}>
            <BookmarkIcon />
            {isSaved ? 'Saved' : 'Save to list'}
          </Button>
        </div>
      )}

      </div>{/* end card body */}
    </div>
  )
}
