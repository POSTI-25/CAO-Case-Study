function PopupModal({
  variant = 'default',
  title,
  message,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
}) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className={`modal-card ${variant === 'break' ? 'break-modal' : ''}`}>
        <h2>{title}</h2>
        <p>{message}</p>

        <div className="modal-actions">
          <button type="button" className="secondary-button" onClick={onSecondary}>
            {secondaryLabel}
          </button>
          <button type="button" className="primary-button" onClick={onPrimary}>
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PopupModal;