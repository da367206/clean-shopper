import { useState, useId } from 'react'
import Button from './Button'

// Chevron points right (→) when collapsed, rotates 90° down when expanded.
const ChevronIcon = ({ expanded }) => (
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
    className={`transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
    aria-hidden="true"
  >
    <polyline points="9 18 15 12 9 6" />
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

const SAFETY_DOT = {
  clean:   'bg-success',
  caution: 'bg-warning',
  avoid:   'bg-error',
}

const SAFETY_LABEL = {
  clean:   { text: 'Clean',   color: 'text-success' },
  caution: { text: 'Caution', color: 'text-warning' },
  avoid:   { text: 'Avoid',   color: 'text-error'   },
}

export default function IngredientRow({
  name,
  safetyScore,
  purpose,
  concerns,
  onAskAI,
}) {
  const [expanded, setExpanded] = useState(false)
  const panelId = useId()

  const dotClass   = SAFETY_DOT[safetyScore]   ?? SAFETY_DOT.caution
  const labelCfg   = SAFETY_LABEL[safetyScore] ?? SAFETY_LABEL.caution

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
        {/* Left — name + always-visible purpose subtitle */}
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-body font-medium text-neutral-900 break-words leading-snug">
            {name}
          </span>
          {purpose && (
            <span className="text-small text-neutral-400 break-words leading-snug mt-space-3xs">
              {purpose}
            </span>
          )}
        </div>

        {/* Right — safety label + dot + chevron */}
        <div className="flex items-center gap-space-xs flex-shrink-0">
          <span className={`text-small font-medium ${labelCfg.color}`}>
            {labelCfg.text}
          </span>
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 ${dotClass}`}
            aria-hidden="true"
          />
          <span className="text-neutral-400">
            <ChevronIcon expanded={expanded} />
          </span>
        </div>
      </button>

      {expanded && (
        <div
          id={panelId}
          className="flex flex-col gap-space-sm px-space-md pb-space-md"
        >
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
