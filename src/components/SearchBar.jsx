import Button from './Button'

export default function SearchBar({ value, onChange, onSubmit, placeholder, isLoading = false }) {
  function handleKeyDown(e) {
    if (e.key === 'Enter') onSubmit()
  }

  return (
    <div className="flex items-center gap-space-sm w-full">
      <div className="flex-1">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? 'Search products…'}
          disabled={isLoading}
          className="
            w-full bg-white
            border border-neutral-200 rounded-radius-md
            px-space-md py-space-sm
            text-body text-neutral-900
            placeholder:text-neutral-400
            focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
            disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed
            transition-colors duration-150
          "
        />
      </div>
      <Button variant="primary" onClick={onSubmit} isLoading={isLoading}>
        Search
      </Button>
    </div>
  )
}
