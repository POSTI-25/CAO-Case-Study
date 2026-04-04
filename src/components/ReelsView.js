import { useEffect, useMemo, useRef } from 'react';

function ReelsView({ posts }) {
  const reelsRef = useRef(null);
  const videoRefs = useRef({});

  const reelPosts = useMemo(() => posts, [posts]);

  useEffect(() => {
    const listNode = reelsRef.current;
    const currentVideoRefs = videoRefs.current;

    if (!listNode) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const postId = Number(entry.target.getAttribute('data-post-id'));
          const videoNode = currentVideoRefs[postId];

          if (!videoNode) {
            return;
          }

          if (entry.isIntersecting && entry.intersectionRatio > 0.65) {
            const playPromise = videoNode.play();
            if (playPromise?.catch) {
              playPromise.catch(() => {});
            }
          } else {
            videoNode.pause();
          }
        });
      },
      {
        root: listNode,
        threshold: [0.2, 0.65, 0.95],
      }
    );

    listNode.querySelectorAll('.reel-item').forEach((node) => {
      observer.observe(node);
    });

    return () => {
      observer.disconnect();
      Object.values(currentVideoRefs).forEach((videoNode) => {
        videoNode?.pause();
      });
    };
  }, [reelPosts]);

  return (
    <section className="reels-shell" aria-label="Reels feed">
      <div className="reels-list" ref={reelsRef}>
        {reelPosts.map((post) => {
          const isVideo = post.media?.type === 'video';

          return (
            <article key={post.id} className="reel-item" data-post-id={post.id}>
              {isVideo ? (
                <video
                  className="reel-media"
                  src={post.media.src}
                  muted
                  playsInline
                  loop
                  autoPlay
                  preload="metadata"
                  ref={(element) => {
                    videoRefs.current[post.id] = element;
                  }}
                />
              ) : (
                <img className="reel-media" src={post.media.src} alt={`${post.username} reel`} />
              )}

              <div className="reel-overlay">
                <div className="reel-text">
                  <h3>@{post.username}</h3>
                  <p>{post.caption}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default ReelsView;
