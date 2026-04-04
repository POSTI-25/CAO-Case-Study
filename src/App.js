import './App.css';
import { useState } from 'react';
import CategorySelection from './components/CategorySelection';
import Feed from './components/Feed';
import ModeToggleBar from './components/ModeToggleBar';
import PopupModal from './components/PopupModal';
import InstaWrappedModal from './components/InstaWrappedModal';
import { CATEGORIES, postsData } from './data/postsData';

function App() {
  const [activeScreen, setActiveScreen] = useState('categories');
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
  };

  return (
    <div className={`app-shell ${modes.moonMode ? 'theme-moon' : 'theme-default'}`}>
      <div className="phone-frame">
        <div className="phone-notch" />
        <div className="phone-screen">
          <div className="app-top-branding">
            <h1>MindfulGram</h1>
            <p>Redesigned for healthy, controlled content consumption.</p>
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
              <Feed
                posts={postsData}
                selectedCategories={selectedCategories}
                modes={modes}
                onBreakTrigger={() => setShowBreakModal(true)}
                onOpenWrapped={() => setShowWrappedModal(true)}
                onStatsUpdate={setWrappedStats}
              />
            </>
          )}
        </div>
      </div>

      {showBreakModal && (
        <PopupModal
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
