const DUMMY_FRIENDS = [
  {
    id: 1,
    name: 'Aanya Mehta',
    lastMessage: 'That focus challenge reel was so useful.',
    time: '2m',
    unread: true,
  },
  {
    id: 2,
    name: 'Rohan Dev',
    lastMessage: 'Gym at 7? I sent the mobility routine.',
    time: '12m',
    unread: false,
  },
  {
    id: 3,
    name: 'Nisha Rao',
    lastMessage: 'Your moon mode design looks super clean.',
    time: '28m',
    unread: true,
  },
  {
    id: 4,
    name: 'Kabir Singh',
    lastMessage: 'Let us do a no-scroll study sprint tonight.',
    time: '1h',
    unread: false,
  },
  {
    id: 5,
    name: 'Mira Jain',
    lastMessage: 'Shared a calming travel video with you.',
    time: '2h',
    unread: false,
  },
];

function MessagesPanel({ onBack, showBackButton = false }) {
  return (
    <section className="messages-panel" aria-label="Messages panel">
      <header className="messages-header">
        {showBackButton && (
          <button
            type="button"
            className="icon-circle-button"
            onClick={onBack}
            aria-label="Back to feed"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M14.7 6.3a1 1 0 010 1.4L11.41 11H20a1 1 0 110 2h-8.59l3.29 3.3a1 1 0 01-1.41 1.4l-5-5a1 1 0 010-1.4l5-5a1 1 0 011.41 0z"
                fill="currentColor"
              />
            </svg>
          </button>
        )}
        <div>
          <h2>Messages</h2>
          <p>Recent chats</p>
        </div>
      </header>

      <div className="messages-list">
        {DUMMY_FRIENDS.map((friend) => {
          const initials = friend.name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();

          return (
            <button
              type="button"
              key={friend.id}
              className={`message-thread ${friend.unread ? 'has-unread' : ''}`}
            >
              <span className={`thread-avatar tone-${(friend.id % 5) + 1}`}>{initials}</span>
              <span className="thread-body">
                <span className="thread-top-row">
                  <strong>{friend.name}</strong>
                  <small>{friend.time}</small>
                </span>
                <span className="thread-preview">{friend.lastMessage}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default MessagesPanel;
