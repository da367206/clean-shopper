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

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)

// EWG Skin Deep search URL — always resolves, no 404 risk from hallucinated
// direct IDs. Users land on a search-results page with the ingredient
// highlighted.
function ewgSearchUrl(name) {
  return `https://www.ewg.org/skindeep/search/?search=${encodeURIComponent(name)}`
}

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
          <a
            href={ewgSearchUrl(name)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-space-xs text-small text-primary hover:underline self-start"
          >
            <InfoIcon />
            More info on this ingredient
          </a>
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
