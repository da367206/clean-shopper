import Button from './Button'

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search for a product…',
  isLoading = false,
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSubmit()
  }

  return (
    <div className="flex items-center gap-space-sm w-full">
      <div className="flex-1">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          className={`
            w-full bg-white border rounded-radius-md
            px-space-md py-space-sm
            text-body text-neutral-900
            placeholder:text-neutral-400
            focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
            disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed
            transition-colors duration-150
            border-neutral-200
          `}
        />
      </div>

      <Button
        variant="primary"
        onClick={onSubmit}
        isLoading={isLoading}
        disabled={isLoading}
      >
        Search
      </Button>
    </div>
  )
}
