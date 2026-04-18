import { useState, useId } from 'react'
import SafetyBadge from './SafetyBadge'
import Button from './Button'

const ChevronIcon = ({ expanded }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
    aria-hidden="true"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

export default function IngredientRow({
  name,
  safetyScore,
  purpose,
  concerns,
  source = 'AI-generated (Claude) · grounded in EWG Skin Deep',
  onAskAI,
}) {
  const [expanded, setExpanded] = useState(false)
  const panelId = useId()

  return (
    <li className="flex flex-col">
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((v) => !v)}
        className="
          flex items-center justify-between
          gap-space-md p-space-md w-full text-left
          min-h-touch
          hover:bg-neutral-50
          transition-colors duration-150
        "
      >
        <div className="flex items-center gap-space-sm min-w-0 flex-1">
          <div className="flex-shrink-0">
            <SafetyBadge score={safetyScore} size="sm" variant="light" />
          </div>
          <span className="text-body font-medium text-neutral-900 break-words">
            {name}
          </span>
        </div>
        <span className="text-neutral-400 flex-shrink-0">
          <ChevronIcon expanded={expanded} />
        </span>
      </button>

      {expanded && (
        <div
          id={panelId}
          className="flex flex-col gap-space-sm px-space-md pb-space-md"
        >
          {purpose && (
            <p className="text-body text-neutral-900">{purpose}</p>
          )}
          {concerns && (
            <p className="text-small text-neutral-600">{concerns}</p>
          )}
          <p className="text-micro text-neutral-400">{source}</p>
          <div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onAskAI?.({ name, safetyScore })}
            >
              Ask about this ingredient
            </Button>
          </div>
        </div>
      )}
    </li>
  )
}
