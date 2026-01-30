import { useState, useMemo, useCallback, memo } from 'react';
import { Icon } from '@iconify/react';
import { cx } from 'class-variance-authority';
import menuItems, {
  menuCategories,
  type MenuItem,
} from '../../data/menu-items';
import { formatPrice, buildWhatsAppUrl } from '@/utils';

// ============================================================================
// Types
// ============================================================================

interface MenuCardProps {
  item: MenuItem;
}

// ============================================================================
// MenuCard Component (Memoized for performance)
// ============================================================================

const MenuCard = memo(function MenuCard({ item }: MenuCardProps) {
  const whatsAppUrl = useMemo(
    () =>
      buildWhatsAppUrl(
        `Hi! I'd like to order ${item.name} (${formatPrice(item.price)})`,
      ),
    [item.name, item.price],
  );

  return (
    <article className="shadow-md hover:shadow-xl group relative overflow-hidden rounded-xl bg-surface transition-all">
      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex gap-2">
        {item.isPopular && (
          <span className="font-semibold rounded-full bg-fill-brand px-2 py-0.5 text-body-xs text-on-bg-fill-brand">
            Popular
          </span>
        )}
        {item.isNew && (
          <span className="bg-green-500 font-semibold text-white rounded-full px-2 py-0.5 text-body-xs">
            New
          </span>
        )}
      </div>

      {/* Image */}
      <div className="aspect-square overflow-hidden">
        <img
          src={item.image.src}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-heading-lg font-primary font-bold">
            {item.name}
          </h3>
          <span className="font-semibold whitespace-nowrap rounded-full bg-fill-brand/20 px-2 py-0.5 text-body-sm text-brand">
            {formatPrice(item.price)}
          </span>
        </div>
        <p className="line-clamp-2 text-body-sm text-secondary">
          {item.description}
        </p>

        {/* Order Button */}
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold hover:shadow-md mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-fill-brand px-4 py-2 text-body-sm text-on-bg-fill-brand transition-all duration-200 hover:scale-[1.02] hover:bg-fill-brand-hover active:scale-[0.98]"
          aria-label={`Order ${item.name} via WhatsApp`}
        >
          <Icon icon="mdi:whatsapp" className="h-4 w-4" aria-hidden="true" />
          Order Now
        </a>
      </div>
    </article>
  );
});

// ============================================================================
// Category Button Component (Memoized)
// ============================================================================

interface CategoryButtonProps {
  category: { id: string; name: string };
  isActive: boolean;
  onClick: () => void;
}

const CategoryButton = memo(function CategoryButton({
  category,
  isActive,
  onClick,
}: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cx(
        'font-medium rounded-full px-4 py-2 text-body-sm transition-all duration-200',
        isActive
          ? 'shadow-md scale-[1.02] bg-fill-brand text-on-bg-fill-brand'
          : 'bg-surface text-secondary hover:scale-[1.02] hover:bg-fill-brand/10 hover:text-brand',
      )}
      aria-pressed={isActive}
    >
      {category.name}
    </button>
  );
});

// ============================================================================
// MenuPage Component
// ============================================================================

export function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Memoized filtered items
  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Memoized handlers
  const handleCategoryClick = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [],
  );

  return (
    <div className="bg-bg min-h-screen">
      {/* Header */}
      <header className="bg-surface py-12 lg:py-16">
        <div className="container">
          <h1 className="mb-4 font-primary text-heading-4xl font-bold lg:text-heading-5xl">
            Our Menu
          </h1>
          <p className="max-w-2xl font-secondary text-body-lg text-secondary">
            Explore our full range of handcrafted brownies. From classic
            favorites to premium creations, find your perfect chocolate
            indulgence.
          </p>
        </div>
      </header>

      {/* Filters */}
      <nav
        className="bg-bg/95 sticky top-20 z-20 border-b border-secondary/20 py-4 backdrop-blur-sm"
        aria-label="Menu filters"
      >
        <div className="container">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2" role="tablist">
              {menuCategories.map((category) => (
                <CategoryButton
                  key={category.id}
                  category={category}
                  isActive={activeCategory === category.id}
                  onClick={() => handleCategoryClick(category.id)}
                />
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Icon
                icon="heroicons:magnifying-glass-20-solid"
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Search brownies..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="focus:border-fill-brand w-full rounded-lg border border-secondary/20 bg-surface py-2 pl-10 pr-4 text-body-sm focus:outline-none lg:w-64"
                aria-label="Search menu items"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Menu Grid */}
      <main className="container py-8 lg:py-12">
        {filteredItems.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center" role="status">
            <Icon
              icon="heroicons:magnifying-glass"
              className="mx-auto mb-4 h-12 w-12 text-secondary"
              aria-hidden="true"
            />
            <p className="text-body-lg text-secondary">
              No brownies found matching your search.
            </p>
          </div>
        )}
      </main>

      {/* CTA Section */}
      <section className="bg-fill-brand py-12" aria-labelledby="cta-heading">
        <div className="container text-center">
          <h2
            id="cta-heading"
            className="mb-4 font-primary text-heading-2xl font-bold text-on-bg-fill-brand lg:text-heading-3xl"
          >
            Want something custom?
          </h2>
          <p className="mb-6 text-body-md text-on-bg-fill-brand-secondary">
            Create your own perfect brownie with our Brownie Builder!
          </p>
          <a
            href={`${import.meta.env.BASE_URL}craft`}
            className="font-semibold hover:shadow-lg inline-flex items-center gap-2 rounded-lg bg-fill px-6 py-3 font-primary text-on-bg-fill transition-all duration-200 hover:scale-[1.03] hover:bg-fill-hover active:scale-[0.98]"
          >
            <Icon
              icon="heroicons:sparkles-solid"
              className="h-5 w-5"
              aria-hidden="true"
            />
            Craft Your Own
          </a>
        </div>
      </section>
    </div>
  );
}

export default MenuPage;
