function InstaWrappedModal({ stats, onClose }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card wrapped-modal">
        <h2>Insta Wrapped</h2>
        <p>Your mindful feed summary for this session.</p>

        <div className="wrapped-grid">
          <div className="wrapped-item">
            <span>Most viewed category</span>
            <strong>{stats.mostViewedCategory}</strong>
          </div>
          <div className="wrapped-item">
            <span>Most interacted friend</span>
            <strong>{stats.mostInteractedFriend}</strong>
          </div>
          <div className="wrapped-item">
            <span>Posts viewed</span>
            <strong>{stats.postsViewed}</strong>
          </div>
          <div className="wrapped-item">
            <span>Time on feed</span>
            <strong>{stats.timeSpentFormatted || '00:00:00'}</strong>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="primary-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstaWrappedModal;