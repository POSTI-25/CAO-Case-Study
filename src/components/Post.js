import { useMemo, useRef, useState } from 'react';

const MIN_COMMENT_LENGTH = 8;

function Post({ post, modes, ghostMode, slowdownActive, onInteraction }) {
  const [mediaFailed, setMediaFailed] = useState(false);
  const [liked, setLiked] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [commentCount, setCommentCount] = useState(post.comments);
  const commentInputRef = useRef(null);

  const likeCount = useMemo(
    () => post.likes + (liked ? 1 : 0),
    [post.likes, liked]
  );

  const isVideo =
    post.media?.type === 'video' ||
    post.media?.src?.toLowerCase().endsWith('.mp4') ||
    false;

  const submitDisabled = commentInput.trim().length < MIN_COMMENT_LENGTH;
  const profileInitial = post.username.charAt(0).toUpperCase();

  const handleLikeClick = () => {
    setLiked((previous) => {
      const next = !previous;
      if (next) {
        onInteraction(post.username);
      }
      return next;
    });
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    if (submitDisabled) {
      return;
    }

    setCommentCount((previous) => previous + 1);
    setCommentInput('');
    onInteraction(post.username);
  };

  return (
    <article
      className={`post-card ${slowdownActive ? 'slowdown' : ''} ${
        ghostMode ? 'ghost-card' : ''
      } ${modes?.closeCircleMode ? 'close-circle-card' : ''} ${
        modes?.parentalMode ? 'parental-card' : ''
      }`}
    >
      <header className="post-header">
        <div className="avatar-ring" aria-hidden="true">
          <div className="avatar-dot">{profileInitial}</div>
        </div>
        <div>
          <h3>{post.username}</h3>
          <small>{post.category} • 5m</small>
        </div>
        <button type="button" className="more-button" aria-label="More options">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-svg">
            <path
              d="M6 10a2 2 0 100 4 2 2 0 000-4zm6 0a2 2 0 100 4 2 2 0 000-4zm6 0a2 2 0 100 4 2 2 0 000-4z"
              fill="currentColor"
            />
          </svg>
        </button>
        {post.isCloseFriend && <span className="close-friend-pill">Close Friend</span>}
      </header>

      <div className="post-media-wrap">
        {mediaFailed || !post.media?.src ? (
          <div className="media-fallback">Media not found</div>
        ) : isVideo ? (
          <video
            className="post-media"
            controls
            preload="metadata"
            onError={() => setMediaFailed(true)}
          >
            <source src={post.media.src} type="video/mp4" />
            Your browser does not support this video.
          </video>
        ) : (
          <img
            className="post-media"
            src={post.media.src}
            alt={`${post.username} post`}
            onError={() => setMediaFailed(true)}
          />
        )}
      </div>

      <p className="post-caption">{post.caption}</p>

      <div className="post-actions-row">
        <div className="post-actions">
          <button
            type="button"
            className={`icon-button icon-only ${liked ? 'liked' : ''}`}
            onClick={handleLikeClick}
            aria-label="Like post"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-svg">
              <path
                d="M12 20.5l-1.3-1.18C5.4 14.73 2 11.64 2 7.99 2 5.07 4.23 3 7 3c1.57 0 3.08.73 4 1.88A5.17 5.17 0 0115 3c2.77 0 5 2.07 5 4.99 0 3.65-3.4 6.74-8.7 11.33L12 20.5z"
                fill="currentColor"
              />
            </svg>
          </button>

          <button
            type="button"
            className="icon-button icon-only"
            aria-label="Comment on post"
            onClick={() => commentInputRef.current?.focus()}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-svg">
              <path
                d="M4 4h16a1 1 0 011 1v10a1 1 0 01-1 1H8l-4 4V5a1 1 0 011-1zm2 3v2h12V7H6zm0 4v2h8v-2H6z"
                fill="currentColor"
              />
            </svg>
          </button>

          <button type="button" className="icon-button icon-only" aria-label="Share post">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-svg">
              <path
                d="M22 3L2.8 10.3a1 1 0 00.08 1.89l5.57 1.85 1.86 5.57a1 1 0 001.88.08L22 3zm-10.7 10.7l-1.13 3.4-1.15-3.45 8.2-8.2-5.92 8.25z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <button type="button" className="icon-button icon-only" aria-label="Save post">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-svg">
            <path
              d="M7 3h10a2 2 0 012 2v16l-7-4-7 4V5a2 2 0 012-2z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      {!ghostMode && (
        <p className="post-meta">
          <strong>{likeCount} likes</strong> • {commentCount} comments • {post.views} views
        </p>
      )}

      {ghostMode && <p className="mode-caption">Ghost Mode Active: public counters hidden</p>}
      {modes?.parentalMode && <p className="mode-caption">Parental Mode Active: safer categories only</p>}
      {modes?.closeCircleMode && (
        <p className="mode-caption">Close Circle Mode Active: close-friend content prioritized</p>
      )}

      <form className="comment-form" onSubmit={handleCommentSubmit}>
        <input
          ref={commentInputRef}
          type="text"
          value={commentInput}
          onChange={(event) => setCommentInput(event.target.value)}
          placeholder="Add a thoughtful comment"
        />
        <button type="submit" disabled={submitDisabled}>
          Post
        </button>
      </form>
      <small className="comment-hint">
        Minimum {MIN_COMMENT_LENGTH} characters to submit.
      </small>
    </article>
  );
}

export default Post;