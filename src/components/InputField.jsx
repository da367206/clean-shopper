export default function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  hint,
  disabled = false,
}) {
  const borderClass = error
    ? 'border-error ring-1 ring-error'
    : 'border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary'

  return (
    <div className="flex flex-col gap-space-xs">
      <label className="text-small font-medium text-neutral-600">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full bg-white border rounded-radius-md
          px-space-md py-space-sm
          text-body text-neutral-900
          placeholder:text-neutral-400
          focus:outline-none
          disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed
          transition-colors duration-150
          ${borderClass}
        `}
      />

      {hint && !error && (
        <p className="text-micro text-neutral-400">{hint}</p>
      )}

      {error && (
        <p className="text-micro text-error">{error}</p>
      )}
    </div>
  )
}
