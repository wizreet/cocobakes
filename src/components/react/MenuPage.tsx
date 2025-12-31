import { useState } from 'react';
import { Icon } from '@iconify/react';
import { cx } from 'class-variance-authority';
import menuItems, { menuCategories, formatPrice, type MenuItem } from '../../data/menu-items';

interface MenuCardProps {
  item: MenuItem;
}

function MenuCard({ item }: MenuCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-surface shadow-md transition-all hover:shadow-xl">
      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex gap-2">
        {item.isPopular && (
          <span className="rounded-full bg-fill-brand px-2 py-0.5 text-body-xs font-semibold text-on-bg-fill-brand">
            Popular
          </span>
        )}
        {item.isNew && (
          <span className="rounded-full bg-green-500 px-2 py-0.5 text-body-xs font-semibold text-white">
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
        />
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-primary text-heading-lg font-bold">{item.name}</h3>
          <span className="whitespace-nowrap rounded-full bg-fill-brand/20 px-2 py-0.5 text-body-sm font-semibold text-brand">
            {formatPrice(item.price)}
          </span>
        </div>
        <p className="text-body-sm text-secondary line-clamp-2">{item.description}</p>
        
        {/* Order Button */}
        <a
          href={`https://wa.me/9779849805290?text=${encodeURIComponent(`Hi! I'd like to order ${item.name} (${formatPrice(item.price)})`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-fill-brand px-4 py-2 text-body-sm font-semibold text-on-bg-fill-brand transition-all duration-200 hover:bg-fill-brand-hover hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <Icon icon="mdi:whatsapp" className="h-4 w-4" />
          Order Now
        </a>
      </div>
    </div>
  );
}

export function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="bg-surface py-12 lg:py-16">
        <div className="container">
          <h1 className="mb-4 font-primary text-heading-4xl font-bold lg:text-heading-5xl">
            Our Menu
          </h1>
          <p className="max-w-2xl font-secondary text-body-lg text-secondary">
            Explore our full range of handcrafted brownies. From classic favorites to 
            premium creations, find your perfect chocolate indulgence.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-20 z-20 border-b border-secondary/20 bg-bg/95 py-4 backdrop-blur-sm">
        <div className="container">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {menuCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cx(
                    'rounded-full px-4 py-2 text-body-sm font-medium transition-all duration-200',
                    activeCategory === category.id
                      ? 'bg-fill-brand text-on-bg-fill-brand shadow-md scale-[1.02]'
                      : 'bg-surface text-secondary hover:bg-fill-brand/10 hover:text-brand hover:scale-[1.02]'
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Icon 
                icon="heroicons:magnifying-glass-20-solid" 
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary" 
              />
              <input
                type="text"
                placeholder="Search brownies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-secondary/20 bg-surface py-2 pl-10 pr-4 text-body-sm focus:border-fill-brand focus:outline-none lg:w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="container py-8 lg:py-12">
        {filteredItems.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map(item => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <Icon icon="heroicons:magnifying-glass" className="mx-auto mb-4 h-12 w-12 text-secondary" />
            <p className="text-body-lg text-secondary">No brownies found matching your search.</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-fill-brand py-12">
        <div className="container text-center">
          <h2 className="mb-4 font-primary text-heading-2xl font-bold text-on-bg-fill-brand lg:text-heading-3xl">
            Want something custom?
          </h2>
          <p className="mb-6 text-body-md text-on-bg-fill-brand-secondary">
            Create your own perfect brownie with our Brownie Builder!
          </p>
          <a
            href="/craft"
            className="inline-flex items-center gap-2 rounded-lg bg-fill px-6 py-3 font-primary font-semibold text-on-bg-fill transition-all duration-200 hover:bg-fill-hover hover:shadow-lg hover:scale-[1.03] active:scale-[0.98]"
          >
            <Icon icon="heroicons:sparkles-solid" className="h-5 w-5" />
            Craft Your Own
          </a>
        </div>
      </div>
    </div>
  );
}

export default MenuPage;
