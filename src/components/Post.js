import { useMemo, useRef, useState } from 'react';

const MIN_COMMENT_LENGTH = 8;

function Post({ post, ghostMode, slowdownActive, onInteraction }) {
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
    <article className={`post-card ${slowdownActive ? 'slowdown' : ''}`}>
      <header className="post-header">
        <div className="avatar-dot" aria-hidden="true" />
        <div>
          <h3>{post.username}</h3>
          <small>{post.category}</small>
        </div>
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

      <div className="post-actions">
        <button type="button" className="icon-button" onClick={handleLikeClick}>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-svg">
            <path
              d="M12 20.5l-1.3-1.18C5.4 14.73 2 11.64 2 7.99 2 5.07 4.23 3 7 3c1.57 0 3.08.73 4 1.88A5.17 5.17 0 0115 3c2.77 0 5 2.07 5 4.99 0 3.65-3.4 6.74-8.7 11.33L12 20.5z"
              fill="currentColor"
            />
          </svg>
          <span>{liked ? 'Liked' : 'Like'}</span>
        </button>
        <button
          type="button"
          className="icon-button"
          onClick={() => commentInputRef.current?.focus()}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-svg">
            <path
              d="M4 4h16a1 1 0 011 1v10a1 1 0 01-1 1H8l-4 4V5a1 1 0 011-1zm2 3v2h12V7H6zm0 4v2h8v-2H6z"
              fill="currentColor"
            />
          </svg>
          <span>Comment</span>
        </button>
      </div>

      {!ghostMode && (
        <p className="post-meta">
          {likeCount} likes | {commentCount} comments | {post.views} views
        </p>
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