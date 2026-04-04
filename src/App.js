import './App.css';
import { useState } from 'react';
import CategorySelection from './components/CategorySelection';
import Feed from './components/Feed';
import ModeToggleBar from './components/ModeToggleBar';
import PopupModal from './components/PopupModal';
import InstaWrappedModal from './components/InstaWrappedModal';
import MessagesPanel from './components/MessagesPanel';
import { CATEGORIES, postsData } from './data/postsData';

function App() {
  const [activeScreen, setActiveScreen] = useState('categories');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [showWrappedModal, setShowWrappedModal] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
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
      setShowMessages(false);
    }
  };

  const handleModeToggle = (modeName) => {
    setModes((prevModes) => ({
      ...prevModes,
      [modeName]: !prevModes[modeName],
    }));
  };

  const handleBreakExit = () => {
    setShowBreakModal(false);
    setActiveScreen('categories');
    setSelectedCategories([]);
    setShowMessages(false);
  };

  return (
    <div className={`app-shell ${modes.moonMode ? 'theme-moon' : 'theme-default'}`}>
      <div className="phone-frame">
        <div className="phone-notch" />
        <div className="phone-screen">
          <div className="app-top-branding">
            <div className="branding-row">
              <div>
                <h1>MindfulGram</h1>
                <p>Redesigned for healthy, controlled content consumption.</p>
              </div>

              {activeScreen === 'feed' && (
                <button
                  type="button"
                  className={`messages-button ${showMessages ? 'active' : ''}`}
                  onClick={() => setShowMessages((previous) => !previous)}
                  aria-label={showMessages ? 'Close messages panel' : 'Open messages panel'}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M20 3H4C2.9 3 2 3.9 2 5v16l4-3h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H6l-2 1.5V5h16v11zM7 8h10v2H7zm0 3h7v2H7z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {activeScreen === 'categories' ? (
            <CategorySelection
              categories={CATEGORIES}
              selectedCategories={selectedCategories}
              onToggleCategory={handleCategoryToggle}
              onContinue={handleStartFeed}
            />
          ) : (
            <>
              <ModeToggleBar modes={modes} onToggleMode={handleModeToggle} />
              <div className="feed-stack">
                <Feed
                  posts={postsData}
                  selectedCategories={selectedCategories}
                  modes={modes}
                  onBreakTrigger={() => setShowBreakModal(true)}
                  onOpenWrapped={() => setShowWrappedModal(true)}
                  onStatsUpdate={setWrappedStats}
                />

                {showMessages && <MessagesPanel onBack={() => setShowMessages(false)} />}
              </div>
            </>
          )}
        </div>
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
