const MODE_CONFIG = [
  { key: 'ghostMode', label: 'Ghost Mode', tone: 'ghost' },
  { key: 'parentalMode', label: 'Parental Mode', tone: 'parental' },
  { key: 'closeCircleMode', label: 'Close Circle', tone: 'close' },
  { key: 'moonMode', label: 'Moon Mode', tone: 'moon' },
];

function ModeToggleBar({ modes, onToggleMode }) {
  return (
    <section className="mode-toggle-bar" aria-label="Mode toggles">
      {MODE_CONFIG.map((mode) => (
        <button
          type="button"
          key={mode.key}
          className={`mode-toggle mode-${mode.tone} ${modes[mode.key] ? 'active' : ''}`}
          onClick={() => onToggleMode(mode.key)}
          aria-pressed={modes[mode.key]}
        >
          <span className="mode-toggle-dot" />
          <span>{mode.label}</span>
          <span className="mode-toggle-state">{modes[mode.key] ? 'ON' : 'OFF'}</span>
        </button>
      ))}
    </section>
  );
}

export default ModeToggleBar;