function CategorySelection({
  categories,
  selectedCategories,
  onToggleCategory,
  onContinue,
}) {
  return (
    <section className="category-selection">
      <h2>Choose your healthy content mix</h2>
      <p>Select one or more categories to personalize your feed.</p>

      <div className="category-grid">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category);

          return (
            <button
              type="button"
              key={category}
              className={`category-chip ${isSelected ? 'selected' : ''}`}
              onClick={() => onToggleCategory(category)}
            >
              {category}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="primary-button"
        onClick={onContinue}
        disabled={selectedCategories.length === 0}
      >
        Continue to Feed
      </button>
    </section>
  );
}

export default CategorySelection;