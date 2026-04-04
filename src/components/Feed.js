import { useEffect, useMemo, useRef, useState } from 'react';
import Post from './Post';
import { SAFE_CATEGORIES } from '../data/postsData';

const INITIAL_VISIBLE_POSTS = 5;
const LOAD_BATCH_SIZE = 2;

const MODE_LABELS = {
  ghostMode: 'Ghost Mode Active',
  parentalMode: 'Parental Mode Active',
  closeCircleMode: 'Close Circle Mode Active',
  moonMode: 'Moon Mode Active',
};

const formatSessionTime = (totalSeconds) => {
  const safeSeconds = Math.max(0, totalSeconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return [hours, minutes, seconds].map((part) => String(part).padStart(2, '0')).join(':');
};

function Feed({
  posts,
  sessionSeconds,
  viewCounts,
  initialSeenPostIds,
  selectedCategories,
  modes,
  onPostViewed,
  onBreakTrigger,
  onOpenWrapped,
  onStatsUpdate,
}) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_POSTS);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [seenPostIds, setSeenPostIds] = useState([]);
  const [slowdownActive, setSlowdownActive] = useState(false);
  const [breakPromptShown, setBreakPromptShown] = useState(false);
  const [interactionByUser, setInteractionByUser] = useState({});

  const scrollRef = useRef(null);
  const postRefs = useRef({});

  const filteredPosts = useMemo(() => {
    let nextPosts = posts.filter((post) => selectedCategories.includes(post.category));

    if (modes.parentalMode) {
      nextPosts = nextPosts.filter((post) => SAFE_CATEGORIES.includes(post.category));
    }

    if (modes.closeCircleMode) {
      nextPosts = nextPosts.filter((post) => post.isCloseFriend);
    }

    if (modes.moonMode) {
      nextPosts = [...nextPosts].sort((a, b) => {
        if (a.isCloseFriend === b.isCloseFriend) {
          return a.id - b.id;
        }
        return a.isCloseFriend ? -1 : 1;
      });
    }

    return nextPosts;
  }, [posts, selectedCategories, modes.parentalMode, modes.closeCircleMode, modes.moonMode]);

  const visiblePosts = useMemo(
    () => filteredPosts.slice(0, visibleCount),
    [filteredPosts, visibleCount]
  );

  const activeModeLabels = useMemo(
    () =>
      Object.keys(modes)
        .filter((modeName) => modes[modeName])
        .map((modeName) => MODE_LABELS[modeName]),
    [modes]
  );

  const seenPosts = useMemo(
    () => posts.filter((post) => seenPostIds.includes(post.id)),
    [posts, seenPostIds]
  );

  const mostViewedCategory = useMemo(() => {
    if (seenPosts.length === 0) {
      return 'No category yet';
    }

    const categoryCounter = seenPosts.reduce((accumulator, post) => {
      const currentCount = accumulator[post.category] || 0;
      return { ...accumulator, [post.category]: currentCount + 1 };
    }, {});

    return Object.keys(categoryCounter).reduce((winner, currentCategory) => {
      if (!winner) {
        return currentCategory;
      }

      return categoryCounter[currentCategory] > categoryCounter[winner]
        ? currentCategory
        : winner;
    }, '');
  }, [seenPosts]);

  const mostInteractedFriend = useMemo(() => {
    const usernames = Object.keys(interactionByUser);
    if (usernames.length === 0) {
      return 'No interactions yet';
    }

    return usernames.reduce((winner, currentUser) => {
      if (!winner) {
        return currentUser;
      }

      return interactionByUser[currentUser] > interactionByUser[winner]
        ? currentUser
        : winner;
    }, '');
  }, [interactionByUser]);

  useEffect(() => {
    setVisibleCount(Math.min(INITIAL_VISIBLE_POSTS, filteredPosts.length));
    setIsLoadingMore(false);
    postRefs.current = {};
  }, [filteredPosts]);

  useEffect(() => {
    setSeenPostIds((previous) => {
      if (!initialSeenPostIds || initialSeenPostIds.length === 0) {
        return previous;
      }

      const merged = [...previous];

      initialSeenPostIds.forEach((postId) => {
        if (!merged.includes(postId)) {
          merged.push(postId);
        }
      });

      return merged.length === previous.length ? previous : merged;
    });
  }, [initialSeenPostIds]);

  useEffect(() => {
    if (seenPostIds.length >= 4) {
      setSlowdownActive(true);
    }
  }, [seenPostIds.length]);

  useEffect(() => {
    if (!breakPromptShown && (seenPostIds.length >= 10 || sessionSeconds >= 30)) {
      setBreakPromptShown(true);
      onBreakTrigger();
    }
  }, [breakPromptShown, seenPostIds.length, sessionSeconds, onBreakTrigger]);

  useEffect(() => {
    onStatsUpdate({
      postsViewed: seenPostIds.length,
      timeSpent: sessionSeconds,
      timeSpentFormatted: formatSessionTime(sessionSeconds),
      mostViewedCategory,
      mostInteractedFriend,
    });
  }, [
    onStatsUpdate,
    seenPostIds.length,
    sessionSeconds,
    mostViewedCategory,
    mostInteractedFriend,
  ]);

  useEffect(() => {
    const rootNode = scrollRef.current;
    if (!rootNode) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const postId = Number(entry.target.getAttribute('data-post-id'));
          if (Number.isNaN(postId)) {
            return;
          }

          setSeenPostIds((previous) =>
            previous.includes(postId)
              ? previous
              : (() => {
                  onPostViewed(postId);

                  return [...previous, postId];
                })()
          );
        });
      },
      {
        root: rootNode,
        threshold: 0.45,
      }
    );

    Object.values(postRefs.current).forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [visiblePosts, onPostViewed]);

  const registerInteraction = (username) => {
    setInteractionByUser((previous) => ({
      ...previous,
      [username]: (previous[username] || 0) + 1,
    }));
  };

  const handleScroll = () => {
    const scrollElement = scrollRef.current;
    if (!scrollElement || isLoadingMore) {
      return;
    }

    const nearBottom =
      scrollElement.scrollTop + scrollElement.clientHeight >=
      scrollElement.scrollHeight - 80;

    if (!nearBottom || visibleCount >= filteredPosts.length) {
      return;
    }

    setIsLoadingMore(true);
    const delay = slowdownActive ? 920 : 560;

    setTimeout(() => {
      setVisibleCount((currentVisible) =>
        Math.min(currentVisible + LOAD_BATCH_SIZE, filteredPosts.length)
      );
      setIsLoadingMore(false);
    }, delay);
  };

  return (
    <section
      className={`feed-shell ${
        modes.ghostMode ? 'mode-ghost-enabled' : ''
      } ${modes.parentalMode ? 'mode-parental-enabled' : ''} ${
        modes.closeCircleMode ? 'mode-close-enabled' : ''
      } ${modes.moonMode ? 'mode-moon-enabled' : ''}`}
    >
      <div className="feed-summary">
        <div>
          <strong>{seenPostIds.length}</strong>
          <span> posts viewed</span>
        </div>
        <div className="timer-block" aria-live="polite">
          <strong>{formatSessionTime(sessionSeconds)}</strong>
          <span> session time</span>
        </div>
        <button type="button" className="wrapped-button" onClick={onOpenWrapped}>
          Insta Wrapped
        </button>
      </div>

      <div className="mode-indicator-strip">
        {activeModeLabels.length === 0 ? (
          <span className="mode-indicator quiet">Standard Feed</span>
        ) : (
          activeModeLabels.map((modeLabel) => (
            <span key={modeLabel} className="mode-indicator">
              {modeLabel}
            </span>
          ))
        )}
      </div>

      <div className="feed-list" ref={scrollRef} onScroll={handleScroll}>
        {visiblePosts.length === 0 ? (
          <div className="empty-feed-state">
            No posts available for your current filter and mode setup.
          </div>
        ) : (
          visiblePosts.map((post, index) => (
            <div
              key={post.id}
              className={`post-shell ${
                slowdownActive && index >= 2 ? 'wide-gap' : ''
              } ${slowdownActive && index >= 4 ? 'extra-gap' : ''}`}
              data-post-id={post.id}
              ref={(element) => {
                postRefs.current[post.id] = element;
              }}
            >
              <Post
                post={post}
                viewCount={viewCounts?.[post.id] ?? post.views}
                modes={modes}
                ghostMode={modes.ghostMode}
                slowdownActive={slowdownActive}
                onInteraction={registerInteraction}
              />
            </div>
          ))
        )}

        {isLoadingMore && (
          <p className="loading-more">
            <span className="loading-dot" />
            Loading the next post batch mindfully...
          </p>
        )}
      </div>
    </section>
  );
}

export default Feed;