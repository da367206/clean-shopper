import { useState, useRef, useEffect } from 'react'
import { sendChatMessage } from '../lib/api/chat'
import { fetchProductById, searchProducts } from '../lib/api/products'

const ChatIcon = ({ size = 22 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

/**
 * Renders assistant message text with light formatting:
 *   [[Name|id]] → clickable product chip
 *   **bold**    → <strong>
 *   lines with "- " → bullet list
 *   blank lines → paragraph breaks
 */
function ChatMessage({ content, onProductClick }) {
  const paragraphs = content.split(/\n{2,}/)

  return (
    <div className="flex flex-col gap-space-sm">
      {paragraphs.map((para, pi) => {
        const lines = para.split('\n')
        const isList = lines.every(l => l.trimStart().startsWith('- '))

        if (isList) {
          return (
            <ul key={pi} className="flex flex-col gap-space-xs pl-space-xs">
              {lines.map((line, li) => (
                <li key={li} className="flex gap-space-xs">
                  <span className="text-primary mt-[3px] flex-shrink-0">•</span>
                  <span>{renderInline(line.replace(/^-\s*/, ''), onProductClick)}</span>
                </li>
              ))}
            </ul>
          )
        }

        return (
          <div key={pi}>
            {lines.map((line, li) => (
              <span key={li} className="block">
                {renderInline(line, onProductClick)}
              </span>
            ))}
          </div>
        )
      })}
    </div>
  )
}

/** Small product card rendered inline in a chat bubble */
function ProductLinkCard({ id, name, onProductClick }) {
  const [product, setProduct] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        // Try exact ID match first (works when Claude uses the real 8-char prefix correctly)
        const byId = await fetchProductById(id).catch(() => null)
        if (byId) { setProduct(byId); return }

        // Fallback: search by name. Claude often prepends a brand name that
        // isn't in the DB, so try progressively shorter trailing substrings.
        const words = name.trim().split(/\s+/)
        for (let take = Math.min(4, words.length); take >= 2; take--) {
          const term = words.slice(words.length - take).join(' ')
          const results = await searchProducts(term).catch(() => [])
          if (results.length > 0) { setProduct(results[0]); return }
        }
      } catch { /* silent */ }
    }
    load()
  }, [id, name])

  const SCORE_COLOR = {
    clean:   'text-success bg-success/10',
    caution: 'text-warning bg-warning/10',
    avoid:   'text-error bg-error/10',
  }

  return (
    <button
      onClick={() => onProductClick?.(id)}
      className="
        flex items-center gap-space-sm w-full text-left mt-space-xs mb-space-3xs
        bg-white border border-neutral-200 rounded-radius-md overflow-hidden
        hover:border-primary hover:shadow-shadow-sm
        transition-all duration-150
      "
    >
      {/* Image */}
      <div className="w-16 h-16 flex-shrink-0 bg-neutral-100 overflow-hidden">
        {product?.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 py-space-xs pr-space-sm">
        <p className="text-small font-medium text-neutral-900 leading-snug line-clamp-2">
          {product?.name ?? name}
        </p>
        {product?.safety_score && (
          <span className={`mt-space-3xs inline-block text-micro font-semibold px-space-xs py-[2px] rounded-full ${SCORE_COLOR[product.safety_score] ?? ''}`}>
            {product.safety_score.charAt(0).toUpperCase() + product.safety_score.slice(1)} · {product.score}/100
          </span>
        )}
      </div>

      {/* Arrow */}
      <div className="pr-space-sm text-neutral-400 flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    </button>
  )
}

/** Render inline tokens: [[Name|id]] product cards and **bold** */
function renderInline(text, onProductClick) {
  const parts = text.split(/(\[\[[^\]]+\]\]|\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    // Product card: [[Name|id]]
    const linkMatch = part.match(/^\[\[(.+?)\|(.+?)\]\]$/)
    if (linkMatch) {
      const [, name, id] = linkMatch
      return <ProductLinkCard key={i} id={id} name={name} onProductClick={onProductClick} />
    }
    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-neutral-900">{part.slice(2, -2)}</strong>
    }
    return part
  })
}

const SUGGESTIONS = [
  'Recommend a clean baby shampoo',
  'Which deodorants are aluminum-free?',
  'What makes parabens unsafe?',
  'Is Dawn dish soap safe to use?',
]

