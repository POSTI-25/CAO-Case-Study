import './App.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CategorySelection from './components/CategorySelection';
import Feed from './components/Feed';
import ModeToggleBar from './components/ModeToggleBar';
import PopupModal from './components/PopupModal';
import InstaWrappedModal from './components/InstaWrappedModal';
import MessagesPanel from './components/MessagesPanel';
import BottomNav from './components/BottomNav';
import ReelsView from './components/ReelsView';
import { CATEGORIES, postsData } from './data/postsData';

const shufflePosts = (posts) => {
  const nextPosts = [...posts];

  for (let index = nextPosts.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [nextPosts[index], nextPosts[randomIndex]] = [nextPosts[randomIndex], nextPosts[index]];
  }

  return nextPosts;
};

const createBaseViewCounts = (posts) =>
  posts.reduce((accumulator, post) => {
    accumulator[post.id] = post.views;
    return accumulator;
  }, {});

function App() {
  const [activeScreen, setActiveScreen] = useState('categories');
  const [activeTab, setActiveTab] = useState('home');
  const [sessionPosts, setSessionPosts] = useState([]);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [viewedPostIds, setViewedPostIds] = useState([]);
  const [globalViewCounts, setGlobalViewCounts] = useState(() => createBaseViewCounts(postsData));
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [showWrappedModal, setShowWrappedModal] = useState(false);
  const [modes, setModes] = useState({
    ghostMode: false,
    parentalMode: false,
    closeCircleMode: false,
    moonMode: false,
  });
  const [wrappedStats, setWrappedStats] = useState({
    mostViewedCategory: 'Education',
    mostInteractedFriend: 'No interactions yet',
    postsViewed: 0,
    timeSpent: 0,
    timeSpentFormatted: '00:00:00',
  });

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(category)) {
        return prevSelected.filter((item) => item !== category);
      }
      return [...prevSelected, category];
    });
  };

  const handleStartFeed = () => {
    if (selectedCategories.length > 0) {
      setActiveScreen('feed');
      setActiveTab('home');
      setSessionPosts(shufflePosts(postsData));
      setSessionSeconds(0);
      setViewedPostIds([]);
      setGlobalViewCounts(createBaseViewCounts(postsData));
    }
  };

  const handlePostViewed = useCallback((postId) => {
    setViewedPostIds((previous) => {
      if (previous.includes(postId)) {
        return previous;
      }

      setGlobalViewCounts((previousCounts) => ({
        ...previousCounts,
        [postId]: (previousCounts[postId] ?? 0) + 1,
      }));

      return [...previous, postId];
    });
  }, []);

  const handleModeToggle = (modeName) => {
    setModes((prevModes) => ({
      ...prevModes,
      [modeName]: !prevModes[modeName],
    }));
  };

  const handleBreakExit = () => {
    setShowBreakModal(false);
    setActiveScreen('categories');
    setActiveTab('home');
    setSessionSeconds(0);
    setSelectedCategories([]);
    setViewedPostIds([]);
    setGlobalViewCounts(createBaseViewCounts(postsData));
  };

  const postPool = useMemo(
    () => (sessionPosts.length > 0 ? sessionPosts : postsData),
    [sessionPosts]
  );

  const isFeedExperience = activeScreen === 'feed';

  useEffect(() => {
    if (!isFeedExperience) {
      return undefined;
    }

    const timer = setInterval(() => {
      setSessionSeconds((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isFeedExperience]);

  const renderFeedTab = () => {
    if (activeTab === 'reels') {
      return <ReelsView posts={postPool} onPostViewed={handlePostViewed} />;
    }

    if (activeTab === 'messages') {
      return <MessagesPanel />;
    }

    if (activeTab === 'search') {
      return (
        <section className="placeholder-panel" aria-label="Search placeholder">
          <h2>Search</h2>
          <p>Explore creators, topics, and mindful content suggestions.</p>
        </section>
      );
    }

    if (activeTab === 'profile') {
      return (
        <section className="placeholder-panel" aria-label="Profile placeholder">
          <h2>Your Profile</h2>
          <p>Posts, saved moments, and mindful activity will appear here.</p>
        </section>
      );
    }

    return (
      <>
        <ModeToggleBar modes={modes} onToggleMode={handleModeToggle} />
        <Feed
          posts={postPool}
          sessionSeconds={sessionSeconds}
          viewCounts={globalViewCounts}
          initialSeenPostIds={viewedPostIds}
          selectedCategories={selectedCategories}
          modes={modes}
          onPostViewed={handlePostViewed}
          onBreakTrigger={() => setShowBreakModal(true)}
          onOpenWrapped={() => setShowWrappedModal(true)}
          onStatsUpdate={setWrappedStats}
        />
      </>
    );
  };

  return (
    <div className={`app-shell ${modes.moonMode ? 'theme-moon' : 'theme-default'}`}>
      <div className="phone-frame">
        <div className="phone-notch" />
        <div className="phone-screen">
          {isFeedExperience ? (
            <div className="app-top-branding instagram-topbar">
              <div className="ig-header-row">
                <button
                  type="button"
                  className={`messages-button ${activeTab === 'search' ? 'active' : ''}`}
                  onClick={() => setActiveTab('search')}
                  aria-label="Open search"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M10 2a8 8 0 105.29 14l4.35 4.35a1 1 0 001.41-1.41l-4.35-4.35A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z"
                      fill="currentColor"
                    />
                  </svg>
                </button>

                <h1>Instagram</h1>

                <button
                  type="button"
                  className={`messages-button ${activeTab === 'messages' ? 'active' : ''}`}
                  onClick={() => setActiveTab('messages')}
                  aria-label="Open messages"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M22 3L2.8 10.3a1 1 0 00.08 1.89l5.57 1.85 1.86 5.57a1 1 0 001.88.08L22 3zm-10.7 10.7l-1.13 3.4-1.15-3.45 8.2-8.2-5.92 8.25z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="app-top-branding">
              <h1>MindfulGram</h1>
              <p>Redesigned for healthy, controlled content consumption.</p>
            </div>
          )}

          {activeScreen === 'categories' ? (
            <CategorySelection
              categories={CATEGORIES}
              selectedCategories={selectedCategories}
              onToggleCategory={handleCategoryToggle}
              onContinue={handleStartFeed}
            />
          ) : (
            <div className="screen-body">
              <div className="feed-stack">
                {renderFeedTab()}
              </div>
            </div>
          )}
        </div>

        {isFeedExperience && (
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        )}
      </div>

      {showBreakModal && (
        <PopupModal
          variant="break"
          title="Scroll Check-In"
          message="You have been scrolling continuously. Take a break?"
          primaryLabel="Continue"
          secondaryLabel="Exit"
          onPrimary={() => setShowBreakModal(false)}
          onSecondary={handleBreakExit}
        />
      )}

      {showWrappedModal && (
        <InstaWrappedModal
          stats={wrappedStats}
          onClose={() => setShowWrappedModal(false)}
        />
      )}
    </div>
  );
}

export default App;
