const MODE_CONFIG = [
  { key: 'ghostMode', label: 'Ghost Mode' },
  { key: 'parentalMode', label: 'Parental Mode' },
  { key: 'closeCircleMode', label: 'Close Circle Mode' },
  { key: 'moonMode', label: 'Moon Mode' },
];

function ModeToggleBar({ modes, onToggleMode }) {
  return (
    <section className="mode-toggle-bar" aria-label="Mode toggles">
      {MODE_CONFIG.map((mode) => (
        <button
          type="button"
          key={mode.key}
          className={`mode-toggle ${modes[mode.key] ? 'active' : ''}`}
          onClick={() => onToggleMode(mode.key)}
        >
          <span className="mode-toggle-dot" />
          <span>{mode.label}</span>
        </button>
      ))}
    </section>
  );
}

export default ModeToggleBar;