export default function ChatDrawer({ onProductClick }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to bottom on new messages or loading state
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Open + seed via a global event. Callers dispatch:
  //   window.dispatchEvent(new CustomEvent('clean-shopper:ask', { detail: { prompt } }))
  // No new props are added to ChatDrawer; its public API is unchanged.
  useEffect(() => {
    function handleAsk(e) {
      const prompt = e?.detail?.prompt
      if (typeof prompt !== 'string' || !prompt.trim()) return
      setIsOpen(true)
      setInput(prompt)
    }
    window.addEventListener('clean-shopper:ask', handleAsk)
    return () => window.removeEventListener('clean-shopper:ask', handleAsk)
  }, [])

  async function sendMessage(text) {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    const next = [...messages, { role: 'user', content: trimmed }]
    setMessages(next)
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const reply = await sendChatMessage(next)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <>
      {/* Floating chat button — visible only when panel is closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI assistant"
          className="
            fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40
            w-14 h-14 rounded-full
            bg-primary text-white
            shadow-shadow-lg hover:bg-primary-light
            flex items-center justify-center
            transition-colors duration-150
          "
        >
          <ChatIcon />
        </button>
      )}

      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Chat panel */}
          <div className="
            fixed z-50
            bottom-0 left-0 right-0 h-[82vh]
            md:bottom-6 md:left-auto md:right-6 md:w-96 md:h-[600px]
            bg-white
            rounded-t-radius-lg md:rounded-radius-lg
            border border-neutral-200 shadow-shadow-lg
            flex flex-col overflow-hidden
          ">

            {/* Header */}
            <div className="flex items-center gap-space-sm px-space-lg py-space-md border-b border-neutral-200 flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <ChatIcon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-small font-semibold text-neutral-900">Ask Clean Shopper</div>
                <div className="text-micro text-neutral-400">Product safety &amp; ingredient questions</div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="text-neutral-400 hover:text-neutral-900 transition-colors duration-150 flex-shrink-0"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-space-md flex flex-col gap-space-sm">

              {/* Empty state */}
              {messages.length === 0 && (
                <div className="flex flex-col items-center text-center pt-space-xl gap-space-md px-space-sm">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-small font-semibold text-neutral-900">Hi, I'm your safety assistant</p>
                    <p className="text-micro text-neutral-400 mt-space-3xs">
                      Ask about any product, ingredient, or safety concern.
                    </p>
                  </div>
                  <div className="flex flex-col gap-space-xs w-full">
                    {SUGGESTIONS.map(s => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="
                          text-left text-small text-primary
                          bg-primary/5 hover:bg-primary/10
                          border border-primary/20
                          rounded-radius-md px-space-md py-space-sm
                          transition-colors duration-150
                        "
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message bubbles */}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    max-w-[85%] text-small leading-relaxed
                    px-space-md py-space-sm
                    ${msg.role === 'user'
                      ? 'bg-primary text-white rounded-radius-md rounded-br-none'
                      : 'bg-neutral-100 text-neutral-900 rounded-radius-md rounded-bl-none'
                    }
                  `}>
                    {msg.role === 'assistant'
                      ? <ChatMessage content={msg.content} onProductClick={onProductClick} />
                      : msg.content}
                  </div>
                </div>
              ))}

              {/* Loading dots */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-100 rounded-radius-md rounded-bl-none px-space-md py-space-sm">
                    <div className="flex gap-space-xs items-center h-4">
                      {[0, 150, 300].map(delay => (
                        <div
                          key={delay}
                          className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${delay}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <p className="text-micro text-error text-center px-space-md py-space-xs">
                  {error}
                </p>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="flex gap-space-sm items-center px-space-md py-space-md border-t border-neutral-200 flex-shrink-0">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about products or ingredients…"
                disabled={isLoading}
                className="
                  flex-1 min-w-0
                  bg-neutral-50 border border-neutral-200 rounded-radius-full
                  px-space-md py-space-xs
                  text-small text-neutral-900
                  placeholder:text-neutral-400
                  focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="
                  w-9 h-9 rounded-full flex-shrink-0
                  bg-primary text-white
                  flex items-center justify-center
                  hover:bg-primary-light transition-colors duration-150
                  disabled:opacity-40 disabled:cursor-not-allowed
                "
              >
                <SendIcon />
              </button>
            </div>

          </div>
        </>
      )}
    </>
  )
}
