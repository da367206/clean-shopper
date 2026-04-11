const LogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
)

const NAV_ITEMS = [
  {
    key: 'home',
    label: 'Home',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    key: 'search',
    label: 'Search',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    key: 'lists',
    label: 'Lists',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  {
    key: 'profile',
    label: 'Profile',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
]

export default function Sidebar({ activeTab, onNavigate }) {
  return (
    <aside className="
      hidden md:flex flex-col
      fixed top-0 left-0 h-full w-56
      bg-white border-r border-neutral-200
      shadow-shadow-sm
      px-space-md py-space-xl
      gap-space-xl
    ">
      {/* Logo */}
      <div className="flex items-center gap-space-sm px-space-sm text-primary">
        <LogoIcon />
        <span className="text-h4 font-semibold text-neutral-900 leading-none">
          Clean Shopper
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-space-xs">
        {NAV_ITEMS.map(({ key, label, icon }) => {
          const isActive = activeTab === key
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`
                flex items-center gap-space-md
                px-space-md py-space-sm
                rounded-radius-md
                text-body font-medium
                transition-colors duration-150
                w-full text-left
                ${isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'}
              `}
            >
              {icon}
              {label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
