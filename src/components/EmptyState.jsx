import Button from './Button'

export default function EmptyState({ title, message, action, icon }) {
  return (
    <div className="
      flex flex-col items-center justify-center
      gap-space-md
      py-space-4xl px-space-2xl
      text-center
    ">
      {icon && (
        <div className="text-neutral-400">
          {icon}
        </div>
      )}

      <h3 className="text-h4 text-neutral-900 font-medium">
        {title}
      </h3>

      {message && (
        <p className="text-body text-neutral-400 max-w-sm">
          {message}
        </p>
      )}

      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
