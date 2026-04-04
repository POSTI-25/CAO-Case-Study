const NAV_ITEMS = [
  {
    key: 'home',
    label: 'Home',
    icon: (
      <path
        d="M12 3l9 7v10a1 1 0 01-1 1h-6v-6H10v6H4a1 1 0 01-1-1V10l9-7z"
        fill="currentColor"
      />
    ),
  },
  {
    key: 'search',
    label: 'Search',
    icon: (
      <path
        d="M10 2a8 8 0 105.29 14l4.35 4.35a1 1 0 001.41-1.41l-4.35-4.35A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z"
        fill="currentColor"
      />
    ),
  },
  {
    key: 'reels',
    label: 'Reels',
    icon: (
      <path
        d="M4 3h16a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2zm5.2 5.4v7.2a.8.8 0 001.2.7l5.7-3.6a.8.8 0 000-1.4l-5.7-3.6a.8.8 0 00-1.2.7z"
        fill="currentColor"
      />
    ),
  },
  {
    key: 'messages',
    label: 'Messages',
    icon: (
      <path
        d="M20 3H4C2.9 3 2 3.9 2 5v16l4-3h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H6l-2 1.5V5h16v11zM7 8h10v2H7zm0 3h7v2H7z"
        fill="currentColor"
      />
    ),
  },
  {
    key: 'profile',
    label: 'Profile',
    icon: (
      <path
        d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.4 0-8 2.2-8 5v2h16v-2c0-2.8-3.6-5-8-5z"
        fill="currentColor"
      />
    ),
  },
];

function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="phone-bottom-nav" aria-label="Instagram navigation">
      {NAV_ITEMS.map((item) => (
        <button
          type="button"
          key={item.key}
          className={`bottom-nav-item ${activeTab === item.key ? 'active' : ''}`}
          onClick={() => onTabChange(item.key)}
          aria-label={item.label}
          aria-current={activeTab === item.key ? 'page' : undefined}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {item.icon}
          </svg>
        </button>
      ))}
    </nav>
  );
}

export default BottomNav;
